CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "extensions";

CREATE TYPE "public"."status_enum" AS ENUM (
    'submitted',
    'approved',
    'active',
    'expired',
    'archived',
    'pending'
);

CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "abstract" "text",
    "archive_url" "text",
    "authors" "jsonb",
    "blog_name" "extensions"."citext",
    "blog_slug" "text" NOT NULL,
    "category" "text",
    "content_text" "text" DEFAULT 'content_html'::"text",
    "doi" "text",
    "guid" "text" NOT NULL,
    "image" "text",
    "images" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "indexed" boolean DEFAULT true,
    "indexed_at" numeric DEFAULT '0'::numeric NOT NULL,
    "language" "text" DEFAULT 'eng'::"text",
    "published_at" numeric,
    "relationships" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "reference" "jsonb",
    "status" "public"."status_enum" DEFAULT 'active'::"public"."status_enum" NOT NULL,
    "summary" "text" NOT NULL,
    "tags" "text"[] NOT NULL,
    "title" "text" NOT NULL,
    "updated" boolean GENERATED ALWAYS AS (("updated_at" > "indexed_at")) STORED,
    "updated_at" numeric,
    "url" "text" NOT NULL
);

ALTER TABLE "public"."posts" OWNER TO "postgres";

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_guid_key" UNIQUE ("guid");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_id_key1" UNIQUE ("doi");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_url_key" UNIQUE ("url");

ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_uuid_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."posts" 
ADD PRIMARY KEY ("guid");

CREATE POLICY "Public posts are viewable by everyone." ON "public"."posts" FOR SELECT USING (true);

ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;
