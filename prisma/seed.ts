import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: 'dev@example.com',
      name: 'Dev User',
      password: 'hashedpassword', // Normally hash this!
    },
  });

  // Create a project
  const project = await prisma.project.create({
    data: {
      name: 'DevTracker MVP',
      description: 'Initial project setup',
      ownerId: user.id,
    },
  });

  // Add tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Set up DB schema',
        status: 'done',
        projectId: project.id,
        assigneeId: user.id,
      },
      {
        title: 'Create Kanban UI',
        status: 'in_progress',
        projectId: project.id,
        assigneeId: user.id,
      },
    ],
  });

  // Add a log
  await prisma.log.create({
    data: {
      content: 'Finished initial DB schema. Starting on frontend.',
      projectId: project.id,
      userId: user.id,
    },
  });

  // Add an issue
  await prisma.issue.create({
    data: {
      title: 'Bug: Login form doesn’t validate',
      description: 'Validation fails even on correct input',
      projectId: project.id,
      userId: user.id,
    },
  });

  console.log('🌱 Seeded data successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
