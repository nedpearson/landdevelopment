-- Land Investment OS - Supabase Database Schema Migration
-- Enables PostGIS extension and creates tables for parcels, properties, comps, offers, sellers, buyers, portfolio, and due diligence.

-- Enable PostGIS & UUID extensions
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Custom Enum Types
CREATE TYPE property_lifecycle_stage AS ENUM (
  'MARKET_DISCOVERY',
  'PARCEL_DISCOVERY',
  'PROSPECT',
  'CONTACTED',
  'QUALIFIED',
  'UNDERWRITING',
  'DUE_DILIGENCE',
  'OFFER_DRAFTED',
  'OFFER_SENT',
  'NEGOTIATION',
  'CONTRACTED',
  'CLOSING',
  'OWNED',
  'LISTED',
  'UNDER_CONTRACT_DISPOSITION',
  'SOLD',
  'ARCHIVED'
);

CREATE TYPE offer_status AS ENUM (
  'DRAFT',
  'AWAITING_APPROVAL',
  'APPROVED',
  'SENT',
  'ACCEPTED',
  'REJECTED',
  'COUNTERED',
  'EXPIRED'
);

CREATE TYPE esignature_status AS ENUM (
  'NOT_SENT',
  'SENT',
  'DELIVERED',
  'SIGNED',
  'DECLINED'
);

CREATE TYPE diligence_category AS ENUM (
  'TITLE_OWNERSHIP',
  'TAXES_LIENS',
  'LEGAL_ACCESS',
  'ZONING_RESTRICTIONS',
  'ENVIRONMENTAL_FLOOD',
  'UTILITIES_SEPTIC',
  'SURVEY_BOUNDARIES',
  'HOA_POA_FEES',
  'CLOSING_REQUIREMENTS'
);

CREATE TYPE diligence_status AS ENUM (
  'PENDING',
  'IN_PROGRESS',
  'VERIFIED',
  'FAILED_BLOCKER',
  'EXEMPT'
);

CREATE TYPE seller_motivation_level AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT'
);

CREATE TYPE portfolio_holding_status AS ENUM (
  'OWNED',
  'LISTED',
  'UNDER_CONTRACT',
  'SOLD'
);

CREATE TYPE note_status AS ENUM (
  'ACTIVE',
  'PAID_IN_FULL',
  'DELINQUENT',
  'DEFAULTED'
);

CREATE TYPE communication_channel AS ENUM (
  'EMAIL',
  'SMS',
  'PHONE',
  'DIRECT_MAIL'
);

CREATE TYPE communication_direction AS ENUM (
  'INBOUND',
  'OUTBOUND'
);

CREATE TYPE communication_status AS ENUM (
  'QUEUED',
  'SENT',
  'DELIVERED',
  'FAILED',
  'RECEIVED'
);

-- Properties / Parcels Table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id VARCHAR(100) NOT NULL DEFAULT 'org_default',
  apn VARCHAR(100) NOT NULL,
  county VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  address VARCHAR(255),
  zip_code VARCHAR(20),
  legal_description TEXT,
  acreage NUMERIC(10, 4) NOT NULL,
  usable_acreage NUMERIC(10, 4) NOT NULL,
  lifecycle_stage property_lifecycle_stage NOT NULL DEFAULT 'PROSPECT',

  -- Owner Information
  owner_name VARCHAR(255) NOT NULL,
  mailing_address TEXT,
  mailing_city_state_zip VARCHAR(255),
  absentee_owner BOOLEAN NOT NULL DEFAULT false,
  corporate_owner BOOLEAN NOT NULL DEFAULT false,
  tax_delinquent BOOLEAN NOT NULL DEFAULT false,
  delinquent_amount NUMERIC(12, 2),
  ownership_length_years NUMERIC(5, 1),

  -- Structured Assessments (Access, Zoning, Environmental, Utilities)
  access_assessment JSONB NOT NULL DEFAULT '{}'::jsonb,
  zoning_assessment JSONB NOT NULL DEFAULT '{}'::jsonb,
  environmental_assessment JSONB NOT NULL DEFAULT '{}'::jsonb,
  utility_assessment JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Geospatial Data (PostGIS geometry and coordinates)
  geometry extensions.geometry(Geometry, 4326),
  centroid_lat NUMERIC(10, 7),
  centroid_lng NUMERIC(10, 7),
  raw_geometry JSONB,

  -- Valuation & Financial Summary
  asking_price NUMERIC(12, 2),
  estimated_market_value NUMERIC(12, 2),
  suggested_offer_price NUMERIC(12, 2),
  deal_score NUMERIC(5, 2),

  -- Data Provenance Tracking
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for Property Searches & PostGIS
CREATE INDEX IF NOT EXISTS idx_properties_apn_county ON public.properties(apn, county, state);
CREATE INDEX IF NOT EXISTS idx_properties_lifecycle ON public.properties(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_properties_geometry ON public.properties USING GIST(geometry);

-- Comparable Sales (Comps) Table
CREATE TABLE IF NOT EXISTS public.comps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  apn VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  county VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  acreage NUMERIC(10, 4) NOT NULL,
  sale_price NUMERIC(12, 2) NOT NULL,
  sale_date TIMESTAMPTZ NOT NULL,
  price_per_acre NUMERIC(12, 2) NOT NULL,
  distance_miles NUMERIC(8, 2) NOT NULL,
  road_access VARCHAR(100) NOT NULL DEFAULT 'UNKNOWN',
  utilities VARCHAR(100) NOT NULL DEFAULT 'UNKNOWN',
  wetlands_percentage NUMERIC(5, 2) DEFAULT 0,
  flood_percentage NUMERIC(5, 2) DEFAULT 0,

  -- Quality Flags & Audit
  is_arm_length_transaction BOOLEAN DEFAULT true,
  is_duplicate BOOLEAN DEFAULT false,
  is_family_transfer BOOLEAN DEFAULT false,
  is_quitclaim BOOLEAN DEFAULT false,
  is_outlier BOOLEAN DEFAULT false,
  exclusion_reason TEXT,
  included_in_valuation BOOLEAN DEFAULT true,

  -- Valuation Adjustments & Adjusted Valuation
  adjustments JSONB DEFAULT '{}'::jsonb,
  adjusted_price_per_acre NUMERIC(12, 2),
  adjusted_sale_price NUMERIC(12, 2),

  -- PostGIS Location
  geometry extensions.geometry(Point, 4326),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comps_property_id ON public.comps(property_id);
CREATE INDEX IF NOT EXISTS idx_comps_location ON public.comps(county, state);
CREATE INDEX IF NOT EXISTS idx_comps_geometry ON public.comps USING GIST(geometry);

-- Sellers / CRM Contacts
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id VARCHAR(100) NOT NULL DEFAULT 'org_default',
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  mailing_address TEXT,
  motivation_level seller_motivation_level DEFAULT 'MEDIUM',
  asking_price NUMERIC(12, 2),
  reason_for_selling TEXT,
  desired_timing VARCHAR(100),
  notes TEXT[] DEFAULT '{}'::text[],
  consent JSONB DEFAULT '[]'::jsonb,
  campaign_id VARCHAR(100),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Property Sellers Junction Table
CREATE TABLE IF NOT EXISTS public.property_sellers (
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, seller_id)
);

-- Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  status offer_status NOT NULL DEFAULT 'DRAFT',
  scenarios JSONB NOT NULL DEFAULT '{}'::jsonb,
  selected_scenario_key VARCHAR(100) NOT NULL DEFAULT 'cash',
  approved_by_id VARCHAR(100),
  approved_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  document_url TEXT,
  esignature_status esignature_status DEFAULT 'NOT_SENT',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_offers_property_id ON public.offers(property_id);
CREATE INDEX IF NOT EXISTS idx_offers_seller_id ON public.offers(seller_id);

-- Buyers Table
CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id VARCHAR(100) NOT NULL DEFAULT 'org_default',
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  verified_buyer BOOLEAN NOT NULL DEFAULT false,
  proof_of_funds_verified BOOLEAN NOT NULL DEFAULT false,
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  purchased_properties_count INT NOT NULL DEFAULT 0,
  unsubscribed BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_buyers_email ON public.buyers(email);

-- Due Diligence Items Table
CREATE TABLE IF NOT EXISTS public.due_diligence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  category diligence_category NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status diligence_status NOT NULL DEFAULT 'PENDING',
  is_blocker BOOLEAN NOT NULL DEFAULT false,
  assigned_to_user VARCHAR(100),
  due_date TIMESTAMPTZ,
  verification_source TEXT,
  evidence_notes TEXT,
  evidence_file_urls TEXT[] DEFAULT '{}'::text[],
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diligence_property_id ON public.due_diligence_items(property_id);
CREATE INDEX IF NOT EXISTS idx_diligence_status ON public.due_diligence_items(status);

-- Portfolio Holdings Table
CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  apn VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  county VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  acreage NUMERIC(10, 4) NOT NULL,
  acquisition_date TIMESTAMPTZ NOT NULL,
  purchase_price NUMERIC(12, 2) NOT NULL,
  closing_costs NUMERIC(12, 2) NOT NULL DEFAULT 0,
  holding_costs NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_cost_basis NUMERIC(12, 2) NOT NULL,
  estimated_current_value NUMERIC(12, 2) NOT NULL,
  unrealized_profit NUMERIC(12, 2) NOT NULL,
  holding_days INT NOT NULL DEFAULT 0,
  status portfolio_holding_status NOT NULL DEFAULT 'OWNED',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_property_id ON public.portfolio_holdings(property_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON public.portfolio_holdings(status);

-- Owner Financing Notes Table
CREATE TABLE IF NOT EXISTS public.owner_finance_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_holding_id UUID NOT NULL REFERENCES public.portfolio_holdings(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  terms JSONB NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  next_payment_due_date TIMESTAMPTZ NOT NULL,
  current_balance NUMERIC(12, 2) NOT NULL,
  status note_status NOT NULL DEFAULT 'ACTIVE',
  payments_received_count INT NOT NULL DEFAULT 0,
  total_interest_collected NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_principal_collected NUMERIC(12, 2) NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_portfolio_id ON public.owner_finance_notes(portfolio_holding_id);
CREATE INDEX IF NOT EXISTS idx_notes_status ON public.owner_finance_notes(status);

-- Communication Logs Table
CREATE TABLE IF NOT EXISTS public.communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  channel communication_channel NOT NULL,
  direction communication_direction NOT NULL,
  content TEXT NOT NULL,
  status communication_status NOT NULL DEFAULT 'SENT',
  provider_message_id VARCHAR(100),
  sent_by_user_id VARCHAR(100),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comm_logs_seller ON public.communication_logs(seller_id);
CREATE INDEX IF NOT EXISTS idx_comm_logs_property ON public.communication_logs(property_id);
