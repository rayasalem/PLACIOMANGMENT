
-- Placio SaaS Platform Mock Seed Data

-- 1. Roles
INSERT INTO roles (name, description) VALUES 
('ADMIN', 'Platform owners and moderators'),
('USER', 'Merchants and store owners');

-- 2. Users (Passwords are hashed in real life)
INSERT INTO users (id, email, password_hash, role_id, tenant_id, status) VALUES 
('user-id-001', 'admin@placio.com', 'hashed_admin_123', 1, 'GLOBAL', 'active'),
('user-id-002', 'omar@gadgetry.com', 'hashed_pass_001', 2, 'T-GADGET', 'active'),
('user-id-003', 'sara@velvet.com', 'hashed_pass_002', 2, 'T-VELVET', 'active'),
('user-id-004', 'nour@artisan.com', 'hashed_pass_003', 2, 'T-ARTISAN', 'suspended');

-- 3. Profiles
INSERT INTO profiles (user_id, full_name, store_name, store_description, bio, subscription_tier) VALUES 
('user-id-002', 'Omar Tech', 'Gadgetry Hub', 'Electronics for the future', 'Premium tech gadgets...', 'PRO'),
('user-id-003', 'Sara Styles', 'Velvet Threads', 'Luxury Fashion Shop', 'Luxury fashion and sustainable...', 'FREE'),
('user-id-004', 'Nour Bites', 'Artisan Bites', 'Gourmet Snacks', 'Handcrafted organic snacks...', 'FREE');

-- 4. Products (Samples)
INSERT INTO products (user_id, tenant_id, name, price, category, status) VALUES 
('user-id-002', 'T-GADGET', 'UltraFlow Pro Laptop', 1299.00, 'Electronics', 'active'),
('user-id-002', 'T-GADGET', 'SonicBuds Wireless', 199.00, 'Audio', 'active'),
('user-id-003', 'T-VELVET', 'Silk Evening Scarf', 85.00, 'Fashion', 'active'),
('user-id-004', 'T-ARTISAN', 'Organic Mountain Honey', 35.00, 'Food', 'active');
