import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Megaphone,
  Calendar,
  Users,
  Bell,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
  MessageSquare,
  Pin,
  Globe,
  School,
  GraduationCap,
} from "lucide-react";

export default function Announcements() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for announcements
  const announcementStats = [
    {
      title: "Total Announcements",
      value: 156,
      change: "+12 this week",
      icon: Megaphone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Announcements",
      value: 23,
      change: "Currently visible",
      icon: Bell,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Scheduled Posts",
      value: 8,
      change: "Upcoming",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Reach",
      value: "2.3K",
      change: "Students & Parents",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "School Holiday - National Day",
      content:
        "School will remain closed on December 25th in observance of National Day. All classes and activities are suspended for the day.",
      type: "holiday",
      priority: "high",
      audience: "all",
      author: "Principal Office",
      createdAt: "2024-07-10T10:00:00Z",
      scheduledAt: "2024-07-10T10:00:00Z",
      status: "published",
      views: 1234,
      likes: 89,
      comments: 23,
      isPinned: true,
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      content:
        "Monthly parent-teacher meeting scheduled for July 20th from 2:00 PM to 5:00 PM. Please check the class schedule for your appointment time.",
      type: "meeting",
      priority: "medium",
      audience: "parents",
      author: "Academic Office",
      createdAt: "2024-07-09T14:30:00Z",
      scheduledAt: "2024-07-09T14:30:00Z",
      status: "published",
      views: 856,
      likes: 45,
      comments: 67,
      isPinned: false,
    },
    {
      id: 3,
      title: "Sports Day Registration Open",
      content:
        "Annual Sports Day is scheduled for August 15th. Registration for various events is now open. Students can register through their class teachers.",
      type: "event",
      priority: "medium",
      audience: "students",
      author: "Sports Department",
      createdAt: "2024-07-08T16:00:00Z",
      scheduledAt: "2024-07-12T09:00:00Z",
      status: "scheduled",
      views: 0,
      likes: 0,
      comments: 0,
      isPinned: false,
    },
    {
      id: 4,
      title: "Library Hours Extended",
      content:
        "Library hours have been extended during exam season. New timings: 7:00 AM to 8:00 PM on weekdays and 9:00 AM to 6:00 PM on weekends.",
      type: "information",
      priority: "low",
      audience: "all",
      author: "Library Department",
      createdAt: "2024-07-07T11:15:00Z",
      scheduledAt: "2024-07-07T11:15:00Z",
      status: "published",
      views: 567,
      likes: 34,
      comments: 12,
      isPinned: false,
    },
    {
      id: 5,
      title: "Fee Payment Reminder",
      content:
        "Monthly fee payment is due by July 15th. Please ensure timely payment to avoid late fees. Online payment options are available.",
      type: "reminder",
      priority: "high",
      audience: "parents",
      author: "Accounts Department",
      createdAt: "2024-07-06T09:00:00Z",
      scheduledAt: "2024-07-06T09:00:00Z",
      status: "published",
      views: 1456,
      likes: 23,
      comments: 89,
      isPinned: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-600 border-green-200">
            Published
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-600 border-blue-200">
            Scheduled
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-600 border-gray-200">
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-red-100 text-red-600 border-red-200">
            Archived
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-600 border-red-200">High</Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-600 border-green-200">
            Low
          </Badge>
        );
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "holiday":
        return <Calendar className="h-4 w-4" />;
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "event":
        return <Star className="h-4 w-4" />;
      case "information":
        return <Info className="h-4 w-4" />;
      case "reminder":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case "students":
        return <GraduationCap className="h-4 w-4" />;
      case "parents":
        return <Users className="h-4 w-4" />;
      case "teachers":
        return <School className="h-4 w-4" />;
      case "all":
        return <Globe className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return announcement.status === "published";
    if (activeTab === "scheduled") return announcement.status === "scheduled";
    if (activeTab === "draft") return announcement.status === "draft";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Announcements Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and track school announcements and communications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input placeholder="Enter announcement title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="Write your announcement content here..."
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="information">Information</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Audience</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Everyone</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="parents">Parents Only</SelectItem>
                        <SelectItem value="teachers">Teachers Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Publish Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Publish Time</label>
                    <Input type="time" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="pinned" />
                  <label htmlFor="pinned" className="text-sm font-medium">
                    Pin this announcement
                  </label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Save as Draft</Button>
                  <Button variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    Publish Now
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {announcementStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Announcements</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex items-center space-x-2">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="audience">Audience</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <Card
                key={announcement.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {announcement.isPinned && (
                          <Pin className="h-4 w-4 text-orange-500" />
                        )}
                        <div className="flex items-center gap-2">
                          {getTypeIcon(announcement.type)}
                          <h3 className="font-semibold text-lg">
                            {announcement.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {getPriorityBadge(announcement.priority)}
                          {getStatusBadge(announcement.status)}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {announcement.content}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getAudienceIcon(announcement.audience)}
                            <span className="capitalize">
                              {announcement.audience}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(announcement.createdAt)}</span>
                          </div>
                          <div>By {announcement.author}</div>
                        </div>

                        {announcement.status === "published" && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{announcement.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              <span>{announcement.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{announcement.comments}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
