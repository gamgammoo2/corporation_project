-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: cddc
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `holduser`
--

DROP TABLE IF EXISTS `holduser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holduser` (
  `num` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nick` varchar(30) NOT NULL,
  `password` varchar(32) NOT NULL,
  `stgroup` varchar(15) NOT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holduser`
--

LOCK TABLES `holduser` WRITE;
/*!40000 ALTER TABLE `holduser` DISABLE KEYS */;
INSERT INTO `holduser` VALUES (1,'fffff','gggg123@abcd.com','ggggg','Ggggg123!','ite/poly');
/*!40000 ALTER TABLE `holduser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preuser`
--

DROP TABLE IF EXISTS `preuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preuser` (
  `num` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preuser`
--

LOCK TABLES `preuser` WRITE;
/*!40000 ALTER TABLE `preuser` DISABLE KEYS */;
INSERT INTO `preuser` VALUES (1,'aaaaa','aaaaa123@abcd.com'),(2,'bbbbb','bbbbb123@abcd.com'),(3,'cccc','ccccc123@abcd.com'),(4,'cccc','ccccc123@abcd.com'),(5,'ee','ee123@abcd.com'),(6,'fffff','fffff123@abcd.com');
/*!40000 ALTER TABLE `preuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `realuser`
--

DROP TABLE IF EXISTS `realuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `realuser` (
  `num` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nick` varchar(30) NOT NULL,
  `password` varchar(32) NOT NULL,
  `stgroup` varchar(15) NOT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `realuser`
--

LOCK TABLES `realuser` WRITE;
/*!40000 ALTER TABLE `realuser` DISABLE KEYS */;
INSERT INTO `realuser` VALUES (1,'aaaaa','aaaaa123@abcd.com','aaaaa','Aaaaa123!','uni'),(2,'eeeee','ee123@abcd.com','eeeee','Eeeee123!','uni');
/*!40000 ALTER TABLE `realuser` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-31  6:21:24
