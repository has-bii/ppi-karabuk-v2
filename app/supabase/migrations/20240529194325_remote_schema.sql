create type "public"."Days" as enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

create type "public"."ProkerStatus" as enum ('requesting', 'approved', 'rejected');

create type "public"."ProkerTimeType" as enum ('daily', 'weekly', 'monthly', 'yearly');

create table "public"."proker" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text not null,
    "tujuan" text not null,
    "audience" text not null,
    "time_type" "ProkerTimeType" not null,
    "time_repetition" smallint not null,
    "time_day" "Days",
    "pj_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "status" "ProkerStatus" not null default 'requesting'::"ProkerStatus",
    "kabinet_id" uuid not null,
    "division_id" uuid not null
);


alter table "public"."proker" enable row level security;

CREATE UNIQUE INDEX proker_pkey ON public.proker USING btree (id);

alter table "public"."proker" add constraint "proker_pkey" PRIMARY KEY using index "proker_pkey";

alter table "public"."proker" add constraint "public_proker_division_id_fkey" FOREIGN KEY (division_id) REFERENCES division(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."proker" validate constraint "public_proker_division_id_fkey";

alter table "public"."proker" add constraint "public_proker_kabinet_id_fkey" FOREIGN KEY (kabinet_id) REFERENCES kabinet(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."proker" validate constraint "public_proker_kabinet_id_fkey";

alter table "public"."proker" add constraint "public_proker_pj_id_fkey" FOREIGN KEY (pj_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."proker" validate constraint "public_proker_pj_id_fkey";

grant delete on table "public"."proker" to "anon";

grant insert on table "public"."proker" to "anon";

grant references on table "public"."proker" to "anon";

grant select on table "public"."proker" to "anon";

grant trigger on table "public"."proker" to "anon";

grant truncate on table "public"."proker" to "anon";

grant update on table "public"."proker" to "anon";

grant delete on table "public"."proker" to "authenticated";

grant insert on table "public"."proker" to "authenticated";

grant references on table "public"."proker" to "authenticated";

grant select on table "public"."proker" to "authenticated";

grant trigger on table "public"."proker" to "authenticated";

grant truncate on table "public"."proker" to "authenticated";

grant update on table "public"."proker" to "authenticated";

grant delete on table "public"."proker" to "service_role";

grant insert on table "public"."proker" to "service_role";

grant references on table "public"."proker" to "service_role";

grant select on table "public"."proker" to "service_role";

grant trigger on table "public"."proker" to "service_role";

grant truncate on table "public"."proker" to "service_role";

grant update on table "public"."proker" to "service_role";

create policy "Enable read access for all users"
on "public"."proker"
as permissive
for select
to authenticated
using (true);



