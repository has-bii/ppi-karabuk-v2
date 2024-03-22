insert into storage.buckets(id,name, public, file_size_limit, allowed_mime_types) values ('database','database', true, 2097152, array['image/png','image/jpg','image/jpeg','application/pdf']);

create policy "user can insert  based on id"
on "public"."student_database"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "user can select  based on id"
on "public"."student_database"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "user can update  based on id"
on "public"."student_database"
as permissive
for update
to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



