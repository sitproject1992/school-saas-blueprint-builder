create table user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role_id bigint not null references roles (id) on delete cascade,
  primary key (user_id, role_id)
);
