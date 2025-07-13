-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create roles table
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  fee_structure_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  school_id UUID NOT NULL
);

-- Create student_fee_structures table
CREATE TABLE public.student_fee_structures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  fee_structure_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, fee_structure_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fee_structures ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "School scoped access" ON public.roles
FOR ALL USING (true);

CREATE POLICY "School scoped access" ON public.user_roles
FOR ALL USING (true);

CREATE POLICY "School scoped access" ON public.invoices
FOR ALL USING ((
  EXISTS (
    SELECT 1 FROM students s 
    WHERE s.id = invoices.student_id 
    AND s.school_id = get_user_school_id()
  )
) OR get_user_role() = 'super_admin');

CREATE POLICY "School scoped access" ON public.student_fee_structures
FOR ALL USING ((
  EXISTS (
    SELECT 1 FROM students s 
    WHERE s.id = student_fee_structures.student_id 
    AND s.school_id = get_user_school_id()
  )
) OR get_user_role() = 'super_admin');

-- Insert default roles
INSERT INTO public.roles (name, description) VALUES
('super_admin', 'Super Administrator'),
('school_admin', 'School Administrator'),
('teacher', 'Teacher'),
('student', 'Student'),
('parent', 'Parent'),
('accountant', 'Accountant'),
('inventory_manager', 'Inventory Manager');

-- Add foreign key constraints
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_role_id_fkey 
FOREIGN KEY (role_id) REFERENCES public.roles(id);

ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.students(id);

ALTER TABLE public.invoices 
ADD CONSTRAINT invoices_fee_structure_id_fkey 
FOREIGN KEY (fee_structure_id) REFERENCES public.fee_structures(id);

ALTER TABLE public.student_fee_structures 
ADD CONSTRAINT student_fee_structures_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.students(id);

ALTER TABLE public.student_fee_structures 
ADD CONSTRAINT student_fee_structures_fee_structure_id_fkey 
FOREIGN KEY (fee_structure_id) REFERENCES public.fee_structures(id);