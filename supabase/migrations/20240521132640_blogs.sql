CREATE TYPE "public"."language_enum" AS ENUM (
    'en',
    'de',
    'es',
    'it',
    'pt',
    'fr',
    'tr'
);

CREATE TYPE "public"."generator" AS ENUM (
    'WordPress',
    'Ghost',
    'Blogger',
    'Medium',
    'Substack',
    'Hugo',
    'Jekyll',
    'Quarto',
    'PubPub',
    'Drupal'
);

CREATE TYPE "public"."prefix_enum" AS ENUM (
    '10.53731',
    '10.54900',
    '10.59350',
    '10.59351',
    '10.59348',
    '10.59349'
);

CREATE TYPE "public"."plan_enum" AS ENUM (
    'Personal',
    'Starter',
    'Team',
    'Project',
    'Enterprise'
);

CREATE TYPE "public"."feed_format" AS ENUM (
    'application/rss+xml',
    'application/atom+xml',
    'application/feed+json',
    'application/json'
);

CREATE TYPE "public"."license" AS ENUM (
    'https://creativecommons.org/licenses/by/4.0/legalcode',
    'https://creativecommons.org/publicdomain/zero/1.0/legalcode'
);

CREATE TABLE IF NOT EXISTS "public"."blogs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "archive_prefix" "text",
    "authors" "jsonb",
    "canonical_url" boolean,
    "category" "text" DEFAULT 'naturalSciences'::"text" NOT NULL,
    "created_at" numeric NOT NULL,
    "current_feed_url" "text",
    "description" "text",
    "favicon" "text",
    "generator" "text",
    "feed_url" "text",
    "funding" "jsonb",
    "home_page_url" "text",
    "feed_format" "public"."feed_format",
    "filter" "text",
    "generator_raw" "text",
    "indexed" boolean DEFAULT true,
    "issn" "text",
    "language" "public"."language_enum" DEFAULT 'en'::"public"."language_enum",
    "license" "public"."license" DEFAULT 'https://creativecommons.org/licenses/by/4.0/legalcode'::"public"."license",
    "mastodon" "text",
    "plan" "public"."plan_enum" DEFAULT 'Starter'::"public"."plan_enum",
    "prefix" "public"."prefix_enum",
    "relative_url" "text",
    "ror" "text",
    "secure" boolean DEFAULT true,
    "slug" "text" DEFAULT ''::"text" NOT NULL,
    "status" "public"."status_enum" DEFAULT 'submitted'::"public"."status_enum" NOT NULL,
    "title" "extensions"."citext",
    "use_api" boolean,
    "use_mastodon" boolean DEFAULT false,
    "user_id" "uuid",
    "updated_at" numeric DEFAULT '0'::numeric NOT NULL,
    CONSTRAINT "blogs_issn_check" CHECK (("length"("issn") = 9)),
    CONSTRAINT "blogs_slug_check" CHECK (("length"("slug") <= 20))
);

ALTER TABLE "public"."blogs" OWNER TO "postgres";

ALTER TABLE ONLY "public"."blogs"
    ADD CONSTRAINT "blogs_issn_key" UNIQUE ("issn");

ALTER TABLE ONLY "public"."blogs"
    ADD CONSTRAINT "blogs_slug_key" UNIQUE ("slug");

ALTER TABLE ONLY "public"."blogs"
    ADD CONSTRAINT "blogs_uuid_key" UNIQUE ("id");

CREATE POLICY "Public blogs are viewable by everyone." ON "public"."blogs" FOR SELECT USING (true);

ALTER TABLE "public"."blogs" ENABLE ROW LEVEL SECURITY;
