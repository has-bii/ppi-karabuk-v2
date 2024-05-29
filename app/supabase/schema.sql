
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

CREATE TYPE "public"."Days" AS ENUM (
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
);

ALTER TYPE "public"."Days" OWNER TO "postgres";

CREATE TYPE "public"."DivisionType" AS ENUM (
    'ketua',
    'sekretaris',
    'bendahara',
    'MPA',
    'divisi'
);

ALTER TYPE "public"."DivisionType" OWNER TO "postgres";

CREATE TYPE "public"."DivisionUserType" AS ENUM (
    'ketua',
    'anggota'
);

ALTER TYPE "public"."DivisionUserType" OWNER TO "postgres";

CREATE TYPE "public"."Gender" AS ENUM (
    'male',
    'female'
);

ALTER TYPE "public"."Gender" OWNER TO "postgres";

CREATE TYPE "public"."ProkerStatus" AS ENUM (
    'requesting',
    'approved',
    'rejected'
);

ALTER TYPE "public"."ProkerStatus" OWNER TO "postgres";

CREATE TYPE "public"."ProkerTimeType" AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'yearly'
);

ALTER TYPE "public"."ProkerTimeType" OWNER TO "postgres";

CREATE TYPE "public"."Role" AS ENUM (
    'ADMIN',
    'BPH',
    'STUDENT'
);

ALTER TYPE "public"."Role" OWNER TO "postgres";

CREATE TYPE "public"."Settings" AS ENUM (
    'signup_is_enabled',
    'signup_default_role',
    'signup_default_status'
);

ALTER TYPE "public"."Settings" OWNER TO "postgres";

CREATE TYPE "public"."Strata" AS ENUM (
    'S1',
    'S2',
    'S3',
    'D3',
    'TOMER'
);

ALTER TYPE "public"."Strata" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."new_kabinet"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  INSERT INTO public.division (kabinet_id,name,type)
  VALUES (
    NEW.id,
    'MPA',
    'MPA'
  );
  INSERT INTO public.division (kabinet_id,name,type)
  VALUES (
    NEW.id,
    'Ketua',
    'ketua'
  );
  INSERT INTO public.division (kabinet_id,name,type)
  VALUES (
    NEW.id,
    'Sekretaris',
    'sekretaris'
  );
  INSERT INTO public.division (kabinet_id,name,type)
  VALUES (
    NEW.id,
    'Bendahara',
    'bendahara'
  );
  RETURN NEW;
end;$$;

ALTER FUNCTION "public"."new_kabinet"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."new_user_on_signup"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  INSERT INTO public.profiles (id,name)
  VALUES (
    NEW.id,
    new.raw_user_meta_data ->> 'name'
  );
  INSERT INTO public.user_role (user_id)
  VALUES (
    NEW.id
  );
  RETURN NEW;
end;$$;

ALTER FUNCTION "public"."new_user_on_signup"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."division" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "kabinet_id" "uuid" NOT NULL,
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "public"."DivisionType" NOT NULL
);

ALTER TABLE "public"."division" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."division_user" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "division_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "division_user_type" "public"."DivisionUserType" DEFAULT 'anggota'::"public"."DivisionUserType" NOT NULL,
    "kabinet_id" "uuid" NOT NULL
);

ALTER TABLE "public"."division_user" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."kabinet" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "start_date" "date" DEFAULT "now"() NOT NULL,
    "end_date" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "isShow" boolean DEFAULT false NOT NULL,
    "image" "text"
);

ALTER TABLE "public"."kabinet" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "name" "text",
    "image" "text",
    "isActive" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."proker" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "tujuan" "text" NOT NULL,
    "audience" "text" NOT NULL,
    "time_type" "public"."ProkerTimeType" NOT NULL,
    "time_repetition" smallint NOT NULL,
    "time_day" "public"."Days",
    "pj_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "public"."ProkerStatus" DEFAULT 'requesting'::"public"."ProkerStatus" NOT NULL,
    "kabinet_id" "uuid" NOT NULL,
    "division_id" "uuid" NOT NULL
);

ALTER TABLE "public"."proker" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."settings" (
    "setting" "public"."Settings" NOT NULL,
    "value" "json" NOT NULL
);

