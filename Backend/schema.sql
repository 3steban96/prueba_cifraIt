-- Create database
CREATE DATABASE IF NOT EXISTS cifraIt;
USE cifraIt;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'support', 'admin') NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests table
CREATE TABLE IF NOT EXISTS requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'resolved', 'closed') DEFAULT 'pending',
    response TEXT,
    category VARCHAR(100),
    priority VARCHAR(50),
    support_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (support_id) REFERENCES users(id)
);

-- Insert sample users
INSERT INTO users (username, password, role, full_name) VALUES
('client1', '123', 'client', 'John Perez'),
('client2', '123', 'client', 'Anna Lopez'),
('support1', '123', 'support', 'Mary Garcia'),
('support2', '123', 'support', 'Peter Martinez'),
('admin1', '123', 'admin', 'Charles Admin');

-- Insert sample requests
INSERT INTO requests 
(client_id, client_name, title, description, status, response, category, priority, support_id) 
VALUES
(1, 'John Perez', 'Access issue', 'I cannot log into the system', 'pending', 'ok', 'CONSULTA', 'BAJA',4),
(1, 'John Perez', 'Billing error', 'The invoice is not generated correctly', 'in_progress', 'Reviewing issue', 'TECNICO', 'MEDIA', 4),
(2, 'Anna Lopez', 'Service inquiry', 'I would like information about the plans', 'resolved', 'Provided details about available plans', 'CONSULTA', 'ALTA', 3),
(3, 'Carlos Ramirez', 'App crash', 'The app crashes when I try to open settings', 'pending', NULL, 'OTRO', 'BAJA', 3),
(4, 'Maria Torres', 'Password reset', 'I forgot my password and cannot reset it', 'in_progress', 'Sent reset instructions', 'QUEJA', 'ALTA', 4),
(5, 'Luis Gonzalez', 'Feature request', 'Could you add dark mode?', 'pending', NULL, 'OTRO', 'MEDIA', 3);