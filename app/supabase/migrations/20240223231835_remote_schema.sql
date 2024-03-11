set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.new_user_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  INSERT INTO public.user (id)
  VALUES (
    NEW.id
  );
  RETURN NEW;
end;$function$
;


