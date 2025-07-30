const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

interface LLMMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponseFromBackend {
  reply: string;
  history: LLMMessage[];
}

export const chatService = {
  /**
   * Sends a message and chat history to the backend AI chat endpoint
   * @param message - User's input message
   * @param currentChatHistory - Existing conversation history
   * @param token - Auth token for authorization
   * @returns AI reply and updated chat history
   */
  async sendMessage(message: string, currentChatHistory: LLMMessage[], token: string): Promise<ChatResponseFromBackend> {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message, history: currentChatHistory }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
      throw new Error(errorData.message || `Failed to send message: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Fetches full chat history for the authenticated user
   * @param token - Auth token for authorization
   * @returns List of chat messages from backend
   */
  async getChatHistory(token: string): Promise<LLMMessage[]> {
    const response = await fetch(`${API_BASE_URL}/ai/chat/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
      throw new Error(errorData.message || `Failed to fetch chat history: ${response.statusText}`);
    }

    const data = await response.json();
    return data.history;
  },
};
