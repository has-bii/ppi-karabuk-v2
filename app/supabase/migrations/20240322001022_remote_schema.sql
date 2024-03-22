create policy "Give users access to own folder tlefzv_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'database'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder tlefzv_1"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'database'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder tlefzv_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'database'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own folder tlefzv_3"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'database'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



