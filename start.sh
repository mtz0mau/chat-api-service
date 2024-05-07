#!/bin/bash

cp .env.example .env

# validar si la carpeta node_modules existe y si no esta vacia
if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias..."
  npm install
fi

# wait 5 seconds
sleep 5

npx prisma migrate dev --name init

npm run start
