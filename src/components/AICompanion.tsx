'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Send, 
  Minimize2, 
  Maximize2, 
  Bot, 
  User,
  Lightbulb,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  category?: 'advice' | 'resource' | 'motivation' | 'guidance'
}

interface AICompanionProps {
  isMinimized?: boolean
}

export default function AICompanion({ isMinimized = false }: AICompanionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimizedState, setIsMinimizedState] = useState(isMinimized)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI career companion. I'm here to help you with your learning journey, answer questions about your roadmap, and provide guidance whenever you need it. What can I help you with today?",
      timestamp: new Date(),
      category: 'guidance'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentInput,
          context: {
            goal: 'Full Stack Developer', // This would come from user data
            currentSkills: ['JavaScript', 'React'], // This would come from user data
            progress: 'In progress',
            currentWeek: '3'
          }
        })
      })

      const result = await response.json()
      
      if (result.success && result.response) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: result.response.content,
          timestamp: new Date(),
          category: result.response.category
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        // Fallback to local response generation
        const aiResponse = generateAIResponse(currentInput)
        setMessages(prev => [...prev, aiResponse])
      }
    } catch (error) {
      console.error('AI chat error:', error)
      // Fallback to local response generation
      const aiResponse = generateAIResponse(currentInput)
      setMessages(prev => [...prev, aiResponse])
    }
    
    setIsTyping(false)
  }

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase()
    
    if (input.includes('stuck') || input.includes('help') || input.includes('confused')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I understand you're feeling stuck! This is completely normal when learning new skills. Let me help you break it down:\n\n1. **Identify the specific challenge** - What exactly is confusing you?\n2. **Go back to basics** - Sometimes we need to reinforce fundamentals\n3. **Practice with small projects** - Apply what you've learned immediately\n4. **Join study groups** - Learning with others can provide new perspectives\n\nWould you like me to suggest some specific resources for the topic you're working on?",
        timestamp: new Date(),
        category: 'guidance'
      }
    }
    
    if (input.includes('motivat') || input.includes('discouraged') || input.includes('give up')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: "Don't lose motivation! Every expert was once a beginner. Remember:\n\n🎯 **You've already made progress** - Look how far you've come!\n📈 **Growth takes time** - Learning isn't always linear\n💪 **Challenges make you stronger** - Each obstacle overcome builds resilience\n\nYou're capable of amazing things! Let's focus on one small win today. What's one tiny step you can take right now?",
        timestamp: new Date(),
        category: 'motivation'
      }
    }
    
    if (input.includes('course') || input.includes('learn') || input.includes('resource')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: "Great question about learning resources! Based on your current roadmap, I recommend:\n\n📚 **For JavaScript fundamentals**: Start with FreeCodeCamp's interactive lessons\n🎥 **For React**: Try Scrimba's visual learning platform\n💻 **For practice**: Join LeetCode for coding challenges\n👥 **For community**: Discord servers for your tech stack\n\nWhat specific topic are you looking to learn more about?",
        timestamp: new Date(),
        category: 'resource'
      }
    }
    
    if (input.includes('job') || input.includes('career') || input.includes('interview')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: "Let's talk career preparation! Here's what you should focus on:\n\n📝 **Update your portfolio** - Showcase your best projects\n🎯 **Practice technical interviews** - Use platforms like Pramp\n🤝 **Network actively** - Attend meetups and connect on LinkedIn\n📊 **Track applications** - Stay organized with your job search\n\nRemember: Your current roadmap is building exactly the skills employers want! Keep focused on your learning milestones.",
        timestamp: new Date(),
        category: 'advice'
      }
    }
    
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: "That's a great question! Based on your learning journey, I'm here to provide personalized guidance. Whether you need help with:\n\n📚 **Learning resources** and study strategies\n🎯 **Staying motivated** and overcoming challenges\n💡 **Career advice** and next steps\n📈 **Progress tracking** and goal adjustments\n\nI'm your dedicated companion throughout this journey. What specific area would you like to explore?",
      timestamp: new Date(),
      category: 'guidance'
    }
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'advice': return <Lightbulb className="w-4 h-4" />
      case 'resource': return <BookOpen className="w-4 h-4" />
      case 'motivation': return <TrendingUp className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'advice': return 'bg-yellow-100 text-yellow-800'
      case 'resource': return 'bg-blue-100 text-blue-800'
      case 'motivation': return 'bg-green-100 text-green-800'
      default: return 'bg-purple-100 text-purple-800'
    }
  }

  if (isMinimizedState) {
    return (
      <Button
        onClick={() => setIsMinimizedState(false)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isOpen ? 'w-96 h-[600px]' : 'w-80 h-16'
    }`}>
      <Card className="h-full shadow-xl">
        {/* Header */}
        <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <span>AI Career Companion</span>
              <Badge variant="secondary" className="text-xs">Online</Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMinimizedState(true)
                }}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              {isOpen ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(false)
                  }}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(true)
                  }}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        {isOpen && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto h-[400px] pb-2">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${
                      message.type === 'user' ? 'order-1' : ''
                    }`}>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                      
                      {message.type === 'assistant' && message.category && (
                        <div className="mt-1">
                          <Badge variant="outline" className={`text-xs ${getCategoryColor(message.category)}`}>
                            {getCategoryIcon(message.category)}
                            <span className="ml-1">{message.category}</span>
                          </Badge>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 order-2">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything about your career journey..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("I'm feeling stuck with my current topic")}
                  className="text-xs"
                >
                  Feeling Stuck
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("I need motivation to continue")}
                  className="text-xs"
                >
                  Need Motivation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("Suggest learning resources")}
                  className="text-xs"
                >
                  Resources
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}