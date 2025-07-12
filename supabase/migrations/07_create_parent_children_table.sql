create table parent_children (
  parent_id uuid not null references auth.users (id) on delete cascade,
  student_id bigint not null references students (id) on delete cascade,
  primary key (parent_id, student_id)
);
