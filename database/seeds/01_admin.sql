INSERT INTO users (name, email, user_password, is_admin) 
VALUES ('admin', 'admin@logicbox.com', crypt('12345', gen_salt('bf')), true);