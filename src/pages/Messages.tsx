import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Send,
  Search,
  PlusCircle,
  Users,
  User,
  Clock,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Filter,
} from "lucide-react";

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState("conv1");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for conversations
  const conversations = [
    {
      id: "conv1",
      participant: "Sarah Johnson (Parent)",
      avatar: "/placeholder-parent.jpg",
      lastMessage: "Thank you for the update on Emma's progress!",
      timestamp: "2 hours ago",
      unread: 0,
      type: "parent",
      status: "online",
    },
    {
      id: "conv2",
      participant: "Mr. Davis (Teacher)",
      avatar: "/placeholder-teacher.jpg",
      lastMessage: "Can we schedule a meeting to discuss the math curriculum?",
      timestamp: "4 hours ago",
      unread: 2,
      type: "teacher",
      status: "away",
    },
    {
      id: "conv3",
      participant: "Principal Wilson",
      avatar: "/placeholder-admin.jpg",
      lastMessage: "Please review the new policy documents",
      timestamp: "1 day ago",
      unread: 1,
      type: "admin",
      status: "offline",
    },
    {
      id: "conv4",
      participant: "Maria Garcia (Parent)",
      avatar: "/placeholder-parent.jpg",
      lastMessage: "When is the next parent-teacher conference?",
      timestamp: "2 days ago",
      unread: 0,
      type: "parent",
      status: "online",
    },
    {
      id: "conv5",
      participant: "Ms. Chen (Teacher)",
      avatar: "/placeholder-teacher.jpg",
      lastMessage: "The science project presentations are next week",
      timestamp: "3 days ago",
      unread: 0,
      type: "teacher",
      status: "online",
    },
  ];

  // Mock data for messages
  const messages = {
    conv1: [
      {
        id: "msg1",
        sender: "Sarah Johnson",
        content: "Hi! I wanted to ask about Emma's recent math test results.",
        timestamp: "Yesterday 2:30 PM",
        sent: false,
        avatar: "/placeholder-parent.jpg",
      },
      {
        id: "msg2",
        sender: "You",
        content:
          "Hello! Emma did very well on her math test. She scored 92% and showed excellent understanding of fractions.",
        timestamp: "Yesterday 3:15 PM",
        sent: true,
        avatar: "/placeholder-teacher.jpg",
      },
      {
        id: "msg3",
        sender: "Sarah Johnson",
        content:
          "That's wonderful! She's been practicing at home. Are there any areas where she could improve?",
        timestamp: "Yesterday 3:20 PM",
        sent: false,
        avatar: "/placeholder-parent.jpg",
      },
      {
        id: "msg4",
        sender: "You",
        content:
          "She's doing great overall. I'd suggest continuing to practice word problems as that's where most students can improve. I'll send some practice sheets home.",
        timestamp: "Today 10:30 AM",
        sent: true,
        avatar: "/placeholder-teacher.jpg",
      },
      {
        id: "msg5",
        sender: "Sarah Johnson",
        content: "Thank you for the update on Emma's progress!",
        timestamp: "2 hours ago",
        sent: false,
        avatar: "/placeholder-parent.jpg",
      },
    ],
    conv2: [
      {
        id: "msg6",
        sender: "Mr. Davis",
        content:
          "Good morning! I've been reviewing the math curriculum and have some ideas for improvements.",
        timestamp: "Yesterday 9:00 AM",
        sent: false,
        avatar: "/placeholder-teacher.jpg",
      },
      {
        id: "msg7",
        sender: "You",
        content:
          "That sounds great! I'd love to hear your ideas. When would be a good time to discuss?",
        timestamp: "Yesterday 11:30 AM",
        sent: true,
        avatar: "/placeholder-teacher.jpg",
      },
      {
        id: "msg8",
        sender: "Mr. Davis",
        content: "Can we schedule a meeting to discuss the math curriculum?",
        timestamp: "4 hours ago",
        sent: false,
        avatar: "/placeholder-teacher.jpg",
      },
    ],
  };

  const currentMessages = messages[selectedConversation] || [];
  const currentConversation = conversations.find(
    (conv) => conv.id === selectedConversation,
  );

  const quickReplies = [
    "Thank you for the update!",
    "I'll get back to you shortly.",
    "Let's schedule a meeting.",
    "Could you provide more details?",
    "That sounds good to me.",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "parent":
        return "border-l-blue-500";
      case "teacher":
        return "border-l-green-500";
      case "admin":
        return "border-l-purple-500";
      default:
        return "border-l-gray-500";
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessageText(reply);
  };

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Communicate with parents, teachers, and administrators
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button size="sm" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1 p-4">
                {conversations
                  .filter(
                    (conv) =>
                      conv.participant
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      conv.lastMessage
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  )
                  .map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-l-4 ${getTypeColor(conversation.type)} ${
                        selectedConversation === conversation.id
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-50 border-transparent"
                      }`}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>
                            {conversation.participant
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">
                            {conversation.participant}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>

                      {conversation.unread > 0 && (
                        <Badge variant="default" className="ml-2">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          {currentConversation ? (
            <>
              {/* Message Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={currentConversation.avatar} />
                        <AvatarFallback>
                          {currentConversation.participant
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(currentConversation.status)}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {currentConversation.participant}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {currentConversation.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.sent ? "justify-end" : "justify-start"}`}
                      >
                        {!message.sent && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.avatar} />
                            <AvatarFallback className="text-xs">
                              {message.sender
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`max-w-[70%] ${message.sent ? "text-right" : "text-left"}`}
                        >
                          <div
                            className={`inline-block p-3 rounded-lg ${
                              message.sent
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {message.timestamp}
                          </p>
                        </div>

                        {message.sent && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.avatar} />
                            <AvatarFallback className="text-xs">
                              You
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Quick Replies */}
                <div className="border-t p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {quickReplies.map((reply, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickReply(reply)}
                        className="text-xs"
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="min-h-[40px] max-h-[100px] resize-none"
                        rows={1}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a conversation to start messaging
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
