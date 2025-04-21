import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Trash2, Settings, Moon, Sun } from 'lucide-react';

interface ChatMessage {
  id: string | number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    setTimeout(() => {
      const responses = [
        "I understand what you're saying.",
        "That's an interesting point.",
        "Let me think about that.",
        "Could you elaborate more?",
        "Thanks for sharing that.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      setMessages([]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      {/* Header */}
      <header className={`${
        isDarkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white'
      } shadow-sm py-4 transition-colors duration-200`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageCircle className={`h-6 w-6 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <h1 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Chat History</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button 
              onClick={clearHistory}
              className={`flex items-center ${
                isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
              }`}
            >
              <Trash2 className="h-5 w-5 mr-1" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Chat container */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden flex flex-col h-[calc(100vh-5rem)]">
        {/* Messages area */}
        <div className={`flex-1 overflow-y-auto mb-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow p-4 transition-colors duration-200`}>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No messages yet.</p>
                <p className="text-sm">Start a conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 transform transition-all duration-200 hover:scale-[1.02] ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-blue-100' 
                        : isDarkMode 
                          ? 'text-gray-400'
                          : 'text-gray-500'