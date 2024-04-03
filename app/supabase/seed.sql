-- Settings
insert into public.settings (setting,value) values ('signup_default_role','{"array": []}'), ('signup_is_enabled','{"boolean": false}'), ('signup_default_status','{"boolean": false}');

insert into storage.buckets(id,name, public, file_size_limit, allowed_mime_types) values 
    ('profiles','profiles', true, 2097152, array['image/png','image/jpg','image/jpeg']),
    ('kabinet','kabinet', false, 2097152, array['image/png','image/jpg','image/jpeg']),
    ('database','database', false, 2097152, array['image/png','image/jpg','image/jpeg','application/pdf']);

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('strapi-uploads', 'strapi-uploads', NULL, '2024-03-09 14:35:28.323903+00', '2024-03-09 14:35:28.323903+00', true, false, 5242880, '{image/png,image/jpg,image/jpeg}', NULL);