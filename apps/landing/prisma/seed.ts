import { PrismaClient } from '@prisma/client'
import { RB001 } from './rb-001-data'
import { SG001 } from './sg-001-data'

const prisma = new PrismaClient()

async function main() {
  const { knownIssues, ...runbook } = RB001

  await prisma.runbook.upsert({
    where: { id: runbook.id },
    create: {
      ...runbook,
      status: 'published',
      knownIssues: {
        create: knownIssues,
      },
    },
    update: {
      ...runbook,
      status: 'published',
      knownIssues: {
        deleteMany: {},
        create: knownIssues,
      },
    },
  })

  console.log(`Seeded runbook ${runbook.id} with ${knownIssues.length} known issues`)

  await prisma.stackGuide.upsert({
    where: { id: SG001.id },
    create: {
      ...SG001,
      seamSections: SG001.seamSections,
    },
    update: {
      ...SG001,
      seamSections: SG001.seamSections,
    },
  })

  console.log(`Seeded stack guide ${SG001.id}`)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
