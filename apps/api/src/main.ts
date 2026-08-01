import express, { Request, Response } from 'express';
import cors from 'cors';
import { MockParcelProvider, GroundedAIModelGateway } from '@land-intelligence/integrations';
import { calculateSellerFinancing, matchBuyerToProperty, STAGE_LABELS } from '@land-intelligence/domain';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const parcelProvider = new MockParcelProvider();
const aiGateway = new GroundedAIModelGateway();

// System & Health Check
app.get('/api/v1/health', async (req: Request, res: Response) => {
  const providerHealth = await parcelProvider.healthCheck();
  res.json({
    status: 'ok',
    system: 'Land Intelligence OS API Server',
    version: '1.0.0-production-grade',
    timestamp: new Date().toISOString(),
    provider: providerHealth,
  });
});

// Parcels & Properties API
app.get('/api/v1/parcels/search', async (req: Request, res: Response) => {
  const { state, county, minAcreage, maxAcreage, absenteeOnly, taxDelinquentOnly } = req.query;
  const results = await parcelProvider.searchParcels({
    state: state as string,
    county: county as string,
    minAcreage: minAcreage ? Number(minAcreage) : undefined,
    maxAcreage: maxAcreage ? Number(maxAcreage) : undefined,
    absenteeOnly: absenteeOnly === 'true',
    taxDelinquentOnly: taxDelinquentOnly === 'true',
  });
  res.json(results);
});

app.get('/api/v1/properties/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const search = await parcelProvider.searchParcels({});
  const prop = search.properties.find((p) => p.id === id) || search.properties[0];
  res.json(prop);
});

// Comps & Underwriting API
app.get('/api/v1/properties/:id/comps', async (req: Request, res: Response) => {
  const search = await parcelProvider.searchParcels({});
  const prop = search.properties.find((p) => p.id === req.params.id) || search.properties[0];
  const comps = await parcelProvider.getCompsForParcel(prop, 5.0);
  res.json({
    propertyId: prop.id,
    radiusMiles: 5.0,
    comps,
    suggestedResaleValue: prop.estimatedMarketValue,
    suggestedMaxAllowableOffer: prop.suggestedOfferPrice,
  });
});

// Financial Calculation Engine API
app.post('/api/v1/offers/calculate', (req: Request, res: Response) => {
  const { purchasePrice, downPaymentPercent, interestRateAnnual, amortizationYears, balloonTermMonths } = req.body;
  const terms = calculateSellerFinancing(
    Number(purchasePrice || 15000),
    Number(downPaymentPercent || 10),
    Number(interestRateAnnual || 9.9),
    Number(amortizationYears || 5),
    balloonTermMonths ? Number(balloonTermMonths) : undefined
  );
  res.json({ terms });
});

// AI Command Center API
app.post('/api/v1/ai/command', async (req: Request, res: Response) => {
  const { prompt, organizationId, propertyId } = req.body;
  const result = await aiGateway.execute({
    systemPrompt: 'You are Land Intelligence OS Grounded AI Assistant.',
    userPrompt: prompt || 'Show deal scores in target counties',
    organizationId: organizationId || 'org-demo',
    userId: 'usr-1',
    propertyContextId: propertyId,
  });
  res.json(result);
});

// Lifecycle Stages Meta API
app.get('/api/v1/lifecycle/stages', (req: Request, res: Response) => {
  res.json(STAGE_LABELS);
});

app.listen(port, () => {
  console.log(`[Land Intelligence OS API] Listening on http://localhost:${port}`);
});
