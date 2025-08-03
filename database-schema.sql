-- Create quote_requests table
CREATE TABLE quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  vehicle_make VARCHAR(100) NOT NULL,
  vehicle_model VARCHAR(100) NOT NULL,
  vehicle_year VARCHAR(4) NOT NULL,
  transport_type VARCHAR(50) NOT NULL,
  transport_details TEXT NOT NULL,
  urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('normal', 'urgent', 'emergency')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'completed', 'cancelled')),
  quote_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultations table
CREATE TABLE consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  vehicle_make VARCHAR(100) NOT NULL,
  vehicle_model VARCHAR(100) NOT NULL,
  vehicle_year VARCHAR(4) NOT NULL,
  issue_type VARCHAR(100) NOT NULL,
  issue_description TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(50) NOT NULL,
  emergency_service BOOLEAN DEFAULT FALSE,
  on_site_service BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')),
  mechanic_assigned VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_quote_requests_status ON quote_requests(status);
CREATE INDEX idx_quote_requests_created_at ON quote_requests(created_at);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_created_at ON consultations(created_at);
CREATE INDEX idx_consultations_emergency ON consultations(emergency_service);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_quote_requests_updated_at 
    BEFORE UPDATE ON quote_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at 
    BEFORE UPDATE ON consultations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access (you can modify these for admin-only access)
CREATE POLICY "Allow public read access" ON quote_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON quote_requests FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON consultations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON consultations FOR UPDATE USING (true); 