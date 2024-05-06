# API de Chat en Tiempo Real
Esta API de chat en tiempo real permite a los usuarios enviar mensajes y participar en conversaciones en tiempo real. Está construida con Node.js, utilizando MySQL como base de datos y Prisma como ORM.

## Características
Registro y Autenticación de Usuarios: Los usuarios pueden registrarse y autenticarse para acceder al chat.
Enviar Mensajes: Los usuarios pueden enviar mensajes en tiempo real a otros usuarios.
Crear y Unirse a Salas de Chat: Los usuarios pueden crear nuevas salas de chat o unirse a salas existentes.
Historial de Mensajes: Los usuarios pueden ver el historial de mensajes en cada sala de chat.
## Tecnologías Utilizadas
Node.js: Plataforma de desarrollo de aplicaciones en JavaScript para el servidor.
MySQL: Sistema de gestión de bases de datos relacional utilizado para almacenar los mensajes y la información de los usuarios.
Prisma: ORM (Object-Relational Mapping) utilizado para interactuar con la base de datos MySQL de manera sencilla desde Node.js.	
## Instalación
Iniciar el contenedor de docker.
```bash
docker compose up
```
Ingresar a la terminal del contenedor.
```bash
docker exec -it chat-service-app-1 sh
```
Realizar migración con prisma.
```javascript
npx prisma migrate dev --name init
```