CREATE DATABASE  IF NOT EXISTS `segredodosabor` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `segredodosabor`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: segredodosabor
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `idadministrador` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acesso` datetime DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`idadministrador`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
INSERT INTO `administrador` VALUES (1,'Administrador','admin@segredodosabor.com','000.000.000-00','$2b$10$g/IYyuSsGc45zlkNVhlXAeFLYijABRXzYOSWjCe1DRTTO6.AQHSQy','2025-10-11 14:24:07','2025-11-11 15:56:13',1);
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assistente_faq`
--

DROP TABLE IF EXISTS `assistente_faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assistente_faq` (
  `idfaq` int NOT NULL AUTO_INCREMENT,
  `pergunta` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `resposta` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` json DEFAULT NULL COMMENT 'Tags para busca ["pedido", "entrega", etc]',
  `visualizacoes` int DEFAULT '0',
  `util` int DEFAULT '0' COMMENT 'Quantas vezes foi marcada como útil',
  `nao_util` int DEFAULT '0',
  `ordem_exibicao` int DEFAULT '0' COMMENT 'Ordem de exibição no FAQ público',
  `ativo` tinyint(1) DEFAULT '1',
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idfaq`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_ativo` (`ativo`),
  KEY `idx_ordem` (`ordem_exibicao`),
  FULLTEXT KEY `idx_busca` (`pergunta`,`resposta`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Base de conhecimento (FAQ) do assistente';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assistente_faq`
--

LOCK TABLES `assistente_faq` WRITE;
/*!40000 ALTER TABLE `assistente_faq` DISABLE KEYS */;
INSERT INTO `assistente_faq` VALUES (1,'Como faço para fazer um pedido?','É muito fácil! Acesse nosso catálogo (https://segredodosabor.com/catalogo), escolha seus produtos, adicione ao carrinho, personalize se desejar e finalize o pedido. Você também pode pedir pelo WhatsApp: (11) 96769-6744','pedidos','[\"pedido\", \"como fazer\", \"comprar\"]',0,0,0,1,1,'2025-11-16 09:19:41','2025-11-16 09:19:41'),(2,'Quais são as formas de pagamento?','Aceitamos PIX (com 5% de desconto), cartão de crédito/débito, dinheiro e vale-presente. Parcelamos em até 3x sem juros!','pagamento','[\"pagamento\", \"pix\", \"cartão\"]',0,0,0,2,1,'2025-11-16 09:19:41','2025-11-16 09:19:41'),(3,'Qual o prazo de entrega?','Produtos prontos: retirada imediata. Sob encomenda: 24-48h. Bolos decorados: 48-72h. Para eventos, entre em contato para combinar!','entrega','[\"prazo\", \"entrega\", \"quanto tempo\"]',0,0,0,3,1,'2025-11-16 09:19:41','2025-11-16 09:19:41'),(4,'Vocês fazem entrega?','Sim! Oferecemos entrega em um raio de 10km. A taxa varia conforme a distância. A retirada na loja é sempre gratuita!','entrega','[\"entrega\", \"delivery\", \"frete\"]',0,0,0,4,1,'2025-11-16 09:19:41','2025-11-16 09:19:41'),(5,'Qual o horário de funcionamento?','Segunda a Sexta: 9h às 18h. Sábado: 9h às 14h. Domingo e feriados: fechado. Pedidos online 24/7!','horario','[\"horário\", \"funciona\", \"abre\"]',0,0,0,5,1,'2025-11-16 09:19:41','2025-11-16 09:19:41'),(6,'Posso personalizar meu pedido?','Sim! Você pode remover ingredientes (alergias), adicionar extras, escolher tamanhos e criar combinações únicas. O preço ajusta automaticamente!','produtos','[\"personalizar\", \"customizar\", \"mudar\"]',0,0,0,6,1,'2025-11-16 09:19:41','2025-11-16 09:19:41'),(7,'Como consulto o status do meu pedido?','Acesse \"Meus Pedidos\" no site ou envie \"status\" no WhatsApp. Você receberá todas as informações em tempo real!','pedidos','[\"status\", \"acompanhar\", \"onde está\"]',0,0,0,7,1,'2025-11-16 09:19:41','2025-11-16 09:19:41'),(8,'O site é acessível?','Sim! Somos 100% acessíveis (WCAG 2.2 AAA): VLibras integrado, navegação por teclado, leitores de tela compatíveis, alto contraste e muito mais!','acessibilidade','[\"acessibilidade\", \"libras\", \"deficiente\"]',0,0,0,8,1,'2025-11-16 09:19:41','2025-11-16 09:19:41');
/*!40000 ALTER TABLE `assistente_faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assistente_feedback`
--

DROP TABLE IF EXISTS `assistente_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assistente_feedback` (
  `idfeedback` int NOT NULL AUTO_INCREMENT,
  `idinteracao` int NOT NULL,
  `tipo` enum('positivo','negativo') COLLATE utf8mb4_unicode_ci NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci COMMENT 'Motivo do feedback negativo',
  `sugestao` text COLLATE utf8mb4_unicode_ci COMMENT 'Sugestão de melhoria',
  `ip_usuario` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_feedback` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idfeedback`),
  KEY `idx_tipo` (`tipo`),
  KEY `idx_data` (`data_feedback`),
  KEY `idinteracao` (`idinteracao`),
  CONSTRAINT `assistente_feedback_ibfk_1` FOREIGN KEY (`idinteracao`) REFERENCES `assistente_interacoes` (`idinteracao`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Feedback detalhado sobre as respostas';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assistente_feedback`
--

LOCK TABLES `assistente_feedback` WRITE;
/*!40000 ALTER TABLE `assistente_feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `assistente_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assistente_intencoes_customizadas`
--

DROP TABLE IF EXISTS `assistente_intencoes_customizadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assistente_intencoes_customizadas` (
  `idintencao` int NOT NULL AUTO_INCREMENT,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pergunta_regex` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Regex para detectar a pergunta',
  `resposta` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `prioridade` int DEFAULT '0' COMMENT 'Prioridade na detecção (maior = mais prioritário)',
  `criado_por` int DEFAULT NULL COMMENT 'ID do admin que criou',
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idintencao`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_ativo` (`ativo`),
  KEY `idx_prioridade` (`prioridade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Intenções customizadas para o assistente';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assistente_intencoes_customizadas`
--

LOCK TABLES `assistente_intencoes_customizadas` WRITE;
/*!40000 ALTER TABLE `assistente_intencoes_customizadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `assistente_intencoes_customizadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assistente_interacoes`
--

DROP TABLE IF EXISTS `assistente_interacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assistente_interacoes` (
  `idinteracao` int NOT NULL AUTO_INCREMENT,
  `mensagem_usuario` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `resposta_assistente` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `confianca` decimal(3,2) DEFAULT '0.00' COMMENT 'Confiança da resposta (0-1)',
  `feedback` enum('positivo','negativo','neutro') COLLATE utf8mb4_unicode_ci DEFAULT 'neutro',
  `ip_usuario` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'IP do usuário',
  `user_agent` text COLLATE utf8mb4_unicode_ci COMMENT 'Navegador/dispositivo',
  `data_interacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `tempo_resposta_ms` int DEFAULT NULL COMMENT 'Tempo de processamento em ms',
  PRIMARY KEY (`idinteracao`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_data` (`data_interacao`),
  KEY `idx_feedback` (`feedback`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Histórico de interações do assistente virtual';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assistente_interacoes`
--

LOCK TABLES `assistente_interacoes` WRITE;
/*!40000 ALTER TABLE `assistente_interacoes` DISABLE KEYS */;
INSERT INTO `assistente_interacoes` VALUES (1,'Ol�','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 09:28:56',NULL),(2,'Como fazer um pedido?','? *Como fazer um pedido:*\n\n1️⃣ Acesse nosso catálogo: https://segredodosabor.com/catalogo\n2️⃣ Escolha seus produtos favoritos\n3️⃣ Adicione ao carrinho\n4️⃣ Personalize (se desejar)\n5️⃣ Finalize o pedido\n\n? Você também pode fazer pedidos pelo WhatsApp!\n? (11) 96769-6744','pedido',0.93,NULL,NULL,NULL,'2025-11-16 09:33:48',NULL),(3,'Como fazer um pedido?','? *Como fazer um pedido:*\n\n1️⃣ Acesse nosso catálogo: https://segredodosabor.com/catalogo\n2️⃣ Escolha seus produtos favoritos\n3️⃣ Adicione ao carrinho\n4️⃣ Personalize (se desejar)\n5️⃣ Finalize o pedido\n\n? Você também pode fazer pedidos pelo WhatsApp!\n? (11) 96769-6744','pedido',0.93,NULL,NULL,NULL,'2025-11-16 09:43:31',NULL),(4,'Quero verificar um pedido','? *Como fazer um pedido:*\n\n1️⃣ Acesse nosso catálogo: https://segredodosabor.com/catalogo\n2️⃣ Escolha seus produtos favoritos\n3️⃣ Adicione ao carrinho\n4️⃣ Personalize (se desejar)\n5️⃣ Finalize o pedido\n\n? Você também pode fazer pedidos pelo WhatsApp!\n? (11) 96769-6744','pedido',0.70,NULL,NULL,NULL,'2025-11-16 09:43:44',NULL),(5,'Como fazer um pedido?','? *Como fazer um pedido:*\n\n1️⃣ Acesse nosso catálogo: https://segredodosabor.com/catalogo\n2️⃣ Escolha seus produtos favoritos\n3️⃣ Adicione ao carrinho\n4️⃣ Personalize (se desejar)\n5️⃣ Finalize o pedido\n\n? Você também pode fazer pedidos pelo WhatsApp!\n? (11) 96769-6744','pedido',0.93,NULL,NULL,NULL,'2025-11-16 09:48:46',NULL),(6,'Olá','Bom dia, amigo(a)! ??\n\nBem-vindo(a) ao *Segredo do Sabor*!\n\nSou seu assistente virtual e estou aqui para ajudar! ??\n\n? *Como posso ajudar?*\n\n1️⃣ ? *Fazer um pedido*\n2️⃣ ? *Consultar status*\n3️⃣ ? *Ver cardápio*\n4️⃣ ? *Formas de pagamento*\n5️⃣ ? *Entrega e retirada*\n6️⃣ ♿ *Acessibilidade*\n7️⃣ ? *Falar com atendente*\n\n? Ou digite sua dúvida diretamente!','saudacao',1.00,NULL,NULL,NULL,'2025-11-16 10:01:41',NULL),(7,'Olá','Bom dia, amigo(a)! ??\n\nBem-vindo(a) ao *Segredo do Sabor*!\n\nSou seu assistente virtual e estou aqui para ajudar! ??\n\n? *Como posso ajudar?*\n\n1️⃣ ? *Fazer um pedido*\n2️⃣ ? *Consultar status*\n3️⃣ ? *Ver cardápio*\n4️⃣ ? *Formas de pagamento*\n5️⃣ ? *Entrega e retirada*\n6️⃣ ♿ *Acessibilidade*\n7️⃣ ? *Falar com atendente*\n\n? Ou digite sua dúvida diretamente!','saudacao',1.00,NULL,NULL,NULL,'2025-11-16 10:18:01',NULL),(8,'Falar com atendente','? *Entre em Contato:*\n\n? WhatsApp: (11) 96769-6744\n? Email: contato@segredodosabor.com\n? Endereço: R. Exemplo, 123 - SP\n\n⏰ *Atendimento:*\nSeg-Sáb: 9h às 18h\n\n? Bot automático 24/7\n? Atendente humano no horário comercial','contato',0.91,NULL,NULL,NULL,'2025-11-16 10:18:25',NULL),(9,'Consultar status','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 10:18:47',NULL),(10,'Ver cardápio','? *Nosso Cardápio:*\n\n? Sorvetes Artesanais (15+ sabores)\n? Bolos Decorados\n? Brigadeiros Gourmet\n? Tortas e Mousses\n? Doces Especiais\n? Opções Sem Açúcar\n\nVeja todos: https://segredodosabor.com/catalogo\n\n? *Personalização total disponível!*','cardapio',0.89,NULL,NULL,NULL,'2025-11-16 10:18:58',NULL),(11,'Consultar status','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 10:19:20',NULL),(12,'Consultar status','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 10:19:55',NULL),(13,'Qual o status do meu pedido?','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 10:20:04',NULL),(14,'#PED000037','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 10:20:28',NULL),(15,'PED000037','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 10:20:32',NULL),(16,'Qual o status do meu pedido?','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 10:25:23',NULL),(17,'#PED000037','? Desculpe, tive um problema ao buscar o pedido.\n\nPor favor, tente novamente ou fale com um atendente:\n? (11) 96769-6744','erro',0.00,NULL,NULL,NULL,'2025-11-16 10:25:36',NULL),(18,'PED000037','? Desculpe, tive um problema ao buscar o pedido.\n\nPor favor, tente novamente ou fale com um atendente:\n? (11) 96769-6744','erro',0.00,NULL,NULL,NULL,'2025-11-16 10:25:47',NULL),(19,'#PED000037','? Desculpe, tive um problema ao buscar o pedido.\n\nPor favor, tente novamente ou fale com um atendente:\n? (11) 96769-6744','erro',0.00,NULL,NULL,NULL,'2025-11-16 10:27:47',NULL),(20,'PED000037','? Desculpe, tive um problema ao buscar o pedido.\n\nPor favor, tente novamente ou fale com um atendente:\n? (11) 96769-6744','erro',0.00,NULL,NULL,NULL,'2025-11-16 10:27:55',NULL),(21,'Qual o status do meu pedido?','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 10:28:04',NULL),(22,'PED000037','? Desculpe, tive um problema ao buscar o pedido.\n\nPor favor, tente novamente ou fale com um atendente:\n? (11) 96769-6744','erro',0.00,NULL,NULL,NULL,'2025-11-16 10:28:09',NULL),(23,'Qual o status do meu pedido?','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 10:43:00',NULL),(24,'PED000037','? *Encontrei seu pedido!*\n\n? Cliente: *Joazinho*\n? Código: *PED000037*\n✨ Status: *Entregue*\n? Data da Entrega: 10/11/2025\n⏰ Horário: 16:02:53\n? Valor Total: R$ 12.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 10:43:10',NULL),(25,'Olá','Bom dia, amigo(a)! ??\n\nBem-vindo(a) ao *Segredo do Sabor*!\n\nSou seu assistente virtual e estou aqui para ajudar! ??\n\n? *Como posso ajudar?*\n\n1️⃣ ? *Fazer um pedido*\n2️⃣ ? *Consultar status*\n3️⃣ ? *Ver cardápio*\n4️⃣ ? *Formas de pagamento*\n5️⃣ ? *Entrega e retirada*\n6️⃣ ♿ *Acessibilidade*\n7️⃣ ? *Falar com atendente*\n\n? Ou digite sua dúvida diretamente!','saudacao',1.00,NULL,NULL,NULL,'2025-11-16 10:50:13',NULL),(26,'#PED000037','? *Encontrei seu pedido!*\n\n? Cliente: *Joazinho*\n? Código: *PED000037*\n✨ Status: *Entregue*\n? Data da Entrega: 10/11/2025\n⏰ Horário: 16:02:53\n? Valor Total: R$ 12.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 10:50:13',NULL),(27,'Consultar status','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 10:50:44',NULL),(28,'Qual o status do meu pedido?','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 10:50:55',NULL),(29,'PED000037','? *Encontrei seu pedido!*\n\n? Cliente: *Joazinho*\n? Código: *PED000037*\n✨ Status: *Entregue*\n? Data da Entrega: 10/11/2025\n⏰ Horário: 16:02:53\n? Valor Total: R$ 12.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 10:51:02',NULL),(30,'Fazer um pedido','? *Como fazer um pedido:*\n\n1️⃣ Acesse nosso catálogo: https://segredodosabor.com/catalogo\n2️⃣ Escolha seus produtos favoritos\n3️⃣ Adicione ao carrinho\n4️⃣ Personalize (se desejar)\n5️⃣ Finalize o pedido\n\n? Você também pode fazer pedidos pelo WhatsApp!\n? (11) 96769-6744','pedido',0.70,NULL,NULL,NULL,'2025-11-16 10:51:40',NULL),(31,'Ver cardápio','? *Nosso Cardápio:*\n\n? Sorvetes Artesanais (15+ sabores)\n? Bolos Decorados\n? Brigadeiros Gourmet\n? Tortas e Mousses\n? Doces Especiais\n? Opções Sem Açúcar\n\nVeja todos: https://segredodosabor.com/catalogo\n\n? *Personalização total disponível!*','cardapio',0.89,NULL,NULL,NULL,'2025-11-16 10:51:49',NULL),(32,'Formas de pagamento','? *Formas de Pagamento:*\n\n✅ PIX (desconto de 5%)\n✅ Cartão de Crédito/Débito\n✅ Dinheiro\n✅ Vale-Presente\n\n? *Parcelamento:* Até 3x sem juros\n\n? *PIX tem desconto especial!*','pagamento',0.91,NULL,NULL,NULL,'2025-11-16 10:51:55',NULL),(33,'Entrega e retirada','? *Entrega e Retirada:*\n\n? *Retirada na loja:* Gratuita!\nEndereço: R. Exemplo, 123 - SP\nHorário: Seg-Sáb 9h-18h\n\n? *Delivery:* Consulte taxa\nRaio de 10km\nTempo médio: 30-45min\n\n? Escolha no checkout!','entrega',0.70,NULL,NULL,NULL,'2025-11-16 10:52:02',NULL),(34,'Acessibilidade','♿ *Acessibilidade Total:*\n\n✅ VLibras integrado (LIBRAS)\n✅ Navegação por teclado\n✅ Leitores de tela compatíveis\n✅ Alto contraste\n✅ Textos ampliáveis\n✅ WCAG 2.2 AAA certificado\n\n? *Primeiro e-commerce 100% acessível do Brasil!*\n\nTodos são bem-vindos! ?','acessibilidade',0.87,NULL,NULL,NULL,'2025-11-16 10:52:09',NULL),(35,'Falar com atendente','? *Entre em Contato:*\n\n? WhatsApp: (11) 96769-6744\n? Email: contato@segredodosabor.com\n? Endereço: R. Exemplo, 123 - SP\n\n⏰ *Atendimento:*\nSeg-Sáb: 9h às 18h\n\n? Bot automático 24/7\n? Atendente humano no horário comercial','contato',0.91,NULL,NULL,NULL,'2025-11-16 10:52:16',NULL),(36,'Consultar status','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 10:52:24',NULL),(37,'Consultar status','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 10:53:28',NULL),(38,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 10:59:13',NULL),(39,'PED000037','? *Encontrei seu pedido!*\n\n? Cliente: *Joazinho*\n? Código: *PED000037*\n✨ Status: *Entregue*\n? Data da Entrega: 10/11/2025\n⏰ Horário: 16:02:53\n? Valor Total: R$ 12.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 10:59:21',NULL),(40,'Pode','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 10:59:44',NULL),(41,'menu','? *Como posso ajudar?*\n\n1️⃣ ? *Fazer um pedido*\n2️⃣ ? *Consultar status*\n3️⃣ ? *Ver cardápio*\n4️⃣ ? *Formas de pagamento*\n5️⃣ ? *Entrega e retirada*\n6️⃣ ♿ *Acessibilidade*\n7️⃣ ? *Falar com atendente*\n\n? Ou digite sua dúvida diretamente!','menu',1.00,NULL,NULL,NULL,'2025-11-16 10:59:52',NULL),(42,'1','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 10:59:59',NULL),(43,'1','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 11:01:09',NULL),(44,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 11:27:11',NULL),(45,'PED00000038','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000000*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 11:27:24',NULL),(46,'#PED00000038','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000000*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 11:27:39',NULL),(47,'PED00000037','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000000*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 11:27:47',NULL),(48,'116756757','? Desculpe, não entendi sua pergunta.\n\n? *Tente perguntar:*\n• \"Como fazer um pedido?\"\n• \"Qual o status do meu pedido?\"\n• \"Quais as formas de pagamento?\"\n• \"Qual o horário de funcionamento?\"\n\nOu digite *menu* para ver todas as opções! ?','naoEntendido',0.00,NULL,NULL,NULL,'2025-11-16 11:28:10',NULL),(49,'Qual o status do meu pedido?','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 11:28:16',NULL),(50,'#PED00000038','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000000*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 11:28:25',NULL),(51,'#PED000038','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000038*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 11:29:11',NULL),(52,'PED000038','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000038*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 11:29:18',NULL),(53,'Fazer um pedido','? *Consultar status do pedido:*\n\nPara consultar seu pedido, informe:\n• O código do pedido (ex: #PED000037), OU\n• Seu telefone/email de cadastro\n\n? *Dica:* Você pode digitar o código diretamente!\nExemplo: #PED000037\n\n? Dúvidas? (11) 96769-6744','status',0.70,NULL,NULL,NULL,'2025-11-16 11:31:50',NULL),(54,'Ver cardápio','? *Nosso Cardápio:*\n\n? Sorvetes Artesanais (15+ sabores)\n? Bolos Decorados\n? Brigadeiros Gourmet\n? Tortas e Mousses\n? Doces Especiais\n? Opções Sem Açúcar\n\nVeja todos: https://segredodosabor.com/catalogo\n\n? *Personalização total disponível!*','cardapio',0.89,NULL,NULL,NULL,'2025-11-16 11:32:04',NULL),(55,'Formas de pagamento','? *Formas de Pagamento:*\n\n✅ PIX (desconto de 5%)\n✅ Cartão de Crédito/Débito\n✅ Dinheiro\n✅ Vale-Presente\n\n? *Parcelamento:* Até 3x sem juros\n\n? *PIX tem desconto especial!*','pagamento',0.91,NULL,NULL,NULL,'2025-11-16 11:32:12',NULL),(56,'Entrega e retirada','? *Entrega e Retirada:*\n\n? *Retirada na loja:* Gratuita!\nEndereço: R. Exemplo, 123 - SP\nHorário: Seg-Sáb 9h-18h\n\n? *Delivery:* Consulte taxa\nRaio de 10km\nTempo médio: 30-45min\n\n? Escolha no checkout!','entrega',0.70,NULL,NULL,NULL,'2025-11-16 11:32:16',NULL),(57,'Acessibilidade','♿ *Acessibilidade Total:*\n\n✅ VLibras integrado (LIBRAS)\n✅ Navegação por teclado\n✅ Leitores de tela compatíveis\n✅ Alto contraste\n✅ Textos ampliáveis\n✅ WCAG 2.2 AAA certificado\n\n? *Primeiro e-commerce 100% acessível do Brasil!*\n\nTodos são bem-vindos! ?','acessibilidade',0.87,NULL,NULL,NULL,'2025-11-16 11:32:20',NULL),(58,'Falar com atendente','? *Entre em Contato:*\n\n? WhatsApp: (11) 96769-6744\n? Email: contato@segredodosabor.com\n? Endereço: R. Exemplo, 123 - SP\n\n⏰ *Atendimento:*\nSeg-Sáb: 9h às 18h\n\n? Bot automático 24/7\n? Atendente humano no horário comercial','contato',0.91,NULL,NULL,NULL,'2025-11-16 11:32:24',NULL),(59,'Fazer um pedido','? *Consultar status do pedido:*\n\nPara consultar seu pedido, informe:\n• O código do pedido (ex: #PED000037), OU\n• Seu telefone/email de cadastro\n\n? *Dica:* Você pode digitar o código diretamente!\nExemplo: #PED000037\n\n? Dúvidas? (11) 96769-6744','status',0.70,NULL,NULL,NULL,'2025-11-16 11:32:28',NULL),(60,'PED000038','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000038*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 11:33:16',NULL),(61,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 11:36:46',NULL),(62,'PED000038','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000038*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 11:36:56',NULL),(63,'#PED000038','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000038*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 11:37:35',NULL),(64,'Fazer um pedido','? *Como fazer um pedido:*\n\n1️⃣ Acesse nosso catálogo: http://localhost:3000/catalogo\n2️⃣ Escolha seus produtos favoritos\n3️⃣ Adicione ao carrinho\n4️⃣ Personalize (se desejar)\n5️⃣ Finalize o pedido\n\n? Você também pode fazer pedidos pelo WhatsApp!\n? (11) 96769-6744','pedido',0.91,NULL,NULL,NULL,'2025-11-16 11:52:11',NULL),(65,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 11:52:25',NULL),(66,'PED000037','? *Encontrei seu pedido!*\n\n? Cliente: *Joazinho*\n? Código: *PED000037*\n✨ Status: *Entregue*\n? Data da Entrega: 10/11/2025\n⏰ Horário: 16:02:53\n? Valor Total: R$ 12.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 11:52:33',NULL),(67,'Ver cardápio','? *Nosso Cardápio:*\n\n? Sorvetes Artesanais (15+ sabores)\n? Bolos Decorados\n? Brigadeiros Gourmet\n? Tortas e Mousses\n? Doces Especiais\n? Opções Sem Açúcar\n\nVeja todos: https://segredodosabor.com/catalogo\n\n? *Personalização total disponível!*','cardapio',0.89,NULL,NULL,NULL,'2025-11-16 11:52:42',NULL),(68,'Formas de pagamento','? *Formas de Pagamento:*\n\n✅ PIX (desconto de 5%)\n✅ Cartão de Crédito/Débito\n✅ Dinheiro\n✅ Vale-Presente\n\n? *Parcelamento:* Até 3x sem juros\n\n? *PIX tem desconto especial!*','pagamento',0.91,NULL,NULL,NULL,'2025-11-16 11:52:45',NULL),(69,'Entrega e retirada','? *Entrega e Retirada:*\n\n? *Retirada na loja:* Gratuita!\nEndereço: R. Exemplo, 123 - SP\nHorário: Seg-Sáb 9h-18h\n\n? *Delivery:* Consulte taxa\nRaio de 10km\nTempo médio: 30-45min\n\n? Escolha no checkout!','entrega',0.70,NULL,NULL,NULL,'2025-11-16 11:52:49',NULL),(70,'Acessibilidade','♿ *Acessibilidade Total:*\n\n✅ VLibras integrado (LIBRAS)\n✅ Navegação por teclado\n✅ Leitores de tela compatíveis\n✅ Alto contraste\n✅ Textos ampliáveis\n✅ WCAG 2.2 AAA certificado\n\n? *Primeiro e-commerce 100% acessível do Brasil!*\n\nTodos são bem-vindos! ?','acessibilidade',0.87,NULL,NULL,NULL,'2025-11-16 11:53:07',NULL),(71,'Falar com atendente','? *Entre em Contato:*\n\n? WhatsApp: (11) 96769-6744\n? Email: contato@segredodosabor.com\n? Endereço: R. Exemplo, 123 - SP\n\n⏰ *Atendimento:*\nSeg-Sáb: 9h às 18h\n\n? Bot automático 24/7\n? Atendente humano no horário comercial','contato',0.91,NULL,NULL,NULL,'2025-11-16 11:53:11',NULL),(72,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 11:53:15',NULL),(73,'PED000038','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000038*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 11:53:19',NULL),(74,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 12:01:11',NULL),(75,'PED000037','? *Encontrei seu pedido!*\n\n? Cliente: *Joazinho*\n? Código: *PED000037*\n✨ Status: *Entregue*\n? Data da Entrega: 10/11/2025\n⏰ Horário: 16:02:53\n? Valor Total: R$ 12.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 12:01:25',NULL),(76,'PED000038','? *Encontrei seu pedido!*\n\n? Cliente: *Njhgjkhhk*\n? Código: *PED000038*\n✨ Status: *Entregue*\n? Data da Entrega: 15/11/2025\n⏰ Horário: 11:25:07\n? Valor Total: R$ 14.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 12:01:30',NULL),(77,'Fazer um pedido','? *Como fazer um pedido:*\n\n1️⃣ Acesse nosso catálogo: http://localhost:3000/catalogo\n2️⃣ Escolha seus produtos favoritos\n3️⃣ Adicione ao carrinho\n4️⃣ Personalize (se desejar)\n5️⃣ Finalize o pedido\n\n? Você também pode fazer pedidos pelo WhatsApp!\n? (11) 96769-6744','pedido',0.91,NULL,NULL,NULL,'2025-11-16 12:01:48',NULL),(78,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 12:04:23',NULL),(79,'PED000039','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000039*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 12:04:25',NULL),(80,'PED000038','? *Encontrei seu pedido!*\n\n? Cliente: *Njhgjkhhk*\n? Código: *PED000038*\n✨ Status: *Entregue*\n? Data da Entrega: 15/11/2025\n⏰ Horário: 11:25:07\n? Valor Total: R$ 14.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 12:04:28',NULL),(81,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 12:32:59',NULL),(82,'PED000040','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000040*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 12:33:09',NULL),(83,'PED000040','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000040*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 12:33:39',NULL),(84,'PED000039','? *Encontrei seu pedido!*\n\n? Cliente: *Maria Luciana*\n? Código: *PED000039*\n✨ Status: *Entregue*\n? Data da Entrega: 15/11/2025\n⏰ Horário: 12:31:48\n? Valor Total: R$ 17.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 12:33:43',NULL),(85,'#PED000039','? *Encontrei seu pedido!*\n\n? Cliente: *Maria Luciana*\n? Código: *PED000039*\n✨ Status: *Entregue*\n? Data da Entrega: 15/11/2025\n⏰ Horário: 12:31:48\n? Valor Total: R$ 17.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 12:54:26',NULL),(86,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 12:55:17',NULL),(87,'PED000038','? *Encontrei seu pedido!*\n\n? Cliente: *Njhgjkhhk*\n? Código: *PED000038*\n✨ Status: *Entregue*\n? Data da Entrega: 15/11/2025\n⏰ Horário: 11:25:07\n? Valor Total: R$ 14.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 12:55:24',NULL),(88,'PED000039','? *Encontrei seu pedido!*\n\n? Cliente: *Maria Luciana*\n? Código: *PED000039*\n✨ Status: *Entregue*\n? Data da Entrega: 15/11/2025\n⏰ Horário: 12:31:48\n? Valor Total: R$ 17.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 12:55:28',NULL),(89,'PED000040','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000040*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 12:55:33',NULL),(90,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 14:01:06',NULL),(91,'#PED000039','? *Encontrei seu pedido!*\n\n? Cliente: *Maria Luciana*\n? Código: *PED000039*\n✨ Status: *Entregue*\n? Data da Entrega: 15/11/2025\n⏰ Horário: 12:31:48\n? Valor Total: R$ 17.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 14:01:09',NULL),(92,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 14:13:47',NULL),(93,'#PED000041','? *Encontrei seu pedido!*\n\n? Cliente: *Vitor*\n? Código: *PED000041*\n✨ Status: *Entregue*\n? Data da Entrega: 15/11/2025\n⏰ Horário: 14:12:27\n? Valor Total: R$ 20.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 14:13:50',NULL),(94,'#PED000040','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000040*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 14:21:24',NULL),(95,'#PED000041','? *Encontrei seu pedido!*\n\n? Cliente: *Vitor*\n? Código: *PED000041*\n✨ Status: *Entregue*\n? Data da Entrega: 16/11/2025\n⏰ Horário: 14:12:27\n? Valor Total: R$ 20.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 14:21:28',NULL),(96,'#PED000039','? *Encontrei seu pedido!*\n\n? Cliente: *Maria Luciana*\n? Código: *PED000039*\n✨ Status: *Entregue*\n? Data da Entrega: 16/11/2025\n⏰ Horário: 12:31:48\n? Valor Total: R$ 17.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 14:21:45',NULL),(97,'#PED000040','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000040*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 14:21:49',NULL),(98,'#PED000041','? *Encontrei seu pedido!*\n\n? Cliente: *Vitor*\n? Código: *PED000041*\n✨ Status: *Entregue*\n? Data da Entrega: 16/11/2025\n⏰ Horário: 14:12:27\n? Valor Total: R$ 20.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 14:21:52',NULL),(99,'Consultar status','? *Para consultar seu pedido, preciso de:*\n\n• Código do pedido, OU\n• Seu telefone/email de cadastro\n\n? Por favor, informe um desses dados!','solicitacaoDados',0.00,NULL,NULL,NULL,'2025-11-16 14:23:25',NULL),(100,'#PED000039','? *Encontrei seu pedido!*\n\n? Cliente: *Maria Luciana*\n? Código: *PED000039*\n✨ Status: *Entregue*\n? Data da Entrega: 16/11/2025\n⏰ Horário: 12:31:48\n? Valor Total: R$ 17.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 14:23:30',NULL),(101,'#PED000040','? *Pedido não encontrado!*\n\nNão encontrei nenhum pedido com o código *PED000040*.\n\nPor favor, verifique:\n• Se o código está correto\n• Se há algum erro de digitação\n• Se o pedido realmente existe\n\n? *Exemplos de códigos válidos:*\n• #PED000037\n• PED000042\n\n? Precisa de ajuda? Fale conosco:\n? (11) 96769-6744','pedidoNaoEncontrado',1.00,NULL,NULL,NULL,'2025-11-16 14:23:33',NULL),(102,'#PED000041','? *Encontrei seu pedido!*\n\n? Cliente: *Vitor*\n? Código: *PED000041*\n✨ Status: *Entregue*\n? Data da Entrega: 16/11/2025\n⏰ Horário: 14:12:27\n? Valor Total: R$ 20.00\n\n✨ Pedido entregue! Esperamos que tenha adorado! ?\n\n? Posso ajudar em algo mais? ?','statusPedido',1.00,NULL,NULL,NULL,'2025-11-16 14:23:35',NULL);
/*!40000 ALTER TABLE `assistente_interacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assistente_palavras_chave`
--

DROP TABLE IF EXISTS `assistente_palavras_chave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assistente_palavras_chave` (
  `idpalavra` int NOT NULL AUTO_INCREMENT,
  `palavra` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `relevancia` int DEFAULT '1' COMMENT 'Peso da palavra (1-10)',
  `ativo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`idpalavra`),
  UNIQUE KEY `uk_palavra_categoria` (`palavra`,`categoria`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_ativo` (`ativo`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Palavras-chave para detecção de intenções';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assistente_palavras_chave`
--

LOCK TABLES `assistente_palavras_chave` WRITE;
/*!40000 ALTER TABLE `assistente_palavras_chave` DISABLE KEYS */;
INSERT INTO `assistente_palavras_chave` VALUES (1,'pedido','pedidos',10,1),(2,'comprar','pedidos',9,1),(3,'encomendar','pedidos',9,1),(4,'reservar','pedidos',8,1),(5,'status','pedidos',10,1),(6,'rastrear','pedidos',9,1),(7,'cancelar','pedidos',10,1),(8,'cardápio','produtos',10,1),(9,'menu','produtos',10,1),(10,'produto','produtos',10,1),(11,'doce','produtos',8,1),(12,'bolo','produtos',9,1),(13,'sorvete','produtos',9,1),(14,'brigadeiro','produtos',9,1),(15,'preço','produtos',10,1),(16,'valor','produtos',9,1),(17,'entrega','entrega',10,1),(18,'delivery','entrega',10,1),(19,'retirar','entrega',9,1),(20,'buscar','entrega',8,1),(21,'prazo','entrega',9,1),(22,'pagar','pagamento',10,1),(23,'pagamento','pagamento',10,1),(24,'pix','pagamento',10,1),(25,'cartão','pagamento',10,1),(26,'dinheiro','pagamento',9,1),(27,'parcelar','pagamento',9,1),(28,'contato','contato',10,1),(29,'telefone','contato',9,1),(30,'whatsapp','contato',10,1),(31,'email','contato',9,1),(32,'atendente','contato',10,1),(33,'ajuda','contato',10,1),(34,'horário','horario',10,1),(35,'abre','horario',9,1),(36,'fecha','horario',9,1),(37,'funciona','horario',9,1),(38,'aberto','horario',8,1),(39,'acessibilidade','acessibilidade',10,1),(40,'libras','acessibilidade',10,1),(41,'vlibras','acessibilidade',10,1),(42,'deficiente','acessibilidade',9,1),(43,'inclusão','acessibilidade',9,1);
/*!40000 ALTER TABLE `assistente_palavras_chave` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assistente_sessoes`
--

DROP TABLE IF EXISTS `assistente_sessoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assistente_sessoes` (
  `idsessao` int NOT NULL AUTO_INCREMENT,
  `identificador_sessao` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'UUID da sessão',
  `idcliente` int DEFAULT NULL COMMENT 'ID do cliente (se logado)',
  `contexto` json DEFAULT NULL COMMENT 'Contexto acumulado da conversa',
  `ultima_mensagem` text COLLATE utf8mb4_unicode_ci,
  `ultima_categoria` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_inicio` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_ultima_interacao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ativa` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`idsessao`),
  UNIQUE KEY `identificador_sessao` (`identificador_sessao`),
  KEY `idx_identificador` (`identificador_sessao`),
  KEY `idx_cliente` (`idcliente`),
  KEY `idx_ativa` (`ativa`),
  CONSTRAINT `assistente_sessoes_ibfk_1` FOREIGN KEY (`idcliente`) REFERENCES `cliente` (`idcliente`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sessões de conversa do assistente';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assistente_sessoes`
--

LOCK TABLES `assistente_sessoes` WRITE;
/*!40000 ALTER TABLE `assistente_sessoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `assistente_sessoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `idcategoria` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descricao` varchar(200) DEFAULT NULL,
  `ativo` tinyint DEFAULT '1',
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcategoria`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Sorvetes','Sorvetes artesanais diversos sabores',1,'2025-10-04 15:51:52'),(2,'Cones Recheados','Cones recheados com brigadeiro e coberturas',1,'2025-10-04 15:51:52'),(3,'Picolés','Picolés de frutas e cremes',1,'2025-10-04 15:51:52'),(4,'Bolos Gelados','Bolos para sobremesa gelados',1,'2025-10-04 15:51:52'),(5,'Mousses','Mousses cremosos diversos sabores',1,'2025-10-04 15:51:52'),(6,'Sobremesas','Sobremesas especiais',1,'2025-10-04 15:51:52'),(13,'Teste editado','fdgdfgdfg',0,'2025-10-04 18:22:16');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `idcliente` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` varchar(11) NOT NULL,
  `senha` varchar(255) DEFAULT NULL COMMENT 'Hash bcrypt da senha',
  `email_verificado` tinyint(1) DEFAULT '0',
  `token_recuperacao` varchar(255) DEFAULT NULL,
  `data_token_recuperacao` datetime DEFAULT NULL,
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acesso` datetime DEFAULT NULL,
  `tipo` enum('cliente','admin') DEFAULT 'cliente',
  PRIMARY KEY (`idcliente`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `telefone_UNIQUE` (`telefone`),
  KEY `idx_cliente_email` (`email`),
  KEY `idx_cliente_tipo` (`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Bruno Henrique Gouveia Da Silva','bruno@gmail.com','11988191980',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(2,'Cliente Exemplo','cliente@email.com','11987654321',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(3,'joao','joao@gmail.com','11988774444',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(4,'joao','joao@gmai.com','11986545454',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(5,'jose','jose@gmail.com','11988544545',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(6,'hffchg','jhgjhg','jhgjkh',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(7,'grbfdch','gfhgfhg','hgnhjh',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(8,'gvgfcgbcv','hbngvh','ghjgjj',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(9,'fbghjgjhg','jhgjhkj','hjmhkhj',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(10,'ghgfhfg','gfhngjgh','jhgjhgj',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(11,'khjukjhk','hbjhkhk','jhkjljljk',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(12,'Vitor','vitor@gmail.com','11967696744',NULL,0,NULL,NULL,'2025-10-04 17:59:30',NULL,'cliente'),(13,'fjghjgjghjg','fsdgfdfgd@gmail.com','456454676',NULL,0,NULL,NULL,'2025-10-04 22:49:05',NULL,'cliente'),(14,'fdgdfgdg','dgdgdf@gmail.com','1212213',NULL,0,NULL,NULL,'2025-10-04 23:08:20',NULL,'cliente'),(15,'trete tertrt','sadadasd@gmail.com','1176575676',NULL,0,NULL,NULL,'2025-10-05 00:27:34',NULL,'cliente'),(16,'ilojkl','jkljklkl@gmail.com','11768678',NULL,0,NULL,NULL,'2025-10-11 09:38:16',NULL,'cliente'),(17,'sdfsdfsdfsdf','joao@joao@gmail.com','11997661964',NULL,0,NULL,NULL,'2025-10-11 21:43:55',NULL,'cliente'),(18,'Emanuel','emanuel@gmail.com','11899786867',NULL,0,NULL,NULL,'2025-10-11 22:17:52',NULL,'cliente'),(19,'jklçklçk','dfsfsfd@gmail.com','1176867868',NULL,0,NULL,NULL,'2025-10-11 22:21:32',NULL,'cliente'),(20,'Maria Luciana','marialuciana@gmail.com','1146263047',NULL,0,NULL,NULL,'2025-10-17 19:46:53',NULL,'cliente'),(21,'Gilvan José da Silva','gilvan@gmail.com','116546465',NULL,0,NULL,NULL,'2025-10-17 21:40:47',NULL,'cliente'),(22,'Almeida','almeida@gmail.com','11675776868',NULL,0,NULL,NULL,'2025-10-17 22:00:09',NULL,'cliente'),(23,'teste persona','teste@gmail.com','1186788768',NULL,0,NULL,NULL,'2025-10-18 07:26:26',NULL,'cliente'),(24,'Joazinho','joa@gmail.com','11786786768',NULL,0,NULL,NULL,'2025-11-11 16:02:53',NULL,'cliente'),(25,'Njhgjkhhk','hjghj@gmail.com','116756757',NULL,0,NULL,NULL,'2025-11-16 11:25:07',NULL,'cliente'),(26,'Maria Luciana','mlucianasmelo@gmail.com','11946263047',NULL,0,NULL,NULL,'2025-11-16 12:31:48',NULL,'cliente'),(27,'Ana Teste Fixo','ana.fixo@teste.com','1144445555',NULL,0,NULL,NULL,'2025-11-16 12:33:59',NULL,'cliente');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente_preferencias`
--

DROP TABLE IF EXISTS `cliente_preferencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_preferencias` (
  `idpreferencia` int NOT NULL AUTO_INCREMENT,
  `idcliente_fk` int NOT NULL,
  `preferencias` json NOT NULL,
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ativo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`idpreferencia`),
  KEY `idx_cliente` (`idcliente_fk`),
  KEY `idx_ativo` (`ativo`),
  CONSTRAINT `cliente_preferencias_ibfk_1` FOREIGN KEY (`idcliente_fk`) REFERENCES `cliente` (`idcliente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Armazena preferências personalizadas de clientes frequentes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_preferencias`
--

LOCK TABLES `cliente_preferencias` WRITE;
/*!40000 ALTER TABLE `cliente_preferencias` DISABLE KEYS */;
INSERT INTO `cliente_preferencias` VALUES (1,1,'{\"notificacoes\": {\"email\": false, \"whatsapp\": true, \"promocoes\": true}, \"horario_preferido\": \"14:00\", \"observacao_padrao\": \"Sem açúcar\", \"produtos_favoritos\": [1, 3, 5], \"forma_pagamento_padrao\": \"PIX\"}','2025-10-17 19:04:57','2025-10-17 19:04:57',1),(2,2,'{\"alergias\": [\"amendoim\"], \"endereco_entrega\": {\"rua\": \"Av. Paulista\", \"bairro\": \"Bela Vista\", \"cidade\": \"São Paulo\", \"numero\": \"1000\"}, \"produtos_favoritos\": [2, 4], \"forma_pagamento_padrao\": \"Cartão\"}','2025-10-17 19:04:57','2025-10-17 19:04:57',1),(3,1,'{\"notificacoes\": {\"email\": false, \"whatsapp\": true, \"promocoes\": true}, \"horario_preferido\": \"14:00\", \"observacao_padrao\": \"Sem açúcar\", \"produtos_favoritos\": [1, 3, 5], \"forma_pagamento_padrao\": \"PIX\"}','2025-10-17 19:18:02','2025-10-17 19:18:02',1),(4,2,'{\"alergias\": [\"amendoim\"], \"endereco_entrega\": {\"rua\": \"Av. Paulista\", \"bairro\": \"Bela Vista\", \"cidade\": \"São Paulo\", \"numero\": \"1000\"}, \"produtos_favoritos\": [2, 4], \"forma_pagamento_padrao\": \"Cartão\"}','2025-10-17 19:18:02','2025-10-17 19:18:02',1);
/*!40000 ALTER TABLE `cliente_preferencias` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_preferencias_before_update` BEFORE UPDATE ON `cliente_preferencias` FOR EACH ROW BEGIN
    -- Registrar alteração no histórico
    INSERT INTO cliente_preferencias_historico (
        idcliente_fk, 
        preferencias_antigas, 
        preferencias_novas
    )
    VALUES (
        OLD.idcliente_fk,
        OLD.preferencias,
        NEW.preferencias
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `cliente_preferencias_historico`
--

DROP TABLE IF EXISTS `cliente_preferencias_historico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_preferencias_historico` (
  `idhistorico` int NOT NULL AUTO_INCREMENT,
  `idcliente_fk` int NOT NULL,
  `preferencias_antigas` json DEFAULT NULL,
  `preferencias_novas` json DEFAULT NULL,
  `data_alteracao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idhistorico`),
  KEY `idx_cliente` (`idcliente_fk`),
  KEY `idx_data` (`data_alteracao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_preferencias_historico`
--

LOCK TABLES `cliente_preferencias_historico` WRITE;
/*!40000 ALTER TABLE `cliente_preferencias_historico` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente_preferencias_historico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracao`
--

DROP TABLE IF EXISTS `configuracao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracao` (
  `idconfig` int NOT NULL AUTO_INCREMENT,
  `chave` varchar(100) NOT NULL,
  `valor` text NOT NULL,
  `descricao` varchar(200) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT 'string' COMMENT 'string, number, boolean, json',
  `data_atualizacao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idconfig`),
  UNIQUE KEY `chave` (`chave`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracao`
--

LOCK TABLES `configuracao` WRITE;
/*!40000 ALTER TABLE `configuracao` DISABLE KEYS */;
INSERT INTO `configuracao` VALUES (1,'margem_lucro_padrao','40','Margem de lucro padrão em porcentagem','number','2025-10-04 15:53:55'),(2,'taxa_desperdicio','5','Taxa de desperdício em porcentagem','number','2025-10-04 15:53:55'),(3,'telefone_whatsapp','5511999999999','Número do WhatsApp para pedidos','string','2025-10-04 15:53:55'),(4,'tempo_preparo_padrao','30','Tempo de preparo padrão em minutos','number','2025-10-04 15:53:55'),(5,'valor_entrega','8.00','Valor da taxa de entrega','number','2025-10-04 15:53:55'),(6,'aceita_pix','true','Aceita pagamento via PIX','boolean','2025-10-04 15:53:55'),(7,'aceita_cartao','true','Aceita pagamento com cartão','boolean','2025-10-04 15:53:55'),(8,'chave_pix','email@exemplo.com','Chave PIX para recebimento','string','2025-10-04 15:53:55'),(9,'email_notificacao','contato@segredodosabor.com','Email para notificações','string','2025-10-04 17:59:30');
/*!40000 ALTER TABLE `configuracao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custo_indireto`
--

DROP TABLE IF EXISTS `custo_indireto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `custo_indireto` (
  `idcusto` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) NOT NULL COMMENT 'luz, agua, gas, embalagem, aluguel, etc',
  `descricao` varchar(200) DEFAULT NULL,
  `valor_mensal` decimal(10,2) NOT NULL,
  `mes_referencia` date NOT NULL,
  `ativo` tinyint DEFAULT '1',
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcusto`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custo_indireto`
--

LOCK TABLES `custo_indireto` WRITE;
/*!40000 ALTER TABLE `custo_indireto` DISABLE KEYS */;
INSERT INTO `custo_indireto` VALUES (1,'Energia Elétrica','Conta de luz mensal',300.00,'2025-10-01',1,'2025-10-04 15:53:55'),(2,'Água','Conta de água mensal',80.00,'2025-10-01',1,'2025-10-04 15:53:55'),(3,'Gás','Gás de cozinha',120.00,'2025-10-01',1,'2025-10-04 15:53:55'),(4,'Internet','Internet e telefone',100.00,'2025-10-01',1,'2025-10-04 15:53:55'),(5,'Material de Limpeza','Produtos de limpeza e higiene',150.00,'2025-10-01',1,'2025-10-04 15:53:55'),(6,'Energia Elétrica','Conta de luz mensal da cozinha',300.00,'2025-10-01',1,'2025-10-04 17:59:30'),(7,'Água','Conta de água mensal',80.00,'2025-10-01',1,'2025-10-04 17:59:30'),(8,'Gás','Gás de cozinha industrial',120.00,'2025-10-01',1,'2025-10-04 17:59:30'),(9,'Internet','Internet e telefone fixo',100.00,'2025-10-01',1,'2025-10-04 17:59:30'),(10,'Material de Limpeza','Produtos de limpeza e higiene',150.00,'2025-10-01',1,'2025-10-04 17:59:30'),(11,'Embalagens','Caixas, sacolas e etiquetas',200.00,'2025-10-01',1,'2025-10-04 17:59:30');
/*!40000 ALTER TABLE `custo_indireto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingrediente`
--

DROP TABLE IF EXISTS `ingrediente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingrediente` (
  `idingrediente` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `unidade_medida` varchar(20) NOT NULL COMMENT 'kg, g, L, ml, unidade',
  `preco_unitario` decimal(10,2) NOT NULL,
  `quantidade_estoque` decimal(10,3) NOT NULL DEFAULT '0.000',
  `estoque_minimo` decimal(10,3) DEFAULT '0.000',
  `fornecedor` varchar(100) DEFAULT NULL,
  `ativo` tinyint DEFAULT '1',
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idingrediente`),
  KEY `idx_ingrediente_ativo` (`ativo`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingrediente`
--

LOCK TABLES `ingrediente` WRITE;
/*!40000 ALTER TABLE `ingrediente` DISABLE KEYS */;
INSERT INTO `ingrediente` VALUES (1,'Leite Condensado','kg',8.50,10.000,2.000,NULL,0,'2025-10-04 15:51:52','2025-10-11 23:58:36'),(2,'Chocolate ao Leite','kg',35.00,5.000,1.000,NULL,0,'2025-10-04 15:51:52','2025-10-11 23:54:45'),(3,'Chocolate Branco','kg',40.00,3.000,1.000,NULL,0,'2025-10-04 15:51:52','2025-10-11 23:55:11'),(4,'Chocolate Meio Amargo','kg',38.00,3.000,1.000,NULL,0,'2025-10-04 15:51:52','2025-10-11 23:55:34'),(5,'Creme de Leite','L',12.00,8.000,2.000,NULL,0,'2025-10-04 15:51:52','2025-10-11 23:56:56'),(6,'Leite em P?? Ninho','kg',25.00,4.000,1.000,NULL,0,'2025-10-04 15:51:52','2025-10-11 23:59:05'),(7,'Nutella','kg',45.00,2.000,0.500,NULL,0,'2025-10-04 15:51:52','2025-10-12 00:01:03'),(8,'Ovomaltine','kg',30.00,3.000,0.500,NULL,0,'2025-10-04 15:51:52','2025-10-12 00:01:43'),(9,'Oreo','kg',20.00,2.000,0.500,NULL,1,'2025-10-04 15:51:52','2025-10-04 15:51:52'),(10,'Kit Kat','kg',35.00,2.000,0.500,NULL,1,'2025-10-04 15:51:52','2025-10-04 15:51:52'),(11,'Kinder Bueno','kg',50.00,1.500,0.300,NULL,1,'2025-10-04 15:51:52','2025-10-04 15:51:52'),(12,'Ferrero Rocher','kg',80.00,1.000,0.200,NULL,1,'2025-10-04 15:51:52','2025-10-04 15:51:52'),(13,'Lim??o Siciliano','kg',8.00,5.000,1.000,NULL,0,'2025-10-04 15:51:52','2025-10-12 00:00:13'),(14,'Coco Ralado','kg',15.00,3.000,0.500,NULL,0,'2025-10-04 15:51:52','2025-10-11 23:56:18'),(15,'Casquinha/Cone','unidade',0.50,200.000,50.000,NULL,1,'2025-10-04 15:51:52','2025-10-04 15:51:52'),(16,'Embalagem Individual','unidade',0.30,500.000,100.000,NULL,1,'2025-10-04 15:51:52','2025-10-04 15:51:52'),(17,'Leite Condensado','kg',8.50,10.000,2.000,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:59:34'),(18,'Chocolate ao Leite','kg',35.00,5.000,1.000,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:54:53'),(19,'Chocolate Branco','kg',40.00,3.000,1.000,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:55:17'),(20,'Chocolate Meio Amargo','kg',38.00,3.000,1.000,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:55:40'),(21,'Creme de Leite','L',12.00,8.000,2.000,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:57:03'),(22,'Leite em Pó Ninho','kg',25.00,4.000,1.000,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:59:54'),(23,'Nutella','kg',45.00,2.000,0.500,NULL,0,'2025-10-04 15:53:54','2025-10-12 00:01:08'),(24,'Ovomaltine','kg',30.00,3.000,0.500,NULL,1,'2025-10-04 15:53:54','2025-10-04 15:53:54'),(25,'Oreo','kg',20.00,2.000,0.500,NULL,0,'2025-10-04 15:53:54','2025-10-12 00:01:27'),(26,'Kit Kat','kg',35.00,2.000,0.500,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:58:18'),(27,'Kinder Bueno','kg',50.00,1.500,0.300,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:58:12'),(28,'Ferrero Rocher','kg',80.00,1.000,0.200,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:57:56'),(29,'Limão Siciliano','kg',8.00,5.000,1.000,NULL,1,'2025-10-04 15:53:54','2025-10-04 15:53:54'),(30,'Coco Ralado','kg',15.00,3.000,0.500,NULL,1,'2025-10-04 15:53:54','2025-10-04 15:53:54'),(31,'Casquinha/Cone','unidade',0.50,200.000,50.000,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:53:21'),(32,'Embalagem Individual','unidade',0.30,500.000,100.000,NULL,0,'2025-10-04 15:53:54','2025-10-11 23:57:38'),(33,'Chocolate ao Leite','kg',35.00,5.000,2.000,'Garoto',0,'2025-10-04 16:00:57','2025-10-11 23:53:34'),(34,'Chocolate Meio Amargo','kg',42.00,3.000,1.000,'Nestlé',0,'2025-10-04 16:00:57','2025-10-11 23:56:08'),(35,'Chocolate Branco','kg',38.00,2.500,1.000,'Garoto',0,'2025-10-04 16:00:57','2025-10-11 23:55:28'),(36,'Leite Condensado','kg',12.50,10.000,3.000,'Nestlé',0,'2025-10-04 16:00:57','2025-10-11 23:58:50'),(37,'Creme de Leite','L',15.00,8.000,3.000,'Nestlé',0,'2025-10-04 16:00:57','2025-10-11 23:57:08'),(38,'Leite Integral','L',5.50,20.000,10.000,'Piracanjuba',0,'2025-10-04 16:00:57','2025-10-12 00:00:05'),(39,'Leite em Pó','kg',28.00,5.000,2.000,'Ninho',1,'2025-10-04 16:00:57','2025-10-04 16:00:57'),(40,'Açúcar Cristal','kg',4.50,25.000,10.000,'União',0,'2025-10-04 16:00:57','2025-10-11 23:52:50'),(41,'Açúcar Refinado','kg',5.00,15.000,5.000,'União',0,'2025-10-04 16:00:57','2025-10-11 23:52:54'),(42,'Morango Congelado','kg',18.00,10.000,3.000,'Frutas da Serra',1,'2025-10-04 16:00:57','2025-10-04 16:00:57'),(43,'Polpa de Limão','kg',12.00,5.000,2.000,'Polpa Norte',1,'2025-10-04 16:00:57','2025-10-04 16:00:57'),(44,'Banana','kg',6.00,8.000,3.000,'Ceasa Local',0,'2025-10-04 16:00:57','2025-10-11 23:53:00'),(45,'Nutella','kg',65.00,3.000,1.000,'Ferrero',0,'2025-10-04 16:00:57','2025-10-12 00:00:30'),(46,'Ovomaltine em Pó','kg',45.00,2.000,1.000,'Nestlé',0,'2025-10-04 16:00:57','2025-10-12 00:01:52'),(47,'Paçoca Triturada','kg',22.00,3.000,1.000,'Santa Helena',1,'2025-10-04 16:00:57','2025-10-04 16:00:57'),(48,'Biscoito Oreo Triturado','kg',28.00,4.000,1.500,'Mondelez',1,'2025-10-04 16:00:57','2025-10-04 16:00:57'),(49,'Kit Kat Triturado','kg',32.00,2.000,1.000,'Nestlé',1,'2025-10-04 16:00:57','2025-10-04 16:00:57'),(50,'Wafer Recheado','kg',18.00,3.000,1.000,'Bauducco',0,'2025-10-04 16:00:57','2025-10-12 00:02:15'),(51,'Casquinha de Sorvete','unidade',0.80,500.000,200.000,'Embalagens Brasil',1,'2025-10-04 16:00:57','2025-10-04 16:00:57'),(52,'Copinho 250ml','unidade',0.35,1000.000,300.000,'Copobras',1,'2025-10-04 16:00:57','2025-10-04 16:00:57'),(53,'Colher Descartável','unidade',0.08,2000.000,500.000,'Plasútil',0,'2025-10-04 16:00:57','2025-10-11 23:56:26'),(54,'Essência de Baunilha','ml',0.15,1000.000,500.000,'Arcolor',0,'2025-10-04 16:00:57','2025-10-11 23:57:46'),(55,'Corante Alimentício Rosa','ml',0.10,500.000,200.000,'Mix',1,'2025-10-04 16:00:57','2025-10-04 16:00:57'),(56,'Chantilly em Pó','kg',24.00,5.000,2.000,'Amélia',1,'2025-10-04 16:00:57','2025-10-04 16:00:57'),(57,'Granulado Colorido','kg',15.00,3.000,1.000,'Mavalério',0,'2025-10-04 16:00:57','2025-10-11 23:58:03'),(58,'Chocolate ao Leite','kg',35.00,5.000,2.000,'Garoto',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(59,'Chocolate Meio Amargo','kg',42.00,3.000,1.000,'Nestlé',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(60,'Chocolate Branco','kg',38.00,2.500,1.000,'Garoto',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(61,'Leite Condensado','kg',12.50,10.000,3.000,'Nestlé',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(62,'Creme de Leite','L',15.00,6.500,3.000,'Nestlé',1,'2025-10-04 16:01:17','2025-11-16 13:58:45'),(63,'Leite Integral','L',5.50,20.000,10.000,'Piracanjuba',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(64,'Leite em Pó','kg',28.00,5.000,2.000,'Ninho',0,'2025-10-04 16:01:17','2025-10-11 23:59:44'),(65,'Açúcar Cristal','kg',4.50,22.000,10.000,'União',1,'2025-10-04 16:01:17','2025-10-12 00:37:02'),(66,'Açúcar Refinado','kg',5.00,15.000,5.000,'União',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(67,'Morango Congelado','kg',18.00,10.000,3.000,'Frutas da Serra',0,'2025-10-04 16:01:17','2025-10-12 00:00:22'),(68,'Polpa de Limão','kg',12.00,5.000,2.000,'Polpa Norte',0,'2025-10-04 16:01:17','2025-10-12 00:02:09'),(69,'Banana','kg',6.00,8.000,3.000,'Ceasa Local',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(70,'Nutella','kg',65.00,0.000,1.000,'Ferrero',1,'2025-10-04 16:01:17','2025-11-11 15:59:59'),(71,'Ovomaltine em Pó','kg',45.00,2.000,1.000,'Nestlé',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(72,'Paçoca Triturada','kg',22.00,3.000,1.000,'Santa Helena',0,'2025-10-04 16:01:17','2025-10-12 00:02:00'),(73,'Biscoito Oreo Triturado','kg',28.00,4.000,1.500,'Mondelez',0,'2025-10-04 16:01:17','2025-10-11 23:53:05'),(74,'Kit Kat Triturado','kg',32.00,2.000,1.000,'Nestlé',0,'2025-10-04 16:01:17','2025-10-11 23:58:28'),(75,'Wafer Recheado','kg',18.00,3.000,1.000,'Bauducco',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(76,'Casquinha de Sorvete','unidade',0.80,500.000,200.000,'Embalagens Brasil',0,'2025-10-04 16:01:17','2025-10-11 23:53:11'),(77,'Copinho 250ml','unidade',0.35,1000.000,300.000,'Copobras',0,'2025-10-04 16:01:17','2025-10-11 23:56:39'),(78,'Colher Descartável','unidade',0.08,2000.000,500.000,'Plasútil',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(79,'Essência de Baunilha','ml',0.15,1000.000,500.000,'Arcolor',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(80,'Corante Alimentício Rosa','ml',0.10,500.000,200.000,'Mix',0,'2025-10-04 16:01:17','2025-10-11 23:56:46'),(81,'Chantilly em Pó','kg',24.00,5.000,2.000,'Amélia',0,'2025-10-04 16:01:17','2025-10-11 23:53:28'),(82,'Granulado Colorido','kg',15.00,3.000,1.000,'Mavalério',1,'2025-10-04 16:01:17','2025-10-04 16:01:17'),(83,'Choco','kg',10.00,15.000,10.000,'teste',0,'2025-10-04 18:09:35','2025-10-12 00:12:54'),(84,'teste','kg',10.00,50.000,20.000,'Testando',0,'2025-10-04 19:17:22','2025-10-12 00:22:42'),(85,'teste 2','kg',10.00,25.000,20.000,'',0,'2025-10-04 19:47:16','2025-10-12 00:22:49'),(86,'teste 3','kg',12.00,10.000,5.000,'tet',0,'2025-10-12 00:22:03','2025-10-12 00:22:51'),(87,'Chantilly em Pó','kg',0.00,5.000,1.000,NULL,1,'2025-11-16 13:27:52','2025-11-16 13:27:52'),(88,'Granulado Colorido','kg',0.00,3.000,0.500,NULL,0,'2025-11-16 13:27:52','2025-11-16 13:39:48'),(89,'Paçoca Triturada','kg',0.00,2.000,0.300,NULL,0,'2025-11-16 13:27:52','2025-11-16 13:40:19'),(90,'Morango Fresco','kg',0.00,10.000,2.000,NULL,1,'2025-11-16 13:27:52','2025-11-16 13:27:52');
/*!40000 ALTER TABLE `ingrediente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `idlogin` int NOT NULL,
  `email` varchar(45) NOT NULL,
  `senha` varchar(10) NOT NULL,
  PRIMARY KEY (`idlogin`),
  UNIQUE KEY `idlogin_UNIQUE` (`idlogin`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensagens_whatsapp`
--

DROP TABLE IF EXISTS `mensagens_whatsapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensagens_whatsapp` (
  `idmensagem` int NOT NULL AUTO_INCREMENT,
  `telefone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Número de telefone do cliente',
  `mensagem` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Conteúdo da mensagem enviada/recebida',
  `tipo` enum('confirmacao','status','confirmacao_reenvio','manual','recebida','consulta_status') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tipo da mensagem',
  `idreserva_fk` int DEFAULT NULL COMMENT 'ID do pedido relacionado (opcional)',
  `data_envio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('enviado','entregue','lido','erro') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Status da entrega da mensagem',
  `data_status` datetime DEFAULT NULL,
  `direcao` enum('entrada','saida') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Direção da mensagem: entrada (cliente->sistema) ou saida (sistema->cliente)',
  PRIMARY KEY (`idmensagem`),
  KEY `idx_telefone` (`telefone`),
  KEY `idx_reserva` (`idreserva_fk`),
  KEY `idx_data` (`data_envio`),
  CONSTRAINT `mensagens_whatsapp_ibfk_1` FOREIGN KEY (`idreserva_fk`) REFERENCES `reserva` (`idreserva`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensagens_whatsapp`
--

LOCK TABLES `mensagens_whatsapp` WRITE;
/*!40000 ALTER TABLE `mensagens_whatsapp` DISABLE KEYS */;
INSERT INTO `mensagens_whatsapp` VALUES (1,'5511999999999','✅ Pedido confirmado! Número: #PED20251101001','confirmacao',NULL,'2025-11-01 12:51:58','entregue',NULL,'saida'),(2,'5511999999999','?‍? Seu pedido está sendo preparado!','status',NULL,'2025-11-01 12:51:58','lido',NULL,'saida'),(3,'5511999999999','Qual o status do meu pedido?','recebida',NULL,'2025-11-01 12:51:58','lido',NULL,'entrada'),(4,'5511988888888','✅ Pedido confirmado! Número: #PED20251101002','confirmacao',NULL,'2025-11-01 12:51:58','entregue',NULL,'saida');
/*!40000 ALTER TABLE `mensagens_whatsapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimentacao_estoque`
--

DROP TABLE IF EXISTS `movimentacao_estoque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimentacao_estoque` (
  `idmovimentacao` int NOT NULL AUTO_INCREMENT,
  `idingrediente` int NOT NULL,
  `tipo` varchar(20) NOT NULL COMMENT 'ENTRADA, SAIDA, AJUSTE',
  `quantidade` decimal(10,3) NOT NULL,
  `valor_unitario` decimal(10,2) DEFAULT NULL,
  `motivo` varchar(200) DEFAULT NULL,
  `idreserva` int DEFAULT NULL COMMENT 'Se saída for por venda',
  `data_movimentacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idmovimentacao`),
  KEY `idx_movimentacao_data` (`data_movimentacao`),
  KEY `idx_movimentacao_tipo` (`tipo`),
  KEY `fk_mov_ingrediente` (`idingrediente`),
  KEY `fk_mov_reserva` (`idreserva`),
  CONSTRAINT `fk_mov_ingrediente` FOREIGN KEY (`idingrediente`) REFERENCES `ingrediente` (`idingrediente`),
  CONSTRAINT `fk_mov_reserva` FOREIGN KEY (`idreserva`) REFERENCES `reserva` (`idreserva`),
  CONSTRAINT `movimentacao_estoque_ibfk_1` FOREIGN KEY (`idingrediente`) REFERENCES `ingrediente` (`idingrediente`),
  CONSTRAINT `movimentacao_estoque_ibfk_2` FOREIGN KEY (`idreserva`) REFERENCES `reserva` (`idreserva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimentacao_estoque`
--

LOCK TABLES `movimentacao_estoque` WRITE;
/*!40000 ALTER TABLE `movimentacao_estoque` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimentacao_estoque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opcao_valores`
--

DROP TABLE IF EXISTS `opcao_valores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opcao_valores` (
  `idvalor` int NOT NULL AUTO_INCREMENT,
  `idopcao_fk` int NOT NULL,
  `nome_valor` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `preco_adicional` decimal(10,2) DEFAULT '0.00',
  `disponivel` tinyint(1) DEFAULT '1',
  `ordem_exibicao` int DEFAULT '0',
  PRIMARY KEY (`idvalor`),
  KEY `idx_opcao` (`idopcao_fk`),
  KEY `idx_disponivel` (`disponivel`),
  CONSTRAINT `opcao_valores_ibfk_1` FOREIGN KEY (`idopcao_fk`) REFERENCES `produto_opcoes_personalizacao` (`idopcao`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Valores possíveis para cada opção';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opcao_valores`
--

LOCK TABLES `opcao_valores` WRITE;
/*!40000 ALTER TABLE `opcao_valores` DISABLE KEYS */;
INSERT INTO `opcao_valores` VALUES (1,1,'Brigadeiro',0.00,1,1),(2,1,'Doce de Leite',0.00,1,2),(3,1,'Nutella',5.00,1,3),(4,1,'Frutas Vermelhas',4.00,1,4),(5,1,'Chocolate Branco',3.00,1,5),(6,1,'Creme de Avelã',6.00,1,6),(7,2,'Chocolate ao Leite',0.00,1,1),(8,2,'Chocolate Meio Amargo',2.00,1,2),(9,2,'Ganache',3.00,1,3),(10,2,'Chantilly',2.00,1,4),(11,2,'Glacê',1.50,1,5),(12,3,'Granulado Colorido',1.00,1,1),(13,3,'Confete',1.50,1,2),(14,3,'Chocolate Raspado',2.00,1,3),(15,3,'Frutas Frescas',5.00,1,4),(16,3,'Flores Comestíveis',8.00,1,5),(17,4,'Pequena (100g)',0.00,1,1),(18,4,'Média (200g)',3.00,1,2),(19,4,'Grande (300g)',6.00,1,3),(20,5,'Embalagem Especial',2.50,1,1),(21,5,'Cartão Personalizado',1.50,1,2),(22,5,'Vela de Aniversário',1.00,1,3);
/*!40000 ALTER TABLE `opcao_valores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_personalizacoes`
--

DROP TABLE IF EXISTS `pedido_personalizacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_personalizacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idreserva_fk` int NOT NULL,
  `idproduto_fk` int NOT NULL,
  `personalizacoes` json NOT NULL,
  `valor_acrescimo` decimal(10,2) DEFAULT '0.00',
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reserva` (`idreserva_fk`),
  KEY `idx_produto` (`idproduto_fk`),
  CONSTRAINT `pedido_personalizacoes_ibfk_1` FOREIGN KEY (`idreserva_fk`) REFERENCES `reserva` (`idreserva`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pedido_personalizacoes_ibfk_2` FOREIGN KEY (`idproduto_fk`) REFERENCES `produto` (`idproduto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Personalizações selecionadas em cada pedido';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_personalizacoes`
--

LOCK TABLES `pedido_personalizacoes` WRITE;
/*!40000 ALTER TABLE `pedido_personalizacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido_personalizacoes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_atualizar_valor_com_personalizacao` AFTER INSERT ON `pedido_personalizacoes` FOR EACH ROW BEGIN
                UPDATE tb_reserva
                SET valor_total = valor_total + NEW.valor_acrescimo
                WHERE idreserva = NEW.idreserva_fk;
            END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `personalizacao_ingrediente`
--

DROP TABLE IF EXISTS `personalizacao_ingrediente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personalizacao_ingrediente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idvalor_fk` int NOT NULL,
  `idingrediente_fk` int NOT NULL,
  `quantidade_usada` decimal(10,3) NOT NULL COMMENT 'Quantidade do ingrediente usada nesta personalização',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_valor_ingrediente` (`idvalor_fk`,`idingrediente_fk`),
  KEY `idx_valor` (`idvalor_fk`),
  KEY `idx_ingrediente` (`idingrediente_fk`),
  CONSTRAINT `personalizacao_ingrediente_ibfk_1` FOREIGN KEY (`idvalor_fk`) REFERENCES `opcao_valores` (`idvalor`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `personalizacao_ingrediente_ibfk_2` FOREIGN KEY (`idingrediente_fk`) REFERENCES `ingrediente` (`idingrediente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Vincula valores de personalização aos ingredientes usados';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalizacao_ingrediente`
--

LOCK TABLES `personalizacao_ingrediente` WRITE;
/*!40000 ALTER TABLE `personalizacao_ingrediente` DISABLE KEYS */;
INSERT INTO `personalizacao_ingrediente` VALUES (35,10,61,0.150),(36,10,66,0.050),(39,7,58,0.200),(41,8,59,0.200),(43,9,58,0.150),(44,9,61,0.100),(47,11,66,0.200),(48,11,61,0.050),(52,14,58,0.050),(54,13,66,0.030),(56,16,66,0.020),(59,15,67,0.100),(60,15,69,0.080),(61,12,66,0.040),(65,1,61,0.050),(66,1,58,0.100),(67,5,60,0.150),(68,5,61,0.050),(73,6,58,0.100),(74,6,61,0.080),(77,2,61,0.100),(78,2,66,0.050),(79,4,67,0.100),(80,4,66,0.030),(85,3,58,0.150),(86,3,61,0.050);
/*!40000 ALTER TABLE `personalizacao_ingrediente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personalizacao_ingredientes`
--

DROP TABLE IF EXISTS `personalizacao_ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personalizacao_ingredientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idproduto_fk` int NOT NULL,
  `idingrediente_fk` int NOT NULL,
  `quantidade_padrao` decimal(10,3) DEFAULT '1.000',
  `preco_adicional` decimal(10,2) DEFAULT '0.00',
  `ativo` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `personalizacao_ingrediente_unico` (`idproduto_fk`,`idingrediente_fk`),
  KEY `idx_pers_ing_produto` (`idproduto_fk`),
  KEY `idx_pers_ing_ingrediente` (`idingrediente_fk`),
  CONSTRAINT `personalizacao_ingredientes_ibfk_1` FOREIGN KEY (`idproduto_fk`) REFERENCES `produto` (`idproduto`) ON DELETE CASCADE,
  CONSTRAINT `personalizacao_ingredientes_ibfk_2` FOREIGN KEY (`idingrediente_fk`) REFERENCES `ingrediente` (`idingrediente`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalizacao_ingredientes`
--

LOCK TABLES `personalizacao_ingredientes` WRITE;
/*!40000 ALTER TABLE `personalizacao_ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `personalizacao_ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personalizacao_produto`
--

DROP TABLE IF EXISTS `personalizacao_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personalizacao_produto` (
  `idpersonalizacao` int NOT NULL AUTO_INCREMENT,
  `idproduto_fk` int NOT NULL,
  `tipo_personalizacao` varchar(50) NOT NULL COMMENT 'sabor, cobertura, tamanho, etc',
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `preco_adicional` decimal(10,2) DEFAULT '0.00',
  `ativo` tinyint DEFAULT '1',
  `ordem` int DEFAULT '0',
  PRIMARY KEY (`idpersonalizacao`),
  KEY `idx_personalizacao_produto` (`idproduto_fk`),
  KEY `idx_personalizacao_tipo` (`tipo_personalizacao`),
  KEY `idx_personalizacao_ativo` (`ativo`),
  CONSTRAINT `personalizacao_produto_ibfk_1` FOREIGN KEY (`idproduto_fk`) REFERENCES `produto` (`idproduto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalizacao_produto`
--

LOCK TABLES `personalizacao_produto` WRITE;
/*!40000 ALTER TABLE `personalizacao_produto` DISABLE KEYS */;
/*!40000 ALTER TABLE `personalizacao_produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto`
--

DROP TABLE IF EXISTS `produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto` (
  `idproduto` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(500) NOT NULL,
  `preco` double NOT NULL,
  `quantidade` int NOT NULL,
  `data_criacao` varchar(45) DEFAULT NULL,
  `data_validade` varchar(45) DEFAULT NULL,
  `ativo` tinyint DEFAULT NULL,
  `img_Produto` varchar(800) NOT NULL,
  `idcategoria` int DEFAULT NULL,
  `codigo_produto` varchar(20) DEFAULT NULL,
  `custo_producao` decimal(10,2) DEFAULT '0.00',
  `margem_lucro` decimal(5,2) DEFAULT '40.00',
  `tempo_preparo` int DEFAULT '30' COMMENT 'Tempo em minutos',
  PRIMARY KEY (`idproduto`),
  UNIQUE KEY `codigo_produto` (`codigo_produto`),
  KEY `idx_produto_categoria` (`idcategoria`),
  KEY `idx_produto_ativo` (`ativo`),
  KEY `idx_produto_codigo` (`codigo_produto`),
  CONSTRAINT `fk_produto_categoria` FOREIGN KEY (`idcategoria`) REFERENCES `categoria` (`idcategoria`),
  CONSTRAINT `produto_ibfk_1` FOREIGN KEY (`idcategoria`) REFERENCES `categoria` (`idcategoria`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto`
--

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
INSERT INTO `produto` VALUES (2,'Ovomaltine','Cone banhado a chocolate ao leite, recheado com brigadeiro de ovomaltine. - 120G',12,2,NULL,NULL,1,'1746127074866-623923024.jpg',2,'PROD0002',8.44,40.00,30),(3,'Kinder Bueno','Cone banhado com chocolate ao leite, com brigadeiro de kinder bueno com nutella.-120G',12,1,NULL,NULL,1,'1746127155139-240072892.jpg',2,'PROD0003',10.44,40.00,30),(11,'Ninho e Nutella','Cone banhado ao chocolate ao leite, recheado com brigadeiro de ninho e nutella.-120G',12,3,NULL,NULL,1,'1746127208787-489235267.jpg',2,'PROD0011',10.11,40.00,30),(19,'Oreo','Cone banhado com chocolate ao leite, recheado com brigadeiro de ninho com oreo.-120G',12,1,NULL,NULL,1,'1746127247949-805945939.jpg',2,'PROD0019',5.06,40.00,30),(20,'Mousse de Limão','Cone banhado com chocolate branco,recheado com um mousse de limão suave e cremoso.-120G',12,4,NULL,NULL,1,'1746124712159-857015468.jpg',2,'PROD0020',3.37,40.00,30),(21,'Ferrero Rocher','Cone banhado com chocolate ao leite, recheado com brigadeiro de ferrero e nutella.- 120G',12,3,NULL,NULL,1,'1746124673480-55474114.jpg',2,'PROD0021',6.33,40.00,30),(22,'Kit- Kat','Cone banhado a chocolate branco, recheado com kit kat ao leite e com pedaços de kit kat.- 120g',12,2,NULL,NULL,1,'1746124422099-104275871.jpg',2,'PROD0022',6.47,40.00,30),(24,'Limão com Chocolate','Cone de chocolate meio amargo com creme de limão equilibrado e refrescante.-120G',12,3,NULL,NULL,1,'1746127574457-996357000.jpg',2,'PROD0024',5.62,40.00,30),(25,'Prestígio','Cone de chocolate ao leite com recheio cremoso de coco e cobertura de chocolate.-120G',12,4,NULL,NULL,1,'1746127613389-81754464.jpg',2,'PROD0025',0.00,40.00,30),(36,'fsfsdf','fdgfdgdf',12,0,NULL,NULL,1,'1760240222482-897587491.jpg',2,NULL,0.00,40.00,30);
/*!40000 ALTER TABLE `produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto_imagens`
--

DROP TABLE IF EXISTS `produto_imagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto_imagens` (
  `idimagem` int NOT NULL AUTO_INCREMENT,
  `idproduto_fk` int NOT NULL,
  `caminho_imagem` varchar(255) NOT NULL,
  `is_principal` tinyint(1) DEFAULT '0',
  `ordem` int DEFAULT '0',
  `data_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idimagem`),
  KEY `idx_produto_imagem` (`idproduto_fk`),
  CONSTRAINT `produto_imagens_ibfk_1` FOREIGN KEY (`idproduto_fk`) REFERENCES `produto` (`idproduto`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto_imagens`
--

LOCK TABLES `produto_imagens` WRITE;
/*!40000 ALTER TABLE `produto_imagens` DISABLE KEYS */;
/*!40000 ALTER TABLE `produto_imagens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto_ingrediente`
--

DROP TABLE IF EXISTS `produto_ingrediente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto_ingrediente` (
  `idproduto_ingrediente` int NOT NULL AUTO_INCREMENT,
  `idproduto` int NOT NULL,
  `idingrediente` int NOT NULL,
  `quantidade` decimal(10,3) NOT NULL COMMENT 'Quantidade do ingrediente necessária',
  `unidade_medida` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'kg, g, L, ml, unidade',
  `custo` decimal(10,2) DEFAULT '0.00' COMMENT 'Custo do ingrediente nesta receita',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idproduto_ingrediente`),
  UNIQUE KEY `unique_produto_ingrediente` (`idproduto`,`idingrediente`),
  KEY `idingrediente` (`idingrediente`),
  CONSTRAINT `produto_ingrediente_ibfk_1` FOREIGN KEY (`idproduto`) REFERENCES `produto` (`idproduto`) ON DELETE CASCADE,
  CONSTRAINT `produto_ingrediente_ibfk_2` FOREIGN KEY (`idingrediente`) REFERENCES `ingrediente` (`idingrediente`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto_ingrediente`
--

LOCK TABLES `produto_ingrediente` WRITE;
/*!40000 ALTER TABLE `produto_ingrediente` DISABLE KEYS */;
INSERT INTO `produto_ingrediente` VALUES (11,36,65,1.000,'kg',4.50,'2025-11-16 16:59:44'),(12,36,70,1.000,'kg',65.00,'2025-11-16 16:59:44');
/*!40000 ALTER TABLE `produto_ingrediente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto_opcao_associacao`
--

DROP TABLE IF EXISTS `produto_opcao_associacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto_opcao_associacao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idproduto_fk` int NOT NULL,
  `idopcao_fk` int NOT NULL,
  `obrigatorio` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_produto_opcao` (`idproduto_fk`,`idopcao_fk`),
  KEY `idx_produto` (`idproduto_fk`),
  KEY `idx_opcao` (`idopcao_fk`),
  CONSTRAINT `produto_opcao_associacao_ibfk_1` FOREIGN KEY (`idproduto_fk`) REFERENCES `produto` (`idproduto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `produto_opcao_associacao_ibfk_2` FOREIGN KEY (`idopcao_fk`) REFERENCES `produto_opcoes_personalizacao` (`idopcao`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Associa produtos com opções de personalização';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto_opcao_associacao`
--

LOCK TABLES `produto_opcao_associacao` WRITE;
/*!40000 ALTER TABLE `produto_opcao_associacao` DISABLE KEYS */;
INSERT INTO `produto_opcao_associacao` VALUES (1,2,1,0),(2,21,1,0),(4,21,2,0),(6,21,3,0),(8,21,4,0),(10,21,5,0),(12,36,1,0),(14,36,2,0),(16,36,3,0),(18,36,4,0),(20,36,5,0),(22,3,1,0),(24,3,2,0),(26,3,3,0),(28,3,4,0),(30,3,5,0),(32,22,1,0),(34,22,2,0),(36,22,3,0),(38,22,4,0),(40,22,5,0),(42,24,1,0),(44,24,2,0),(46,24,3,0),(48,24,4,0),(50,24,5,0),(52,20,1,0),(54,20,2,0),(56,20,3,0),(58,20,4,0),(60,20,5,0),(62,11,1,0),(64,11,2,0),(66,11,3,0),(68,11,4,0),(70,11,5,0),(72,19,1,0),(74,19,2,0),(76,19,3,0),(78,19,4,0),(80,19,5,0),(84,2,2,0),(86,2,3,0),(88,2,4,0),(90,2,5,0),(92,25,1,0),(94,25,2,0),(96,25,3,0),(98,25,4,0),(100,25,5,0);
/*!40000 ALTER TABLE `produto_opcao_associacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto_opcoes_personalizacao`
--

DROP TABLE IF EXISTS `produto_opcoes_personalizacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto_opcoes_personalizacao` (
  `idopcao` int NOT NULL AUTO_INCREMENT,
  `nome_opcao` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descricao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `tipo_selecao` enum('radio','checkbox','select') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'radio',
  `obrigatorio` tinyint(1) DEFAULT '0',
  `ativo` tinyint(1) DEFAULT '1',
  `ordem_exibicao` int DEFAULT '0',
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idopcao`),
  KEY `idx_ativo` (`ativo`),
  KEY `idx_ordem` (`ordem_exibicao`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Opções de personalização disponíveis';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto_opcoes_personalizacao`
--

LOCK TABLES `produto_opcoes_personalizacao` WRITE;
/*!40000 ALTER TABLE `produto_opcoes_personalizacao` DISABLE KEYS */;
INSERT INTO `produto_opcoes_personalizacao` VALUES (1,'Recheio','Escolha o recheio do seu bolo ou doce','radio',1,1,1,'2025-10-17 19:28:37','2025-10-17 19:28:37'),(2,'Cobertura','Selecione a cobertura desejada','radio',0,1,2,'2025-10-17 19:28:37','2025-10-17 19:28:37'),(3,'Decoração','Adicione decorações especiais','checkbox',0,1,3,'2025-10-17 19:28:37','2025-10-17 19:28:37'),(4,'Tamanho da Fatia','Escolha o tamanho da fatia','radio',1,1,4,'2025-10-17 19:28:37','2025-10-17 19:28:37'),(5,'Extras','Adicione extras ao seu pedido','checkbox',0,1,5,'2025-10-17 19:28:37','2025-10-17 19:28:37');
/*!40000 ALTER TABLE `produto_opcoes_personalizacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receita`
--

DROP TABLE IF EXISTS `receita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receita` (
  `idreceita` int NOT NULL AUTO_INCREMENT,
  `idproduto` int NOT NULL,
  `idingrediente` int NOT NULL,
  `quantidade` decimal(10,3) NOT NULL COMMENT 'Quantidade do ingrediente por unidade de produto',
  PRIMARY KEY (`idreceita`),
  UNIQUE KEY `receita_unica` (`idproduto`,`idingrediente`),
  KEY `fk_receita_ingrediente` (`idingrediente`),
  CONSTRAINT `fk_receita_ingrediente` FOREIGN KEY (`idingrediente`) REFERENCES `ingrediente` (`idingrediente`) ON DELETE RESTRICT,
  CONSTRAINT `fk_receita_produto` FOREIGN KEY (`idproduto`) REFERENCES `produto` (`idproduto`) ON DELETE CASCADE,
  CONSTRAINT `receita_ibfk_1` FOREIGN KEY (`idproduto`) REFERENCES `produto` (`idproduto`) ON DELETE CASCADE,
  CONSTRAINT `receita_ibfk_2` FOREIGN KEY (`idingrediente`) REFERENCES `ingrediente` (`idingrediente`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receita`
--

LOCK TABLES `receita` WRITE;
/*!40000 ALTER TABLE `receita` DISABLE KEYS */;
INSERT INTO `receita` VALUES (63,2,46,0.060),(64,2,1,0.040),(65,2,5,0.080),(66,2,22,0.020),(67,2,51,1.000),(68,3,2,0.070),(69,3,3,0.040),(70,3,47,0.030),(71,3,1,0.035),(72,3,5,0.080),(73,3,51,1.000),(74,11,22,0.080),(75,11,7,0.040),(76,11,1,0.045),(77,11,5,0.090),(78,11,3,0.030),(79,11,51,1.000),(80,19,48,0.080),(81,19,5,0.100),(82,19,1,0.040),(83,19,56,0.020),(84,19,51,1.000),(85,20,43,0.100),(86,20,1,0.050),(87,20,5,0.080),(88,20,40,0.030),(89,20,54,2.000),(90,20,52,1.000),(91,21,2,0.060),(92,21,4,0.030),(93,21,47,0.040),(94,21,1,0.035),(95,21,5,0.080),(96,21,57,0.010),(97,21,51,1.000),(98,22,49,0.070),(99,22,2,0.050),(100,22,1,0.035),(101,22,5,0.070),(102,22,50,0.030),(103,22,51,1.000),(104,24,43,0.090),(105,24,4,0.060),(106,24,1,0.045),(107,24,5,0.080),(108,24,40,0.025),(109,24,51,1.000),(110,2,4,0.030),(111,2,8,0.040),(112,2,15,1.000),(113,2,16,1.000),(115,3,11,0.035),(116,3,7,0.025),(117,3,15,1.000),(118,3,16,1.000),(120,11,2,0.030),(121,11,6,0.040),(122,11,15,1.000),(123,11,16,1.000);
/*!40000 ALTER TABLE `receita` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_receita_after_insert` AFTER INSERT ON `receita` FOR EACH ROW BEGIN
    CALL sp_calcular_custo_produto(NEW.idproduto);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_receita_after_update` AFTER UPDATE ON `receita` FOR EACH ROW BEGIN
    CALL sp_calcular_custo_produto(NEW.idproduto);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `tr_receita_after_delete` AFTER DELETE ON `receita` FOR EACH ROW BEGIN
    CALL sp_calcular_custo_produto(OLD.idproduto);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `idtoken` int NOT NULL AUTO_INCREMENT,
  `idcliente_fk` int NOT NULL,
  `token` varchar(500) NOT NULL,
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_expiracao` datetime NOT NULL,
  `revogado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`idtoken`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_refresh_token` (`token`),
  KEY `idx_refresh_cliente` (`idcliente_fk`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`idcliente_fk`) REFERENCES `cliente` (`idcliente`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva` (
  `idreserva` int NOT NULL AUTO_INCREMENT,
  `data_pedido` datetime DEFAULT CURRENT_TIMESTAMP,
  `numero_pedido` varchar(20) DEFAULT NULL,
  `data_entrega` varchar(45) DEFAULT NULL,
  `hora_entrega` varchar(45) DEFAULT NULL,
  `ponto_entrega` varchar(45) DEFAULT NULL,
  `valor_total` double DEFAULT NULL,
  `status` enum('Pendente','Confirmado','Preparando','Pronto','Entregue','Cancelado') DEFAULT 'Pendente',
  `pagamento` varchar(45) DEFAULT NULL,
  `produtos` json DEFAULT NULL,
  `qtdReserva` json DEFAULT NULL,
  `idcliente_fk` int DEFAULT NULL,
  `codigo_pedido` varchar(20) DEFAULT NULL,
  `tipo_pedido` varchar(20) DEFAULT 'RETIRADA' COMMENT 'RETIRADA, ENTREGA',
  `endereco_entrega` text,
  `taxa_entrega` decimal(10,2) DEFAULT '0.00',
  `tempo_preparo_estimado` int DEFAULT NULL,
  `observacoes` text,
  `troco_para` decimal(10,2) DEFAULT NULL,
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `historico_status` json DEFAULT NULL,
  `status_pagamento` enum('pendente','confirmado','cancelado') DEFAULT 'pendente',
  `status_pedido` enum('pendente','confirmado','preparando','pronto','entregue','cancelado') DEFAULT 'pendente',
  `canal_venda` enum('web','whatsapp','presencial') DEFAULT 'web',
  `whatsapp_notificado` tinyint(1) DEFAULT '0',
  `data_notificacao` datetime DEFAULT NULL,
  PRIMARY KEY (`idreserva`),
  UNIQUE KEY `codigo_pedido` (`codigo_pedido`),
  UNIQUE KEY `numero_pedido` (`numero_pedido`),
  KEY `idcliente_idx` (`idcliente_fk`),
  KEY `idx_reserva_status` (`status`),
  KEY `idx_reserva_data` (`data_entrega`),
  KEY `idx_reserva_cliente` (`idcliente_fk`),
  KEY `idx_reserva_status_pagamento` (`status_pagamento`),
  KEY `idx_reserva_status_pedido` (`status_pedido`),
  KEY `idx_reserva_codigo` (`codigo_pedido`),
  KEY `idx_reserva_data_pedido` (`data_pedido` DESC),
  KEY `idx_reserva_numero_pedido` (`numero_pedido`),
  KEY `idx_codigo_pedido` (`codigo_pedido`),
  CONSTRAINT `idcliente` FOREIGN KEY (`idcliente_fk`) REFERENCES `cliente` (`idcliente`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (17,'2025-10-11 08:46:59','PED000017','2025-05-12','16:09','P - Alimentação 1',48,'Cancelado','Débito','{\"produtosReservados\": [{\"id\": 22, \"nome\": \"Kit- Kat\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado a chocolate branco, recheado com kit kat ao leite e com pedaços de kit kat - 120g\", \"quantidade\": 5, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746124422099-104275871.jpg\"}, {\"id\": 25, \"nome\": \"Prestígio\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone de chocolate ao leite com recheio cremoso de coco e cobertura de chocolate-120G\", \"quantidade\": 4, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127613389-81754464.jpg\"}]}','[{\"id\": 22, \"quantidade\": 3}, {\"id\": 25, \"quantidade\": 1}]',11,'PED202510040017','RETIRADA',NULL,0.00,NULL,NULL,NULL,'2025-10-04 15:51:52','2025-10-11 09:23:43','[{\"data\": \"2025-10-11 08:46:59\", \"status\": \"Cancelado\", \"observacao\": \"Status inicial: Cancelado\"}]','pendente','pendente','web',0,NULL),(18,'2025-10-11 08:46:59','PED000018','2025-05-14','20:35','P - Alimentação 2',36,'Entregue','Pix','{\"produtosReservados\": [{\"id\": 2, \"nome\": \"Ovomaltine\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado a chocolate ao leite, recheado com brigadeiro de ovomaltine. - 120G\", \"quantidade\": 5, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127074866-623923024.jpg\"}, {\"id\": 3, \"nome\": \"Kinder Bueno\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado com chocolate ao leite, com brigadeiro de kinder bueno com nutella.-120G\", \"quantidade\": 5, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127155139-240072892.jpg\"}]}','[{\"id\": 2, \"quantidade\": 2}, {\"id\": 3, \"quantidade\": 1}]',3,'PED202510040018','RETIRADA',NULL,0.00,NULL,NULL,NULL,'2025-10-04 15:51:52','2025-10-11 12:39:52','[{\"data\": \"2025-10-11 08:46:59\", \"status\": \"Confirmado\", \"observacao\": \"Status inicial: Confirmado\"}, {\"data\": \"2025-10-11 12:39:13.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 12:39:36.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 12:39:52.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(19,'2025-10-11 08:46:59','PED000019','2025-05-20','18:07','P - Alimentação 1',24,'Entregue','Débito','{\"produtosReservados\": [{\"id\": 19, \"nome\": \"Oreo\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado com chocolate ao leite, recheado com brigadeiro de ninho com oreo.-120G\", \"quantidade\": 5, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127247949-805945939.jpg\"}, {\"id\": 20, \"nome\": \"Mousse de Limão\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado com chocolate branco,recheado com um mousse de limão suave e cremoso.-120G\", \"quantidade\": 5, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746124712159-857015468.jpg\"}]}','[{\"id\": 19, \"quantidade\": 1}, {\"id\": 20, \"quantidade\": 1}]',5,'PED202510040019','RETIRADA',NULL,0.00,NULL,NULL,NULL,'2025-10-04 15:51:52','2025-10-11 12:39:55','[{\"data\": \"2025-10-11 08:46:59\", \"status\": \"Confirmado\", \"observacao\": \"Status inicial: Confirmado\"}, {\"data\": \"2025-10-11 12:39:16.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 12:39:38.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 12:39:55.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(20,'2025-10-11 08:46:59','PED000020','2025-05-21','19:08','P - Alimentação 1',36,'Cancelado','Dinheiro','{\"produtosReservados\": [{\"id\": 19, \"nome\": \"Oreo\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado com chocolate ao leite, recheado com brigadeiro de ninho com oreo.-120G\", \"quantidade\": 5, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127247949-805945939.jpg\"}, {\"id\": 20, \"nome\": \"Mousse de Limão\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado com chocolate branco,recheado com um mousse de limão suave e cremoso.-120G\", \"quantidade\": 5, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746124712159-857015468.jpg\"}, {\"id\": 3, \"nome\": \"Kinder Bueno\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado com chocolate ao leite, com brigadeiro de kinder bueno com nutella.-120G\", \"quantidade\": 4, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127155139-240072892.jpg\"}, {\"id\": 2, \"nome\": \"Ovomaltine\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado a chocolate ao leite, recheado com brigadeiro de ovomaltine. - 120G\", \"quantidade\": 3, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127074866-623923024.jpg\"}]}','[{\"id\": 2, \"quantidade\": 1}, {\"id\": 3, \"quantidade\": 1}, {\"id\": 19, \"quantidade\": 1}, {\"id\": 20, \"quantidade\": 2}]',3,'PED202510040020','RETIRADA',NULL,0.00,NULL,NULL,NULL,'2025-10-04 15:51:52','2025-10-11 09:23:43','[{\"data\": \"2025-10-11 08:46:59\", \"status\": \"Cancelado\", \"observacao\": \"Status inicial: Cancelado\"}]','pendente','pendente','web',0,NULL),(21,'2025-10-11 08:46:59','PED000021','2025-05-21','19:15','P - Alimentação 1',24,'Entregue','Débito','{\"produtosReservados\": [{\"id\": 3, \"nome\": \"Kinder Bueno\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado com chocolate ao leite, com brigadeiro de kinder bueno com nutella.-120G\", \"quantidade\": 4, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127155139-240072892.jpg\"}, {\"id\": 19, \"nome\": \"Oreo\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado com chocolate ao leite, recheado com brigadeiro de ninho com oreo.-120G\", \"quantidade\": 4, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127247949-805945939.jpg\"}]}','[{\"id\": 3, \"quantidade\": 1}, {\"id\": 19, \"quantidade\": 1}]',1,'PED202510040021','RETIRADA',NULL,0.00,NULL,NULL,NULL,'2025-10-04 15:51:52','2025-10-11 12:39:57','[{\"data\": \"2025-10-11 08:46:59\", \"status\": \"Confirmado\", \"observacao\": \"Status inicial: Confirmado\"}, {\"data\": \"2025-10-11 12:39:18.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 12:39:41.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 12:39:57.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(22,'2025-10-11 08:46:59','PED000022','2025-05-21','18:18','P - Alimentação 1',24,'Entregue','Vale Alimentação','{\"produtosReservados\": [{\"id\": 3, \"nome\": \"Kinder Bueno\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado com chocolate ao leite, com brigadeiro de kinder bueno com nutella.-120G\", \"quantidade\": 3, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127155139-240072892.jpg\"}, {\"id\": 11, \"nome\": \"Ninho e Nutella\", \"ativo\": null, \"preco\": 12, \"descricao\": \"Cone banhado ao chocolate ao leite, recheado com brigadeiro de ninho e nutella.-120G\", \"quantidade\": 5, \"dataCriacao\": null, \"dataValidade\": null, \"caminhoImagem\": \"1746127208787-489235267.jpg\"}]}','[{\"id\": 3, \"quantidade\": 1}, {\"id\": 11, \"quantidade\": 1}]',5,'PED202510040022','RETIRADA',NULL,0.00,NULL,NULL,NULL,'2025-10-04 15:51:52','2025-10-11 12:39:59','[{\"data\": \"2025-10-11 08:46:59\", \"status\": \"Confirmado\", \"observacao\": \"Status inicial: Confirmado\"}, {\"data\": \"2025-10-11 12:39:20.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 12:39:43.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 12:39:59.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(23,'2025-10-11 08:46:59','PED000023','2025-10-05','22:49:05','Loja Segredos do Sabor',12,'Entregue','Dinheiro','[{\"id\": 22, \"nome\": \"Kit- Kat\", \"valor\": 12}]','[{\"id\": 22, \"quantidade\": 1}]',13,'PED000023','ENTREGA','jkhhkhjk, 789789 - ghfjhgjg, hgjghjgj, hgjgjgjh/jg',0.00,NULL,'teste',NULL,'2025-10-04 22:49:05','2025-11-16 10:27:23','[{\"data\": \"2025-10-11 08:46:59\", \"status\": \"Confirmado\", \"observacao\": \"Status inicial: Confirmado\"}, {\"data\": \"2025-10-11 12:39:23.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 12:39:45.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 12:40:03.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(24,'2025-10-11 08:46:59','PED000024','2025-10-05','23:08:20','Loja Segredos do Sabor',12,'Entregue','PIX','[{\"id\": 24, \"nome\": \"Limão com Chocolate\", \"valor\": 12, \"caminhoImagem\": \"1746127574457-996357000.jpg\"}]','[{\"id\": 24, \"quantidade\": 1}]',14,'PED000024','ENTREGA','hgjgjgh, jgjghjgjhhg - jghjgjhg, jghjhgjg, ghjhgjhgjgj/jg',0.00,NULL,'',NULL,'2025-10-04 23:08:20','2025-11-16 10:27:23','[{\"data\": \"2025-10-11 08:46:59\", \"status\": \"Confirmado\", \"observacao\": \"Status inicial: Confirmado\"}, {\"data\": \"2025-10-11 12:39:25.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 12:39:47.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 12:40:05.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(25,'2025-10-11 08:46:59','PED000025','2025-10-05','00:27:34','Loja Segredos do Sabor',36,'Entregue','PIX','[{\"id\": 22, \"nome\": \"Kit- Kat\", \"valor\": 12, \"caminhoImagem\": \"1746124422099-104275871.jpg\"}, {\"id\": 24, \"nome\": \"Limão com Chocolate\", \"valor\": 12, \"caminhoImagem\": \"1746127574457-996357000.jpg\"}, {\"id\": 3, \"nome\": \"Kinder Bueno\", \"valor\": 12, \"caminhoImagem\": \"1746127155139-240072892.jpg\"}]','[{\"id\": 22, \"quantidade\": 1}, {\"id\": 24, \"quantidade\": 1}, {\"id\": 3, \"quantidade\": 1}]',15,'PED000025','ENTREGA','fgdgdfgd, 45646 - dfgfdhg, fghfh, hgfhh/fg',0.00,NULL,'',NULL,'2025-10-05 00:27:34','2025-11-16 10:27:23','[{\"data\": \"2025-10-11 08:46:59\", \"status\": \"Confirmado\", \"observacao\": \"Status inicial: Confirmado\"}, {\"data\": \"2025-10-11 12:48:57.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 12:49:04.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 12:49:16.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(26,'2025-10-11 09:06:50','PED000026','2025-10-11','09:06:50','Loja Segredos do Sabor',12,'Entregue','Cartão','[{\"id\": 21, \"nome\": \"Ferrero Rocher\", \"valor\": 12, \"caminhoImagem\": \"1746124673480-55474114.jpg\"}]','[{\"id\": 21, \"quantidade\": 1}]',12,'PED000026','ENTREGA','fdgdgdfg, 23132123 - dfgdgdgd, dfgfdgdg, fgdgdg/df',0.00,NULL,'',NULL,'2025-10-11 09:06:50','2025-11-16 10:27:23','[{\"data\": \"2025-10-11 09:06:50\", \"status\": \"Pendente\", \"observacao\": \"Status inicial: Pendente\"}, {\"data\": \"2025-10-11 09:30:48.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 09:30:54.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 09:30:54.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 09:30:54.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 09:30:54.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 09:30:54.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 09:30:54.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 09:30:54.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 12:22:33.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 12:22:44.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 12:25:13.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(27,'2025-10-11 09:38:16',NULL,'2025-10-11','09:38:16','Loja Segredos do Sabor',12,'Entregue','Dinheiro','[{\"id\": 11, \"nome\": \"Ninho e Nutella\", \"valor\": 12, \"caminhoImagem\": \"1746127208787-489235267.jpg\"}]','[{\"id\": 11, \"quantidade\": 1}]',16,'PED000027','ENTREGA','tryryrty, rtyrtyrt - ytryrty, rtyrtytry, yuiyuiy/iy',0.00,NULL,'',NULL,'2025-10-11 09:38:16','2025-11-16 10:27:23','[{\"data\": \"2025-10-11 12:21:14.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 12:21:40.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 12:21:57.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(28,'2025-10-11 20:17:47',NULL,'2025-10-11','20:17:47','Entrega em Domicílio',12,'Entregue','Dinheiro','[{\"id\": 19, \"nome\": \"Oreo\", \"valor\": 12, \"caminhoImagem\": \"1746127247949-805945939.jpg\"}]','[{\"id\": 19, \"quantidade\": 1}]',12,'PED000028','ENTREGA','Rua Campos Borges, 000 - Casa 2, Jardim São Bento Novo, São Paulo/SP',0.00,NULL,'Chamar meu nome na hora da entrega, por favor!',NULL,'2025-10-11 20:17:47','2025-11-16 10:27:23','[{\"data\": \"2025-10-11 20:18:27.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 20:18:48.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 20:18:57.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 20:18:58.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 20:19:13.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 20:19:25.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(29,'2025-10-11 21:43:55',NULL,'2025-10-12','21:43:55','Entrega em Domicílio',12,'Entregue','Dinheiro','[{\"id\": 22, \"nome\": \"Kit- Kat\", \"valor\": 12, \"caminhoImagem\": \"1746124422099-104275871.jpg\"}]','[{\"id\": 22, \"quantidade\": 1}]',17,'PED000029','ENTREGA','Rua Inácio de Almeida Arruda, 282 - barraco de madeira, Vila da Paz, São Paulo/SP',0.00,NULL,'troco pra 200',NULL,'2025-10-11 21:43:55','2025-11-16 10:27:23','[{\"data\": \"2025-10-11 21:47:37.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 21:47:52.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 21:48:34.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 21:49:05.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(30,'2025-10-11 22:17:52',NULL,'2025-10-12','22:17:52','Entrega em Domicílio',12,'Entregue','Dinheiro','[{\"id\": 21, \"nome\": \"Ferrero Rocher\", \"valor\": 12, \"caminhoImagem\": \"1746124673480-55474114.jpg\"}]','[{\"id\": 21, \"quantidade\": 1}]',18,'PED000030','ENTREGA','Rua Gerona, 4535 - gfgfhfhhf, Vila Clara, São Paulo/SP',0.00,NULL,'nh,nm,n',NULL,'2025-10-11 22:17:52','2025-11-16 10:27:23','[{\"data\": \"2025-10-11 22:18:28.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-11 22:18:39.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-11 22:18:52.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-11 22:19:00.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(31,'2025-10-11 22:21:32',NULL,'2025-10-12','22:21:32','Entrega em Domicílio',10,'Entregue','Cartão','[{\"id\": 26, \"nome\": \"teste\", \"valor\": 10, \"caminhoImagem\": \"1759617288433-378178979.jpg\"}]','[{\"id\": 26, \"quantidade\": 1}]',19,'PED000031','ENTREGA','Rua Feirral do Couto, 646 - hfghfhf, Estância Mirim, São Paulo/SP',0.00,NULL,'',NULL,'2025-10-11 22:21:32','2025-11-16 10:27:23','[{\"data\": \"2025-10-12 00:31:54.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-12 00:31:58.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-12 00:32:04.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-12 00:32:09.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(32,'2025-10-17 19:46:53',NULL,'2025-10-17','19:46:53','Entrega em Domicílio',12,'Entregue','Cartão','[{\"id\": 2, \"nome\": \"Ovomaltine\", \"valor\": 12, \"caminhoImagem\": \"1746127074866-623923024.jpg\"}]','[{\"id\": 2, \"quantidade\": 1}]',20,'PED000032','ENTREGA','Rua Campos Borges, 255 - Casa 2, Jardim São Bento Novo, São Paulo/SP',0.00,NULL,'nada',NULL,'2025-10-17 19:46:53','2025-11-16 10:27:23','[{\"data\": \"2025-10-17 19:48:30.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-17 19:48:39.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-17 19:49:00.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-17 19:49:18.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(33,'2025-10-17 21:40:47',NULL,'2025-10-18','21:40:47','Entrega em Domicílio',14.5,'Cancelado','PIX','[{\"id\": 19, \"nome\": \"Oreo\", \"valor\": 12, \"caminhoImagem\": \"1746127247949-805945939.jpg\"}]','[{\"id\": 19, \"quantidade\": 1}]',21,'PED000033','ENTREGA','Rua José Ramon Urtiza, 120 - 7657, Vila Andrade, São Paulo/SP',0.00,NULL,'',NULL,'2025-10-17 21:40:47','2025-11-16 10:27:23',NULL,'pendente','pendente','web',0,NULL),(34,'2025-10-17 21:50:25',NULL,'2025-10-18','21:50:25','Entrega em Domicílio',13,'Entregue','PIX','[{\"id\": 21, \"nome\": \"Ferrero Rocher\", \"valor\": 12, \"caminhoImagem\": \"1746124673480-55474114.jpg\", \"personalizacoes\": [{\"preco\": 1, \"idopcao\": 5, \"idvalor\": 44, \"nome_opcao\": \"Extras\", \"nome_valor\": \"Vela de Aniversário\"}], \"valor_acrescimo\": 1}]','[{\"id\": 21, \"quantidade\": 1}]',21,'PED000034','ENTREGA','Rua José Ramon Urtiza, 34345 - hfghf, Vila Andrade, São Paulo/SP',0.00,NULL,'',NULL,'2025-10-17 21:50:25','2025-11-16 10:27:23','[{\"data\": \"2025-10-17 21:50:49.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-17 21:57:33.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-17 21:57:42.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-17 21:57:47.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(35,'2025-10-17 22:00:09',NULL,'2025-10-18','22:00:09','Entrega em Domicílio',17,'Entregue','PIX','[{\"id\": 21, \"nome\": \"Ferrero Rocher\", \"valor\": 12, \"caminhoImagem\": \"1746124673480-55474114.jpg\", \"personalizacoes\": [{\"preco\": 5, \"idopcao\": 1, \"idvalor\": 3, \"nome_opcao\": \"Recheio\", \"nome_valor\": \"Nutella\"}], \"valor_acrescimo\": 5}]','[{\"id\": 21, \"quantidade\": 1}]',22,'PED000035','ENTREGA','Rua Bela Cintra, 666 - 3232, Consolação, São Paulo/SP',0.00,NULL,'',NULL,'2025-10-17 22:00:09','2025-11-16 10:27:23','[{\"data\": \"2025-10-17 22:00:59.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-17 22:01:38.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-17 22:01:54.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-17 22:02:34.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(36,'2025-10-18 07:26:26',NULL,'2025-10-18','07:26:26','Entrega em Domicílio',17,'Entregue','Cartão','[{\"id\": 21, \"nome\": \"Ferrero Rocher\", \"valor\": 12, \"caminhoImagem\": \"1746124673480-55474114.jpg\", \"personalizacoes\": [{\"preco\": 5, \"idopcao\": 1, \"idvalor\": 3, \"nome_opcao\": \"Recheio\", \"nome_valor\": \"Nutella\"}], \"valor_acrescimo\": 5}]','[{\"id\": 21, \"quantidade\": 1}]',23,'PED000036','ENTREGA','Rua Almansa, 666 - gfhfghfh, Vila Andrade, São Paulo/SP',0.00,NULL,'',NULL,'2025-10-18 07:26:26','2025-11-16 10:27:23','[{\"data\": \"2025-10-18 07:27:19.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-10-18 07:27:44.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-10-18 07:28:12.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-10-18 07:28:47.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(37,'2025-11-11 16:02:53',NULL,'2025-11-11','16:02:53','Entrega em Domicílio',12,'Entregue','PIX','[{\"id\": 19, \"nome\": \"Oreo\", \"valor\": 12, \"caminhoImagem\": \"1746127247949-805945939.jpg\", \"personalizacoes\": [], \"valor_acrescimo\": 0}]','[{\"id\": 19, \"quantidade\": 1}]',24,'PED000037','ENTREGA','Rua Campos Borges, 999 - Casa 1, Jardim São Bento Novo, São Paulo/SP',0.00,NULL,'kljl',NULL,'2025-11-11 16:02:53','2025-11-16 10:27:23','[{\"data\": \"2025-11-11 16:03:25.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-11-11 16:03:44.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-11-11 16:03:56.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-11-11 16:04:07.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(38,'2025-11-16 11:25:07',NULL,'2025-11-16','11:25:07','Entrega em Domicílio',14,'Entregue','PIX','[{\"id\": 21, \"nome\": \"Ferrero Rocher\", \"valor\": 12, \"caminhoImagem\": \"1746124673480-55474114.jpg\", \"personalizacoes\": [{\"preco\": 2, \"idopcao\": 2, \"idvalor\": 10, \"nome_opcao\": \"Cobertura\", \"nome_valor\": \"Chantilly\"}], \"valor_acrescimo\": 2}]','[{\"id\": 21, \"quantidade\": 1}]',25,'PED000038','ENTREGA','Rua Campos Borges, 888 - gfdhgfg, Jardim São Bento Novo, São Paulo/SP',0.00,NULL,'Sem lactose',NULL,'2025-11-16 11:25:07','2025-11-16 11:59:40','[{\"data\": \"2025-11-16 11:25:52.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-11-16 11:26:23.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-11-16 11:26:23.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-11-16 11:26:36.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-11-16 11:26:44.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(40,'2025-11-16 12:31:48',NULL,'2025-11-16','12:31:48','Entrega em Domicílio',17,'Entregue','PIX','[{\"id\": 21, \"nome\": \"Ferrero Rocher\", \"valor\": 12, \"caminhoImagem\": \"1746124673480-55474114.jpg\", \"personalizacoes\": [{\"preco\": 5, \"idopcao\": 1, \"idvalor\": 3, \"nome_opcao\": \"Recheio\", \"nome_valor\": \"Nutella\"}], \"valor_acrescimo\": 5}]','[{\"id\": 21, \"quantidade\": 1}]',26,'PED000039','ENTREGA','Rua Campos Borges, 255 - Casa 2, Jardim São Bento Novo, São Paulo/SP',0.00,NULL,'jkljkl',NULL,'2025-11-16 12:31:48','2025-11-16 12:32:37','[{\"data\": \"2025-11-16 12:32:10.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-11-16 12:32:23.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-11-16 12:32:31.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-11-16 12:32:37.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL),(41,'2025-11-16 14:12:27',NULL,'2025-11-16','14:12:27','Entrega em Domicílio',20,'Entregue','PIX','[{\"id\": 25, \"nome\": \"Prestígio\", \"valor\": 12, \"caminhoImagem\": \"1746127613389-81754464.jpg\", \"personalizacoes\": [{\"preco\": 5, \"idopcao\": 1, \"idvalor\": 3, \"nome_opcao\": \"Recheio\", \"nome_valor\": \"Nutella\"}, {\"preco\": 3, \"idopcao\": 2, \"idvalor\": 9, \"nome_opcao\": \"Cobertura\", \"nome_valor\": \"Ganache\"}], \"valor_acrescimo\": 8}]','[{\"id\": 25, \"quantidade\": 1}]',12,'PED000041','ENTREGA','Rua Campos Borges, 123 - Casa 2, Jardim São Bento Novo, São Paulo/SP',0.00,NULL,'teste',NULL,'2025-11-16 14:12:27','2025-11-16 14:13:20','[{\"data\": \"2025-11-16 14:12:57.000000\", \"status\": \"Confirmado\", \"observacao\": \"Status alterado para Confirmado\"}, {\"data\": \"2025-11-16 14:13:03.000000\", \"status\": \"Preparando\", \"observacao\": \"Status alterado para Preparando\"}, {\"data\": \"2025-11-16 14:13:12.000000\", \"status\": \"Pronto\", \"observacao\": \"Status alterado para Pronto\"}, {\"data\": \"2025-11-16 14:13:20.000000\", \"status\": \"Entregue\", \"observacao\": \"Status alterado para Entregue\"}]','pendente','pendente','web',0,NULL);
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_reserva_insert` BEFORE INSERT ON `reserva` FOR EACH ROW BEGIN
                -- Se codigo_pedido estiver vazio, gera automaticamente
                IF NEW.codigo_pedido IS NULL OR NEW.codigo_pedido = '' THEN
                    -- Gera código baseado no próximo ID
                    SET @next_id = (SELECT IFNULL(MAX(idreserva), 0) + 1 FROM reserva);
                    SET NEW.codigo_pedido = CONCAT('PED', LPAD(@next_id, 6, '0'));
                END IF;
            END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `tb_mensagens_whatsapp`
--

DROP TABLE IF EXISTS `tb_mensagens_whatsapp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_mensagens_whatsapp` (
  `id_mensagem` int NOT NULL AUTO_INCREMENT,
  `id_reserva` int DEFAULT NULL,
  `telefone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_mensagem` enum('enviada','recebida') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `conteudo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_envio` enum('pendente','enviado','entregue','lido','falha') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pendente',
  `tipo_notificacao` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp_message_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `erro_mensagem` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `data_hora_envio` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_hora_entrega` datetime DEFAULT NULL,
  `data_hora_leitura` datetime DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_mensagem`),
  KEY `idx_telefone` (`telefone`),
  KEY `idx_reserva` (`id_reserva`),
  KEY `idx_tipo` (`tipo_mensagem`),
  KEY `idx_status` (`status_envio`),
  KEY `idx_data` (`data_hora_envio`),
  CONSTRAINT `tb_mensagens_whatsapp_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`idreserva`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_mensagens_whatsapp`
--

LOCK TABLES `tb_mensagens_whatsapp` WRITE;
/*!40000 ALTER TABLE `tb_mensagens_whatsapp` DISABLE KEYS */;
INSERT INTO `tb_mensagens_whatsapp` VALUES (1,NULL,'5511999999999','enviada','? Teste de mensagem do sistema','enviado',NULL,'demo_1760750625815',NULL,'2025-10-17 22:23:45',NULL,NULL,'2025-10-18 01:23:45'),(2,NULL,'5511999999999','enviada','? Teste de mensagem do sistema','enviado',NULL,'demo_1760750662094',NULL,'2025-10-17 22:24:22',NULL,NULL,'2025-10-18 01:24:22'),(3,NULL,'5511999999999','enviada','? Teste de mensagem do sistema','enviado',NULL,'demo_1760750707442',NULL,'2025-10-17 22:25:07',NULL,NULL,'2025-10-18 01:25:07'),(4,NULL,'5511967696744','enviada','? *NOVO PEDIDO RECEBIDO!*\n\n? *Pedido:* PED000036\n? *Cliente:* teste persona\n? *Telefone:* 1186788768\n? *Endereço:* Rua Almansa, 666 - gfhfghfh, Vila Andrade, São Paulo/SP\n\n?️ *Itens:*\n• 1x Ferrero Rocher - R$ 12.00\n\n? *Total:* R$ 17.00\n? *Pagamento:* Cartão\n','enviado',NULL,'demo_1760783186158',NULL,'2025-10-18 07:26:26',NULL,NULL,'2025-10-18 10:26:26'),(5,NULL,'5511967696744','enviada','? *NOVO PEDIDO RECEBIDO!*\n\n? *Pedido:* PED000037\n? *Cliente:* Joazinho\n? *Telefone:* 11786786768\n? *Endereço:* Rua Campos Borges, 999 - Casa 1, Jardim São Bento Novo, São Paulo/SP\n\n?️ *Itens:*\n• 1x Oreo - R$ 12.00\n\n? *Total:* R$ 12.00\n? *Pagamento:* PIX\n\n? *Obs:* kljl','enviado',NULL,'demo_1762887773803',NULL,'2025-11-11 16:02:53',NULL,NULL,'2025-11-11 19:02:53'),(6,NULL,'5511967696744','enviada','? *NOVO PEDIDO RECEBIDO!*\n\n? *Pedido:* PED000038\n? *Cliente:* Njhgjkhhk\n? *Telefone:* 116756757\n? *Endereço:* Rua Campos Borges, 888 - gfdhgfg, Jardim São Bento Novo, São Paulo/SP\n\n?️ *Itens:*\n• 1x Ferrero Rocher - R$ 12.00\n\n? *Total:* R$ 14.00\n? *Pagamento:* PIX\n\n? *Obs:* Sem lactose','enviado',NULL,'demo_1763303107280',NULL,'2025-11-16 11:25:07',NULL,NULL,'2025-11-16 14:25:07'),(7,NULL,'5511967696744','enviada','? *NOVO PEDIDO RECEBIDO!*\n\n? *Pedido:* PED000040\n? *Cliente:* Maria Luciana\n? *Telefone:* 11946263047\n? *Endereço:* Rua Campos Borges, 255 - Casa 2, Jardim São Bento Novo, São Paulo/SP\n\n?️ *Itens:*\n• 1x Ferrero Rocher - R$ 12.00\n\n? *Total:* R$ 17.00\n? *Pagamento:* PIX\n\n? *Obs:* jkljkl','enviado',NULL,'demo_1763307108358',NULL,'2025-11-16 12:31:48',NULL,NULL,'2025-11-16 15:31:48'),(8,NULL,'5511967696744','enviada','? *NOVO PEDIDO RECEBIDO!*\n\n? *Pedido:* PED000041\n? *Cliente:* Vitor Melo\n? *Telefone:* 11967696744\n? *Endereço:* Rua Campos Borges, 123 - Casa 2, Jardim São Bento Novo, São Paulo/SP\n\n?️ *Itens:*\n• 1x Prestígio - R$ 12.00\n\n? *Total:* R$ 20.00\n? *Pagamento:* PIX\n\n? *Obs:* teste','enviado',NULL,'demo_1763313147489',NULL,'2025-11-16 14:12:27',NULL,NULL,'2025-11-16 17:12:27');
/*!40000 ALTER TABLE `tb_mensagens_whatsapp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_whatsapp_bot_config`
--

DROP TABLE IF EXISTS `tb_whatsapp_bot_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_whatsapp_bot_config` (
  `id_config` int NOT NULL AUTO_INCREMENT,
  `status_bot` enum('ativo','inativo','manutencao') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'ativo',
  `mensagem_boas_vindas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `mensagem_ausente` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `horario_funcionamento_inicio` time DEFAULT '08:00:00',
  `horario_funcionamento_fim` time DEFAULT '18:00:00',
  `resposta_automatica_ativa` tinyint(1) DEFAULT '1',
  `ultima_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_config`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_whatsapp_bot_config`
--

LOCK TABLES `tb_whatsapp_bot_config` WRITE;
/*!40000 ALTER TABLE `tb_whatsapp_bot_config` DISABLE KEYS */;
INSERT INTO `tb_whatsapp_bot_config` VALUES (1,'ativo','? Olá! Bem-vindo ao *Segredos do Sabor*! ?\n\nComo posso te ajudar hoje?\n\n1️⃣ Fazer um pedido\n2️⃣ Consultar pedido\n3️⃣ Ver cardápio\n4️⃣ Falar com atendente','? No momento estamos fora do horário de atendimento.\n\nNosso horário é de *Segunda a Sexta, das 8h às 18h*.\n\nDeixe sua mensagem que responderemos em breve!','08:00:00','18:00:00',1,'2025-10-18 01:19:46'),(2,'ativo','? Olá! Bem-vindo ao *Segredos do Sabor*! ?\n\nComo posso te ajudar hoje?\n\n1️⃣ Fazer um pedido\n2️⃣ Consultar pedido\n3️⃣ Ver cardápio\n4️⃣ Falar com atendente','? No momento estamos fora do horário de atendimento.\n\nNosso horário é de *Segunda a Sexta, das 8h às 18h*.\n\nDeixe sua mensagem que responderemos em breve!','08:00:00','18:00:00',1,'2025-10-18 01:21:54'),(3,'ativo','? Olá! Bem-vindo ao *Segredos do Sabor*! ?\n\nComo posso te ajudar hoje?\n\n1️⃣ Fazer um pedido\n2️⃣ Consultar pedido\n3️⃣ Ver cardápio\n4️⃣ Falar com atendente','? No momento estamos fora do horário de atendimento.\n\nNosso horário é de *Segunda a Sexta, das 8h às 18h*.\n\nDeixe sua mensagem que responderemos em breve!','08:00:00','18:00:00',1,'2025-10-18 01:22:27');
/*!40000 ALTER TABLE `tb_whatsapp_bot_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_whatsapp_comandos`
--

DROP TABLE IF EXISTS `tb_whatsapp_comandos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_whatsapp_comandos` (
  `id_comando` int NOT NULL AUTO_INCREMENT,
  `palavra_chave` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_resposta` enum('texto','menu','acao') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `resposta_texto` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `acao_controller` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `ordem_exibicao` int DEFAULT '0',
  PRIMARY KEY (`id_comando`),
  KEY `idx_palavra` (`palavra_chave`),
  KEY `idx_ativo` (`ativo`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_whatsapp_comandos`
--

LOCK TABLES `tb_whatsapp_comandos` WRITE;
/*!40000 ALTER TABLE `tb_whatsapp_comandos` DISABLE KEYS */;
INSERT INTO `tb_whatsapp_comandos` VALUES (1,'pedido','texto','? Para fazer um pedido, acesse nosso catálogo online:\n\nhttps://segredodosabor.com.br/catalogo\n\nOu se preferir, me diga o que deseja e eu te ajudo! ?',NULL,1,1),(2,'consultar','acao',NULL,NULL,1,2),(3,'cardapio','texto','? Confira nosso cardápio completo:\n\nhttps://segredodosabor.com.br/catalogo\n\n? Bolos personalizados\n? Doces finos\n? Tortas artesanais\n? Cookies gourmet',NULL,1,3),(4,'horario','texto','⏰ *Horário de Funcionamento:*\n\nSegunda a Sexta: 8h às 18h\nSábado: 8h às 14h\nDomingo: Fechado',NULL,1,4),(5,'endereco','texto','? *Nosso endereço:*\n\nRua dos Doces, 123\nCentro - São Paulo/SP\nCEP: 01234-567\n\nEstamos te esperando! ?',NULL,1,5),(6,'ajuda','menu','? *Comandos disponíveis:*\n\n• *pedido* - Fazer um novo pedido\n• *consultar* - Ver status do seu pedido\n• *cardapio* - Ver nossos produtos\n• *horario* - Horário de funcionamento\n• *endereco* - Como chegar\n• *contato* - Falar com atendente',NULL,1,6),(7,'pedido','texto','? Para fazer um pedido, acesse nosso catálogo online:\n\nhttps://segredodosabor.com.br/catalogo\n\nOu se preferir, me diga o que deseja e eu te ajudo! ?',NULL,1,1),(8,'consultar','acao',NULL,NULL,1,2),(9,'cardapio','texto','? Confira nosso cardápio completo:\n\nhttps://segredodosabor.com.br/catalogo\n\n? Bolos personalizados\n? Doces finos\n? Tortas artesanais\n? Cookies gourmet',NULL,1,3),(10,'horario','texto','⏰ *Horário de Funcionamento:*\n\nSegunda a Sexta: 8h às 18h\nSábado: 8h às 14h\nDomingo: Fechado',NULL,1,4),(11,'endereco','texto','? *Nosso endereço:*\n\nRua dos Doces, 123\nCentro - São Paulo/SP\nCEP: 01234-567\n\nEstamos te esperando! ?',NULL,1,5),(12,'ajuda','menu','? *Comandos disponíveis:*\n\n• *pedido* - Fazer um novo pedido\n• *consultar* - Ver status do seu pedido\n• *cardapio* - Ver nossos produtos\n• *horario* - Horário de funcionamento\n• *endereco* - Como chegar\n• *contato* - Falar com atendente',NULL,1,6),(13,'pedido','texto','? Para fazer um pedido, acesse nosso catálogo online:\n\nhttps://segredodosabor.com.br/catalogo\n\nOu se preferir, me diga o que deseja e eu te ajudo! ?',NULL,1,1),(14,'consultar','acao',NULL,NULL,1,2),(15,'cardapio','texto','? Confira nosso cardápio completo:\n\nhttps://segredodosabor.com.br/catalogo\n\n? Bolos personalizados\n? Doces finos\n? Tortas artesanais\n? Cookies gourmet',NULL,1,3),(16,'horario','texto','⏰ *Horário de Funcionamento:*\n\nSegunda a Sexta: 8h às 18h\nSábado: 8h às 14h\nDomingo: Fechado',NULL,1,4),(17,'endereco','texto','? *Nosso endereço:*\n\nRua dos Doces, 123\nCentro - São Paulo/SP\nCEP: 01234-567\n\nEstamos te esperando! ?',NULL,1,5),(18,'ajuda','menu','? *Comandos disponíveis:*\n\n• *pedido* - Fazer um novo pedido\n• *consultar* - Ver status do seu pedido\n• *cardapio* - Ver nossos produtos\n• *horario* - Horário de funcionamento\n• *endereco* - Como chegar\n• *contato* - Falar com atendente',NULL,1,6);
/*!40000 ALTER TABLE `tb_whatsapp_comandos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_whatsapp_estatisticas`
--

DROP TABLE IF EXISTS `tb_whatsapp_estatisticas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_whatsapp_estatisticas` (
  `id_estatistica` int NOT NULL AUTO_INCREMENT,
  `data_referencia` date NOT NULL,
  `total_mensagens_enviadas` int DEFAULT '0',
  `total_mensagens_recebidas` int DEFAULT '0',
  `total_mensagens_lidas` int DEFAULT '0',
  `total_pedidos_whatsapp` int DEFAULT '0',
  `tempo_medio_resposta_segundos` int DEFAULT '0',
  `taxa_conversao` decimal(5,2) DEFAULT '0.00',
  `ultima_atualizacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_estatistica`),
  UNIQUE KEY `idx_data` (`data_referencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_whatsapp_estatisticas`
--

LOCK TABLES `tb_whatsapp_estatisticas` WRITE;
/*!40000 ALTER TABLE `tb_whatsapp_estatisticas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_whatsapp_estatisticas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_whatsapp_webhooks`
--

DROP TABLE IF EXISTS `tb_whatsapp_webhooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_whatsapp_webhooks` (
  `id_webhook` int NOT NULL AUTO_INCREMENT,
  `evento_tipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `evento_json` json NOT NULL,
  `id_mensagem` int DEFAULT NULL,
  `telefone_origem` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `processado` tinyint(1) DEFAULT '0',
  `data_recebimento` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_processamento` datetime DEFAULT NULL,
  `erro_processamento` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id_webhook`),
  KEY `id_mensagem` (`id_mensagem`),
  KEY `idx_processado` (`processado`),
  KEY `idx_tipo` (`evento_tipo`),
  KEY `idx_telefone` (`telefone_origem`),
  CONSTRAINT `tb_whatsapp_webhooks_ibfk_1` FOREIGN KEY (`id_mensagem`) REFERENCES `tb_mensagens_whatsapp` (`id_mensagem`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_whatsapp_webhooks`
--

LOCK TABLES `tb_whatsapp_webhooks` WRITE;
/*!40000 ALTER TABLE `tb_whatsapp_webhooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_whatsapp_webhooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_assistente_estatisticas`
--

DROP TABLE IF EXISTS `vw_assistente_estatisticas`;
/*!50001 DROP VIEW IF EXISTS `vw_assistente_estatisticas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_assistente_estatisticas` AS SELECT 
 1 AS `data`,
 1 AS `total_interacoes`,
 1 AS `confianca_media`,
 1 AS `feedbacks_positivos`,
 1 AS `feedbacks_negativos`,
 1 AS `sem_feedback`,
 1 AS `tempo_medio_ms`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_categorias_populares`
--

DROP TABLE IF EXISTS `vw_categorias_populares`;
/*!50001 DROP VIEW IF EXISTS `vw_categorias_populares`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_categorias_populares` AS SELECT 
 1 AS `categoria`,
 1 AS `total_consultas`,
 1 AS `confianca_media`,
 1 AS `satisfacao`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_cliente_preferencias`
--

DROP TABLE IF EXISTS `vw_cliente_preferencias`;
/*!50001 DROP VIEW IF EXISTS `vw_cliente_preferencias`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_cliente_preferencias` AS SELECT 
 1 AS `idpreferencia`,
 1 AS `idcliente`,
 1 AS `cliente_nome`,
 1 AS `email`,
 1 AS `telefone`,
 1 AS `produtos_favoritos`,
 1 AS `observacao_padrao`,
 1 AS `forma_pagamento_padrao`,
 1 AS `horario_preferido`,
 1 AS `preferencias_completas`,
 1 AS `ultima_atualizacao`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_clientes_ativos`
--

DROP TABLE IF EXISTS `vw_clientes_ativos`;
/*!50001 DROP VIEW IF EXISTS `vw_clientes_ativos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_clientes_ativos` AS SELECT 
 1 AS `idcliente`,
 1 AS `nome`,
 1 AS `email`,
 1 AS `telefone`,
 1 AS `tipo`,
 1 AS `total_pedidos`,
 1 AS `valor_total_compras`,
 1 AS `ultima_compra`,
 1 AS `data_cadastro`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_custo_produtos`
--

DROP TABLE IF EXISTS `vw_custo_produtos`;
/*!50001 DROP VIEW IF EXISTS `vw_custo_produtos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_custo_produtos` AS SELECT 
 1 AS `idproduto`,
 1 AS `produto`,
 1 AS `preco_venda`,
 1 AS `custo_ingredientes`,
 1 AS `custo_producao`,
 1 AS `lucro_bruto`,
 1 AS `margem_lucro_real`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_estatisticas_whatsapp`
--

DROP TABLE IF EXISTS `vw_estatisticas_whatsapp`;
/*!50001 DROP VIEW IF EXISTS `vw_estatisticas_whatsapp`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_estatisticas_whatsapp` AS SELECT 
 1 AS `data`,
 1 AS `total_mensagens`,
 1 AS `clientes_unicos`,
 1 AS `confirmacoes`,
 1 AS `atualizacoes_status`,
 1 AS `reenvios`,
 1 AS `consultas_status`,
 1 AS `mensagens_recebidas`,
 1 AS `mensagens_enviadas`,
 1 AS `erros`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_faq_populares`
--

DROP TABLE IF EXISTS `vw_faq_populares`;
/*!50001 DROP VIEW IF EXISTS `vw_faq_populares`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_faq_populares` AS SELECT 
 1 AS `idfaq`,
 1 AS `pergunta`,
 1 AS `categoria`,
 1 AS `visualizacoes`,
 1 AS `util`,
 1 AS `nao_util`,
 1 AS `taxa_utilidade`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_ingredientes_estoque_baixo`
--

DROP TABLE IF EXISTS `vw_ingredientes_estoque_baixo`;
/*!50001 DROP VIEW IF EXISTS `vw_ingredientes_estoque_baixo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_ingredientes_estoque_baixo` AS SELECT 
 1 AS `idingrediente`,
 1 AS `nome`,
 1 AS `quantidade_estoque`,
 1 AS `estoque_minimo`,
 1 AS `unidade_medida`,
 1 AS `status`,
 1 AS `quantidade_comprar`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_opcoes_personalizacao_completas`
--

DROP TABLE IF EXISTS `vw_opcoes_personalizacao_completas`;
/*!50001 DROP VIEW IF EXISTS `vw_opcoes_personalizacao_completas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_opcoes_personalizacao_completas` AS SELECT 
 1 AS `idopcao`,
 1 AS `nome_opcao`,
 1 AS `opcao_descricao`,
 1 AS `tipo_selecao`,
 1 AS `obrigatorio`,
 1 AS `opcao_ativa`,
 1 AS `opcao_ordem`,
 1 AS `idvalor`,
 1 AS `nome_valor`,
 1 AS `preco_adicional`,
 1 AS `valor_disponivel`,
 1 AS `valor_ordem`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_produtos_com_opcoes`
--

DROP TABLE IF EXISTS `vw_produtos_com_opcoes`;
/*!50001 DROP VIEW IF EXISTS `vw_produtos_com_opcoes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_produtos_com_opcoes` AS SELECT 
 1 AS `idproduto`,
 1 AS `produto_nome`,
 1 AS `produto_preco`,
 1 AS `idopcao`,
 1 AS `nome_opcao`,
 1 AS `tipo_selecao`,
 1 AS `obrigatorio`,
 1 AS `total_valores`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_produtos_estoque_baixo`
--

DROP TABLE IF EXISTS `vw_produtos_estoque_baixo`;
/*!50001 DROP VIEW IF EXISTS `vw_produtos_estoque_baixo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_produtos_estoque_baixo` AS SELECT 
 1 AS `idproduto`,
 1 AS `nome`,
 1 AS `quantidade_atual`,
 1 AS `status_estoque`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_relatorio_clientes_preferencias`
--

DROP TABLE IF EXISTS `vw_relatorio_clientes_preferencias`;
/*!50001 DROP VIEW IF EXISTS `vw_relatorio_clientes_preferencias`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_relatorio_clientes_preferencias` AS SELECT 
 1 AS `idcliente`,
 1 AS `nome`,
 1 AS `email`,
 1 AS `telefone`,
 1 AS `possui_preferencias`,
 1 AS `data_cadastro_preferencias`,
 1 AS `ultima_atualizacao_preferencias`,
 1 AS `total_produtos_favoritos`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_relatorio_personalizacoes`
--

DROP TABLE IF EXISTS `vw_relatorio_personalizacoes`;
/*!50001 DROP VIEW IF EXISTS `vw_relatorio_personalizacoes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_relatorio_personalizacoes` AS SELECT 
 1 AS `idreserva`,
 1 AS `codigo_pedido`,
 1 AS `data_entrega`,
 1 AS `cliente_nome`,
 1 AS `produto_nome`,
 1 AS `preco_base`,
 1 AS `valor_acrescimo`,
 1 AS `preco_final`,
 1 AS `personalizacoes`,
 1 AS `data_personalizacao`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_vendas_hoje`
--

DROP TABLE IF EXISTS `vw_vendas_hoje`;
/*!50001 DROP VIEW IF EXISTS `vw_vendas_hoje`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_vendas_hoje` AS SELECT 
 1 AS `total_pedidos`,
 1 AS `faturamento_total`,
 1 AS `ticket_medio`,
 1 AS `pedidos_confirmados`,
 1 AS `pedidos_pendentes`,
 1 AS `pedidos_cancelados`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_vendas_mes_atual`
--

DROP TABLE IF EXISTS `vw_vendas_mes_atual`;
/*!50001 DROP VIEW IF EXISTS `vw_vendas_mes_atual`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_vendas_mes_atual` AS SELECT 
 1 AS `data_venda`,
 1 AS `total_pedidos`,
 1 AS `faturamento_dia`,
 1 AS `ticket_medio`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_whatsapp_status`
--

DROP TABLE IF EXISTS `vw_whatsapp_status`;
/*!50001 DROP VIEW IF EXISTS `vw_whatsapp_status`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_whatsapp_status` AS SELECT 
 1 AS `mensagens_hoje`,
 1 AS `falhas_hoje`,
 1 AS `webhooks_pendentes`,
 1 AS `status_bot`,
 1 AS `pedidos_whatsapp_hoje`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'segredodosabor'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `evt_limpar_historico_mensal` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `evt_limpar_historico_mensal` ON SCHEDULE EVERY 1 MONTH STARTS '2025-11-11 15:29:27' ON COMPLETION NOT PRESERVE ENABLE DO CALL limpar_historico_preferencias(365) */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `evt_limpar_tokens_diario` */;;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`localhost`*/ /*!50106 EVENT `evt_limpar_tokens_diario` ON SCHEDULE EVERY 1 DAY STARTS '2025-11-11 15:29:27' ON COMPLETION NOT PRESERVE ENABLE DO CALL limpar_tokens_expirados() */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'segredodosabor'
--
/*!50003 DROP FUNCTION IF EXISTS `gerar_codigo_pedido` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `gerar_codigo_pedido`(id_reserva INT) RETURNS varchar(20) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
                RETURN CONCAT('PED', LPAD(id_reserva, 6, '0'));
            END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `limpar_historico_preferencias` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `limpar_historico_preferencias`(IN dias INT)
BEGIN
    DELETE FROM cliente_preferencias_historico
    WHERE data_alteracao < DATE_SUB(NOW(), INTERVAL dias DAY);
    
    SELECT ROW_COUNT() as registros_removidos;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `limpar_tokens_expirados` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `limpar_tokens_expirados`()
BEGIN
    DELETE FROM refresh_tokens 
    WHERE (data_expiracao < NOW() OR revogado = TRUE)
    AND data_criacao < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    SELECT ROW_COUNT() as tokens_removidos;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_aplicar_preferencias_pedido` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_aplicar_preferencias_pedido`(
    IN p_idcliente INT,
    OUT p_observacao VARCHAR(500),
    OUT p_forma_pagamento VARCHAR(50),
    OUT p_horario TIME
)
BEGIN
    DECLARE v_preferencias JSON;
    
    -- Buscar preferências do cliente
    SELECT preferencias INTO v_preferencias
    FROM cliente_preferencias
    WHERE idcliente_fk = p_idcliente
    AND ativo = TRUE
    LIMIT 1;
    
    -- Extrair valores das preferências
    IF v_preferencias IS NOT NULL THEN
        SET p_observacao = JSON_UNQUOTE(JSON_EXTRACT(v_preferencias, '$.observacao_padrao'));
        SET p_forma_pagamento = JSON_UNQUOTE(JSON_EXTRACT(v_preferencias, '$.forma_pagamento_padrao'));
        SET p_horario = JSON_UNQUOTE(JSON_EXTRACT(v_preferencias, '$.horario_preferido'));
    ELSE
        SET p_observacao = NULL;
        SET p_forma_pagamento = NULL;
        SET p_horario = NULL;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_atualizar_estatisticas_whatsapp` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_atualizar_estatisticas_whatsapp`()
BEGIN
                    INSERT INTO tb_whatsapp_estatisticas (
                        data_referencia,
                        total_mensagens_enviadas,
                        total_mensagens_recebidas,
                        total_mensagens_lidas,
                        total_pedidos_whatsapp,
                        tempo_medio_resposta_segundos
                    )
                    SELECT 
                        CURDATE(),
                        SUM(CASE WHEN tipo_mensagem = 'enviada' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN tipo_mensagem = 'recebida' THEN 1 ELSE 0 END),
                        SUM(CASE WHEN status_envio = 'lido' THEN 1 ELSE 0 END),
                        (SELECT COUNT(*) FROM tb_reserva WHERE DATE(data_reserva) = CURDATE() AND canal_venda = 'whatsapp'),
                        0
                    FROM tb_mensagens_whatsapp
                    WHERE DATE(data_hora_envio) = CURDATE()
                    ON DUPLICATE KEY UPDATE
                        total_mensagens_enviadas = VALUES(total_mensagens_enviadas),
                        total_mensagens_recebidas = VALUES(total_mensagens_recebidas),
                        total_mensagens_lidas = VALUES(total_mensagens_lidas),
                        total_pedidos_whatsapp = VALUES(total_pedidos_whatsapp);
                END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_atualizar_status_mensagem` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_atualizar_status_mensagem`(
                    IN p_whatsapp_message_id VARCHAR(100),
                    IN p_novo_status ENUM('pendente', 'enviado', 'entregue', 'lido', 'falha')
                )
BEGIN
                    UPDATE tb_mensagens_whatsapp
                    SET 
                        status_envio = p_novo_status,
                        data_hora_entrega = CASE WHEN p_novo_status = 'entregue' THEN NOW() ELSE data_hora_entrega END,
                        data_hora_leitura = CASE WHEN p_novo_status = 'lido' THEN NOW() ELSE data_hora_leitura END
                    WHERE whatsapp_message_id = p_whatsapp_message_id;
                    
                    SELECT ROW_COUNT() as linhas_afetadas;
                END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_baixar_estoque_venda` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_baixar_estoque_venda`(IN p_idreserva INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_idproduto INT;
    DECLARE v_quantidade INT;
    DECLARE cur CURSOR FOR 
        SELECT id, quantidade FROM JSON_TABLE(
            (SELECT qtdReserva FROM reserva WHERE idreserva = p_idreserva),
            '$[*]' COLUMNS (
                id INT PATH '$.id',
                quantidade INT PATH '$.quantidade'
            )
        ) AS jt;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_idproduto, v_quantidade;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Registrar movimentação de estoque
        INSERT INTO movimentacao_estoque (idingrediente, tipo, quantidade, idreserva, motivo)
        SELECT 
            r.idingrediente,
            'SAIDA',
            r.quantidade * v_quantidade,
            p_idreserva,
            CONCAT('Venda - Pedido ', p_idreserva)
        FROM receita r
        WHERE r.idproduto = v_idproduto;
        
        -- Atualizar estoque de ingredientes
        UPDATE ingrediente i
        INNER JOIN receita r ON i.idingrediente = r.idingrediente
        SET i.quantidade_estoque = i.quantidade_estoque - (r.quantidade * v_quantidade)
        WHERE r.idproduto = v_idproduto;
        
    END LOOP;
    
    CLOSE cur;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_buscar_historico_mensagens` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_buscar_historico_mensagens`(
                    IN p_telefone VARCHAR(20),
                    IN p_limite INT
                )
BEGIN
                    SELECT 
                        m.id_mensagem,
                        m.id_reserva,
                        m.telefone,
                        m.tipo_mensagem,
                        m.conteudo,
                        m.status_envio,
                        m.tipo_notificacao,
                        m.data_hora_envio,
                        m.data_hora_leitura,
                        r.numero_pedido
                    FROM tb_mensagens_whatsapp m
                    LEFT JOIN reserva r ON m.id_reserva = r.idreserva
                    WHERE m.telefone COLLATE utf8mb4_unicode_ci = p_telefone COLLATE utf8mb4_unicode_ci
                    ORDER BY m.data_hora_envio DESC
                    LIMIT p_limite;
                END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_buscar_opcoes_produto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_buscar_opcoes_produto`(
                IN p_idproduto INT
            )
BEGIN
                SELECT
                    poa.idopcao_fk AS idopcao,
                    pop.nome_opcao AS nome,
                    pop.descricao,
                    pop.tipo_selecao AS tipo,
                    poa.obrigatorio,
                    CASE
                        WHEN pop.tipo_selecao = 'checkbox' THEN 1
                        ELSE 0
                    END AS multipla_selecao,
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'idvalor', ov.idvalor,
                                'nome', ov.nome_valor,
                                'preco', ov.preco_adicional,
                                'ordem', ov.ordem_exibicao
                            )
                        )
                        FROM opcao_valores ov
                        WHERE ov.idopcao_fk = poa.idopcao_fk
                          AND ov.disponivel = 1
                        ORDER BY ov.ordem_exibicao, ov.nome_valor
                    ) AS valores
                FROM produto_opcao_associacao poa
                INNER JOIN produto_opcoes_personalizacao pop ON poa.idopcao_fk = pop.idopcao
                WHERE poa.idproduto_fk = p_idproduto
                  AND pop.ativo = 1
                ORDER BY pop.ordem_exibicao, pop.nome_opcao;
            END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_buscar_preferencias_cliente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_buscar_preferencias_cliente`(
    IN p_idcliente INT
)
BEGIN
    SELECT 
        preferencias,
        data_atualizacao
    FROM cliente_preferencias
    WHERE idcliente_fk = p_idcliente
    AND ativo = TRUE
    LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_buscar_produtos_favoritos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_buscar_produtos_favoritos`(
    IN p_idcliente INT
)
BEGIN
    SELECT 
        p.idproduto,
        p.nome,
        p.preco,
        p.img_Produto,
        c.nome AS categoria
    FROM cliente_preferencias cp
    CROSS JOIN JSON_TABLE(
        cp.preferencias,
        '$.produtos_favoritos[*]' COLUMNS (idproduto INT PATH '$')
    ) AS jt
    INNER JOIN produto p ON p.idproduto = jt.idproduto
    LEFT JOIN categoria c ON p.idcategoria = c.idcategoria
    WHERE cp.idcliente_fk = p_idcliente
    AND cp.ativo = TRUE
    AND p.ativo = TRUE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_calcular_acrescimo_personalizacao` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_calcular_acrescimo_personalizacao`(
                IN p_personalizacoes JSON,
                OUT p_valor_acrescimo DECIMAL(10,2)
            )
BEGIN
                DECLARE v_total DECIMAL(10,2) DEFAULT 0.00;
                DECLARE v_num_opcoes INT;
                DECLARE v_idx INT DEFAULT 0;
                DECLARE v_idvalor INT;
                DECLARE v_preco DECIMAL(10,2);
                
                SET v_num_opcoes = JSON_LENGTH(p_personalizacoes);
                
                WHILE v_idx < v_num_opcoes DO
                    SET v_idvalor = JSON_UNQUOTE(JSON_EXTRACT(p_personalizacoes, CONCAT('$[', v_idx, '].idvalor')));
                    
                    SELECT preco_adicional INTO v_preco
                    FROM opcao_valores
                    WHERE idvalor = v_idvalor;
                    
                    SET v_total = v_total + COALESCE(v_preco, 0.00);
                    SET v_idx = v_idx + 1;
                END WHILE;
                
                SET p_valor_acrescimo = v_total;
            END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_calcular_custo_produto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_calcular_custo_produto`(IN p_idproduto INT)
BEGIN
    DECLARE v_custo DECIMAL(10,2);
    
    SELECT IFNULL(SUM(r.quantidade * i.preco_unitario), 0)
    INTO v_custo
    FROM receita r
    INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
    WHERE r.idproduto = p_idproduto;
    
    UPDATE produto 
    SET custo_producao = v_custo
    WHERE idproduto = p_idproduto;
    
    SELECT v_custo AS custo_calculado;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_gerar_codigo_pedido` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_gerar_codigo_pedido`()
BEGIN
    DECLARE v_codigo VARCHAR(20);
    DECLARE v_existe INT;
    
    REPEAT
        SET v_codigo = CONCAT(
            'PED',
            DATE_FORMAT(NOW(), '%Y%m%d'),
            LPAD(FLOOR(RAND() * 10000), 4, '0')
        );
        
        SELECT COUNT(*) INTO v_existe
        FROM reserva
        WHERE codigo_pedido = v_codigo;
        
    UNTIL v_existe = 0 END REPEAT;
    
    SELECT v_codigo AS codigo_pedido;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_limpar_interacoes_antigas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_limpar_interacoes_antigas`(IN dias_reter INT)
BEGIN
                DELETE FROM assistente_interacoes
                WHERE data_interacao < DATE_SUB(NOW(), INTERVAL dias_reter DAY);
                
                SELECT ROW_COUNT() as registros_removidos;
            END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obter_sugestoes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obter_sugestoes`(IN id_cliente INT)
BEGIN
                SELECT DISTINCT
                    categoria,
                    COUNT(*) as vezes_consultada
                FROM assistente_interacoes ai
                JOIN assistente_sessoes ases ON ai.ip_usuario = ases.identificador_sessao
                WHERE ases.idcliente = id_cliente
                AND ai.data_interacao >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY categoria
                ORDER BY vezes_consultada DESC
                LIMIT 5;
            END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_recalcular_todos_custos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_recalcular_todos_custos`()
BEGIN
    UPDATE produto p
    LEFT JOIN (
        SELECT 
            r.idproduto,
            SUM(r.quantidade * i.preco_unitario) AS custo_total
        FROM receita r
        INNER JOIN ingrediente i ON r.idingrediente = i.idingrediente
        GROUP BY r.idproduto
    ) custos ON p.idproduto = custos.idproduto
    SET p.custo_producao = IFNULL(custos.custo_total, 0);
    
    SELECT COUNT(*) AS produtos_atualizados FROM produto;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrar_mensagem_enviada` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_mensagem_enviada`(
                    IN p_id_reserva INT,
                    IN p_telefone VARCHAR(20),
                    IN p_conteudo TEXT,
                    IN p_tipo_notificacao VARCHAR(50),
                    IN p_whatsapp_message_id VARCHAR(100)
                )
BEGIN
                    INSERT INTO tb_mensagens_whatsapp (
                        id_reserva,
                        telefone,
                        tipo_mensagem,
                        conteudo,
                        status_envio,
                        tipo_notificacao,
                        whatsapp_message_id
                    ) VALUES (
                        p_id_reserva,
                        p_telefone,
                        'enviada',
                        p_conteudo,
                        'enviado',
                        p_tipo_notificacao,
                        p_whatsapp_message_id
                    );
                    
                    SELECT LAST_INSERT_ID() as id_mensagem;
                END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_registrar_mensagem_recebida` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_mensagem_recebida`(
                    IN p_telefone VARCHAR(20),
                    IN p_conteudo TEXT,
                    IN p_whatsapp_message_id VARCHAR(100)
                )
BEGIN
                    DECLARE v_id_mensagem INT;
                    
                    INSERT INTO tb_mensagens_whatsapp (
                        telefone,
                        tipo_mensagem,
                        conteudo,
                        status_envio,
                        whatsapp_message_id
                    ) VALUES (
                        p_telefone,
                        'recebida',
                        p_conteudo,
                        'entregue',
                        p_whatsapp_message_id
                    );
                    
                    SET v_id_mensagem = LAST_INSERT_ID();
                    
                    SELECT 
                        id_mensagem,
                        telefone,
                        conteudo,
                        data_hora_envio
                    FROM tb_mensagens_whatsapp
                    WHERE id_mensagem = v_id_mensagem;
                END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_salvar_personalizacao_pedido` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_salvar_personalizacao_pedido`(
                IN p_idreserva INT,
                IN p_idproduto INT,
                IN p_personalizacoes JSON
            )
BEGIN
                DECLARE v_acrescimo DECIMAL(10,2) DEFAULT 0.00;
                
                CALL sp_calcular_acrescimo_personalizacao(p_personalizacoes, v_acrescimo);
                
                INSERT INTO pedido_personalizacoes (
                    idreserva_fk,
                    idproduto_fk,
                    personalizacoes_json,
                    valor_acrescimo
                ) VALUES (
                    p_idreserva,
                    p_idproduto,
                    p_personalizacoes,
                    v_acrescimo
                );
            END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_salvar_preferencias_cliente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_salvar_preferencias_cliente`(
    IN p_idcliente INT,
    IN p_preferencias JSON
)
BEGIN
    -- Verificar se já existe preferência para este cliente
    DECLARE v_existe INT;
    
    SELECT COUNT(*) INTO v_existe
    FROM cliente_preferencias
    WHERE idcliente_fk = p_idcliente
    AND ativo = TRUE;
    
    IF v_existe > 0 THEN
        -- Atualizar preferências existentes
        UPDATE cliente_preferencias
        SET preferencias = p_preferencias,
            data_atualizacao = CURRENT_TIMESTAMP
        WHERE idcliente_fk = p_idcliente
        AND ativo = TRUE;
        
        SELECT 'Preferências atualizadas com sucesso' AS mensagem;
    ELSE
        -- Inserir novas preferências
        INSERT INTO cliente_preferencias (idcliente_fk, preferencias)
        VALUES (p_idcliente, p_preferencias);
        
        SELECT 'Preferências criadas com sucesso' AS mensagem;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `vw_assistente_estatisticas`
--

/*!50001 DROP VIEW IF EXISTS `vw_assistente_estatisticas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_assistente_estatisticas` AS select cast(`assistente_interacoes`.`data_interacao` as date) AS `data`,count(0) AS `total_interacoes`,avg(`assistente_interacoes`.`confianca`) AS `confianca_media`,sum((case when (`assistente_interacoes`.`feedback` = 'positivo') then 1 else 0 end)) AS `feedbacks_positivos`,sum((case when (`assistente_interacoes`.`feedback` = 'negativo') then 1 else 0 end)) AS `feedbacks_negativos`,sum((case when (`assistente_interacoes`.`feedback` = 'neutro') then 1 else 0 end)) AS `sem_feedback`,avg(`assistente_interacoes`.`tempo_resposta_ms`) AS `tempo_medio_ms` from `assistente_interacoes` group by cast(`assistente_interacoes`.`data_interacao` as date) order by `data` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_categorias_populares`
--

/*!50001 DROP VIEW IF EXISTS `vw_categorias_populares`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_categorias_populares` AS select `assistente_interacoes`.`categoria` AS `categoria`,count(0) AS `total_consultas`,avg(`assistente_interacoes`.`confianca`) AS `confianca_media`,sum((case when (`assistente_interacoes`.`feedback` = 'positivo') then 1 else 0 end)) AS `satisfacao` from `assistente_interacoes` where (`assistente_interacoes`.`categoria` is not null) group by `assistente_interacoes`.`categoria` order by `total_consultas` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_cliente_preferencias`
--

/*!50001 DROP VIEW IF EXISTS `vw_cliente_preferencias`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_cliente_preferencias` AS select `cp`.`idpreferencia` AS `idpreferencia`,`c`.`idcliente` AS `idcliente`,`c`.`nome` AS `cliente_nome`,`c`.`email` AS `email`,`c`.`telefone` AS `telefone`,json_extract(`cp`.`preferencias`,'$.produtos_favoritos') AS `produtos_favoritos`,json_unquote(json_extract(`cp`.`preferencias`,'$.observacao_padrao')) AS `observacao_padrao`,json_unquote(json_extract(`cp`.`preferencias`,'$.forma_pagamento_padrao')) AS `forma_pagamento_padrao`,json_unquote(json_extract(`cp`.`preferencias`,'$.horario_preferido')) AS `horario_preferido`,`cp`.`preferencias` AS `preferencias_completas`,`cp`.`data_atualizacao` AS `ultima_atualizacao` from (`cliente_preferencias` `cp` join `cliente` `c` on((`cp`.`idcliente_fk` = `c`.`idcliente`))) where (`cp`.`ativo` = true) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_clientes_ativos`
--

/*!50001 DROP VIEW IF EXISTS `vw_clientes_ativos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_clientes_ativos` AS select `c`.`idcliente` AS `idcliente`,`c`.`nome` AS `nome`,`c`.`email` AS `email`,`c`.`telefone` AS `telefone`,`c`.`tipo` AS `tipo`,count(`r`.`idreserva`) AS `total_pedidos`,sum(`r`.`valor_total`) AS `valor_total_compras`,max(`r`.`data_entrega`) AS `ultima_compra`,`c`.`data_cadastro` AS `data_cadastro` from (`cliente` `c` left join `reserva` `r` on((`c`.`idcliente` = `r`.`idcliente_fk`))) where ((`r`.`status_pedido` <> 'cancelado') or (`r`.`status_pedido` is null)) group by `c`.`idcliente` order by `total_pedidos` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_custo_produtos`
--

/*!50001 DROP VIEW IF EXISTS `vw_custo_produtos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_custo_produtos` AS select `p`.`idproduto` AS `idproduto`,`p`.`nome` AS `produto`,`p`.`preco` AS `preco_venda`,ifnull(sum((`r`.`quantidade` * `i`.`preco_unitario`)),0) AS `custo_ingredientes`,`p`.`custo_producao` AS `custo_producao`,(`p`.`preco` - ifnull(sum((`r`.`quantidade` * `i`.`preco_unitario`)),0)) AS `lucro_bruto`,(case when (`p`.`preco` > 0) then (((`p`.`preco` - ifnull(sum((`r`.`quantidade` * `i`.`preco_unitario`)),0)) / `p`.`preco`) * 100) else 0 end) AS `margem_lucro_real` from ((`produto` `p` left join `receita` `r` on((`p`.`idproduto` = `r`.`idproduto`))) left join `ingrediente` `i` on((`r`.`idingrediente` = `i`.`idingrediente`))) group by `p`.`idproduto`,`p`.`nome`,`p`.`preco`,`p`.`custo_producao` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_estatisticas_whatsapp`
--

/*!50001 DROP VIEW IF EXISTS `vw_estatisticas_whatsapp`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_estatisticas_whatsapp` AS select cast(`mensagens_whatsapp`.`data_envio` as date) AS `data`,count(0) AS `total_mensagens`,count(distinct `mensagens_whatsapp`.`telefone`) AS `clientes_unicos`,sum((case when (`mensagens_whatsapp`.`tipo` = 'confirmacao') then 1 else 0 end)) AS `confirmacoes`,sum((case when (`mensagens_whatsapp`.`tipo` = 'status') then 1 else 0 end)) AS `atualizacoes_status`,sum((case when (`mensagens_whatsapp`.`tipo` = 'confirmacao_reenvio') then 1 else 0 end)) AS `reenvios`,sum((case when (`mensagens_whatsapp`.`tipo` = 'consulta_status') then 1 else 0 end)) AS `consultas_status`,sum((case when (`mensagens_whatsapp`.`direcao` = 'entrada') then 1 else 0 end)) AS `mensagens_recebidas`,sum((case when (`mensagens_whatsapp`.`direcao` = 'saida') then 1 else 0 end)) AS `mensagens_enviadas`,sum((case when (`mensagens_whatsapp`.`status` = 'erro') then 1 else 0 end)) AS `erros` from `mensagens_whatsapp` group by cast(`mensagens_whatsapp`.`data_envio` as date) order by `data` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_faq_populares`
--

/*!50001 DROP VIEW IF EXISTS `vw_faq_populares`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_faq_populares` AS select `assistente_faq`.`idfaq` AS `idfaq`,`assistente_faq`.`pergunta` AS `pergunta`,`assistente_faq`.`categoria` AS `categoria`,`assistente_faq`.`visualizacoes` AS `visualizacoes`,`assistente_faq`.`util` AS `util`,`assistente_faq`.`nao_util` AS `nao_util`,round(((`assistente_faq`.`util` / nullif((`assistente_faq`.`util` + `assistente_faq`.`nao_util`),0)) * 100),1) AS `taxa_utilidade` from `assistente_faq` where (`assistente_faq`.`ativo` = true) order by `assistente_faq`.`visualizacoes` desc,`assistente_faq`.`util` desc limit 10 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_ingredientes_estoque_baixo`
--

/*!50001 DROP VIEW IF EXISTS `vw_ingredientes_estoque_baixo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_ingredientes_estoque_baixo` AS select `i`.`idingrediente` AS `idingrediente`,`i`.`nome` AS `nome`,`i`.`quantidade_estoque` AS `quantidade_estoque`,`i`.`estoque_minimo` AS `estoque_minimo`,`i`.`unidade_medida` AS `unidade_medida`,(case when (`i`.`quantidade_estoque` = 0) then 'SEM ESTOQUE' when (`i`.`quantidade_estoque` <= `i`.`estoque_minimo`) then 'COMPRAR URGENTE' when (`i`.`quantidade_estoque` <= (`i`.`estoque_minimo` * 1.5)) then 'COMPRAR EM BREVE' else 'ESTOQUE OK' end) AS `status`,greatest(0,((`i`.`estoque_minimo` * 2) - `i`.`quantidade_estoque`)) AS `quantidade_comprar` from `ingrediente` `i` where ((`i`.`quantidade_estoque` <= (`i`.`estoque_minimo` * 1.5)) and (`i`.`ativo` = 1)) order by `i`.`quantidade_estoque` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_opcoes_personalizacao_completas`
--

/*!50001 DROP VIEW IF EXISTS `vw_opcoes_personalizacao_completas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_opcoes_personalizacao_completas` AS select `o`.`idopcao` AS `idopcao`,`o`.`nome_opcao` AS `nome_opcao`,`o`.`descricao` AS `opcao_descricao`,`o`.`tipo_selecao` AS `tipo_selecao`,`o`.`obrigatorio` AS `obrigatorio`,`o`.`ativo` AS `opcao_ativa`,`o`.`ordem_exibicao` AS `opcao_ordem`,`v`.`idvalor` AS `idvalor`,`v`.`nome_valor` AS `nome_valor`,`v`.`preco_adicional` AS `preco_adicional`,`v`.`disponivel` AS `valor_disponivel`,`v`.`ordem_exibicao` AS `valor_ordem` from (`produto_opcoes_personalizacao` `o` left join `opcao_valores` `v` on((`o`.`idopcao` = `v`.`idopcao_fk`))) where (`o`.`ativo` = true) order by `o`.`ordem_exibicao`,`v`.`ordem_exibicao` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_produtos_com_opcoes`
--

/*!50001 DROP VIEW IF EXISTS `vw_produtos_com_opcoes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_produtos_com_opcoes` AS select `p`.`idproduto` AS `idproduto`,`p`.`nome` AS `produto_nome`,`p`.`preco` AS `produto_preco`,`o`.`idopcao` AS `idopcao`,`o`.`nome_opcao` AS `nome_opcao`,`o`.`tipo_selecao` AS `tipo_selecao`,`a`.`obrigatorio` AS `obrigatorio`,count(`v`.`idvalor`) AS `total_valores` from (((`produto` `p` join `produto_opcao_associacao` `a` on((`p`.`idproduto` = `a`.`idproduto_fk`))) join `produto_opcoes_personalizacao` `o` on((`a`.`idopcao_fk` = `o`.`idopcao`))) left join `opcao_valores` `v` on(((`o`.`idopcao` = `v`.`idopcao_fk`) and (`v`.`disponivel` = true)))) where ((`p`.`ativo` = true) and (`o`.`ativo` = true)) group by `p`.`idproduto`,`p`.`nome`,`p`.`preco`,`o`.`idopcao`,`o`.`nome_opcao`,`o`.`tipo_selecao`,`a`.`obrigatorio` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_produtos_estoque_baixo`
--

/*!50001 DROP VIEW IF EXISTS `vw_produtos_estoque_baixo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_produtos_estoque_baixo` AS select `p`.`idproduto` AS `idproduto`,`p`.`nome` AS `nome`,`p`.`quantidade` AS `quantidade_atual`,(case when (`p`.`quantidade` = 0) then 'SEM ESTOQUE' when (`p`.`quantidade` <= 5) then 'ESTOQUE CRÍTICO' when (`p`.`quantidade` <= 10) then 'ESTOQUE BAIXO' else 'ESTOQUE OK' end) AS `status_estoque` from `produto` `p` where (`p`.`quantidade` <= 10) order by `p`.`quantidade` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_relatorio_clientes_preferencias`
--

/*!50001 DROP VIEW IF EXISTS `vw_relatorio_clientes_preferencias`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_relatorio_clientes_preferencias` AS select `c`.`idcliente` AS `idcliente`,`c`.`nome` AS `nome`,`c`.`email` AS `email`,`c`.`telefone` AS `telefone`,(case when (`cp`.`idpreferencia` is not null) then 'Sim' else 'Não' end) AS `possui_preferencias`,`cp`.`data_criacao` AS `data_cadastro_preferencias`,`cp`.`data_atualizacao` AS `ultima_atualizacao_preferencias`,json_length(json_extract(`cp`.`preferencias`,'$.produtos_favoritos')) AS `total_produtos_favoritos` from (`cliente` `c` left join `cliente_preferencias` `cp` on(((`c`.`idcliente` = `cp`.`idcliente_fk`) and (`cp`.`ativo` = true)))) order by `cp`.`data_atualizacao` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_relatorio_personalizacoes`
--

/*!50001 DROP VIEW IF EXISTS `vw_relatorio_personalizacoes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_relatorio_personalizacoes` AS select `r`.`idreserva` AS `idreserva`,`r`.`codigo_pedido` AS `codigo_pedido`,`r`.`data_entrega` AS `data_entrega`,`c`.`nome` AS `cliente_nome`,`p`.`nome` AS `produto_nome`,`p`.`preco` AS `preco_base`,`pp`.`valor_acrescimo` AS `valor_acrescimo`,(`p`.`preco` + `pp`.`valor_acrescimo`) AS `preco_final`,`pp`.`personalizacoes` AS `personalizacoes`,`pp`.`data_criacao` AS `data_personalizacao` from (((`pedido_personalizacoes` `pp` join `reserva` `r` on((`pp`.`idreserva_fk` = `r`.`idreserva`))) join `cliente` `c` on((`r`.`idcliente_fk` = `c`.`idcliente`))) join `produto` `p` on((`pp`.`idproduto_fk` = `p`.`idproduto`))) order by `pp`.`data_criacao` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_vendas_hoje`
--

/*!50001 DROP VIEW IF EXISTS `vw_vendas_hoje`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_vendas_hoje` AS select count(0) AS `total_pedidos`,sum(`reserva`.`valor_total`) AS `faturamento_total`,(case when (count(0) > 0) then avg(`reserva`.`valor_total`) else 0 end) AS `ticket_medio`,sum((case when (`reserva`.`status` = 'Confirmado') then 1 else 0 end)) AS `pedidos_confirmados`,sum((case when (`reserva`.`status` = 'Pendente') then 1 else 0 end)) AS `pedidos_pendentes`,sum((case when (`reserva`.`status` = 'Cancelado') then 1 else 0 end)) AS `pedidos_cancelados` from `reserva` where (cast(`reserva`.`data_entrega` as date) = curdate()) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_vendas_mes_atual`
--

/*!50001 DROP VIEW IF EXISTS `vw_vendas_mes_atual`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_vendas_mes_atual` AS select cast(`reserva`.`data_entrega` as date) AS `data_venda`,count(0) AS `total_pedidos`,sum(`reserva`.`valor_total`) AS `faturamento_dia`,avg(`reserva`.`valor_total`) AS `ticket_medio` from `reserva` where ((month(`reserva`.`data_entrega`) = month(curdate())) and (year(`reserva`.`data_entrega`) = year(curdate()))) group by cast(`reserva`.`data_entrega` as date) order by `data_venda` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_whatsapp_status`
--

/*!50001 DROP VIEW IF EXISTS `vw_whatsapp_status`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_whatsapp_status` AS select (select count(0) from `tb_mensagens_whatsapp` where (cast(`tb_mensagens_whatsapp`.`data_hora_envio` as date) = curdate())) AS `mensagens_hoje`,(select count(0) from `tb_mensagens_whatsapp` where ((`tb_mensagens_whatsapp`.`tipo_mensagem` = 'enviada') and (`tb_mensagens_whatsapp`.`status_envio` = 'falha') and (cast(`tb_mensagens_whatsapp`.`data_hora_envio` as date) = curdate()))) AS `falhas_hoje`,(select count(0) from `tb_whatsapp_webhooks` where (`tb_whatsapp_webhooks`.`processado` = false)) AS `webhooks_pendentes`,(select `tb_whatsapp_bot_config`.`status_bot` from `tb_whatsapp_bot_config` order by `tb_whatsapp_bot_config`.`id_config` desc limit 1) AS `status_bot`,(select count(0) from `reserva` where ((cast(`reserva`.`data_pedido` as date) = curdate()) and (`reserva`.`canal_venda` = 'whatsapp'))) AS `pedidos_whatsapp_hoje` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-16 14:27:14
