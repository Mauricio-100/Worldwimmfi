import { useState, useEffect } from 'react';
import { chatAPI } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger l'historique depuis le localStorage pour les invités
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    
    // Pour les utilisateurs connectés, charger depuis l'API
    const token = localStorage.getItem('token');
    if (token) {
      chatAPI.getHistory()
        .then(response => {
          setMessages(response.data.history || []);
        })
        .catch(() => {
          // En cas d'erreur, utiliser les messages du localStorage
          const savedMessages = localStorage.getItem('chatMessages');
          if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
          }
        });
    }
  }, []);

  const sendMessage = async (message) => {
    const newMessage = { role: 'user', content: message, timestamp: new Date() };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Sauvegarder dans le localStorage pour les invités
    if (!localStorage.getItem('token')) {
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    }

    setLoading(true);
    try {
      const response = await chatAPI.sendMessage(message);
      const aiMessage = { 
        role: 'assistant', 
        content: response.data.response,
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      // Sauvegarder dans le localStorage pour les invités
      if (!localStorage.getItem('token')) {
        localStorage.setItem('chatMessages', JSON.stringify(finalMessages));
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        timestamp: new Date(),
        isError: true
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return { messages, loading, sendMessage, clearMessages };
};