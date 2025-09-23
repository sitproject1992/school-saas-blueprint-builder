-- Create fee_structures table
CREATE TABLE public.fee_structures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  frequency TEXT NOT NULL, -- monthly, quarterly, yearly, one-time
  class_id UUID NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  due_day INTEGER DEFAULT 1, -- day of month when fee is due
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fee_payments table
CREATE TABLE public.fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  fee_structure_id UUID NOT NULL,
  amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, overdue, waived
  payment_method TEXT, -- cash, card, bank_transfer, cheque
  transaction_id TEXT,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for fee_structures
CREATE POLICY "Allow all access to fee structures" 
ON public.fee_structures 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for fee_payments
CREATE POLICY "Allow all access to fee payments" 
ON public.fee_payments 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_fee_structures_updated_at
    BEFORE UPDATE ON public.fee_structures
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_payments_updated_at
    BEFORE UPDATE ON public.fee_payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();