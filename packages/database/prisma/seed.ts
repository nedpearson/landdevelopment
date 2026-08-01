import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Land Intelligence OS (Land Investment & Landman Operations Dual-Mode)...');

  // Seed Property
  const property = await prisma.property.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      organizationId: 'org_default',
      apn: '123-456-789',
      county: 'Costilla',
      state: 'CO',
      address: '100 Costilla Ranch Road',
      zipCode: '81151',
      legalDescription: 'NW1/4 Section 12, Township 32S, Range 72W',
      acreage: 160.0,
      usableAcreage: 155.0,
      lifecycleStage: 'UNDERWRITING',
      ownerName: 'Estate of Henry T. Miller',
      mailingAddress: '450 Midland Ave, Midland, TX 79701',
      absenteeOwner: true,
      corporateOwner: false,
      taxDelinquent: false,
      askingPrice: 75000,
      estimatedMarketValue: 96000,
      suggestedOfferPrice: 48000,
      dealScore: 84.5,
    },
  });

  // Seed Landman Project
  const project = await prisma.landProject.upsert({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000010',
      organizationId: 'org_default',
      projectName: 'Permian Basin Wolfcamp Prospect',
      clientName: 'Pioneer Natural Resources',
      projectType: 'MINERAL_ACQUISITION',
      state: 'TX',
      county: 'Reeves',
      basin: 'Permian',
      play: 'Wolfcamp A & B',
      targetGrossAcres: 5000.0,
      targetNetMineralAcres: 1250.0,
      budgetUsd: 5000000,
      status: 'ACTIVE',
    },
  });

  // Seed Canonical Landman Tract
  const tract = await prisma.landTract.upsert({
    where: { id: '00000000-0000-0000-0000-000000000020' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000020',
      projectId: project.id,
      tractNumber: 'T-104',
      clientTractRef: 'PNR-T104',
      county: 'Reeves',
      state: 'TX',
      legalDescription: 'NW1/4 Section 14, Block 55, PSL Survey',
      grossAcres: 160.0,
      grossMineralAcres: 160.0,
      netMineralAcres: 40.0,
      surfaceAcres: 160.0,
      formationName: 'Wolfcamp A & B',
      surfaceOwnerName: 'Reeves Ranch Holdings LLC',
      mineralOwnerName: 'Estate of Henry T. Miller',
      executiveRightsOwnerName: 'Miller Family Trust',
      leaseholdStatus: 'OPEN_UNLEASED',
      hbpStatus: 'NOT_HBP',
      titleStatus: 'CURATIVE_REQUIRED',
      status: 'TITLE_IN_PROGRESS',
    },
  });

  console.log('Seeding completed successfully!');
  console.log('Created Property:', property.id);
  console.log('Created Land Project:', project.id);
  console.log('Created Land Tract:', tract.id);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
