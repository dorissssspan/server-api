/*
SQLyog Ultimate v11.27 (32 bit)
MySQL - 8.0.13 : Database - my_demo_01
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`my_demo_01` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;

USE `my_demo_01`;

/*Table structure for table `ev_users` */

DROP TABLE IF EXISTS `ev_users`;

CREATE TABLE `ev_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `user_pic` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户信息表';

/*Data for the table `ev_users` */

insert  into `ev_users`(`id`,`username`,`password`,`nickname`,`email`,`user_pic`) values (1,'admin','123456','abc','abc@qq.com',NULL),(2,'admin1','$2a$10$fOVbfhRrIlAswZk3QRjZneEdmMv/69dfy1wG9Y0Cz6/.cZ9xNMZAm','码崽','abc@qq.com','data:image/png;base64,VE9PTUFOWVNFQ1JFVFM='),(3,'doris','$2a$10$Uc49/ggSp9Hc3TmMuY6xWuWPIofCbSM8PjXJJ/qF3B02tV7Vr0MwS','abc','abc@qq.com',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
