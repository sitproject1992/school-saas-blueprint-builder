import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useSchool } from '@/hooks/useSchool';

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { school } = useSchool();
  const [content, setContent] = useState('');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="text-center py-8 text-muted-foreground">
        <p>Chat functionality will be available once the messaging system is implemented.</p>
        <p className="text-sm mt-2">This feature requires a messages table in the database.</p>
      </div>
      <div className="flex space-x-4 mt-4">
        <Input
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled
        />
        <Button disabled>Send</Button>
      </div>
    </div>
  );
};

export default ChatPage;