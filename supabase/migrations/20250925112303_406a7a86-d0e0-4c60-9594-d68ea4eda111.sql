-- Create grading_systems table
CREATE TABLE public.grading_systems (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL,
    name TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    scale JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification_settings table
CREATE TABLE public.notification_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    school_id UUID NOT NULL,
    email_notifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    in_app_notifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parent_students table for parent-student relationships
CREATE TABLE public.parent_students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID NOT NULL,
    student_id UUID NOT NULL,
    relationship TEXT NOT NULL DEFAULT 'parent',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(parent_id, student_id)
);

-- Enable RLS
ALTER TABLE public.grading_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow all access to grading systems" ON public.grading_systems FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to notification settings" ON public.notification_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to parent students" ON public.parent_students FOR ALL USING (true) WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_grading_systems_updated_at
    BEFORE UPDATE ON public.grading_systems
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
    BEFORE UPDATE ON public.notification_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add max_marks column to exams table for exam results
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS max_marks INTEGER DEFAULT 100;