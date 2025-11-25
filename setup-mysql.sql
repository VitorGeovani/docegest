-- Script SQL para configurar banco de dados
-- Execute com: sudo mysql < setup-mysql.sql

-- Remover usuário se existir
DROP USER IF EXISTS 'segredo_user'@'localhost';

-- Configurar root
ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;

-- Criar usuário
CREATE USER 'segredo_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@$$w0rd';

-- Criar banco se não existir
CREATE DATABASE IF NOT EXISTS segredodosabor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Dar privilégios
GRANT ALL PRIVILEGES ON segredodosabor.* TO 'segredo_user'@'localhost';

-- Aplicar
FLUSH PRIVILEGES;

-- Verificar
SELECT User, Host, plugin FROM mysql.user WHERE User IN ('root', 'segredo_user');
