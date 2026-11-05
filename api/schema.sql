CREATE TABLE demo_registrations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    company VARCHAR(200) NOT NULL,
    package_name VARCHAR(120) NOT NULL DEFAULT '',
    ip_address VARCHAR(45) NOT NULL DEFAULT '',
    user_agent VARCHAR(500) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_demo_registrations_created_at (created_at),
    INDEX idx_demo_registrations_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
