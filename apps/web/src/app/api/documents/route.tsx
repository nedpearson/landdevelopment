import { NextResponse } from 'next/server';
import { prisma } from '@land-intelligence/database';

export async function GET() {
  try {
    const instruments = await prisma.titleInstrument.findMany({
      take: 50,
      orderBy: { recordingDate: 'desc' },
      include: {
        parties: true,
      },
    });

    const diligenceDocs = await prisma.dueDiligenceItem.findMany({
      take: 50,
      include: {
        property: {
          select: { id: true, apn: true, address: true, county: true, state: true },
        },
      },
    });

    const documents = [
      ...instruments.map(inst => ({
        id: inst.id,
        type: inst.instrumentType,
        title: `${inst.instrumentType.replace(/_/g, ' ')} - ${inst.bookPageDoc}`,
        grantor: inst.grantor,
        grantee: inst.grantee,
        recordingDate: inst.recordingDate.toISOString(),
        category: 'TITLE_INSTRUMENT',
        hasDefect: inst.hasGapOrDefect,
        notes: inst.defectNotes,
      })),
      ...diligenceDocs.map(doc => ({
        id: doc.id,
        type: doc.category,
        title: `${doc.title} (${doc.property?.apn || 'Unknown'})`,
        grantor: doc.property?.address || `${doc.property?.county || ''}, ${doc.property?.state || ''}`,
        grantee: 'Internal Diligence Archive',
        recordingDate: doc.createdAt.toISOString(),
        category: 'DUE_DILIGENCE',
        url: doc.evidenceFileUrls?.[0] || null,
        notes: doc.evidenceNotes || doc.description,
      })),
    ];

    return NextResponse.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch documents',
      documents: [],
    }, { status: 500 });
  }
}
