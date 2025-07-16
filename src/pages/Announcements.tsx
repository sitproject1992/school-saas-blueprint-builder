import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnnouncementForm from "@/components/communication/AnnouncementForm";
import { Megaphone } from "lucide-react";

export default function Announcements() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Megaphone className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Announcements</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <AnnouncementForm />
        </CardContent>
      </Card>
    </div>
  );
}
