import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SchoolProfileForm from '@/components/settings/SchoolProfileForm';
import UserManagement from '@/components/settings/UserManagement';
import AcademicYear from '@/components/settings/AcademicYear';
import GradingSystem from '@/components/settings/GradingSystem';
import NotificationSettings from '@/components/settings/NotificationSettings';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Tabs defaultValue="school-profile">
        <TabsList>
          <TabsTrigger value="school-profile">School Profile</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="academic-year">Academic Year</TabsTrigger>
          <TabsTrigger value="grading-system">Grading System</TabsTrigger>
          <TabsTrigger value="notification-settings">Notification Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="school-profile">
          <SchoolProfileForm />
        </TabsContent>
        <TabsContent value="user-management">
          <UserManagement />
        </TabsContent>
        <TabsContent value="academic-year">
          <AcademicYear />
        </TabsContent>
        <TabsContent value="grading-system">
          <GradingSystem />
        </TabsContent>
        <TabsContent value="notification-settings">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
