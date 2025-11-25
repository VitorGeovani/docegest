CREATE DATABASE IF NOT EXISTS segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'segredo_user'@'localhost' IDENTIFIED BY 'P@$$w0rd';
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';
FLUSH PRIVILEGES;
SELECT 'MySQL configurado!' as status;
