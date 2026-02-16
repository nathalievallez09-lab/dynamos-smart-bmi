insert into admin_users (username, password, full_name)
values ('admin', 'admin123', 'System Administrator')
on conflict (username) do update
set password = excluded.password,
    full_name = excluded.full_name;

insert into users (id, full_name, age, sex, email, status)
values
  ('12345', 'Juan Dela Cruz', 21, 'Male', 'juan.delacruz@mpc.edu.ph', 'active'),
  ('12346', 'Maria Santos', 20, 'Female', 'maria.santos@mpc.edu.ph', 'active'),
  ('12347', 'Pedro Garcia', 22, 'Male', 'pedro.garcia@mpc.edu.ph', 'active'),
  ('12348', 'Ana Reyes', 19, 'Female', 'ana.reyes@mpc.edu.ph', 'active'),
  ('12349', 'Carlos Martinez', 23, 'Male', 'carlos.martinez@mpc.edu.ph', 'inactive'),
  ('12350', 'Sofia Cruz', 20, 'Female', 'sofia.cruz@mpc.edu.ph', 'active')
on conflict (id) do update
set full_name = excluded.full_name,
    age = excluded.age,
    sex = excluded.sex,
    email = excluded.email,
    status = excluded.status;

delete from bmi_records
where user_id in ('12345', '12346', '12347', '12348', '12349', '12350');

insert into bmi_records (user_id, measured_at, bmi, weight_kg, height_cm)
values
  ('12345', now() - interval '35 days', 24.20, 70.00, 170.00),
  ('12345', now() - interval '28 days', 23.80, 69.00, 170.00),
  ('12345', now() - interval '21 days', 23.50, 68.50, 170.00),
  ('12345', now() - interval '14 days', 23.60, 68.70, 170.00),
  ('12345', now() - interval '2 days', 23.50, 68.00, 170.00),

  ('12346', now() - interval '35 days', 21.90, 56.00, 160.00),
  ('12346', now() - interval '21 days', 21.40, 55.00, 160.00),
  ('12346', now() - interval '2 days', 21.20, 54.60, 160.00),

  ('12347', now() - interval '30 days', 27.30, 82.00, 173.00),
  ('12347', now() - interval '10 days', 26.90, 80.90, 173.00),
  ('12347', now() - interval '1 days', 26.80, 80.50, 173.00),

  ('12348', now() - interval '30 days', 19.90, 49.80, 158.00),
  ('12348', now() - interval '14 days', 19.70, 49.40, 158.00),
  ('12348', now() - interval '3 days', 19.50, 49.00, 158.00),

  ('12349', now() - interval '45 days', 28.80, 86.00, 174.00),
  ('12349', now() - interval '20 days', 28.50, 85.20, 174.00),
  ('12349', now() - interval '5 days', 28.30, 84.60, 174.00),

  ('12350', now() - interval '18 days', 22.60, 59.20, 162.00),
  ('12350', now() - interval '6 days', 22.30, 58.40, 162.00),
  ('12350', now() - interval '1 days', 22.10, 57.90, 162.00);
