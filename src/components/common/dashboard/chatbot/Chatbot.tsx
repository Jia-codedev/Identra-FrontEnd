"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Clock,
  Calendar,
  FileText,
  CheckCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PermissionForm, LeaveForm, ManualPunchForm } from './ChatbotForms';
import { useTranslations } from '@/hooks/use-translations';

// Exportable ChatBot Interface
export interface ChatBotConfig {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  botName?: string;
  welcomeMessage?: string;
  supportedActions?: ChatBotAction[];
  apiEndpoints?: ChatBotEndpoints;
  userRole?: 'employee' | 'manager' | 'admin';
}

export interface ChatBotAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'attendance' | 'leave' | 'permission' | 'approval' | 'report';
  requiredRole?: string[];
}

export interface ChatBotEndpoints {
  sendMessage?: string;
  getActions?: string;
  submitRequest?: string;
  getApprovals?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
  status?: 'pending' | 'success' | 'error';
}

export interface ChatAction {
  id: string;
  label: string;
  type: 'button' | 'form' | 'link';
  data?: any;
}

function Chatbot({ config = {} }: { config?: ChatBotConfig }) {
  const { t } = useTranslations();

  // Bot state management
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [, setCurrentAction] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<'permission' | 'leave' | 'manual-punch' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Default configuration
  const defaultConfig: ChatBotConfig = {
    position: 'bottom-right',
    botName: 'CHRONEXA BOT',
    welcomeMessage: t('chatbot.welcome'),
    userRole: 'employee',
    ...config
  };

  // Default actions based on user role
  const defaultActions: ChatBotAction[] = [
    {
      id: 'apply-permission',
      label: t('chatbot.actions.applyPermission'),
      description: t('chatbot.actions.applyPermissionDesc'),
      icon: <Clock className="w-4 h-4" />,
      category: 'permission',
      requiredRole: ['employee', 'manager']
    },
    {
      id: 'apply-leave',
      label: t('chatbot.actions.applyLeave'),
      description: t('chatbot.actions.applyLeaveDesc'),
      icon: <Calendar className="w-4 h-4" />,
      category: 'leave',
      requiredRole: ['employee', 'manager']
    },
    {
      id: 'manual-punch',
      label: t('chatbot.actions.manualPunch'),
      description: t('chatbot.actions.manualPunchDesc'),
      icon: <FileText className="w-4 h-4" />,
      category: 'attendance',
      requiredRole: ['employee', 'manager']
    },
    {
      id: 'work-summary',
      label: t('chatbot.actions.workSummary'),
      description: t('chatbot.actions.workSummaryDesc'),
      icon: <FileText className="w-4 h-4" />,
      category: 'report',
      requiredRole: ['employee', 'manager']
    },
    {
      id: 'pending-approvals',
      label: t('chatbot.actions.pendingApprovals'),
      description: t('chatbot.actions.pendingApprovalsDesc'),
      icon: <CheckCircle className="w-4 h-4" />,
      category: 'approval',
      requiredRole: ['manager']
    }
  ];

  // Filter actions based on user role
  const availableActions = defaultActions.filter(action =>
    !action.requiredRole || action.requiredRole.includes(defaultConfig.userRole || 'employee')
  );

  // Initialize bot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Show welcome message and all available actions by default
      const welcomeMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'bot',
        content: defaultConfig.welcomeMessage || t('chatbot.welcome'),
        timestamp: new Date(),
      };
      const actionsMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        type: 'system',
        content: t('chatbot.availableActions'),
        timestamp: new Date(),
        actions: availableActions.map(action => ({
          id: action.id,
          label: action.label,
          type: 'button',
          data: action
        }))
      };
      setMessages([welcomeMessage, actionsMessage]);
    }
  }, [isOpen, messages.length, defaultConfig.welcomeMessage, t, availableActions]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Generate bot response based on user input
  const generateBotResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase();

    let response = '';
    let actions: ChatAction[] = [];

    if (input.includes('late') || input.includes('permission')) {
      response = t('chatbot.responses.permission');
      actions = [{
        id: 'apply-permission',
        label: t('chatbot.actions.applyPermission'),
        type: 'button'
      }];
    } else if (input.includes('leave') || input.includes('absent')) {
      response = t('chatbot.responses.leave');
      actions = [{
        id: 'apply-leave',
        label: t('chatbot.actions.applyLeave'),
        type: 'button'
      }];
    } else if (input.includes('punch') || input.includes('forgot')) {
      response = t('chatbot.responses.punch');
      actions = [{
        id: 'manual-punch',
        label: t('chatbot.actions.manualPunch'),
        type: 'button'
      }];
    } else if (input.includes('hours') || input.includes('summary')) {
      response = t('chatbot.responses.summary');
      actions = [{
        id: 'work-summary',
        label: t('chatbot.actions.viewSummary'),
        type: 'button'
      }];
    } else {
      response = t('chatbot.responses.default');
      actions = [{
        id: 'show-actions',
        label: t('chatbot.showActions'),
        type: 'button'
      }];
    }

    return {
      id: `msg-${Date.now()}`,
      type: 'bot',
      content: response,
      timestamp: new Date(),
      actions
    };
  };

  // Handle action clicks
  const handleActionClick = (actionId: string) => {
    setCurrentAction(actionId);

    if (actionId === 'show-actions') {
      const actionsMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'system',
        content: t('chatbot.availableActions'),
        timestamp: new Date(),
        actions: availableActions.map(action => ({
          id: action.id,
          label: action.label,
          type: 'button',
          data: action
        }))
      };
      setMessages(prev => [...prev, actionsMessage]);
    } else {
      // Handle specific actions
      handleSpecificAction(actionId);
    }
  };

  // Handle specific actions
  const handleSpecificAction = (actionId: string) => {
    let response = '';

    switch (actionId) {
      case 'apply-permission':
        setActiveForm('permission');
        response = t('chatbot.responses.permission');
        break;
      case 'apply-leave':
        setActiveForm('leave');
        response = t('chatbot.responses.leave');
        break;
      case 'manual-punch':
        setActiveForm('manual-punch');
        response = t('chatbot.responses.punch');
        break;
      case 'work-summary':
        response = t('chatbot.forms.workSummary');
        break;
      case 'pending-approvals':
        response = t('chatbot.forms.approvals');
        break;
      default:
        response = t('chatbot.responses.processing');
    }

    const actionMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'bot',
      content: response,
      timestamp: new Date(),
      status: 'success'
    };

    setMessages(prev => [...prev, actionMessage]);
  };

  // Handle form submissions
  const handleFormSubmit = (formData: any) => {
    const submissionMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'bot',
      content: `✅ Your ${formData.type} request has been submitted successfully! You will receive a notification once it's processed.`,
      timestamp: new Date(),
      status: 'success'
    };

    setMessages(prev => [...prev, submissionMessage]);
    setActiveForm(null);

    // Call external API if provided
    if (config?.apiEndpoints?.submitRequest) {
      // Handle API submission here
      console.log('Submitting to API:', formData);
    }
  };

  const handleFormCancel = () => {
    setActiveForm(null);
    const cancelMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'bot',
      content: 'Request cancelled. How else can I help you?',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, cancelMessage]);
  };

  // Chat position styles
  const getButtonPositionStyles = () => {
    const base = 'fixed z-40';
    switch (defaultConfig.position) {
      case 'bottom-left':
        return `${base} bottom-4 left-4`;
      case 'top-right':
        return `${base} top-4 right-4`;
      case 'top-left':
        return `${base} top-4 left-4`;
      default:
        return `${base} bottom-4 right-4`;
    }
  };

  const getChatWindowPositionStyles = () => {
    const base = 'fixed z-50'; // Lower z-index than button
    switch (defaultConfig.position) {
      case 'bottom-left':
        return `${base} bottom-4 left-4`; // Position beside button
      case 'top-right':
        return `${base} top-4 right-4`; // Position beside button  
      case 'top-left':
        return `${base} top-4 left-4`; // Position beside button
      default:
        return `${base} bottom-4 right-4`; // Position beside button (default: bottom-right)
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className={getButtonPositionStyles()}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.3
        }}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="chat-button"
              initial={{ scale: 0, rotate: -180 , opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 , y: 80 }}
              transition={{
                type: "tween",
                stiffness: 300,
                damping: 25,
                duration: 0.4
              }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                className="w-12 h-12 rounded-full bg-primary cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                style={{
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="close-button"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.4
              }}
            >
              <Button
                onClick={() => setIsOpen(false)}
                className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                style={{
                  backgroundColor: defaultConfig.primaryColor,
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <X className="w-6 h-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              scale: 0,
              opacity: 0,
              x: defaultConfig.position?.includes('right') ? 20 : -20,
              y: defaultConfig.position?.includes('top') ? -20 : 20
            }}
            animate={{
              scale: 1,
              opacity: 1,
              x: 0,
              y: 0
            }}
            exit={{
              scale: 0,
              opacity: 0,
              x: defaultConfig.position?.includes('right') ? 20 : -20,
              y: defaultConfig.position?.includes('top') ? -20 : 20
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.5
            }}
            className={`${getChatWindowPositionStyles()} w-80`}
          >
            <Card className="w-full flex flex-col shadow-2xl transition-all duration-300 overflow-hidden"
              style={{
                height: isMinimized ? '80px' : '500px'
              }}
            >
              {/* Header */}
              <CardHeader className="pb-2 space-y-0 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: defaultConfig.primaryColor }}
                    >
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{defaultConfig.botName}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {t('chatbot.online')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-muted/50 transition-colors"
                      onClick={() => setIsMinimized(!isMinimized)}
                      title={isMinimized ? "Maximize chat" : "Minimize chat"}
                    >
                      <motion.div
                        initial={false}
                        animate={{ rotate: isMinimized ? 0 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                      </motion.div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-muted/50 transition-colors"
                      onClick={() => setIsOpen(false)}
                      title="Close chat"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence mode="wait">
                {!isMinimized && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="flex flex-col flex-1 min-h-0 overflow-hidden"
                  >
                    {/* Messages and Form Area */}
                    <CardContent className="flex-1 p-0 min-h-0 overflow-hidden">
                      <div className="flex flex-col h-full">
                        {/* Messages Area */}
                        <div className="flex-1 min-h-0">
                          <ScrollArea className="h-full px-4">
                            <div className="space-y-4 py-4">
                              {messages.map((message) => (
                                <motion.div
                                  key={message.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} items-start gap-1`}
                                >
                                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                                    <div
                                      className={`rounded-lg p-3 text-sm break-words ${message.type === 'user'
                                          ? 'bg-primary text-primary-foreground'
                                          : message.type === 'system'
                                            ? 'bg-muted'
                                            : 'bg-secondary'
                                        }`}
                                    >
                                      {message.content}
                                    </div>

                                    {/* Action Buttons */}
                                    {message.actions && message.actions.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        {message.actions.map((action) => (
                                          <Button
                                            key={action.id}
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-left justify-start text-xs"
                                            onClick={() => handleActionClick(action.id)}
                                          >
                                            {action.data?.icon && <span className="mr-2">{action.data.icon}</span>}
                                            {action.label}
                                          </Button>
                                        ))}
                                      </div>
                                    )}

                                    <p className="text-xs text-muted-foreground mt-1">
                                      {message.timestamp.toLocaleTimeString()}
                                    </p>
                                  </div>

                                  {/* Avatar */}
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${message.type === 'user' ? 'order-1 ml-2 bg-primary' : 'order-2 mr-2 bg-secondary'
                                    }`}>
                                    {message.type === 'user' ? (
                                      <User className="w-3 h-3" />
                                    ) : (
                                      <Bot className="w-3 h-3" />
                                    )}
                                  </div>
                                </motion.div>
                              ))}

                              {/* Typing Indicator */}
                              {isTyping && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex justify-start"
                                >
                                  <div className="bg-secondary rounded-lg p-3">
                                    <div className="flex space-x-1">
                                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              <div ref={messagesEndRef} />
                            </div>
                          </ScrollArea>
                        </div>

                        {/* Form Area */}
                        {activeForm && (
                          <div className="border-t bg-background flex-shrink-0 max-h-48 overflow-hidden">
                            <ScrollArea className="h-full">
                              <div className="p-3">
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                >
                                  {activeForm === 'permission' && (
                                    <PermissionForm
                                      onSubmit={handleFormSubmit}
                                      onCancel={handleFormCancel}
                                    />
                                  )}
                                  {activeForm === 'leave' && (
                                    <LeaveForm
                                      onSubmit={handleFormSubmit}
                                      onCancel={handleFormCancel}
                                    />
                                  )}
                                  {activeForm === 'manual-punch' && (
                                    <ManualPunchForm
                                      onSubmit={handleFormSubmit}
                                      onCancel={handleFormCancel}
                                    />
                                  )}
                                </motion.div>
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    {/* Input Area */}
                    <div className="border-t p-4 flex-shrink-0">
                      <div className="flex space-x-2">
                        <Input
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={t('chatbot.typePlaceholder')}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1 text-sm"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim()}
                          size="icon"
                          className="h-9 w-9"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;