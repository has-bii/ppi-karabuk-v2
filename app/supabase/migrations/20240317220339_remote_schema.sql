create type "public"."Settings" as enum ('signup_is_enabled', 'signup_default_role', 'signup_default_status');

create table "public"."settings" (
    "setting" "Settings" not null,
    "value" json not null
);

alter table "public"."settings" enable row level security;

CREATE UNIQUE INDEX settings_pkey ON public.settings USING btree (setting);

CREATE UNIQUE INDEX settings_setting_key ON public.settings USING btree (setting);

alter table "public"."settings" add constraint "settings_pkey" PRIMARY KEY using index "settings_pkey";

alter table "public"."settings" add constraint "settings_setting_key" UNIQUE using index "settings_setting_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.new_kabinet()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
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
end;$function$
;

grant delete on table "public"."settings" to "anon";

grant insert on table "public"."settings" to "anon";

grant references on table "public"."settings" to "anon";

grant select on table "public"."settings" to "anon";

grant trigger on table "public"."settings" to "anon";

grant truncate on table "public"."settings" to "anon";

grant update on table "public"."settings" to "anon";

grant delete on table "public"."settings" to "authenticated";

grant insert on table "public"."settings" to "authenticated";

grant references on table "public"."settings" to "authenticated";

grant select on table "public"."settings" to "authenticated";

grant trigger on table "public"."settings" to "authenticated";

grant truncate on table "public"."settings" to "authenticated";

grant update on table "public"."settings" to "authenticated";

grant delete on table "public"."settings" to "service_role";

grant insert on table "public"."settings" to "service_role";

grant references on table "public"."settings" to "service_role";

grant select on table "public"."settings" to "service_role";

grant trigger on table "public"."settings" to "service_role";

grant truncate on table "public"."settings" to "service_role";

grant update on table "public"."settings" to "service_role";


