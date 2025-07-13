import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClasses } from '@/hooks/useClasses';
import { Tables } from '@/integrations/supabase/types';

type Teacher = Tables<'teachers'> & {
  profile: Tables<'profiles'>;
  class?: Tables<'classes'>;
};

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TeacherForm({ teacher, onSubmit, onCancel, isLoading }: TeacherFormProps) {
  const { classes } = useClasses();
  
  const [formData, setFormData] = useState({
    // Profile data
    first_name: teacher?.profile?.first_name || '',
    last_name: teacher?.profile?.last_name || '',
    email: teacher?.profile?.email || '',
    phone: teacher?.profile?.phone || '',
    address: teacher?.profile?.address || '',
    date_of_birth: teacher?.profile?.date_of_birth || '',
    
    // Teacher data
    qualification: teacher?.qualification || '',
    experience_years: teacher?.experience_years || 0,
    joining_date: teacher?.joining_date || '',
    salary: teacher?.salary || '',
    class_id: teacher?.class_id || '',
    is_class_teacher: teacher?.is_class_teacher || false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      profile: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.date_of_birth,
      },
      qualification: formData.qualification,
      experience_years: formData.experience_years,
      joining_date: formData.joining_date,
      salary: formData.salary ? parseFloat(formData.salary) : null,
      class_id: formData.class_id || null,
      is_class_teacher: formData.is_class_teacher,
    };

    if (teacher) {
      onSubmit({ id: teacher.id, ...submitData });
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{teacher ? 'Edit Teacher' : 'Add New Teacher'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="joining_date">Joining Date</Label>
                <Input
                  id="joining_date"
                  type="date"
                  value={formData.joining_date}
                  onChange={(e) => handleChange('joining_date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Professional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleChange('qualification', e.target.value)}
                  placeholder="e.g., M.Ed, B.Ed, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="experience_years">Experience (Years)</Label>
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  value={formData.experience_years}
                  onChange={(e) => handleChange('experience_years', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salary}
                  onChange={(e) => handleChange('salary', e.target.value)}
                  placeholder="Monthly salary"
                />
              </div>
              
              <div>
                <Label htmlFor="class_id">Assigned Class</Label>
                <Select
                  value={formData.class_id}
                  onValueChange={(value) => handleChange('class_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No class assigned</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} {cls.section && `- ${cls.section}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_class_teacher"
                checked={formData.is_class_teacher}
                onCheckedChange={(checked) => handleChange('is_class_teacher', checked)}
              />
              <Label htmlFor="is_class_teacher">Class Teacher</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : teacher ? 'Update Teacher' : 'Create Teacher'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
