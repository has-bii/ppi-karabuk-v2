
create policy "Give users access to own profile 1ige2ga_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'profiles'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own profile 1ige2ga_1"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'profiles'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own profile 1ige2ga_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'profiles'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Give users access to own profile 1ige2ga_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'profiles'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



