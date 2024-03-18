create policy "Enable read access for all users"
on "public"."settings"
as permissive
for select
to authenticated
using (true);



