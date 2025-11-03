// Chatbot API Integration Example
// This file demonstrates how to integrate the CHRONEXA_BOT with external APIs

import { ChatBotConfig } from './Chatbot';

// Example API configuration for time attendance system
export const timeAttendanceAPIConfig: ChatBotConfig = {
  position: 'bottom-right',
  primaryColor: 'hsl(var(--primary))',
  botName: 'CHRONEXA_BOT',
  welcomeMessage: 'Hello! I\'m CHRONEXA_BOT, your time attendance assistant. How can I help you today?',
  userRole: 'employee',
  
  // API endpoints for integration
  apiEndpoints: {
    sendMessage: '/api/chatbot/message',
    getActions: '/api/chatbot/actions',
    submitRequest: '/api/timeattendance/submit',
    getApprovals: '/api/timeattendance/approvals'
  },

  // Custom actions for time attendance
  supportedActions: [
    {
      id: 'apply-permission',
      label: 'Apply for Permission',
      description: 'Request permission for late arrival, early departure, or missing hours',
      icon: '🕐',
      category: 'permission',
      requiredRole: ['employee', 'manager']
    },
    {
      id: 'apply-leave',
      label: 'Apply for Leave',
      description: 'Submit leave application for absences or extended time off',
      icon: '🏖️',
      category: 'leave',
      requiredRole: ['employee', 'manager']
    },
    {
      id: 'manual-punch',
      label: 'Request Manual Punch',
      description: 'Request manual punch for missed clock in/out',
      icon: '👆',
      category: 'attendance',
      requiredRole: ['employee', 'manager']
    },
    {
      id: 'work-summary',
      label: 'Work Hours Summary',
      description: 'View your worked hours summary for the current month',
      icon: '📊',
      category: 'report',
      requiredRole: ['employee', 'manager']
    },
    {
      id: 'pending-approvals',
      label: 'Pending Approvals',
      description: 'Review and approve/reject team member requests',
      icon: '⏳',
      category: 'approval',
      requiredRole: ['manager', 'admin']
    }
  ]
};

// Example API response handlers
export const chatbotAPIHandlers = {
  // Handle form submission to backend
  async submitRequest(formData: any, endpoint: string) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Use cookies for authentication
        body: JSON.stringify({
          type: formData.type,
          data: formData.data,
          userId: formData.userId,
          timestamp: formData.timestamp
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: 'Request submitted successfully'
      };
    } catch (error) {
      console.error('API submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to submit request'
      };
    }
  },

  // Get pending approvals for managers
  async getPendingApprovals(endpoint: string) {
    try {
      const response = await fetch(endpoint, {
        credentials: 'include' // Use cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const approvals = await response.json();
      return {
        success: true,
        data: approvals
      };
    } catch (error) {
      console.error('API fetch error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get work summary for employee
  async getWorkSummary(endpoint: string, userId: string, month?: string) {
    try {
      const params = new URLSearchParams({
        userId,
        ...(month && { month })
      });

      const response = await fetch(`${endpoint}?${params}`, {
        credentials: 'include' // Use cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const summary = await response.json();
      return {
        success: true,
        data: summary
      };
    } catch (error) {
      console.error('API fetch error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

