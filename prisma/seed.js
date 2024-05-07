// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Aquí puedes agregar tus datos de seeding
  const app = await prisma.app.create({
    data: {
      name: "My App",
      urls: "http://localhost:3000,http://localhost:3001"
    }
  });

  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
      permissions: {
        create: [
          {
            name: 'create:users'
          }
        ]
      }
    }
  });

  const userRole = await prisma.role.create({
    data: {
      name: "User",
    }
  });

  await prisma.user.createMany({
    data: [
      {
        name: "Alice",
        email: "alice@example.com",
        app_uuid: app.uuid,
        role_uuid: adminRole.uuid,
        password: await bcrypt.hash('12345678', 10),
      },
      {
        name: "Bob",
        email: "bob@example.com",
        app_uuid: app.uuid,
        role_uuid: userRole.uuid,
        password: await bcrypt.hash('12345678', 10),
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });