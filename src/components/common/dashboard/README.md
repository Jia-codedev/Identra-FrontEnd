# CHRONEXA_BOT - Time Attendance Chatbot

A comprehensive, exportable chatbot component designed for time attendance and workforce management systems. Built with React, TypeScript, and Framer Motion.

## Features

### Core Functionality
- ✅ **Interactive Chat Interface** - Real-time messaging with typing indicators
- ✅ **Multi-language Support** - English and Arabic translations
- ✅ **Role-based Actions** - Different capabilities based on user roles
- ✅ **Form Integration** - Built-in forms for permissions, leave, and manual punch requests
- ✅ **Responsive Design** - Adapts to different screen sizes and orientations
- ✅ **Theme Support** - Integrates with your app's theme system
- ✅ **Animation Effects** - Smooth transitions and micro-interactions

### Time Attendance Features
- 📝 **Permission Requests** - Late arrival, early departure, missing hours
- 🏖️ **Leave Applications** - Annual, sick, emergency, personal leave
- 👆 **Manual Punch Requests** - Missing clock-in/out entries
- 📊 **Work Summary** - Monthly hours and attendance statistics
- ⏳ **Approval Management** - Review and approve team requests (managers)

### Exportable Design
- 🔧 **Configurable Interface** - Easy customization through config object
- 🔌 **API Integration** - Built-in support for external API endpoints
- 📦 **Component Library** - Reusable across different applications
- 🎨 **Theme Flexibility** - Adapts to your brand colors and styling

## Installation & Setup

### 1. Copy Components
```bash
# Copy the chatbot components to your project
cp src/components/common/dashboard/Chatbot.tsx your-project/src/components/
cp src/components/common/dashboard/ChatbotForms.tsx your-project/src/components/
cp src/components/common/dashboard/ChatbotAPI.ts your-project/src/components/
```

### 2. Install Dependencies
```bash
npm install framer-motion lucide-react date-fns
# or
yarn add framer-motion lucide-react date-fns
```

### 3. Add Required UI Components
Ensure you have these UI components in your project:
- `Button`
- `Input`
- `Textarea`
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Badge`
- `ScrollArea`
- `Separator`
- `Calendar`
- `Popover`, `PopoverContent`, `PopoverTrigger`

## Usage

### Basic Implementation

```tsx
import { ChatBot } from '@/components/common/dashboard/Chatbot';

function App() {
  return (
    <div>
      {/* Your app content */}
      <ChatBot />
    </div>
  );
}
```

### Advanced Configuration

```tsx
import { ChatBot, ChatBotConfig } from '@/components/common/dashboard/Chatbot';

const chatbotConfig: ChatBotConfig = {
  position: 'bottom-right',
  primaryColor: '#your-brand-color',
  botName: 'CHRONEXA_BOT',
  welcomeMessage: 'Hello! How can I help you today?',
  userRole: 'employee',
  apiEndpoints: {
    submitRequest: '/api/timeattendance/submit',
    getApprovals: '/api/timeattendance/approvals'
  },
  supportedActions: [
    {
      id: 'apply-permission',
      label: 'Apply for Permission',
      description: 'Request permission for attendance issues',
      icon: '🕐',
      category: 'permission',
      requiredRole: ['employee', 'manager']
    }
    // ... more actions
  ]
};

function App() {
  return (
    <div>
      <ChatBot config={chatbotConfig} />
    </div>
  );
}
```

## Configuration Options

### ChatBotConfig Interface

```typescript
interface ChatBotConfig {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  botName?: string;
  welcomeMessage?: string;
  supportedActions?: ChatBotAction[];
  apiEndpoints?: ChatBotEndpoints;
  userRole?: 'employee' | 'manager' | 'admin';
}
```

### API Endpoints

```typescript
interface ChatBotEndpoints {
  sendMessage?: string;       // POST: Send chat messages
  getActions?: string;        // GET: Retrieve available actions
  submitRequest?: string;     // POST: Submit form requests
  getApprovals?: string;      // GET: Get pending approvals
}
```

### Actions Configuration

```typescript
interface ChatBotAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'attendance' | 'leave' | 'permission' | 'approval' | 'report';
  requiredRole?: string[];
}
```

## API Integration

### Submit Form Request

```typescript
// Expected API request format
POST /api/timeattendance/submit
{
  "type": "permission" | "leave" | "manual-punch",
  "data": {
    // Form-specific data
    "date": "2024-01-15",
    "reason": "Traffic jam",
    // ... other fields
  },
  "userId": "user123",
  "timestamp": "2024-01-15T10:30:00Z"
}

