"use client";

import React from 'react';
import Chatbot, { type ChatBotConfig } from './Chatbot';
import { timeAttendanceAPIConfig } from './ChatbotAPI';

// Example implementation for different user roles
const employeeConfig: ChatBotConfig = {
  ...timeAttendanceAPIConfig,
  userRole: 'employee',
  supportedActions: timeAttendanceAPIConfig.supportedActions?.filter(
    action => action.requiredRole?.includes('employee')
  )
};

const managerConfig: ChatBotConfig = {
  ...timeAttendanceAPIConfig,
  userRole: 'manager',
  botName: 'CHRONEXA_BOT Manager',
  welcomeMessage: 'Hello Manager! I can help you with team management and approvals.',
  supportedActions: timeAttendanceAPIConfig.supportedActions?.filter(
    action => action.requiredRole?.includes('manager')
  )
};

// Demo component showing different configurations
export const ChatBotDemo: React.FC = () => {
  const [userRole, setUserRole] = React.useState<'employee' | 'manager'>('employee');

  const currentConfig = userRole === 'employee' ? employeeConfig : managerConfig;

  return (
    <div className="fixed bottom-4 right-4 space-y-4">
      {/* Role Switcher for Demo */}
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
        <p className="text-sm font-medium mb-2">Demo: Switch User Role</p>
        <div className="flex gap-2">
          <button
            onClick={() => setUserRole('employee')}
            className={`px-3 py-1 text-xs rounded ${
              userRole === 'employee'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => setUserRole('manager')}
            className={`px-3 py-1 text-xs rounded ${
              userRole === 'manager'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Manager
          </button>
        </div>
      </div>

      {/* Chatbot Component */}
      <Chatbot config={currentConfig} />
    </div>
  );
};

// Simple implementation for production use
export const ProductionChatBot: React.FC = () => {
  return <Chatbot config={timeAttendanceAPIConfig} />;
};

// Customized implementation example
export const CustomChatBot: React.FC<{ userRole: 'employee' | 'manager' | 'admin' }> = ({ userRole }) => {
  const customConfig: ChatBotConfig = {
    position: 'bottom-left',
    primaryColor: '#10B981', // Custom green color
    botName: 'TimeBot',
    welcomeMessage: `Welcome ${userRole}! I'm here to help with your time attendance needs.`,
    userRole,
    apiEndpoints: {
      submitRequest: '/api/custom/submit',
      getApprovals: '/api/custom/approvals'
    }
  };

  return <Chatbot config={customConfig} />;
};

export default ChatBotDemo;
