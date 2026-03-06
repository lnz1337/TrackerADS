-- TrackerADS Seed Data
-- 6 creatives covering all Hook/Hold classification combos

-- 1. Hook Bom + Hold Ruim → Doador de Hook (Meta, Oferta Alpha, Brasil)
INSERT INTO creatives (id, name, platform, offer_name, niche, region, creative_type, angle, hook_text, hook_type, hold_structure, cta_type, duration_seconds, status, start_date, notes)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'UGC Pergunta Impactante',
  'Meta',
  'Oferta Alpha',
  'Saúde',
  'Brasil',
  'UGC',
  'Dor',
  'Você sabia que 90% das pessoas erram isso?',
  'Pergunta',
  'Storytelling',
  'Clique no link',
  30,
  'Em teste',
  '2026-03-01',
  'Hook forte, retenção fraca'
);

-- 2. Hook Ruim + Hold Bom → Doador de Hold (Meta, Oferta Alpha, Brasil)
INSERT INTO creatives (id, name, platform, offer_name, niche, region, creative_type, angle, hook_text, hook_type, hold_structure, cta_type, duration_seconds, status, start_date, notes)
VALUES (
  'b2222222-2222-2222-2222-222222222222',
  'VSL Depoimento Completo',
  'Meta',
  'Oferta Alpha',
  'Saúde',
  'Brasil',
  'VSL',
  'Dor',
  'Olá, eu sou a Maria e...',
  'Prova social',
  'Depoimento',
  'Saiba mais',
  45,
  'Em teste',
  '2026-03-01',
  'Hold forte, abertura fraca'
);

-- 3. Hook Bom + Hold Bom → Benchmark / Winner potencial (Meta, Oferta Alpha, Brasil)
INSERT INTO creatives (id, name, platform, offer_name, niche, region, creative_type, angle, hook_text, hook_type, hold_structure, cta_type, duration_seconds, status, start_date, notes)
VALUES (
  'c3333333-3333-3333-3333-333333333333',
  'Mashup Winner Total',
  'Meta',
  'Oferta Alpha',
  'Saúde',
  'Brasil',
  'Mashup',
  'Curiosidade',
  'Isso mudou minha vida em 7 dias',
  'Afirmação chocante',
  'Problema → Solução',
  'Compre agora',
  25,
  'Vencedor',
  '2026-02-20',
  'Criativo de alta performance'
);

-- 4. Hook Ruim + Hold Ruim → Criativo fraco (Meta, Oferta Alpha, Brasil)
INSERT INTO creatives (id, name, platform, offer_name, niche, region, creative_type, angle, hook_text, hook_type, hold_structure, cta_type, duration_seconds, status, start_date, notes)
VALUES (
  'd4444444-4444-4444-4444-444444444444',
  'Imagem Estática Genérica',
  'Meta',
  'Oferta Alpha',
  'Saúde',
  'Brasil',
  'Imagem estática',
  'Benefício',
  'Conheça nosso produto',
  'Outro',
  'Educativo',
  'Saiba mais',
  NULL,
  'Perdedor',
  '2026-02-25',
  'Performance muito fraca'
);

-- 5. Hook Médio + Hold Médio → Em observação (Meta, Oferta Alpha, Brasil)
INSERT INTO creatives (id, name, platform, offer_name, niche, region, creative_type, angle, hook_text, hook_type, hold_structure, cta_type, duration_seconds, status, start_date, notes)
VALUES (
  'e5555555-5555-5555-5555-555555555555',
  'Carrossel Educativo',
  'Meta',
  'Oferta Alpha',
  'Saúde',
  'Brasil',
  'Carrossel',
  'Dor',
  '5 erros que você comete todo dia',
  'Pergunta',
  'Listicle',
  'Arraste pra cima',
  NULL,
  'Iterando',
  '2026-03-01',
  'Métricas medianas, iterando'
);

-- 6. Incompatível (TikTok, Oferta Beta, EUA) — não deve combinar com os acima
INSERT INTO creatives (id, name, platform, offer_name, niche, region, creative_type, angle, hook_text, hook_type, hold_structure, cta_type, duration_seconds, status, start_date, notes)
VALUES (
  'f6666666-6666-6666-6666-666666666666',
  'TikTok Viral Dance',
  'TikTok',
  'Oferta Beta',
  'Fitness',
  'EUA',
  'UGC',
  'Antes/Depois',
  'Watch this transformation!',
  'Antes/Depois',
  'Demo do produto',
  'Link na bio',
  15,
  'Em teste',
  '2026-03-02',
  'Plataforma e oferta diferentes'
);

-- ============================================================
-- Metric Logs
-- ============================================================

-- Creative 1 (Hook Bom, Hold Ruim) — 3 logs
INSERT INTO creative_metrics_logs (creative_id, log_date, impressions, cpm, cpc, ctr, hook_rate, hold_rate, thumbstop_rate, view_25, view_50, view_75, view_95, clicks, cost, leads, sales, revenue, cpa, roas, notes)
VALUES
('a1111111-1111-1111-1111-111111111111', '2026-03-02', 5000, 12.50, 1.80, 2.5, 55.0, 7.0, 45.0, 60.0, 35.0, 15.0, 5.0, 140, 62.50, 8, 2, 200.00, 31.25, 3.2, 'Primeiro dia'),
('a1111111-1111-1111-1111-111111111111', '2026-03-04', 8000, 11.00, 1.50, 3.0, 58.0, 8.5, 48.0, 62.0, 38.0, 18.0, 6.0, 240, 88.00, 12, 3, 350.00, 29.33, 3.98, 'Melhorando hook'),
('a1111111-1111-1111-1111-111111111111', '2026-03-05', 12000, 10.50, 1.30, 3.5, 62.0, 9.0, 52.0, 65.0, 40.0, 20.0, 7.0, 420, 126.00, 18, 5, 600.00, 25.20, 4.76, 'Hook excelente, hold ainda fraco');

