#!/bin/bash

cp .env.example .env

# comprobate if the node_modules folder exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# wait for the database to start or execute the migrations manually
sleep 10

# execute the migrations
npx prisma migrate dev --name init

npm run start
