create type "public"."DivisionType" as enum ('ketua', 'sekretaris', 'bendahara', 'MPA', 'divisi');

create table "public"."division" (
    "id" uuid not null default gen_random_uuid(),
    "kabinet_id" uuid not null,
    "name" text,
    "created_at" timestamp with time zone not null default now(),
    "type" "DivisionType" not null
);


alter table "public"."division" enable row level security;

create table "public"."division_user" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "division_id" uuid not null,
    "user_id" uuid not null
);


alter table "public"."division_user" enable row level security;

create table "public"."kabinet" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "start_date" date not null default now(),
    "end_date" date not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."kabinet" enable row level security;

CREATE UNIQUE INDEX division_pkey ON public.division USING btree (id);

CREATE UNIQUE INDEX division_user_pkey ON public.division_user USING btree (id);

CREATE UNIQUE INDEX kabinet_pkey ON public.kabinet USING btree (id);

alter table "public"."division" add constraint "division_pkey" PRIMARY KEY using index "division_pkey";

alter table "public"."division_user" add constraint "division_user_pkey" PRIMARY KEY using index "division_user_pkey";

alter table "public"."kabinet" add constraint "kabinet_pkey" PRIMARY KEY using index "kabinet_pkey";

alter table "public"."division" add constraint "public_division_kabinet_id_fkey" FOREIGN KEY (kabinet_id) REFERENCES kabinet(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."division" validate constraint "public_division_kabinet_id_fkey";

alter table "public"."division_user" add constraint "public_division_user_division_id_fkey" FOREIGN KEY (division_id) REFERENCES division(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."division_user" validate constraint "public_division_user_division_id_fkey";

alter table "public"."division_user" add constraint "public_division_user_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."division_user" validate constraint "public_division_user_user_id_fkey";

grant delete on table "public"."division" to "anon";

grant insert on table "public"."division" to "anon";

grant references on table "public"."division" to "anon";

grant select on table "public"."division" to "anon";

grant trigger on table "public"."division" to "anon";

grant truncate on table "public"."division" to "anon";

grant update on table "public"."division" to "anon";

grant delete on table "public"."division" to "authenticated";

grant insert on table "public"."division" to "authenticated";

grant references on table "public"."division" to "authenticated";

grant select on table "public"."division" to "authenticated";

grant trigger on table "public"."division" to "authenticated";

grant truncate on table "public"."division" to "authenticated";

grant update on table "public"."division" to "authenticated";

grant delete on table "public"."division" to "service_role";

grant insert on table "public"."division" to "service_role";

grant references on table "public"."division" to "service_role";

grant select on table "public"."division" to "service_role";

grant trigger on table "public"."division" to "service_role";

grant truncate on table "public"."division" to "service_role";

grant update on table "public"."division" to "service_role";

grant delete on table "public"."division_user" to "anon";

grant insert on table "public"."division_user" to "anon";

grant references on table "public"."division_user" to "anon";

grant select on table "public"."division_user" to "anon";

grant trigger on table "public"."division_user" to "anon";

grant truncate on table "public"."division_user" to "anon";

grant update on table "public"."division_user" to "anon";

grant delete on table "public"."division_user" to "authenticated";

grant insert on table "public"."division_user" to "authenticated";

grant references on table "public"."division_user" to "authenticated";

grant select on table "public"."division_user" to "authenticated";

grant trigger on table "public"."division_user" to "authenticated";

grant truncate on table "public"."division_user" to "authenticated";

grant update on table "public"."division_user" to "authenticated";

grant delete on table "public"."division_user" to "service_role";

grant insert on table "public"."division_user" to "service_role";

grant references on table "public"."division_user" to "service_role";

grant select on table "public"."division_user" to "service_role";

grant trigger on table "public"."division_user" to "service_role";

grant truncate on table "public"."division_user" to "service_role";

grant update on table "public"."division_user" to "service_role";

grant delete on table "public"."kabinet" to "anon";

grant insert on table "public"."kabinet" to "anon";

grant references on table "public"."kabinet" to "anon";

grant select on table "public"."kabinet" to "anon";

grant trigger on table "public"."kabinet" to "anon";

grant truncate on table "public"."kabinet" to "anon";

grant update on table "public"."kabinet" to "anon";

grant delete on table "public"."kabinet" to "authenticated";

grant insert on table "public"."kabinet" to "authenticated";

grant references on table "public"."kabinet" to "authenticated";

grant select on table "public"."kabinet" to "authenticated";

grant trigger on table "public"."kabinet" to "authenticated";

grant truncate on table "public"."kabinet" to "authenticated";

grant update on table "public"."kabinet" to "authenticated";

grant delete on table "public"."kabinet" to "service_role";

grant insert on table "public"."kabinet" to "service_role";

grant references on table "public"."kabinet" to "service_role";

grant select on table "public"."kabinet" to "service_role";

grant trigger on table "public"."kabinet" to "service_role";

grant truncate on table "public"."kabinet" to "service_role";

grant update on table "public"."kabinet" to "service_role";

create policy "Only authenticated users"
on "public"."kabinet"
as permissive
for select
to authenticated
using (true);



