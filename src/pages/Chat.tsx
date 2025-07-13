import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useSchool } from '@/hooks/useSchool';

const getMessages = async (recipientId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
    .order('created_at');
  if (error) throw new Error(error.message);
  return data;
};

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { school } = useSchool();
  const queryClient = useQueryClient();
  const [recipientId, setRecipientId] = useState<string>('');
  const [content, setContent] = useState('');

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['messages', recipientId],
    queryFn: () => getMessages(recipientId),
    enabled: !!recipientId,
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('messages').insert({
        school_id: school?.id,
        sender_id: user?.id,
        recipient_id: recipientId,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', recipientId] });
      setContent('');
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Recipient ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
        />
      </div>
      <div className="border rounded-lg p-4 h-96 overflow-y-auto">
        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`p-2 my-2 rounded-lg ${
              message.sender_id === user?.id ? 'bg-blue-200 ml-auto' : 'bg-gray-200'
            }`}
            style={{ width: 'fit-content' }}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex space-x-4 mt-4">
        <Input
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={() => sendMessage.mutate()}>Send</Button>
      </div>
    </div>
  );
};

export default ChatPage;
