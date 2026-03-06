-- TrackerADS Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Table: creatives
-- ============================================================
CREATE TABLE creatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('YouTube', 'Meta', 'TikTok', 'Outro')),
  offer_name TEXT NOT NULL,
  niche TEXT,
  region TEXT,
  creative_type TEXT,
  angle TEXT,
  hook_text TEXT,
  hook_type TEXT,
  hold_structure TEXT,
  main_copy TEXT,
  cta_type TEXT,
  duration_seconds INTEGER CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  creative_url TEXT,
  ad_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('Em teste', 'Vencedor', 'Pausado', 'Perdedor', 'Iterando')),
  start_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Table: creative_metrics_logs
-- ============================================================
CREATE TABLE creative_metrics_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creative_id UUID NOT NULL REFERENCES creatives(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  impressions INTEGER CHECK (impressions IS NULL OR impressions >= 0),
  cpm NUMERIC CHECK (cpm IS NULL OR cpm >= 0),
  cpc NUMERIC CHECK (cpc IS NULL OR cpc >= 0),
  ctr NUMERIC CHECK (ctr IS NULL OR ctr >= 0),
  link_ctr NUMERIC CHECK (link_ctr IS NULL OR link_ctr >= 0),
  hook_rate NUMERIC CHECK (hook_rate IS NULL OR hook_rate >= 0),
  hold_rate NUMERIC CHECK (hold_rate IS NULL OR hold_rate >= 0),
  thumbstop_rate NUMERIC CHECK (thumbstop_rate IS NULL OR thumbstop_rate >= 0),
  view_25 NUMERIC CHECK (view_25 IS NULL OR view_25 >= 0),
  view_50 NUMERIC CHECK (view_50 IS NULL OR view_50 >= 0),
  view_75 NUMERIC CHECK (view_75 IS NULL OR view_75 >= 0),
  view_95 NUMERIC CHECK (view_95 IS NULL OR view_95 >= 0),
  clicks INTEGER CHECK (clicks IS NULL OR clicks >= 0),
  cost NUMERIC CHECK (cost IS NULL OR cost >= 0),
  leads INTEGER CHECK (leads IS NULL OR leads >= 0),
  checkouts INTEGER CHECK (checkouts IS NULL OR checkouts >= 0),
  sales INTEGER CHECK (sales IS NULL OR sales >= 0),
  revenue NUMERIC CHECK (revenue IS NULL OR revenue >= 0),
  cpa NUMERIC CHECK (cpa IS NULL OR cpa >= 0),
  roas NUMERIC CHECK (roas IS NULL OR roas >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (creative_id, log_date)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_creative_metrics_logs_creative_id ON creative_metrics_logs(creative_id);
CREATE INDEX idx_creative_metrics_logs_log_date ON creative_metrics_logs(log_date);
CREATE INDEX idx_creatives_platform ON creatives(platform);
CREATE INDEX idx_creatives_offer_name ON creatives(offer_name);
CREATE INDEX idx_creatives_status ON creatives(status);

-- ============================================================
-- Updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_creatives_updated_at
  BEFORE UPDATE ON creatives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creative_metrics_logs_updated_at
  BEFORE UPDATE ON creative_metrics_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
