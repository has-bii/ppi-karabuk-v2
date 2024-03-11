drop policy "Enable read access for all users" on "public"."musta";

drop policy "Enable read access for all users" on "public"."musta_vote";

drop policy "Give all access to users" on "public"."musta_vote_register_candidate";

drop policy "All access to users" on "public"."musta_voters";

drop policy "users can see their own data" on "public"."user";

revoke delete on table "public"."musta" from "anon";

revoke insert on table "public"."musta" from "anon";

revoke references on table "public"."musta" from "anon";

revoke select on table "public"."musta" from "anon";

revoke trigger on table "public"."musta" from "anon";

revoke truncate on table "public"."musta" from "anon";

revoke update on table "public"."musta" from "anon";

revoke delete on table "public"."musta" from "authenticated";

revoke insert on table "public"."musta" from "authenticated";

revoke references on table "public"."musta" from "authenticated";

revoke select on table "public"."musta" from "authenticated";

revoke trigger on table "public"."musta" from "authenticated";

revoke truncate on table "public"."musta" from "authenticated";

revoke update on table "public"."musta" from "authenticated";

revoke delete on table "public"."musta" from "service_role";

revoke insert on table "public"."musta" from "service_role";

revoke references on table "public"."musta" from "service_role";

revoke select on table "public"."musta" from "service_role";

revoke trigger on table "public"."musta" from "service_role";

revoke truncate on table "public"."musta" from "service_role";

revoke update on table "public"."musta" from "service_role";

revoke delete on table "public"."musta_file" from "anon";

revoke insert on table "public"."musta_file" from "anon";

revoke references on table "public"."musta_file" from "anon";

revoke select on table "public"."musta_file" from "anon";

revoke trigger on table "public"."musta_file" from "anon";

revoke truncate on table "public"."musta_file" from "anon";

revoke update on table "public"."musta_file" from "anon";

revoke delete on table "public"."musta_file" from "authenticated";

revoke insert on table "public"."musta_file" from "authenticated";

revoke references on table "public"."musta_file" from "authenticated";

revoke select on table "public"."musta_file" from "authenticated";

revoke trigger on table "public"."musta_file" from "authenticated";

revoke truncate on table "public"."musta_file" from "authenticated";

revoke update on table "public"."musta_file" from "authenticated";

revoke delete on table "public"."musta_file" from "service_role";

revoke insert on table "public"."musta_file" from "service_role";

revoke references on table "public"."musta_file" from "service_role";

revoke select on table "public"."musta_file" from "service_role";

revoke trigger on table "public"."musta_file" from "service_role";

revoke truncate on table "public"."musta_file" from "service_role";

revoke update on table "public"."musta_file" from "service_role";

revoke delete on table "public"."musta_vote" from "anon";

revoke insert on table "public"."musta_vote" from "anon";

revoke references on table "public"."musta_vote" from "anon";

revoke select on table "public"."musta_vote" from "anon";

revoke trigger on table "public"."musta_vote" from "anon";

revoke truncate on table "public"."musta_vote" from "anon";

revoke update on table "public"."musta_vote" from "anon";

revoke delete on table "public"."musta_vote" from "authenticated";

revoke insert on table "public"."musta_vote" from "authenticated";

revoke references on table "public"."musta_vote" from "authenticated";

revoke select on table "public"."musta_vote" from "authenticated";

revoke trigger on table "public"."musta_vote" from "authenticated";

revoke truncate on table "public"."musta_vote" from "authenticated";

revoke update on table "public"."musta_vote" from "authenticated";

revoke delete on table "public"."musta_vote" from "service_role";

revoke insert on table "public"."musta_vote" from "service_role";

revoke references on table "public"."musta_vote" from "service_role";

revoke select on table "public"."musta_vote" from "service_role";

revoke trigger on table "public"."musta_vote" from "service_role";

revoke truncate on table "public"."musta_vote" from "service_role";

revoke update on table "public"."musta_vote" from "service_role";

revoke delete on table "public"."musta_vote_register_candidate" from "anon";

revoke insert on table "public"."musta_vote_register_candidate" from "anon";

revoke references on table "public"."musta_vote_register_candidate" from "anon";

revoke select on table "public"."musta_vote_register_candidate" from "anon";

revoke trigger on table "public"."musta_vote_register_candidate" from "anon";

revoke truncate on table "public"."musta_vote_register_candidate" from "anon";

revoke update on table "public"."musta_vote_register_candidate" from "anon";

revoke delete on table "public"."musta_vote_register_candidate" from "authenticated";

revoke insert on table "public"."musta_vote_register_candidate" from "authenticated";

revoke references on table "public"."musta_vote_register_candidate" from "authenticated";

revoke select on table "public"."musta_vote_register_candidate" from "authenticated";

revoke trigger on table "public"."musta_vote_register_candidate" from "authenticated";

revoke truncate on table "public"."musta_vote_register_candidate" from "authenticated";

revoke update on table "public"."musta_vote_register_candidate" from "authenticated";

