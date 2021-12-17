CREATE DATABASE IF NOT EXISTS `simple_sns_test`;
GRANT ALL ON simple_sns_test.* TO 'mysql'@'%';
ALTER USER 'mysql'@'%' IDENTIFIED WITH mysql_native_password BY 'password'
