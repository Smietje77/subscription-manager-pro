-- =====================================================
-- SEED DATA FOR SUBSCRIPTION MANAGER PRO
-- =====================================================

-- Insert Categories
INSERT INTO public.categories (id, name, slug, icon, color) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Streaming Services', 'streaming', '🎬', '#E50914'),
  ('22222222-2222-2222-2222-222222222222', 'Software & SaaS', 'software-saas', '💻', '#4285F4'),
  ('33333333-3333-3333-3333-333333333333', 'Cloud Storage', 'cloud-storage', '☁️', '#00A4EF'),
  ('44444444-4444-4444-4444-444444444444', 'Music Streaming', 'music-streaming', '🎵', '#1DB954'),
  ('55555555-5555-5555-5555-555555555555', 'Gaming', 'gaming', '🎮', '#00C853'),
  ('66666666-6666-6666-6666-666666666666', 'Productivity', 'productivity', '📊', '#FF6B00'),
  ('77777777-7777-7777-7777-777777777777', 'News & Media', 'news-media', '📰', '#FFD700'),
  ('88888888-8888-8888-8888-888888888888', 'Fitness & Health', 'fitness-health', '💪', '#FF4081'),
  ('99999999-9999-9999-9999-999999999999', 'Education', 'education', '🎓', '#9C27B0'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Utilities', 'utilities', '⚡', '#607D8B')
ON CONFLICT (id) DO NOTHING;

-- Insert Products
INSERT INTO public.products (id, name, slug, description, logo_url, website_url, category_id, is_active) VALUES
  -- Streaming Services
  ('p1111111-1111-1111-1111-111111111111', 'Netflix', 'netflix', '{"en": "Watch TV shows and movies", "nl": "Bekijk tv-series en films"}', 'https://logo.clearbit.com/netflix.com', 'https://www.netflix.com', '11111111-1111-1111-1111-111111111111', true),
  ('p2222222-2222-2222-2222-222222222222', 'Disney+', 'disney-plus', '{"en": "Stream Disney, Pixar, Marvel, Star Wars & more", "nl": "Stream Disney, Pixar, Marvel, Star Wars en meer"}', 'https://logo.clearbit.com/disneyplus.com', 'https://www.disneyplus.com', '11111111-1111-1111-1111-111111111111', true),
  ('p3333333-3333-3333-3333-333333333333', 'Amazon Prime Video', 'amazon-prime-video', '{"en": "Watch movies and TV shows", "nl": "Bekijk films en tv-programmas"}', 'https://logo.clearbit.com/primevideo.com', 'https://www.primevideo.com', '11111111-1111-1111-1111-111111111111', true),

  -- Music Streaming
  ('p4444444-4444-4444-4444-444444444444', 'Spotify', 'spotify', '{"en": "Music for everyone", "nl": "Muziek voor iedereen"}', 'https://logo.clearbit.com/spotify.com', 'https://www.spotify.com', '44444444-4444-4444-4444-444444444444', true),
  ('p5555555-5555-5555-5555-555555555555', 'Apple Music', 'apple-music', '{"en": "70 million songs ad-free", "nl": "70 miljoen nummers zonder advertenties"}', 'https://logo.clearbit.com/apple.com/music', 'https://www.apple.com/music', '44444444-4444-4444-4444-444444444444', true),

  -- Software & SaaS
  ('p6666666-6666-6666-6666-666666666666', 'Adobe Creative Cloud', 'adobe-creative-cloud', '{"en": "Creative tools for everyone", "nl": "Creatieve tools voor iedereen"}', 'https://logo.clearbit.com/adobe.com', 'https://www.adobe.com', '22222222-2222-2222-2222-222222222222', true),
  ('p7777777-7777-7777-7777-777777777777', 'Microsoft 365', 'microsoft-365', '{"en": "Office apps and cloud services", "nl": "Office-apps en cloudservices"}', 'https://logo.clearbit.com/microsoft.com', 'https://www.microsoft.com/microsoft-365', '22222222-2222-2222-2222-222222222222', true),
  ('p8888888-8888-8888-8888-888888888888', 'GitHub', 'github', '{"en": "Code hosting platform", "nl": "Code hosting platform"}', 'https://logo.clearbit.com/github.com', 'https://github.com', '22222222-2222-2222-2222-222222222222', true),

  -- Cloud Storage
  ('p9999999-9999-9999-9999-999999999999', 'Dropbox', 'dropbox', '{"en": "Keep your files safe and synced", "nl": "Houd je bestanden veilig en gesynchroniseerd"}', 'https://logo.clearbit.com/dropbox.com', 'https://www.dropbox.com', '33333333-3333-3333-3333-333333333333', true),
  ('paaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Google Drive', 'google-drive', '{"en": "Cloud storage and file backup", "nl": "Cloudopslag en bestandsback-up"}', 'https://logo.clearbit.com/google.com/drive', 'https://www.google.com/drive', '33333333-3333-3333-3333-333333333333', true)
ON CONFLICT (id) DO NOTHING;

-- Insert Plans for Netflix
INSERT INTO public.plans (id, product_id, name, description, features) VALUES
  ('plan1111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'Mobile', 'Watch on phone or tablet', '["480p", "1 device", "Mobile only"]'),
  ('plan2222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111', 'Basic', 'Good video quality', '["720p", "1 device", "Watch on any device"]'),
  ('plan3333-3333-3333-3333-333333333333', 'p1111111-1111-1111-1111-111111111111', 'Standard', 'Great video quality', '["1080p", "2 devices", "Download on 2 devices"]'),
  ('plan4444-4444-4444-4444-444444444444', 'p1111111-1111-1111-1111-111111111111', 'Premium', 'Our best video quality', '["4K+HDR", "4 devices", "Download on 4 devices"]')
ON CONFLICT (id) DO NOTHING;

-- Insert Plans for Spotify
INSERT INTO public.plans (id, product_id, name, description, features) VALUES
  ('plan5555-5555-5555-5555-555555555555', 'p4444444-4444-4444-4444-444444444444', 'Free', 'Listen with ads', '["Ad-supported", "Shuffle play", "Basic audio quality"]'),
  ('plan6666-6666-6666-6666-666666666666', 'p4444444-4444-4444-4444-444444444444', 'Premium', 'Ad-free music', '["No ads", "Offline listening", "High audio quality"]'),
  ('plan7777-7777-7777-7777-777777777777', 'p4444444-4444-4444-4444-444444444444', 'Duo', 'For 2 people living together', '["2 Premium accounts", "No ads", "Duo Mix playlist"]'),
  ('plan8888-8888-8888-8888-888888888888', 'p4444444-4444-4444-4444-444444444444', 'Family', 'For up to 6 people', '["6 Premium accounts", "No ads", "Family Mix playlist"]')
ON CONFLICT (id) DO NOTHING;

-- Insert Plans for Adobe Creative Cloud
INSERT INTO public.plans (id, product_id, name, description, features) VALUES
  ('plan9999-9999-9999-9999-999999999999', 'p6666666-6666-6666-6666-666666666666', 'Photography', 'Photoshop and Lightroom', '["Photoshop", "Lightroom", "20GB cloud storage"]'),
  ('planaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'p6666666-6666-6666-6666-666666666666', 'Single App', 'One Adobe app of your choice', '["1 Adobe app", "100GB cloud storage", "Adobe Fonts"]'),
  ('planbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'p6666666-6666-6666-6666-666666666666', 'All Apps', 'All Adobe creative apps', '["20+ Adobe apps", "100GB cloud storage", "Adobe Fonts"]')
ON CONFLICT (id) DO NOTHING;

-- Insert Prices for Netflix Plans
INSERT INTO public.prices (plan_id, amount, currency, interval, is_active) VALUES
  ('plan1111-1111-1111-1111-111111111111', 5.99, 'USD', 'monthly', true),
  ('plan2222-2222-2222-2222-222222222222', 9.99, 'USD', 'monthly', true),
  ('plan3333-3333-3333-3333-333333333333', 15.49, 'USD', 'monthly', true),
  ('plan4444-4444-4444-4444-444444444444', 19.99, 'USD', 'monthly', true),

  ('plan1111-1111-1111-1111-111111111111', 5.99, 'EUR', 'monthly', true),
  ('plan2222-2222-2222-2222-222222222222', 9.99, 'EUR', 'monthly', true),
  ('plan3333-3333-3333-3333-333333333333', 13.99, 'EUR', 'monthly', true),
  ('plan4444-4444-4444-4444-444444444444', 17.99, 'EUR', 'monthly', true)
ON CONFLICT DO NOTHING;

-- Insert Prices for Spotify Plans
INSERT INTO public.prices (plan_id, amount, currency, interval, is_active) VALUES
  ('plan5555-5555-5555-5555-555555555555', 0.00, 'USD', 'monthly', true),
  ('plan6666-6666-6666-6666-666666666666', 10.99, 'USD', 'monthly', true),
  ('plan7777-7777-7777-7777-777777777777', 14.99, 'USD', 'monthly', true),
  ('plan8888-8888-8888-8888-888888888888', 16.99, 'USD', 'monthly', true),

  ('plan5555-5555-5555-5555-555555555555', 0.00, 'EUR', 'monthly', true),
  ('plan6666-6666-6666-6666-666666666666', 10.99, 'EUR', 'monthly', true),
  ('plan7777-7777-7777-7777-777777777777', 14.99, 'EUR', 'monthly', true),
  ('plan8888-8888-8888-8888-888888888888', 16.99, 'EUR', 'monthly', true)
ON CONFLICT DO NOTHING;

-- Insert Prices for Adobe Creative Cloud Plans
INSERT INTO public.prices (plan_id, amount, currency, interval, is_active) VALUES
  ('plan9999-9999-9999-9999-999999999999', 9.99, 'USD', 'monthly', true),
  ('planaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 22.99, 'USD', 'monthly', true),
  ('planbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 54.99, 'USD', 'monthly', true),

  ('plan9999-9999-9999-9999-999999999999', 11.89, 'EUR', 'monthly', true),
  ('planaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 23.79, 'EUR', 'monthly', true),
  ('planbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 59.99, 'EUR', 'monthly', true),

  -- Yearly pricing with discount
  ('plan9999-9999-9999-9999-999999999999', 119.88, 'USD', 'yearly', true),
  ('planaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 263.88, 'USD', 'yearly', true),
  ('planbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 599.88, 'USD', 'yearly', true)
ON CONFLICT DO NOTHING;

-- Insert Default Settings
INSERT INTO public.settings (key, value, category, is_public) VALUES
  ('supported_locales', '["en", "nl", "fr", "de", "es", "it"]', 'localization', true),
  ('default_locale', '"en"', 'localization', true),
  ('supported_currencies', '["USD", "EUR", "GBP", "CAD", "AUD"]', 'pricing', true),
  ('default_currency', '"USD"', 'pricing', true),
  ('app_name', '"Subscription Manager Pro"', 'general', true),
  ('app_description', '"Manage all your subscriptions in one place"', 'general', true),
  ('enable_ai_insights', 'false', 'features', true),
  ('enable_payment_integration', 'false', 'features', false),
  ('enable_email_notifications', 'true', 'features', false),
  ('notification_days_before_renewal', '7', 'notifications', false),
  ('max_subscriptions_per_user', '100', 'limits', false)
ON CONFLICT (key) DO NOTHING;

-- Insert example price history (for demonstration)
INSERT INTO public.price_history (price_id, old_amount, new_amount, change_reason, effective_date)
SELECT
  id,
  amount - 1.00,
  amount,
  'Annual price adjustment',
  NOW() - INTERVAL '6 months'
FROM public.prices
WHERE plan_id IN (
  'plan3333-3333-3333-3333-333333333333',
  'plan4444-4444-4444-4444-444444444444'
)
AND currency = 'USD'
LIMIT 2
ON CONFLICT DO NOTHING;
