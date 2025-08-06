const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ChatResponseFromBackend {
  reply: string;
}

export const chatService = {
  /**
   * Sends a message to the backend AI chat endpoint
   * @param message - User's input message
   * @param token - Auth token for authorization
   * @returns AI reply
   */
  async sendMessage(message: string, token: string): Promise<ChatResponseFromBackend> {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred.' }));
      throw new Error(errorData.message || `Failed to send message: ${response.statusText}`);
    }

    return response.json();
  },
};