INSERT INTO users (id, name, email, user_password, is_admin) VALUES
(2, 'John Doe', 'john.doe@example.com', crypt('54321', gen_salt('bf')), false),
(3, 'Jane Smith', 'jane.smith@example.com', crypt('54321', gen_salt('bf')), false),
(4, 'Robert Johnson', 'robert.j@example.com', crypt('54321', gen_salt('bf')), false),
(5, 'Emily Davis', 'emily.d@example.com', crypt('54321', gen_salt('bf')), false),
(6, 'Michael Wilson', 'michael.w@example.com', crypt('54321', gen_salt('bf')), false),
(7, 'Sarah Brown', 'sarah.b@example.com', crypt('54321', gen_salt('bf')), false),
(8, 'David Miller', 'david.m@example.com', crypt('54321', gen_salt('bf')), false),
(9, 'Lisa Taylor', 'lisa.t@example.com', crypt('54321', gen_salt('bf')), false),
(10, 'James Anderson', 'james.a@example.com', crypt('54321', gen_salt('bf')), false),
(11, 'Jennifer Thomas', 'jennifer.t@example.com', crypt('54321', gen_salt('bf')), false);