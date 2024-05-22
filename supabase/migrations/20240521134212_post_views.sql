CREATE OR REPLACE VIEW "public"."posts_by_generator" with (security_invoker=on) AS
 SELECT "count"(*) AS "gen_count",
    "blogs"."generator"
   FROM ("public"."posts"
     JOIN "public"."blogs" ON (("posts"."blog_slug" = "blogs"."slug")))
  GROUP BY "blogs"."generator";

ALTER TABLE "public"."posts_by_generator" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."posts_by_language" with (security_invoker=on) AS
 SELECT "posts"."language",
    "count"(*) AS "lang_count"
   FROM "public"."posts"
  GROUP BY "posts"."language";

ALTER TABLE "public"."posts_by_language" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."posts_by_category" with (security_invoker=on) AS
 SELECT "posts"."category",
    "count"(*) AS "cat_count"
   FROM "public"."posts"
  GROUP BY "posts"."category";

ALTER TABLE "public"."posts_by_category" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."posts_sync_tracker" (
    "post_id" "uuid" NOT NULL,
    "is_synced" boolean DEFAULT false
);

ALTER TABLE "public"."posts_sync_tracker" OWNER TO "postgres";

ALTER TABLE ONLY "public"."posts_sync_tracker"
    ADD CONSTRAINT "posts_sync_tracker_pkey" PRIMARY KEY ("post_id");

ALTER TABLE ONLY "public"."posts_sync_tracker"
    ADD CONSTRAINT "posts_sync_tracker_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;

CREATE POLICY "Enable read access for all users" ON "public"."posts_sync_tracker" FOR SELECT USING (true);

ALTER TABLE "public"."posts_sync_tracker" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE "public"."posts_by_generator" TO "anon";
GRANT ALL ON TABLE "public"."posts_by_generator" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_by_generator" TO "service_role";

GRANT ALL ON TABLE "public"."posts_by_language" TO "anon";
GRANT ALL ON TABLE "public"."posts_by_language" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_by_language" TO "service_role";

GRANT ALL ON TABLE "public"."posts_by_category" TO "anon";
GRANT ALL ON TABLE "public"."posts_by_category" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_by_category" TO "service_role";

GRANT ALL ON TABLE "public"."posts_sync_tracker" TO "anon";
GRANT ALL ON TABLE "public"."posts_sync_tracker" TO "authenticated";
GRANT ALL ON TABLE "public"."posts_sync_tracker" TO "service_role";

CREATE OR REPLACE FUNCTION "public"."insert_posts_trigger_func"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO posts_sync_tracker (post_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."insert_posts_trigger_func"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."sync_posts_updates"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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
$$;

ALTER FUNCTION "public"."sync_posts_updates"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_posts_trigger_func"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO posts_sync_tracker (post_id)
    VALUES (NEW.id)
    ON CONFLICT (post_id)
    DO UPDATE SET is_synced = FALSE;

    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_posts_trigger_func"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."updated"() RETURNS boolean
    LANGUAGE "sql"
    AS $$
  select updated_at > indexed_at from posts;
$$;

ALTER FUNCTION "public"."updated"() OWNER TO "postgres";
