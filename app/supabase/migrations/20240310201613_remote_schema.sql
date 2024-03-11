create table "public"."user_role" (
    "user_id" uuid not null default auth.uid(),
    "role" "Role"[]
);


alter table "public"."user_role" enable row level security;

CREATE UNIQUE INDEX user_role_pkey ON public.user_role USING btree (user_id);

alter table "public"."user_role" add constraint "user_role_pkey" PRIMARY KEY using index "user_role_pkey";

alter table "public"."user_role" add constraint "public_user_role_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_role" validate constraint "public_user_role_user_id_fkey";

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
  INSERT INTO public.user_role (user_id)
  VALUES (
    NEW.id
  );
  RETURN NEW;
end;$function$
;

grant delete on table "public"."user_role" to "anon";

grant insert on table "public"."user_role" to "anon";

grant references on table "public"."user_role" to "anon";

grant select on table "public"."user_role" to "anon";

grant trigger on table "public"."user_role" to "anon";

grant truncate on table "public"."user_role" to "anon";

grant update on table "public"."user_role" to "anon";

grant delete on table "public"."user_role" to "authenticated";

grant insert on table "public"."user_role" to "authenticated";

grant references on table "public"."user_role" to "authenticated";

grant select on table "public"."user_role" to "authenticated";

grant trigger on table "public"."user_role" to "authenticated";

grant truncate on table "public"."user_role" to "authenticated";

grant update on table "public"."user_role" to "authenticated";

grant delete on table "public"."user_role" to "service_role";

grant insert on table "public"."user_role" to "service_role";

grant references on table "public"."user_role" to "service_role";

grant select on table "public"."user_role" to "service_role";

grant trigger on table "public"."user_role" to "service_role";

grant truncate on table "public"."user_role" to "service_role";

grant update on table "public"."user_role" to "service_role";


