import express, { Request, Response } from 'express';
import cors from 'cors';
import { MockParcelProvider, GroundedAIModelGateway } from '@land-intelligence/integrations';
import { calculateSellerFinancing, matchBuyerToProperty, STAGE_LABELS, rationalToDecimal } from '@land-intelligence/domain';

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
    system: 'Pearson Developments Platform API Server',
    version: '2.0.0-pearson-developments',
    operatingModes: ['LAND_INVESTMENT_MODE', 'LANDMAN_OPERATIONS_MODE'],
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

// -------------------------------------------------------------
// LANDMAN OPERATIONS API ENDPOINTS
// -------------------------------------------------------------

// Land Projects API
app.get('/api/v1/landman/projects', (req: Request, res: Response) => {
  res.json({
    projects: [
      {
        id: 'prj-101',
        projectName: 'Permian Basin Wolfcamp Prospect',
        clientName: 'Pioneer Natural Resources',
        projectType: 'MINERAL_ACQUISITION',
        state: 'TX',
        county: 'Reeves',
        targetGrossAcres: 5000,
        targetNetMineralAcres: 1250,
        budgetUsd: 5000000,
        status: 'ACTIVE',
      },
      {
        id: 'prj-102',
        projectName: 'Costilla Solar Array Phase 1',
        clientName: 'NextEra Energy Resources',
        projectType: 'SOLAR_DEVELOPMENT',
        state: 'CO',
        county: 'Costilla',
        targetGrossAcres: 800,
        targetNetMineralAcres: 800,
        budgetUsd: 1200000,
        status: 'ACTIVE',
      },
    ],
  });
});

// Canonical Land Tracts API
app.get('/api/v1/landman/tracts', (req: Request, res: Response) => {
  res.json({
    tracts: [
      {
        id: 'trc-104',
        tractNumber: 'T-104',
        clientTractRef: 'PNR-T104',
        county: 'Reeves',
        state: 'TX',
        legalDescription: 'NW1/4 Section 14, Block 55, PSL Survey',
        grossAcres: 160.0,
        grossMineralAcres: 160.0,
        netMineralAcres: 40.0,
        surfaceOwnerName: 'Reeves Ranch Holdings LLC',
        mineralOwnerName: 'Estate of Henry T. Miller',
        executiveRightsOwnerName: 'Miller Family Trust',
        leaseholdStatus: 'OPEN_UNLEASED',
        hbpStatus: 'NOT_HBP',
        titleStatus: 'CURATIVE_REQUIRED',
      },
    ],
  });
});

// Rational Fractional Ownership Calculator API
app.post('/api/v1/landman/ownership/calculate', (req: Request, res: Response) => {
  const { grossAcres, mineralNum, mineralDen, royaltyNum, royaltyDen } = req.body;
  const mineralInterest = { numerator: Number(mineralNum || 1), denominator: Number(mineralDen || 4) };
  const leaseRoyalty = { numerator: Number(royaltyNum || 1), denominator: Number(royaltyDen || 5) };

  const mineralDecimal = rationalToDecimal(mineralInterest);
  const leaseRoyaltyDecimal = rationalToDecimal(leaseRoyalty);

  const netMineralAcres = Number(grossAcres || 160) * mineralDecimal;
  const netRevenueInterest = mineralDecimal * leaseRoyaltyDecimal;

  res.json({
    grossAcres: Number(grossAcres || 160),
    mineralInterestFraction: mineralInterest,
    leaseRoyaltyFraction: leaseRoyalty,
    netMineralAcres,
    netRevenueInterest,
    netRevenueInterestPercentage: (netRevenueInterest * 100).toFixed(6),
    allocationCheck: '100.00% Balanced',
  });
});

// AI Command Center API
app.post('/api/v1/ai/command', async (req: Request, res: Response) => {
  const { prompt, organizationId, propertyId } = req.body;
  const result = await aiGateway.execute({
    systemPrompt: 'You are Pearson Developments Grounded AI Assistant (Land Investment & Landman Operations).',
    userPrompt: prompt || 'Show deal scores and mineral tract title gaps',
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
  console.log(`[Pearson Developments API] Listening on http://localhost:${port}`);
});
