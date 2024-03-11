create table "public"."musta" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."musta" enable row level security;

create table "public"."musta_file" (
    "id" uuid not null default gen_random_uuid(),
    "musta_id" uuid not null,
    "name" text not null,
    "file" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."musta_file" enable row level security;

create table "public"."musta_vote" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "musta_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."musta_vote" enable row level security;

create table "public"."musta_vote_register_candidate" (
    "id" uuid not null default gen_random_uuid(),
    "musta_vote_id" uuid not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."musta_vote_register_candidate" enable row level security;

create table "public"."musta_voters" (
    "id" uuid not null default gen_random_uuid(),
    "musta_vote_register_candidate_id" uuid not null,
    "user_id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "musta_vote_id" uuid not null
);


alter table "public"."musta_voters" enable row level security;

CREATE UNIQUE INDEX musta_file_pkey ON public.musta_file USING btree (id, musta_id);

CREATE UNIQUE INDEX musta_pkey ON public.musta USING btree (id);

CREATE UNIQUE INDEX musta_vote_pkey ON public.musta_vote USING btree (id);

CREATE UNIQUE INDEX musta_vote_register_candidate_pkey ON public.musta_vote_register_candidate USING btree (id);

CREATE UNIQUE INDEX musta_voters_pkey ON public.musta_voters USING btree (id);

alter table "public"."musta" add constraint "musta_pkey" PRIMARY KEY using index "musta_pkey";

alter table "public"."musta_file" add constraint "musta_file_pkey" PRIMARY KEY using index "musta_file_pkey";

alter table "public"."musta_vote" add constraint "musta_vote_pkey" PRIMARY KEY using index "musta_vote_pkey";

alter table "public"."musta_vote_register_candidate" add constraint "musta_vote_register_candidate_pkey" PRIMARY KEY using index "musta_vote_register_candidate_pkey";

alter table "public"."musta_voters" add constraint "musta_voters_pkey" PRIMARY KEY using index "musta_voters_pkey";

alter table "public"."musta_file" add constraint "musta_file_musta_id_fkey" FOREIGN KEY (musta_id) REFERENCES musta(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."musta_file" validate constraint "musta_file_musta_id_fkey";

alter table "public"."musta_vote" add constraint "musta_vote_musta_id_fkey" FOREIGN KEY (musta_id) REFERENCES musta(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."musta_vote" validate constraint "musta_vote_musta_id_fkey";

alter table "public"."musta_vote_register_candidate" add constraint "musta_vote_register_candidate_musta_vote_id_fkey" FOREIGN KEY (musta_vote_id) REFERENCES musta_vote(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."musta_vote_register_candidate" validate constraint "musta_vote_register_candidate_musta_vote_id_fkey";

alter table "public"."musta_vote_register_candidate" add constraint "musta_vote_register_candidate_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."musta_vote_register_candidate" validate constraint "musta_vote_register_candidate_user_id_fkey";

alter table "public"."musta_voters" add constraint "musta_voters_musta_vote_id_fkey" FOREIGN KEY (musta_vote_id) REFERENCES musta_vote(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."musta_voters" validate constraint "musta_voters_musta_vote_id_fkey";

alter table "public"."musta_voters" add constraint "musta_voters_musta_vote_register_candidate_id_fkey" FOREIGN KEY (musta_vote_register_candidate_id) REFERENCES musta_vote_register_candidate(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."musta_voters" validate constraint "musta_voters_musta_vote_register_candidate_id_fkey";

alter table "public"."musta_voters" add constraint "musta_voters_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."musta_voters" validate constraint "musta_voters_user_id_fkey";

grant delete on table "public"."musta" to "anon";

grant insert on table "public"."musta" to "anon";

grant references on table "public"."musta" to "anon";

grant select on table "public"."musta" to "anon";

grant trigger on table "public"."musta" to "anon";

grant truncate on table "public"."musta" to "anon";

grant update on table "public"."musta" to "anon";

grant delete on table "public"."musta" to "authenticated";

grant insert on table "public"."musta" to "authenticated";

grant references on table "public"."musta" to "authenticated";

grant select on table "public"."musta" to "authenticated";

grant trigger on table "public"."musta" to "authenticated";

grant truncate on table "public"."musta" to "authenticated";

grant update on table "public"."musta" to "authenticated";

grant delete on table "public"."musta" to "service_role";

grant insert on table "public"."musta" to "service_role";

grant references on table "public"."musta" to "service_role";

grant select on table "public"."musta" to "service_role";

grant trigger on table "public"."musta" to "service_role";

grant truncate on table "public"."musta" to "service_role";

grant update on table "public"."musta" to "service_role";

grant delete on table "public"."musta_file" to "anon";

grant insert on table "public"."musta_file" to "anon";

grant references on table "public"."musta_file" to "anon";

grant select on table "public"."musta_file" to "anon";

grant trigger on table "public"."musta_file" to "anon";

grant truncate on table "public"."musta_file" to "anon";

grant update on table "public"."musta_file" to "anon";

grant delete on table "public"."musta_file" to "authenticated";

grant insert on table "public"."musta_file" to "authenticated";

grant references on table "public"."musta_file" to "authenticated";

grant select on table "public"."musta_file" to "authenticated";

grant trigger on table "public"."musta_file" to "authenticated";

grant truncate on table "public"."musta_file" to "authenticated";

grant update on table "public"."musta_file" to "authenticated";

grant delete on table "public"."musta_file" to "service_role";

grant insert on table "public"."musta_file" to "service_role";

grant references on table "public"."musta_file" to "service_role";

grant select on table "public"."musta_file" to "service_role";

grant trigger on table "public"."musta_file" to "service_role";

grant truncate on table "public"."musta_file" to "service_role";

grant update on table "public"."musta_file" to "service_role";

grant delete on table "public"."musta_vote" to "anon";

grant insert on table "public"."musta_vote" to "anon";

grant references on table "public"."musta_vote" to "anon";

grant select on table "public"."musta_vote" to "anon";

grant trigger on table "public"."musta_vote" to "anon";

grant truncate on table "public"."musta_vote" to "anon";

grant update on table "public"."musta_vote" to "anon";

grant delete on table "public"."musta_vote" to "authenticated";

grant insert on table "public"."musta_vote" to "authenticated";

grant references on table "public"."musta_vote" to "authenticated";

grant select on table "public"."musta_vote" to "authenticated";

grant trigger on table "public"."musta_vote" to "authenticated";

grant truncate on table "public"."musta_vote" to "authenticated";

grant update on table "public"."musta_vote" to "authenticated";

grant delete on table "public"."musta_vote" to "service_role";

grant insert on table "public"."musta_vote" to "service_role";

grant references on table "public"."musta_vote" to "service_role";

grant select on table "public"."musta_vote" to "service_role";

grant trigger on table "public"."musta_vote" to "service_role";

grant truncate on table "public"."musta_vote" to "service_role";

grant update on table "public"."musta_vote" to "service_role";

grant delete on table "public"."musta_vote_register_candidate" to "anon";

grant insert on table "public"."musta_vote_register_candidate" to "anon";

grant references on table "public"."musta_vote_register_candidate" to "anon";

grant select on table "public"."musta_vote_register_candidate" to "anon";

grant trigger on table "public"."musta_vote_register_candidate" to "anon";

grant truncate on table "public"."musta_vote_register_candidate" to "anon";

grant update on table "public"."musta_vote_register_candidate" to "anon";

grant delete on table "public"."musta_vote_register_candidate" to "authenticated";

grant insert on table "public"."musta_vote_register_candidate" to "authenticated";

grant references on table "public"."musta_vote_register_candidate" to "authenticated";

grant select on table "public"."musta_vote_register_candidate" to "authenticated";

grant trigger on table "public"."musta_vote_register_candidate" to "authenticated";

grant truncate on table "public"."musta_vote_register_candidate" to "authenticated";

grant update on table "public"."musta_vote_register_candidate" to "authenticated";

grant delete on table "public"."musta_vote_register_candidate" to "service_role";

grant insert on table "public"."musta_vote_register_candidate" to "service_role";

grant references on table "public"."musta_vote_register_candidate" to "service_role";

grant select on table "public"."musta_vote_register_candidate" to "service_role";

grant trigger on table "public"."musta_vote_register_candidate" to "service_role";

grant truncate on table "public"."musta_vote_register_candidate" to "service_role";

grant update on table "public"."musta_vote_register_candidate" to "service_role";

grant delete on table "public"."musta_voters" to "anon";

grant insert on table "public"."musta_voters" to "anon";

grant references on table "public"."musta_voters" to "anon";

grant select on table "public"."musta_voters" to "anon";

grant trigger on table "public"."musta_voters" to "anon";

grant truncate on table "public"."musta_voters" to "anon";

grant update on table "public"."musta_voters" to "anon";

grant delete on table "public"."musta_voters" to "authenticated";

grant insert on table "public"."musta_voters" to "authenticated";

grant references on table "public"."musta_voters" to "authenticated";

grant select on table "public"."musta_voters" to "authenticated";

grant trigger on table "public"."musta_voters" to "authenticated";

grant truncate on table "public"."musta_voters" to "authenticated";

grant update on table "public"."musta_voters" to "authenticated";

grant delete on table "public"."musta_voters" to "service_role";

grant insert on table "public"."musta_voters" to "service_role";

grant references on table "public"."musta_voters" to "service_role";

grant select on table "public"."musta_voters" to "service_role";

grant trigger on table "public"."musta_voters" to "service_role";

grant truncate on table "public"."musta_voters" to "service_role";

grant update on table "public"."musta_voters" to "service_role";

create policy "Enable read access for all users"
on "public"."musta"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."musta_vote"
as permissive
for select
to authenticated
using (true);


create policy "Give all access to users"
on "public"."musta_vote_register_candidate"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "All access to users"
on "public"."musta_voters"
as permissive
for all
to authenticated
using (true)
with check (true);



