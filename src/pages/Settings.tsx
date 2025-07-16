import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolProfileForm } from "@/components/settings/SchoolProfileForm";
import { AcademicYear } from "@/components/settings/AcademicYear";
import { GradingSystem } from "@/components/settings/GradingSystem";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { UserManagement } from "@/components/settings/UserManagement";
import { SystemConfiguration } from "@/components/settings/SystemConfiguration";
import {
  Settings as SettingsIcon,
  School,
  Users,
  Bell,
  Cog,
  BookOpen,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="school" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="school" className="flex items-center space-x-2">
            <School className="h-4 w-4" />
            <span>School</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Academic</span>
          </TabsTrigger>
          <TabsTrigger value="grading" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Grading</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Cog className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <SchoolProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <AcademicYear />
        </TabsContent>

        <TabsContent value="grading">
          <GradingSystem />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="system">
          <SystemConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
