
-- Placio SaaS Platform Database Schema

-- 0. Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    subscription_plan VARCHAR(50) DEFAULT 'FREE' CHECK (subscription_plan IN ('FREE', 'MONTHLY', 'YEARLY')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    company_id UUID REFERENCES companies(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sessions Table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    specialist_id UUID NOT NULL REFERENCES users(id),
    client_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'InProgress', 'Completed', 'Cancelled')),
    notes TEXT,
    price NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Financial Records Table (New Model)
CREATE TABLE financial_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    description TEXT,
    income NUMERIC(12, 2) NOT NULL DEFAULT 0,
    expenses NUMERIC(12, 2) NOT NULL DEFAULT 0,
    -- Automatic calculation of net profit for data integrity
    net_profit NUMERIC(12, 2) GENERATED ALWAYS AS (income - expenses) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Constraints & Indexes
CREATE UNIQUE INDEX idx_specialist_time_prevent_overlap ON sessions (specialist_id, session_date, start_time);
CREATE INDEX idx_sessions_company ON sessions(company_id);
CREATE INDEX idx_financial_company ON financial_records(company_id);
CREATE INDEX idx_financial_session ON financial_records(session_id);