revoke delete on table "public"."musta_vote_register_candidate" from "service_role";

revoke insert on table "public"."musta_vote_register_candidate" from "service_role";

revoke references on table "public"."musta_vote_register_candidate" from "service_role";

revoke select on table "public"."musta_vote_register_candidate" from "service_role";

revoke trigger on table "public"."musta_vote_register_candidate" from "service_role";

revoke truncate on table "public"."musta_vote_register_candidate" from "service_role";

revoke update on table "public"."musta_vote_register_candidate" from "service_role";

revoke delete on table "public"."musta_voters" from "anon";

revoke insert on table "public"."musta_voters" from "anon";

revoke references on table "public"."musta_voters" from "anon";

revoke select on table "public"."musta_voters" from "anon";

revoke trigger on table "public"."musta_voters" from "anon";

revoke truncate on table "public"."musta_voters" from "anon";

revoke update on table "public"."musta_voters" from "anon";

revoke delete on table "public"."musta_voters" from "authenticated";

revoke insert on table "public"."musta_voters" from "authenticated";

revoke references on table "public"."musta_voters" from "authenticated";

revoke select on table "public"."musta_voters" from "authenticated";

revoke trigger on table "public"."musta_voters" from "authenticated";

revoke truncate on table "public"."musta_voters" from "authenticated";

revoke update on table "public"."musta_voters" from "authenticated";

revoke delete on table "public"."musta_voters" from "service_role";

revoke insert on table "public"."musta_voters" from "service_role";

revoke references on table "public"."musta_voters" from "service_role";

revoke select on table "public"."musta_voters" from "service_role";

revoke trigger on table "public"."musta_voters" from "service_role";

revoke truncate on table "public"."musta_voters" from "service_role";

revoke update on table "public"."musta_voters" from "service_role";

revoke delete on table "public"."user" from "anon";

revoke insert on table "public"."user" from "anon";

revoke references on table "public"."user" from "anon";

revoke select on table "public"."user" from "anon";

revoke trigger on table "public"."user" from "anon";

revoke truncate on table "public"."user" from "anon";

revoke update on table "public"."user" from "anon";

revoke delete on table "public"."user" from "authenticated";

revoke insert on table "public"."user" from "authenticated";

revoke references on table "public"."user" from "authenticated";

revoke select on table "public"."user" from "authenticated";

revoke trigger on table "public"."user" from "authenticated";

revoke truncate on table "public"."user" from "authenticated";

revoke update on table "public"."user" from "authenticated";

revoke delete on table "public"."user" from "service_role";

revoke insert on table "public"."user" from "service_role";

revoke references on table "public"."user" from "service_role";

revoke select on table "public"."user" from "service_role";

revoke trigger on table "public"."user" from "service_role";

revoke truncate on table "public"."user" from "service_role";

revoke update on table "public"."user" from "service_role";

alter table "public"."musta_file" drop constraint "musta_file_musta_id_fkey";

alter table "public"."musta_vote" drop constraint "musta_vote_musta_id_fkey";

alter table "public"."musta_vote_register_candidate" drop constraint "musta_vote_register_candidate_musta_vote_id_fkey";

alter table "public"."musta_vote_register_candidate" drop constraint "musta_vote_register_candidate_user_id_fkey";

alter table "public"."musta_voters" drop constraint "musta_voters_musta_vote_id_fkey";

alter table "public"."musta_voters" drop constraint "musta_voters_musta_vote_register_candidate_id_fkey";

alter table "public"."musta_voters" drop constraint "musta_voters_user_id_fkey";

alter table "public"."user" drop constraint "user_id_fkey";

alter table "public"."musta" drop constraint "musta_pkey";

alter table "public"."musta_file" drop constraint "musta_file_pkey";

alter table "public"."musta_vote" drop constraint "musta_vote_pkey";

alter table "public"."musta_vote_register_candidate" drop constraint "musta_vote_register_candidate_pkey";

alter table "public"."musta_voters" drop constraint "musta_voters_pkey";

alter table "public"."user" drop constraint "users_pkey";

drop index if exists "public"."musta_file_pkey";

drop index if exists "public"."musta_pkey";

drop index if exists "public"."musta_vote_pkey";

drop index if exists "public"."musta_vote_register_candidate_pkey";

drop index if exists "public"."musta_voters_pkey";

drop index if exists "public"."users_pkey";

drop table "public"."musta";

drop table "public"."musta_file";

drop table "public"."musta_vote";

drop table "public"."musta_vote_register_candidate";

drop table "public"."musta_voters";

drop table "public"."user";

create table "public"."profiles" (
    "id" uuid not null,
    "name" text,
    "image" text,
    "isActive" boolean not null default false,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX users_pkey ON public.profiles USING btree (id);

alter table "public"."profiles" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.new_user_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  INSERT INTO public.profiles (id,name)
  VALUES (
    NEW.id,
    new.raw_user_meta_data ->> 'name'
  );
  RETURN NEW;
end;$function$
;

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "users can see their own data"
on "public"."profiles"
as permissive
for all
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



