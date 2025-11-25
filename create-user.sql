DROP USER IF EXISTS 'segredo_user'@'localhost';
CREATE USER 'segredo_user'@'localhost' IDENTIFIED BY 'SegredoSabor2025!';
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';
FLUSH PRIVILEGES;
SELECT User, Host FROM mysql.user WHERE User='segredo_user';
