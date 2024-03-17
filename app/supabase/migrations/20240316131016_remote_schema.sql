create type "public"."DivisionUserType" as enum ('ketua', 'anggota');

alter table "public"."division_user" add column "division_user_type" "DivisionUserType" not null default 'anggota'::"DivisionUserType";

alter table "public"."division_user" add column "kabinet_id" uuid not null;

alter table "public"."division_user" add constraint "public_division_user_kabinet_id_fkey" FOREIGN KEY (kabinet_id) REFERENCES kabinet(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."division_user" validate constraint "public_division_user_kabinet_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.new_kabinet()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
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
  INSERT INTO public.division (kabinet_id,name,type)
  VALUES (
    NEW.id,
    'MPA',
    'MPA'
  );
  RETURN NEW;
end;$function$
;

create policy "Enable read access for all users"
on "public"."division"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."division_user"
as permissive
for select
to authenticated
using (true);


CREATE TRIGGER create_main_division_on_create_new_kabinet AFTER INSERT ON public.kabinet FOR EACH ROW EXECUTE FUNCTION new_kabinet();


