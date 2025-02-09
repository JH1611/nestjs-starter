import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.permission.createMany({
    data: [
      {
        name: 'create-user',
        key: 'CREATE_USER',
      },
      {
        name: 'list-users',
        key: 'LIST_USERS',
      },
      {
        name: 'read-user',
        key: 'READ_USER',
      },
      {
        name: 'update-user',
        key: 'UPDATE_USER',
      },
      {
        name: 'delete-user',
        key: 'DELETE_USER',
      },
    ],
  });

  await prisma.role.createMany({
    data: [
      {
        name: 'Admin',
        key: 'ADMIN',
      },
      {
        name: 'User',
        key: 'USER',
      },
    ],
  });

  await prisma.rolePermission.createMany({
    data: [
      {
        roleId: 1,
        permissionId: 1,
      },
      {
        roleId: 1,
        permissionId: 2,
      },
      {
        roleId: 1,
        permissionId: 3,
      },
      {
        roleId: 1,
        permissionId: 4,
      },
      {
        roleId: 1,
        permissionId: 5,
      },
      {
        roleId: 2,
        permissionId: 2,
      },
    ],
  });
}

main()
  .then(() => {
    console.log('Seed data created successfully');
  })
  .catch((error) => {
    console.error('Error creating seed data:', error);
  })
  .finally(() => {
    prisma.$disconnect();
  });
