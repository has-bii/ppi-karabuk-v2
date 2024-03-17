create trigger "auth_signup"
after insert on auth.users
for each row
execute function new_user_on_signup();

