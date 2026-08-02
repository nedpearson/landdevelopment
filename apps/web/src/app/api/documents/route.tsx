import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { Document, Page, Text, View, StyleSheet, renderToStream } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 40 },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 10, color: '#666' },
  body: { fontSize: 12, lineHeight: 1.5, marginBottom: 10 },
  signature: { marginTop: 50, borderTop: '1 solid #000', paddingTop: 10, width: 200 }
});

const PurchaseContract = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Land Purchase Agreement</Text>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>Date: {new Date().toLocaleDateString()}</Text>
        <Text style={styles.body}>
          This Land Purchase Agreement is entered into by and between the Buyer (Land OS) and the Seller ({data.sellerName || '____________________'}).
        </Text>
        
        <Text style={styles.body}>
          Property Description:
          APN: {data.apn || 'N/A'}
          Acreage: {data.acreage || 'N/A'} Acres
          County: {data.county || 'N/A'}, {data.state || 'N/A'}
        </Text>
        
        <Text style={styles.body}>
          Purchase Price: ${data.price ? data.price.toLocaleString() : '__________'}
        </Text>

        <View style={styles.signature}>
          <Text style={styles.body}>Seller Signature</Text>
        </View>
        <View style={styles.signature}>
          <Text style={styles.body}>Buyer Signature</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // @ts-ignore - renderToStream returns a Node stream which Next.js NextResponse accepts
    const stream = await renderToStream(<PurchaseContract data={data} />);
    
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contract_${data.apn || 'draft'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
