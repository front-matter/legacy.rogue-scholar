CREATE TABLE IF NOT EXISTS "public"."works" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pid" "text" NOT NULL,
    "type" "public"."type_enum" DEFAULT 'Other'::"public"."type_enum" NOT NULL,
    "additionalType" "text",
    "archiveLocations" "jsonb",
    "container" "jsonb",
    "contributors" "jsonb",
    "date" "jsonb",
    "descriptions" "jsonb",
    "files" "jsonb",
    "fundingReferences" "jsonb",
    "geoLocations" "jsonb",
    "identifiers" "jsonb",
    "language" "text",
    "license" "jsonb",
    "provider" "public"."provider_enum",
    "publisher" "jsonb",
    "relations" "jsonb",
    "references" "jsonb",
    "subjects" "jsonb",
    "titles" "jsonb",
    "version" "text",
    "url" "text",
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT "now"() NOT NULL,
);

ALTER TABLE "public"."works" OWNER TO "postgres";

ALTER TABLE ONLY "public"."works"
    ADD CONSTRAINT "works_pid_key" UNIQUE ("pid");

ALTER TABLE ONLY "public"."works"
    ADD CONSTRAINT "works_pkey" PRIMARY KEY ("id");

CREATE POLICY "Enable read access for all users" ON "public"."works" FOR SELECT USING (true);

ALTER TABLE "public"."works" ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE "public"."works" TO "anon";
GRANT ALL ON TABLE "public"."works" TO "authenticated";
GRANT ALL ON TABLE "public"."works" TO "service_role";
