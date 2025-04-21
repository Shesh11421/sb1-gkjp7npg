import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Trash2, Moon, Sun, Image, Smile, Paperclip } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
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

    setIsDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responses = [
        "I understand what you're saying.",
        "That's an interesting perspective! Could you tell me more?",
        "I appreciate you sharing that with me.",
        "Let me think about that for a moment...",
        "That's a great point you've made.",
      ];
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your chat history? This action cannot be undone.')) {
      setMessages([]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`${
        isDarkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white'
      } shadow-lg py-4 fixed top-0 w-full z-10 transition-colors duration-300`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <MessageCircle className={`h-6 w-6 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <h1 className="text-xl font-semibold">Chat History</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-all duration-300 transform hover:scale-110 ${
                isDarkMode ? 'text-yellow-300' : 'text-gray-600'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button 
              onClick={clearHistory}
              className={`flex items-center px-3 py-1 rounded-full transition-all duration-300 transform hover:scale-105 ${
                isDarkMode 
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                  : 'text-red-500 hover:text-red-700 hover:bg-red-100'
              }`}
            >
              <Trash2 className="h-5 w-5 mr-1" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Chat container */}
      <div className="flex-1 container mx-auto px-4 pt-20 pb-24 overflow-hidden flex flex-col h-screen">
        {/* Messages area */}
        <div className={`flex-1 overflow-y-auto mb-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-lg p-4 transition-colors duration-300`}>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50 animate-bounce" />
                <p className="text-xl font-semibold mb-2">No messages yet</p>
                <p className="text-sm opacity-75">Start a conversation below!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const showDate = index === 0 || 
                  formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                
                return (
                  <React.Fragment key={message.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 transform transition-all duration-300 hover:scale-[1.02] ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                              : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        <div className="flex items-center justify-end mt-1 space-x-2">
                          <span className={`text-xs ${
                            message.sender === 'user' 
                              ? 'text-blue-100' 
                              : isDarkMode 
                                ? 'text-gray-400'
                                : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </span>
                          {message.sender === 'user' && (
                            <span className="text-xs text-blue-100">
                              {message.status === 'sending' && '• Sending...'}
                              {message.status === 'sent' && '• Sent'}
                              {message.status === 'error' && '• Failed'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`rounded-lg px-4 py-2 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg p-4 transition-colors duration-300`}>
          <div className="container mx-auto">
            <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className={`w-full rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button
                  onClick={() => setShowEmoji(!showEmoji)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <Smile className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-3 rounded-full transition-all duration-300 transform ${
                  newMessage.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;