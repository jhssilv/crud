INSERT INTO users (id, name, email, user_password, is_admin) 
VALUES (1, 'admin', 'admin@logicbox.com', crypt('12345', gen_salt('bf')), true);