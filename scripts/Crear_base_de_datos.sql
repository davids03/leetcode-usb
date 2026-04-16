CREATE DATABASE leetcode_usb;
CREATE USER 'leetcode_user'@'localhost' IDENTIFIED BY 'Segura123';
GRANT ALL PRIVILEGES ON leetcode_usb.* TO 'leetcode_user'@'localhost';
FLUSH PRIVILEGES;