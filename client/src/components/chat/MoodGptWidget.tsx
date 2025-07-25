import { useState, useEffect, useRef } from "react";
import { Brain, X, Minimize2, Send, Bot, User, Loader2, TrendingUp, DollarSign, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { useAiChat } from "@/hooks/useAiChat";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const PRESET_PROMPTS = [
  {
    icon: TrendingUp,
    label: "Top Bullish Stocks",
    query: "What are the top bullish stocks based on current sentiment data?"
  },
  {
    icon: DollarSign,
    label: "Crypto Sentiment Summary", 
    query: "Give me a summary of current crypto sentiment across major coins"
  },
  {
    icon: BarChart3,
    label: "Check Watchlist Mood",
    query: "Analyze the sentiment mood for my current watchlist tickers"
  }
];

export const MoodGptWidget = () => {
  const { themeMode } = useMoodTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useAiChat();

  // Load chat session from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('moodgpt-chat-session');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
      } catch (error) {
        console.error('Failed to load chat session:', error);
        initializeWelcomeMessage();
      }
    } else {
      initializeWelcomeMessage();
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('moodgpt-chat-session', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "assistant",
      content: "Hi! I'm Mood GPT, your AI Market Companion! 🧠✨\n\nI'm trained on MoodMeter's sentiment data, watchlist analytics, and market insights to help you make informed trading decisions.\n\n💡 **What I can help you with:**\n• Real-time sentiment analysis for any ticker\n• Watchlist mood tracking and alerts  \n• Crypto market sentiment summaries\n• Trading strategy insights\n• Market trend analysis\n• Portfolio optimization suggestions\n\n🚀 **Try asking me:**\n\"What's the mood for $AAPL?\"\n\"Show me the most bullish crypto\"\n\"How should I diversify my portfolio?\"\n\nOr use the quick action buttons below!",
      timestamp: new Date(),
      suggestions: [
        "What's the sentiment for $TSLA today?",
        "Show me the most bullish sectors",
        "How is crypto performing this week?",
        "Analyze my watchlist mood",
        "Give me a market overview",
        "Help me with trading strategy"
      ],
    };
    setMessages([welcomeMessage]);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeWidget = () => {
    setIsMinimized(true);
  };

  const closeWidget = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessage(inputValue);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Mood GPT error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment, or use one of the preset prompts below.",
        timestamp: new Date(),
        suggestions: [
          "Try again",
          "Check top bullish stocks",
          "Get crypto sentiment",
          "What can you help with?",
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetPrompt = (query: string) => {
    setInputValue(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    localStorage.removeItem('moodgpt-chat-session');
    setMessages([]);
    initializeWelcomeMessage();
  };

  return (
    <>
      {/* Floating Assistant Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Pulsing ring effect */}
          <div className={cn(
            "absolute inset-0 rounded-full animate-pulse",
            "bg-gradient-to-br from-purple-400 to-blue-400 opacity-30",
            "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
          )} />
          <Button
            onClick={toggleWidget}
            size="lg"
            className={cn(
              "relative h-16 w-16 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 border-2",
              "hover:scale-110 active:scale-95",
              themeMode === 'light'
                ? "bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-purple-500/20"
                : "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-purple-400/30"
            )}
            aria-label="Open Mood GPT Assistant"
          >
            <Brain className="h-8 w-8 text-white drop-shadow-sm" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-bounce" />
          </Button>
        </div>
      )}

      {/* Chat Panel - Sliding from right */}
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 pointer-events-none",
            "animate-in fade-in-0 duration-300"
          )}
        >
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto md:pointer-events-none"
            onClick={closeWidget}
          />
          
          {/* Chat Panel */}
          <div
            className={cn(
              "absolute right-0 top-0 h-full w-full md:w-[480px] pointer-events-auto",
              "animate-in slide-in-from-right-0 duration-300",
              isMinimized && "h-auto"
            )}
          >
            <Card
              className={cn(
                "h-full flex flex-col shadow-2xl border-0 overflow-hidden",
                "rounded-l-3xl md:rounded-l-2xl rounded-r-none",
                themeMode === 'light'
                  ? "bg-[#F7F9FB] border-l border-t border-b border-gray-200"
                  : "bg-[#121212] border-l border-t border-b border-purple-500/20"
              )}
            >
              {/* Header */}
              <div className={cn(
                "flex items-center justify-between p-4 border-b flex-shrink-0",
                "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              )}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      Mood GPT
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        Verified AI
                      </Badge>
                    </h3>
                    <p className="text-sm opacity-90">
                      {messages.length > 1
                        ? `${messages.length - 1} messages • Online`
                        : "AI Market Companion • Online"
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!isMinimized && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={minimizeWidget}
                      className="h-9 w-9 p-0 text-white hover:bg-white/20 rounded-full"
                      aria-label="Minimize chat"
                    >
                      <Minimize2 className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeWidget}
                    className="h-9 w-9 p-0 text-white hover:bg-white/20 rounded-full"
                    aria-label="Close chat"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Content */}
              {!isMinimized && (
                <>
                  {/* Preset Prompt Buttons */}
                  <div className={cn(
                    "p-4 border-b flex-shrink-0",
                    themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900/50 border-purple-500/20'
                  )}>
                    <p className={cn(
                      "text-sm font-medium mb-3",
                      themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
                    )}>
                      Quick Actions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_PROMPTS.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePresetPrompt(prompt.query)}
                          className={cn(
                            "h-9 text-xs font-medium transition-all hover:scale-105",
                            themeMode === 'light'
                              ? "border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                              : "border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400"
                          )}
                        >
                          <prompt.icon className="h-3 w-3 mr-1.5" />
                          {prompt.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4 min-h-0">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                            message.type === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          {message.type === "assistant" && (
                            <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                              <Bot className="h-5 w-5 text-white" />
                            </div>
                          )}

                          <div className={cn(
                            "max-w-[85%] min-w-0",
                            message.type === "user" ? "order-1" : ""
                          )}>
                            <Card
                              className={cn(
                                "shadow-sm",
                                message.type === "user"
                                  ? themeMode === 'light'
                                    ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white border-purple-500"
                                    : "bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-400"
                                  : themeMode === 'light'
                                    ? "bg-white border-gray-200"
                                    : "bg-gray-800/50 border-purple-500/20"
                              )}
                            >
                              <CardContent className="p-3">
                                <div className={cn(
                                  "text-sm leading-relaxed whitespace-pre-wrap break-words",
                                  message.type === "assistant" && themeMode === 'dark' && "text-gray-100"
                                )}>
                                  {message.content}
                                </div>

                                {/* Suggestion Pills */}
                                {message.suggestions && (
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {message.suggestions.map((suggestion, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className={cn(
                                          "cursor-pointer transition-all hover:scale-105",
                                          themeMode === 'light'
                                            ? "border-purple-300 text-purple-700 hover:bg-purple-100"
                                            : "border-purple-400 text-purple-300 hover:bg-purple-500/20"
                                        )}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                      >
                                        {suggestion}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            <div className={cn(
                              "text-xs mt-1 px-1",
                              message.type === "user" ? "text-right" : "text-left",
                              themeMode === 'light' ? 'text-gray-500' : 'text-gray-400'
                            )}>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>

                          {message.type === "user" && (
                            <div className={cn(
                              "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center order-2 shadow-sm",
                              themeMode === 'light' 
                                ? "bg-gradient-to-br from-gray-600 to-gray-700"
                                : "bg-gradient-to-br from-gray-700 to-gray-800"
                            )}>
                              <User className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Loading indicator */}
                      {isLoading && (
                        <div className="flex gap-3 justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                          <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                          <Card className={cn(
                            themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800/50 border-purple-500/20'
                          )}>
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                                <span className={cn(
                                  "text-sm",
                                  themeMode === 'light' ? 'text-gray-600' : 'text-gray-300'
                                )}>
                                  Analyzing market data...
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </ScrollArea>

                  {/* Input Area */}
                  <div className={cn(
                    "p-4 border-t flex-shrink-0",
                    themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900/50 border-purple-500/20'
                  )}>
                    <div className="flex gap-2 mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearChat}
                        className={cn(
                          "text-xs h-7",
                          themeMode === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-gray-200'
                        )}
                      >
                        Clear Chat
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about stocks, sentiment, or trading tips..."
                        className={cn(
                          "flex-1 min-w-0 h-11",
                          themeMode === 'light'
                            ? "border-gray-300 focus:border-purple-400"
                            : "border-purple-500/30 focus:border-purple-400"
                        )}
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        size="sm"
                        className={cn(
                          "px-4 h-11 flex-shrink-0",
                          themeMode === 'light'
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        )}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
