create extension if not exists "http" with schema "extensions";

create extension if not exists "moddatetime" with schema "extensions";

create extension if not exists "pg_cron" with schema "extensions";


create type "public"."archive_locations_enum" as enum ('CLOCKSS', 'LOCKSS', 'Portico', 'KB', 'Internet Archive', 'DWT');

create type "public"."category" as enum ('Engineering and Technology', 'Medical and Health Sciences', 'Natural Sciences', 'Social Sciences', 'Humanities');

create type "public"."category_enum" as enum ('Natural Sciences', 'Engineering and Technology', 'Medical and Health Sciences', 'Agricultural Sciences', 'Social Sciences', 'Humanities');

create type "public"."newsletter_enum" as enum ('digest');

create type "public"."schema_version_enum" as enum ('http://datacite.org/schema/kernel-4', 'http://datacite.org/schema/kernel-3', 'https://commonmeta.org/commonmeta_v0.12');

create type "public"."state_enum" as enum ('findable', 'not_found', 'forbidden');

create type "public"."version_enum" as enum ('https://jsonfeed.org/version/1.1');

alter table "public"."posts" drop constraint "posts_pkey";

drop index if exists "public"."posts_pkey";

CREATE UNIQUE INDEX blogs_pkey ON public.blogs USING btree (slug);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (guid, url);

alter table "public"."blogs" add constraint "blogs_pkey" PRIMARY KEY using index "blogs_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."blogs" add constraint "blogs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."blogs" validate constraint "blogs_user_id_fkey";

alter table "public"."posts" add constraint "posts_blog_slug_fkey" FOREIGN KEY (blog_slug) REFERENCES blogs(slug) not valid;

alter table "public"."posts" validate constraint "posts_blog_slug_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.sync_posts_updates()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
    DECLARE
        -- lock key: an arbitary number that will be used as a 'key' to lock the function
        -- only one instance of the function can have the key and run at any time
        -- If multiple requests are sent at the same time while 
        -- rows are actively being updated, it is impossible to know which will be processed first.
        -- This can lead to Typesense receiving stale data. 
        -- Locking the function prevents this negative outcome.
        lock_key INTEGER := 123456;
        is_locked BOOLEAN := FALSE;

        -- used to tell Typesense how many rows need to be synced
        total_rows INTEGER;

        -- variables for converting rows to NDJSON
        ndjson TEXT := '';

        -- variables for referencing http response values
        request_status INTEGER;
        response_message TEXT;
    BEGIN
        -- Create lock, so that only one instance of the function can
        -- be run at a time. 
        SELECT pg_try_advisory_xact_lock(lock_key) INTO is_locked;
        IF NOT is_locked THEN
            RAISE EXCEPTION 'Could not lock. Other job in process';
        END IF;

        -- Preemptively update 40 unsynced products as synced.
        -- Create a temporary table to hold the updated rows
        -- They will be synced with Typesense.
        CREATE TEMPORARY TABLE updated_rows (
            post_id UUID
        ) ON COMMIT DROP; 

        WITH soon_to_be_synced_rows AS (
            UPDATE posts_sync_tracker
            SET is_synced = TRUE
            WHERE post_id IN (
                SELECT 
                    post_id
                FROM posts_sync_tracker
                WHERE is_synced = FALSE
                LIMIT 40
            )
            RETURNING post_id
        )
        INSERT INTO updated_rows
        SELECT * FROM soon_to_be_synced_rows;


        SELECT 
            COUNT(post_id) 
            INTO total_rows
        FROM updated_rows;

        IF total_rows < 1 THEN 
            RAISE EXCEPTION 'No rows need to be synced';
        END IF;

        -- Cast the soon-to-be synced rows into a Typesense interpretable format
        WITH row_data AS (
            SELECT
                p.id,
                p.doi,
                p.url,
                p.guid,
                p.archive_url,
                p.blog_name,
                p.blog_slug,
                p.title,
                p.summary,
                p.abstract,
                p.content_text,
                p.authors,
                p.tags,
                p.reference,
                p.relationships,
                p.image,
                p.published_at,
                p.updated_at,
                p.language,
                p.category,
                p.status
            FROM posts p
            JOIN updated_rows u ON p.id = u.post_id
        )
        SELECT 
            string_agg(row_to_json(row_data)::text, E'\n')
        INTO ndjson
        FROM row_data;

        SELECT
            status,
            content
            INTO request_status, response_message
        FROM http((
            'POST'::http_method,
            -- ADD TYPESENSE URL
            'https://fmxr36stzdcbiw7hp-1.a1.typesense.net/collections/posts/documents/import?action=upsert',
            ARRAY[
                http_header('X-Typesense-API-KEY', 'afSLVEjRPsF2R2k1hFzth2zlcEUu6m5x')
            ]::http_header[],
            'application/x-ndjson',
            ndjson --payload
        )::http_request);

        -- Check if the request failed
        IF request_status <> 200 THEN
            -- stores error message in Supabase Postgres Logs
            RAISE LOG 'Typesense Sync request failed. Request status: %. Message: %.', request_status, response_message;
            -- Raises Exception, which undoes the transaction
            -- RAISE EXCEPTION 'UPSERT FAILED';
        ELSE
            RAISE LOG 'Typesense Sync request succeeded. Request status: %. Message: %.', request_status, response_message;
            -- A successful response will contain NDJSON of the results for each row
            /* possible results:
                {"success": true}
                {"success": false, "error": "Bad JSON.", "document": "[bad doc]"}
            */ 
            -- This must be processed to determine which rows synced and which did not
            WITH ndjson_from_response AS (
                SELECT unnest(string_to_array(response_message, E'\n')) AS ndjson_line
            ),
            ndjson_to_json_data AS (
                SELECT 
                    ndjson_line::JSON AS json_line
                FROM ndjson_from_response
            ),
            failed_syncs AS (
                SELECT 
                    json_line
                FROM ndjson_to_json_data
                WHERE (json_line->>'success')::BOOLEAN = FALSE
            ),
            unsynced_ids AS (
                SELECT 
                    ((json_line->>'document')::JSON->>'id')::UUID AS ids
                FROM failed_syncs
            )
            UPDATE public.posts_sync_tracker
            SET is_synced = FALSE
            WHERE post_id IN (SELECT ids FROM unsynced_ids);
        END IF;
    END;
$function$
;

create policy "Allow all authenticated users"
on "public"."blogs"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable all authenticated users"
on "public"."blogs"
as permissive
for insert
to authenticated
with check (true);


CREATE TRIGGER insert_posts_trigger AFTER INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION insert_posts_trigger_func();

CREATE TRIGGER update_posts_trigger BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_posts_trigger_func();


