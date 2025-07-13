import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Send, 
  Search,
  Plus,
  Users,
  Bell,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  User,
  Building2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_id: string;
  receiver_id?: string;
  content: string;
  message_type: 'direct' | 'announcement' | 'group';
  is_read: boolean;
  created_at: string;
  sender?: {
    first_name: string;
    last_name: string;
    role: string;
  };
  receiver?: {
    first_name: string;
    last_name: string;
    role: string;
  };
}

interface Conversation {
  id: string;
  participant_ids: string[];
  last_message?: Message;
  unread_count: number;
  participants?: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
  }[];
}

export default function Messages() {
  const { schoolId, isSchoolAdmin, isTeacher, isStudent, isParent } = useTenant();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations", schoolId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles(first_name, last_name, role),
          receiver:profiles!messages_receiver_id_fkey(first_name, last_name, role)
        `)
        .eq("school_id", schoolId)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      
      // Group messages by conversation
      const conversationMap = new Map<string, Conversation>();
      
      (data || []).forEach((message: Message) => {
        const otherUserId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
        if (!otherUserId) return;
        
        const conversationId = [user?.id, otherUserId].sort().join('-');
        
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            participant_ids: [user?.id, otherUserId],
            last_message: message,
            unread_count: message.receiver_id === user?.id && !message.is_read ? 1 : 0,
            participants: [
              message.sender_id === user?.id ? message.sender : message.receiver,
              message.sender_id === user?.id ? message.receiver : message.sender
            ].filter(Boolean)
          });
        } else {
          const conversation = conversationMap.get(conversationId)!;
          if (message.receiver_id === user?.id && !message.is_read) {
            conversation.unread_count++;
          }
          if (!conversation.last_message || new Date(message.created_at) > new Date(conversation.last_message.created_at)) {
            conversation.last_message = message;
          }
        }
      });

      return Array.from(conversationMap.values());
    },
    enabled: !!schoolId && !!user?.id,
  });

  // Fetch messages for selected conversation
  const { data: messages } = useQuery({
    queryKey: ["messages", selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];
      
      const [user1, user2] = selectedConversation.split('-');
      
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles(first_name, last_name, role),
          receiver:profiles!messages_receiver_id_fkey(first_name, last_name, role)
        `)
        .or(`and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);
      return data as Message[];
    },
    enabled: !!selectedConversation,
  });

  // Fetch announcements
  const { data: announcements } = useQuery({
    queryKey: ["announcements", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select(`
          *,
          created_by:profiles(first_name, last_name)
        `)
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!schoolId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: {
      receiver_id: string;
      content: string;
      message_type: string;
    }) => {
      const { data, error } = await supabase
        .from("messages")
        .insert([{
          ...messageData,
          sender_id: user?.id,
          school_id: schoolId,
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", schoolId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["messages", selectedConversation] });
      setNewMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: {
      title: string;
      content: string;
      target_audience: string[];
    }) => {
      const { data, error } = await supabase
        .from("announcements")
        .insert([{
          ...announcementData,
          school_id: schoolId,
          created_by: user?.id,
          published_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements", schoolId] });
      toast({
        title: "Announcement created successfully",
        description: "The announcement has been published.",
      });
      setIsAnnouncementDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating announcement",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const [user1, user2] = selectedConversation.split('-');
    const receiverId = user1 === user?.id ? user2 : user1;
    
    sendMessageMutation.mutate({
      receiver_id: receiverId,
      content: newMessage.trim(),
      message_type: 'direct',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentConversation = () => {
    return conversations?.find(c => c.id === selectedConversation);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with teachers, parents, and students
          </p>
        </div>
        <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Send an announcement to the school community.
              </DialogDescription>
            </DialogHeader>
            <CreateAnnouncementForm onSubmit={createAnnouncementMutation.mutate} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Conversations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {isLoading ? (
                <div className="text-center py-8">Loading conversations...</div>
              ) : conversations?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No conversations yet.
                </div>
              ) : (
                conversations?.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                      selectedConversation === conversation.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div className="font-medium">
                            {conversation.participants?.[0]?.first_name} {conversation.participants?.[0]?.last_name}
                          </div>
                          {conversation.unread_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {conversation.last_message?.content}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {conversation.last_message?.created_at ? 
                            new Date(conversation.last_message.created_at).toLocaleDateString() : ''
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>
                    {getCurrentConversation()?.participants?.[0]?.first_name} {getCurrentConversation()?.participants?.[0]?.last_name}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Announcements */}
      <Tabs defaultValue="announcements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          <div className="grid gap-4">
            {announcements?.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-5 w-5" />
                        <span>{announcement.title}</span>
                        {announcement.is_urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        By {announcement.created_by?.first_name} {announcement.created_by?.last_name} • {new Date(announcement.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{announcement.content}</p>
                  <div className="mt-4 flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Target: {announcement.target_audience?.join(', ')}</span>
                    <span>Published: {new Date(announcement.published_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Settings</CardTitle>
              <CardDescription>
                Configure notification preferences and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Message settings coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Create Announcement Form Component
function CreateAnnouncementForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    target_audience: [] as string[],
    is_urgent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter announcement title"
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter announcement content"
          rows={4}
          required
        />
      </div>

      <div>
        <Label>Target Audience</Label>
        <div className="space-y-2 mt-2">
          {['students', 'teachers', 'parents', 'all'].map((audience) => (
            <label key={audience} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.target_audience.includes(audience)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      target_audience: [...formData.target_audience, audience]
                    });
                  } else {
                    setFormData({
                      ...formData,
                      target_audience: formData.target_audience.filter(a => a !== audience)
                    });
                  }
                }}
              />
              <span className="capitalize">{audience}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_urgent}
            onChange={(e) => setFormData({ ...formData, is_urgent: e.target.checked })}
          />
          <span>Mark as urgent</span>
        </label>
      </div>

      <DialogFooter>
        <Button type="submit">Create Announcement</Button>
      </DialogFooter>
    </form>
  );
}