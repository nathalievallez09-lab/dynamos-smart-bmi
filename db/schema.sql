create table if not exists admin_users (
  id serial primary key,
  username text unique not null,
  password text not null,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id text primary key,
  full_name text not null,
  age int not null check (age >= 1),
  sex text not null check (sex in ('Male', 'Female')),
  email text unique not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create table if not exists bmi_records (
  id bigserial primary key,
  user_id text not null references users(id) on delete cascade,
  measured_at timestamptz not null default now(),
  bmi numeric(5,2) not null check (bmi > 0),
  weight_kg numeric(6,2) not null check (weight_kg > 0),
  height_cm numeric(6,2) not null check (height_cm > 0)
);

create index if not exists idx_bmi_records_user_id_measured_at
  on bmi_records(user_id, measured_at desc);
