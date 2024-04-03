create policy "Kabinet full access 1jb5qhs_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'kabinet'::text));


create policy "Kabinet full access 1jb5qhs_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'kabinet'::text));


create policy "Kabinet full access 1jb5qhs_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'kabinet'::text));


create policy "Kabinet full access 1jb5qhs_3"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'kabinet'::text));