-- Creative 2 (Hook Ruim, Hold Bom) — 3 logs
INSERT INTO creative_metrics_logs (creative_id, log_date, impressions, cpm, cpc, ctr, hook_rate, hold_rate, thumbstop_rate, view_25, view_50, view_75, view_95, clicks, cost, leads, sales, revenue, cpa, roas, notes)
VALUES
('b2222222-2222-2222-2222-222222222222', '2026-03-02', 3000, 15.00, 2.50, 1.5, 18.0, 22.0, 20.0, 55.0, 45.0, 35.0, 25.0, 45, 45.00, 5, 1, 80.00, 45.00, 1.78, 'Abertura fraca'),
('b2222222-2222-2222-2222-222222222222', '2026-03-04', 4500, 14.00, 2.20, 1.8, 20.0, 25.0, 22.0, 58.0, 48.0, 38.0, 28.0, 81, 63.00, 8, 2, 180.00, 31.50, 2.86, 'Hold melhorando'),
('b2222222-2222-2222-2222-222222222222', '2026-03-05', 6000, 13.50, 2.00, 2.0, 22.0, 28.0, 25.0, 60.0, 50.0, 40.0, 30.0, 120, 81.00, 10, 3, 300.00, 27.00, 3.70, 'Retenção excelente');

-- Creative 3 (Hook Bom, Hold Bom) — 2 logs
INSERT INTO creative_metrics_logs (creative_id, log_date, impressions, cpm, cpc, ctr, hook_rate, hold_rate, thumbstop_rate, view_25, view_50, view_75, view_95, clicks, cost, leads, sales, revenue, cpa, roas, notes)
VALUES
('c3333333-3333-3333-3333-333333333333', '2026-03-01', 15000, 8.00, 0.80, 4.5, 65.0, 30.0, 55.0, 75.0, 60.0, 45.0, 30.0, 675, 120.00, 25, 8, 1200.00, 15.00, 10.0, 'Performance forte'),
('c3333333-3333-3333-3333-333333333333', '2026-03-05', 25000, 7.50, 0.70, 5.0, 70.0, 32.0, 60.0, 78.0, 65.0, 50.0, 35.0, 1250, 187.50, 40, 12, 2000.00, 15.63, 10.67, 'Winner confirmado');

-- Creative 4 (Hook Ruim, Hold Ruim) — 2 logs
INSERT INTO creative_metrics_logs (creative_id, log_date, impressions, cpm, cpc, ctr, hook_rate, hold_rate, thumbstop_rate, view_25, view_50, view_75, view_95, clicks, cost, leads, sales, revenue, cpa, roas, notes)
VALUES
('d4444444-4444-4444-4444-444444444444', '2026-03-01', 2000, 20.00, 4.50, 0.8, 12.0, 5.0, 10.0, 25.0, 12.0, 5.0, 2.0, 16, 40.00, 1, 0, 0.00, NULL, 0.0, 'Muito fraco'),
('d4444444-4444-4444-4444-444444444444', '2026-03-03', 2500, 19.00, 4.20, 0.9, 15.0, 6.0, 12.0, 28.0, 14.0, 6.0, 3.0, 22, 47.50, 2, 0, 0.00, NULL, 0.0, 'Sem melhora significativa');

-- Creative 5 (Hook Médio, Hold Médio) — 2 logs
INSERT INTO creative_metrics_logs (creative_id, log_date, impressions, cpm, cpc, ctr, hook_rate, hold_rate, thumbstop_rate, view_25, view_50, view_75, view_95, clicks, cost, leads, sales, revenue, cpa, roas, notes)
VALUES
('e5555555-5555-5555-5555-555555555555', '2026-03-03', 6000, 13.00, 2.00, 2.0, 35.0, 15.0, 30.0, 50.0, 35.0, 22.0, 12.0, 120, 78.00, 6, 2, 180.00, 39.00, 2.31, 'Métricas medianas'),
('e5555555-5555-5555-5555-555555555555', '2026-03-05', 8000, 12.00, 1.80, 2.3, 38.0, 16.0, 33.0, 52.0, 38.0, 25.0, 14.0, 184, 96.00, 9, 3, 280.00, 32.00, 2.92, 'Leve melhora');

-- Creative 6 (TikTok, incompatível) — 2 logs
INSERT INTO creative_metrics_logs (creative_id, log_date, impressions, cpm, cpc, ctr, hook_rate, hold_rate, thumbstop_rate, view_25, view_50, view_75, view_95, clicks, cost, leads, sales, revenue, cpa, roas, notes)
VALUES
('f6666666-6666-6666-6666-666666666666', '2026-03-03', 50000, 5.00, 0.50, 6.0, 55.0, 8.0, 50.0, 70.0, 40.0, 15.0, 5.0, 3000, 250.00, 20, 5, 400.00, 50.00, 1.60, 'Viral mas sem conversão'),
('f6666666-6666-6666-6666-666666666666', '2026-03-05', 80000, 4.50, 0.40, 7.0, 60.0, 9.0, 55.0, 72.0, 42.0, 18.0, 6.0, 5600, 360.00, 30, 8, 650.00, 45.00, 1.81, 'Volume alto');
