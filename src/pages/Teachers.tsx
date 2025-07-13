import { useState } from 'react';
import { Plus, Edit, Trash2, Search, GraduationCap, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useTeachers } from '@/hooks/useTeachers';
import { TeacherForm } from '@/components/teachers/TeacherForm';
import { Tables } from '@/integrations/supabase/types';

type Teacher = Tables<'teachers'> & {
  profile: Tables<'profiles'>;
  class?: Tables<'classes'>;
};

export default function Teachers() {
  const { teachers, isLoading, createTeacher, updateTeacher, deleteTeacher, isCreating, isUpdating, isDeleting } = useTeachers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setIsFormOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsFormOpen(true);
  };

  const handleDeleteTeacher = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (selectedTeacher) {
      updateTeacher(data);
    } else {
      createTeacher(data);
    }
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setSelectedTeacher(null);
    setIsFormOpen(false);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      deleteTeacher(teacherToDelete.id);
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(salary);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading teachers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">Manage teaching staff and their information</p>
        </div>
        <Button onClick={handleAddTeacher} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teachers by name, email, or qualification..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(teacher.profile.first_name, teacher.profile.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {teacher.profile.first_name} {teacher.profile.last_name}
                    </CardTitle>
                    {teacher.is_class_teacher && (
                      <Badge variant="secondary" className="text-xs">
                        Class Teacher
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTeacher(teacher)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTeacher(teacher)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{teacher.profile.email}</span>
              </div>
              
              {teacher.profile.phone && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{teacher.profile.phone}</span>
                </div>
              )}

              {teacher.qualification && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>{teacher.qualification}</span>
                </div>
              )}

              {teacher.experience_years !== null && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{teacher.experience_years} years experience</span>
                </div>
              )}

              {teacher.class && (
                <div className="pt-2">
                  <Badge variant="outline">
                    {teacher.class.name} {teacher.class.section && `- ${teacher.class.section}`}
                  </Badge>
                </div>
              )}

              <div className="pt-2 text-sm">
                <span className="font-medium">Salary: </span>
                <span className="text-muted-foreground">{formatSalary(teacher.salary)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No teachers found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No teachers match your search criteria.' : 'Get started by adding your first teacher.'}
            </p>
            {!searchTerm && (
              <Button onClick={handleAddTeacher}>Add Teacher</Button>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </DialogTitle>
          </DialogHeader>
          <TeacherForm
            teacher={selectedTeacher}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {teacherToDelete?.profile.first_name} {teacherToDelete?.profile.last_name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
