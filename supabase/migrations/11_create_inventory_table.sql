-- Create inventory_categories table
CREATE TABLE IF NOT EXISTS inventory_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    school_id UUID, -- Will be linked to schools table when created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES inventory_categories(id) ON DELETE SET NULL,
    brand VARCHAR(255),
    model VARCHAR(255),
    serial_number VARCHAR(255) UNIQUE,
    barcode VARCHAR(255),
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    current_value DECIMAL(10,2),
    supplier VARCHAR(255),
    warranty_expiry DATE,
    location VARCHAR(255), -- Where the item is located
    condition VARCHAR(50) DEFAULT 'good', -- 'excellent', 'good', 'fair', 'poor', 'damaged'
    status VARCHAR(50) DEFAULT 'available', -- 'available', 'in_use', 'maintenance', 'disposed'
    quantity INTEGER DEFAULT 1,
    min_quantity INTEGER DEFAULT 0, -- For low stock alerts
    assigned_to VARCHAR(255), -- Who is using this item
    maintenance_schedule VARCHAR(255), -- Maintenance frequency
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    notes TEXT,
    school_id UUID, -- Will be linked to schools table when created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create inventory_movements table for tracking item history
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL, -- 'purchase', 'disposal', 'transfer', 'maintenance', 'assignment'
    from_location VARCHAR(255),
    to_location VARCHAR(255),
    assigned_from VARCHAR(255),
    assigned_to VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    reason TEXT,
    movement_date DATE DEFAULT CURRENT_DATE,
    recorded_by UUID REFERENCES auth.users(id),
    school_id UUID, -- Will be linked to schools table when created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_inventory_categories_school_id ON inventory_categories(school_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category_id ON inventory(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_school_id ON inventory(school_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_condition ON inventory(condition);
CREATE INDEX IF NOT EXISTS idx_inventory_serial_number ON inventory(serial_number);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_inventory_id ON inventory_movements(inventory_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_school_id ON inventory_movements(school_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_date ON inventory_movements(movement_date);

-- Enable RLS
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for inventory_categories
CREATE POLICY "Users can view inventory categories for their school" ON inventory_categories
    FOR SELECT USING (true); -- Will add proper school filtering later

CREATE POLICY "Admins can manage inventory categories" ON inventory_categories
    FOR ALL USING (true); -- Will add proper role checking later

-- Create RLS policies for inventory
CREATE POLICY "Users can view inventory for their school" ON inventory
    FOR SELECT USING (true); -- Will add proper school filtering later

CREATE POLICY "Admins can manage inventory" ON inventory
    FOR ALL USING (true); -- Will add proper role checking later

-- Create RLS policies for inventory_movements
CREATE POLICY "Users can view inventory movements for their school" ON inventory_movements
    FOR SELECT USING (true); -- Will add proper school filtering later

CREATE POLICY "Admins can manage inventory movements" ON inventory_movements
    FOR ALL USING (true); -- Will add proper role checking later

-- Create updated_at triggers
CREATE TRIGGER update_inventory_categories_updated_at BEFORE UPDATE ON inventory_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO inventory_categories (name, description) VALUES
    ('Furniture', 'Desks, chairs, tables, cabinets'),
    ('Electronics', 'Computers, projectors, tablets, smart boards'),
    ('Laboratory Equipment', 'Science lab instruments and tools'),
    ('Sports Equipment', 'Balls, nets, mats, outdoor equipment'),
    ('Books & Library', 'Textbooks, reference books, library materials'),
    ('Stationery', 'Pens, papers, markers, office supplies'),
    ('Maintenance Tools', 'Cleaning equipment, repair tools'),
    ('Safety Equipment', 'Fire extinguishers, first aid kits')
ON CONFLICT DO NOTHING;
