import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserForm from "@/components/settings/UserForm";
import { Users as UsersIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Users() {
  const { user } = useAuth();

  if (!user?.profile?.school_id) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>School ID not found. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <UsersIcon className="h-8 w-8" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm 
            schoolId={user.profile.school_id}
            onSuccess={() => console.log("User created successfully")}
            onCancel={() => console.log("User creation cancelled")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