ALTER TABLE "public"."settings" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."student_database" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "birth_place" "text" NOT NULL,
    "birth_date" "date" NOT NULL,
    "no_active" "text" NOT NULL,
    "no_wa" "text" NOT NULL,
    "domisili" "text" NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "department" "text" NOT NULL,
    "strata" "public"."Strata" NOT NULL,
    "tahun_kedatangan" numeric NOT NULL,
    "file_student" "text" NOT NULL,
    "file_paspor" "text",
    "file_ikamet" "text",
    "no_student" "text" NOT NULL,
    "no_paspor" "text",
    "no_ikamet" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."student_database" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_role" (
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "role" "public"."Role"[]
);

ALTER TABLE "public"."user_role" OWNER TO "postgres";

ALTER TABLE ONLY "public"."division"
    ADD CONSTRAINT "division_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."division_user"
    ADD CONSTRAINT "division_user_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."kabinet"
    ADD CONSTRAINT "kabinet_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."proker"
    ADD CONSTRAINT "proker_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("setting");

ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_setting_key" UNIQUE ("setting");

ALTER TABLE ONLY "public"."student_database"
    ADD CONSTRAINT "student_database_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."user_role"
    ADD CONSTRAINT "user_role_pkey" PRIMARY KEY ("user_id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "create_main_division_on_create_new_kabinet" AFTER INSERT ON "public"."kabinet" FOR EACH ROW EXECUTE FUNCTION "public"."new_kabinet"();

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."division"
    ADD CONSTRAINT "public_division_kabinet_id_fkey" FOREIGN KEY ("kabinet_id") REFERENCES "public"."kabinet"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."division_user"
    ADD CONSTRAINT "public_division_user_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "public"."division"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."division_user"
    ADD CONSTRAINT "public_division_user_kabinet_id_fkey" FOREIGN KEY ("kabinet_id") REFERENCES "public"."kabinet"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."division_user"
    ADD CONSTRAINT "public_division_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."proker"
    ADD CONSTRAINT "public_proker_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "public"."division"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."proker"
    ADD CONSTRAINT "public_proker_kabinet_id_fkey" FOREIGN KEY ("kabinet_id") REFERENCES "public"."kabinet"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."proker"
    ADD CONSTRAINT "public_proker_pj_id_fkey" FOREIGN KEY ("pj_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."student_database"
    ADD CONSTRAINT "public_student_database_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_role"
    ADD CONSTRAINT "public_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable read access for all users" ON "public"."division" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."division_user" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."proker" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."settings" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Only authenticated users" ON "public"."kabinet" FOR SELECT TO "authenticated" USING (true);

ALTER TABLE "public"."division" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."division_user" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."kabinet" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."proker" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."student_database" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user can insert  based on id" ON "public"."student_database" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));

CREATE POLICY "user can select  based on id" ON "public"."student_database" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));

CREATE POLICY "user can update  based on id" ON "public"."student_database" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));

ALTER TABLE "public"."user_role" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can see their own data" ON "public"."profiles" TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "users only can see their own record" ON "public"."user_role" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."new_kabinet"() TO "anon";
GRANT ALL ON FUNCTION "public"."new_kabinet"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."new_kabinet"() TO "service_role";

GRANT ALL ON FUNCTION "public"."new_user_on_signup"() TO "anon";
GRANT ALL ON FUNCTION "public"."new_user_on_signup"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."new_user_on_signup"() TO "service_role";

GRANT ALL ON TABLE "public"."division" TO "anon";
GRANT ALL ON TABLE "public"."division" TO "authenticated";
GRANT ALL ON TABLE "public"."division" TO "service_role";

GRANT ALL ON TABLE "public"."division_user" TO "anon";
GRANT ALL ON TABLE "public"."division_user" TO "authenticated";
GRANT ALL ON TABLE "public"."division_user" TO "service_role";

GRANT ALL ON TABLE "public"."kabinet" TO "anon";
GRANT ALL ON TABLE "public"."kabinet" TO "authenticated";
GRANT ALL ON TABLE "public"."kabinet" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."proker" TO "anon";
GRANT ALL ON TABLE "public"."proker" TO "authenticated";
GRANT ALL ON TABLE "public"."proker" TO "service_role";

GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";

GRANT ALL ON TABLE "public"."student_database" TO "anon";
GRANT ALL ON TABLE "public"."student_database" TO "authenticated";
GRANT ALL ON TABLE "public"."student_database" TO "service_role";

GRANT ALL ON TABLE "public"."user_role" TO "anon";
GRANT ALL ON TABLE "public"."user_role" TO "authenticated";
GRANT ALL ON TABLE "public"."user_role" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
