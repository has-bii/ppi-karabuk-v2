create type "public"."Gender" as enum ('male', 'female');

create type "public"."Strata" as enum ('S1', 'S2', 'S3', 'D3', 'TOMER');

create table "public"."student_database" (
    "user_id" uuid not null default auth.uid(),
    "name" text not null,
    "email" text not null,
    "birth_place" text not null,
    "birth_date" date not null,
    "no_active" text not null,
    "no_wa" text not null,
    "domisili" text not null,
    "gender" "Gender" not null,
    "department" text not null,
    "strata" "Strata" not null,
    "tahun_kedatangan" numeric not null,
    "file_student" text not null,
    "file_paspor" text,
    "file_ikamet" text,
    "no_student" text not null,
    "no_paspor" text,
    "no_ikamet" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."student_database" enable row level security;

CREATE UNIQUE INDEX student_database_pkey ON public.student_database USING btree (user_id);

alter table "public"."student_database" add constraint "student_database_pkey" PRIMARY KEY using index "student_database_pkey";

alter table "public"."student_database" add constraint "public_student_database_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."student_database" validate constraint "public_student_database_user_id_fkey";

grant delete on table "public"."student_database" to "anon";

grant insert on table "public"."student_database" to "anon";

grant references on table "public"."student_database" to "anon";

grant select on table "public"."student_database" to "anon";

grant trigger on table "public"."student_database" to "anon";

grant truncate on table "public"."student_database" to "anon";

grant update on table "public"."student_database" to "anon";

grant delete on table "public"."student_database" to "authenticated";

grant insert on table "public"."student_database" to "authenticated";

grant references on table "public"."student_database" to "authenticated";

grant select on table "public"."student_database" to "authenticated";

grant trigger on table "public"."student_database" to "authenticated";

grant truncate on table "public"."student_database" to "authenticated";

grant update on table "public"."student_database" to "authenticated";

grant delete on table "public"."student_database" to "service_role";

grant insert on table "public"."student_database" to "service_role";

grant references on table "public"."student_database" to "service_role";

grant select on table "public"."student_database" to "service_role";

grant trigger on table "public"."student_database" to "service_role";

grant truncate on table "public"."student_database" to "service_role";

grant update on table "public"."student_database" to "service_role";


