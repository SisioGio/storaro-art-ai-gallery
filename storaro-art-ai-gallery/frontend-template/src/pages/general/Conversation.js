'use client';

import { useConversation,SessionConfig } from '@elevenlabs/react';
import { PlayCircle, StopCircle } from 'lucide-react';
// import {SessionConfig} from "@elevenlabs/client"
import { useCallback } from 'react';

export function Conversation({item}) {
  const {conversation,startSession,
    endSession,
    isSpeaking,
    status} = useConversation(
   
    {
         overrides: {
            agent: {
                    
                    firstMessage: `Welcome to my gallery. Let me introduce you to *${item.title}*. This piece holds layers of light, shadow, and meaning. Would you like a complete overview of the work, or shall we explore a particular element together — perhaps the symbolism, the color, the historical context, or the technique?`,
                    language: "en", 
                }
    },

    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });




  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await startSession({
        agentId: 'agent_01jy79mm6eft482skgqy25m0e8',
        dynamicVariables: {
                item_name: item.title
            },


      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">

       <div className="flex items-center gap-4 mt-6">
  {status=='connected' ? (
    <button
      onClick={stopConversation}
      disabled={status !== 'connected'}
      className={`px-6 py-3 text-lg font-medium rounded-xl transition duration-300 shadow-lg  flex items-center gap-3  bg-opacity-80  ${
        status === 'connected'
          ? 'bg-red-700  hover:brightness-110 text-white'
          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
      }`}
    >
      <StopCircle/> End the Dialogue
    </button>
  ) : (
    <button
      onClick={startConversation}
      disabled={status === 'connected'}
      className={`px-6 py-3 text-lg font-medium rounded-xl transition duration-300 shadow-lg flex items-center gap-3  bg-opacity-80 ${
        status !== 'connected'
          ? 'bg-blue-700  hover:brightness-110 text-white '
          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
      }`}
    >
      <PlayCircle/> Begin the AI Conversational Experience
    </button>
  )}
</div>
       
       
      </div>

      
    </div>
  );
}