// Expected response
{
  "success": true,
  "requestId": "req_123456",
  "status": "pending",
  "message": "Request submitted successfully"
}
```

### Get Pending Approvals

```typescript
// API request
GET /api/timeattendance/approvals

// Expected response
{
  "success": true,
  "data": [
    {
      "id": "req_123",
      "type": "permission",
      "employee": "John Doe",
      "date": "2024-01-15",
      "status": "pending",
      "submittedAt": "2024-01-15T09:00:00Z"
    }
    // ... more approvals
  ]
}
```

## Internationalization

### Translation Keys

The chatbot uses the following translation structure:

```json
{
  "chatbot": {
    "welcome": "Welcome message",
    "online": "Online status",
    "typePlaceholder": "Type your message...",
    "actions": {
      "applyPermission": "Apply for Permission",
      "applyLeave": "Apply for Leave",
      // ... more actions
    },
    "forms": {
      "permissionTitle": "Request Permission",
      "date": "Date",
      "reason": "Reason",
      // ... more form fields
    },
    "responses": {
      "permission": "I can help you apply for permission...",
      // ... more responses
    }
  }
}
```

### Adding New Languages

1. Create translation files in `src/i18n/locales/`
2. Add the new language to your i18n configuration
3. The chatbot will automatically use the translations

## Customization

### Styling

The chatbot uses CSS custom properties for theming:

```css
:root {
  --primary: your-primary-color;
  --secondary: your-secondary-color;
  --muted: your-muted-color;
  --border: your-border-color;
}
```

### Custom Actions

Add your own actions by extending the `supportedActions` array:

```typescript
const customAction: ChatBotAction = {
  id: 'custom-action',
  label: 'Custom Action',
  description: 'Description of your custom action',
  icon: '⚡',
  category: 'custom',
  requiredRole: ['employee']
};
```

### Custom Forms

Create custom forms by extending the `ChatbotForms.tsx` file:

```typescript
export const CustomForm: React.FC<ChatBotFormConfig> = ({ onSubmit, onCancel }) => {
  // Your custom form implementation
};
```

## Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { ChatBot } from './Chatbot';

describe('ChatBot', () => {
  test('renders chatbot button', () => {
    render(<ChatBot />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('opens chat window on click', () => {
    render(<ChatBot />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText(/CHRONEXA_BOT/)).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatBot } from './Chatbot';

describe('ChatBot Integration', () => {
  test('submits permission form', async () => {
    const mockSubmit = jest.fn();
    render(<ChatBot onFormSubmit={mockSubmit} />);
    
    // Open chatbot and trigger permission form
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    const permissionAction = screen.getByText('Apply for Permission');
    await userEvent.click(permissionAction);
    
    // Fill and submit form
    const reasonInput = screen.getByPlaceholderText(/reason/i);
    await userEvent.type(reasonInput, 'Traffic jam');
    
    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'permission',
          data: expect.objectContaining({
            reason: 'Traffic jam'
          })
        })
      );
    });
  });
});
```

## Performance Considerations

- **Message Limiting**: Default limit of 100 messages to prevent memory issues
- **Lazy Loading**: Forms are rendered only when needed
- **Debounced Typing**: Typing indicators are optimized to reduce re-renders
- **Memoization**: Key components use React.memo for performance

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 90+
- ✅ Safari 14+
- ✅ Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- 📧 Email: support@chronexa.com
- 📚 Documentation: [docs.chronexa.com](https://docs.chronexa.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**CHRONEXA_BOT** - Making time attendance management conversational and intuitive! 🚀
