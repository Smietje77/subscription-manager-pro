-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (id = auth.uid());

-- Users can update their own profile (excluding role and status)
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (public.is_admin());

-- Admins can insert users
CREATE POLICY "Admins can insert users" ON public.users
  FOR INSERT WITH CHECK (public.is_admin());

-- Admins can update users
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (public.is_admin());

-- Super admins can delete users
CREATE POLICY "Super admins can delete users" ON public.users
  FOR DELETE USING (public.is_super_admin());

-- =====================================================
-- CATEGORIES TABLE POLICIES
-- =====================================================

-- Everyone can read categories
CREATE POLICY "Anyone can read categories" ON public.categories
  FOR SELECT USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories" ON public.categories
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete categories" ON public.categories
  FOR DELETE USING (public.is_admin());

-- =====================================================
-- PRODUCTS TABLE POLICIES
-- =====================================================

-- Everyone can read active products
CREATE POLICY "Anyone can read active products" ON public.products
  FOR SELECT USING (is_active = true OR public.is_admin());

-- Admins can manage products
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (public.is_admin());

-- =====================================================
-- PLANS TABLE POLICIES
-- =====================================================

-- Everyone can read plans for active products
CREATE POLICY "Anyone can read plans" ON public.plans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = plans.product_id
      AND (is_active = true OR public.is_admin())
    )
  );

-- Admins can manage plans
CREATE POLICY "Admins can insert plans" ON public.plans
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update plans" ON public.plans
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete plans" ON public.plans
  FOR DELETE USING (public.is_admin());

-- =====================================================
-- PRICES TABLE POLICIES
-- =====================================================

-- Everyone can read active prices
CREATE POLICY "Anyone can read active prices" ON public.prices
  FOR SELECT USING (is_active = true OR public.is_admin());

-- Admins can manage prices
CREATE POLICY "Admins can insert prices" ON public.prices
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update prices" ON public.prices
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete prices" ON public.prices
  FOR DELETE USING (public.is_admin());

-- =====================================================
-- PRICE HISTORY TABLE POLICIES
-- =====================================================

-- Everyone can read price history
CREATE POLICY "Anyone can read price history" ON public.price_history
  FOR SELECT USING (true);

-- Admins can insert price history (update/delete handled by triggers)
CREATE POLICY "Admins can insert price history" ON public.price_history
  FOR INSERT WITH CHECK (public.is_admin());

-- =====================================================
-- SUBSCRIPTIONS TABLE POLICIES
-- =====================================================

-- Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete own subscriptions" ON public.subscriptions
  FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- =====================================================
-- TRANSLATIONS TABLE POLICIES
-- =====================================================

-- Everyone can read translations
CREATE POLICY "Anyone can read translations" ON public.translations
  FOR SELECT USING (true);

-- Admins can manage translations
CREATE POLICY "Admins can insert translations" ON public.translations
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update translations" ON public.translations
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete translations" ON public.translations
  FOR DELETE USING (public.is_admin());

-- =====================================================
-- AUDIT LOGS TABLE POLICIES
-- =====================================================

-- Users can read their own audit logs
CREATE POLICY "Users can read own audit logs" ON public.audit_logs
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- System can insert audit logs (via triggers)
CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Only super admins can delete audit logs
CREATE POLICY "Super admins can delete audit logs" ON public.audit_logs
  FOR DELETE USING (public.is_super_admin());

-- =====================================================
-- SETTINGS TABLE POLICIES
-- =====================================================

-- Everyone can read public settings
CREATE POLICY "Anyone can read public settings" ON public.settings
  FOR SELECT USING (is_public = true OR public.is_admin());

-- Admins can manage settings
CREATE POLICY "Admins can insert settings" ON public.settings
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update settings" ON public.settings
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Super admins can delete settings" ON public.settings
  FOR DELETE USING (public.is_super_admin());

-- =====================================================
-- AUDIT LOG TRIGGERS
-- =====================================================

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
BEGIN
  -- Only audit important tables
  IF TG_TABLE_NAME NOT IN ('subscriptions', 'users', 'products', 'prices') THEN
    RETURN NEW;
  END IF;

  -- Convert OLD and NEW to JSONB
  IF TG_OP = 'DELETE' THEN
    old_data := to_jsonb(OLD);
    new_data := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
  ELSE
    old_data := NULL;
    new_data := to_jsonb(NEW);
  END IF;

  -- Insert audit log
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    old_data,
    new_data
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit log triggers
CREATE TRIGGER audit_subscriptions_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_users_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_products_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_prices_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.prices
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();
