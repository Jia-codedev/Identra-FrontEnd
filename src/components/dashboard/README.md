# Enhanced Dashboard System

A comprehensive dashboard system built with React, TypeScript, and Chart.js that provides both employee and team/manager views for tracking attendance, leave management, and team analytics.

## Features

### Employee Dashboard (Self View)
- **Attendance Overview**
  - Punch Status Card: Real-time punch in/out status
  - Worked Hours Tracker: Circular progress showing hours vs target
  - Break Time Tracker: Total break time taken
  - Shift Info Card: Current shift details and timing

- **Leave & Violations**
  - Leave Balance: Available leave by type (Annual, Sick, Emergency)
  - Violation Summary: Late ins, early outs, missed punches

- **Communication**
  - Announcement Feed: Scrollable feed with latest announcements
  - Work Hours Trend: Chart showing shift completion progress

### Team Dashboard (Manager/Admin View)
- **Team Overview**
  - Total Employees count
  - Punched In/Out status
  - Not Yet Punched In highlights
  - Leave Count Today
  - Absent Without Leave alerts
  - Pending Approvals count

- **Analytics & Charts**
  - Weekly Attendance Trend: Bar chart showing attendance patterns
  - Leave Distribution: Doughnut chart showing leave usage breakdown
  - Violation Trends: Line chart tracking violations over time
  - Department Heatmap: Attendance percentage by department

## Components

### Widgets
- `StatCard`: Displays numerical statistics with optional animations
- `InfoCard`: Shows informational content with icons and badges
- `ProgressCard`: Circular progress indicator with customizable colors
- `BadgeGroupCard`: Groups related badges with counts
- `ChartCard`: Generic chart wrapper supporting multiple chart types
- `ScrollableCard`: Scrollable content areas
- `AnnouncementFeed`: Specialized feed for announcements

### Charts
- `AttendanceChart`: Weekly attendance visualization
- `LeaveDistributionChart`: Leave usage breakdown
- `WorkHoursTrendChart`: Shift completion progress

### Sections
- `EmployeeDashboardSection`: Complete employee view
- `TeamDashboardSection`: Complete manager/admin view

## Usage

### Basic Implementation
```tsx
import { EnhancedDashboard } from '@/components/dashboard';

function App() {
  return (
    <EnhancedDashboard 
      userRole="manager" // "employee" | "manager" | "admin"
      defaultTab="employee" // "employee" | "team"
    />
  );
}
```

### Individual Component Usage
```tsx
import { StatCard, ChartCard, AnnouncementFeed } from '@/components/dashboard';

// Stat Card
<StatCard
  title="Total Employees"
  value={150}
  icon={<Users className="w-6 h-6" />}
  variant="success"
  isAnimated={true}
/>

// Chart Card
<ChartCard
  title="Attendance Trend"
  type="line"
  data={chartData}
  height={300}
/>

// Announcement Feed
<AnnouncementFeed 
  announcements={announcements}
  maxHeight={400}
/>
```

## Customization

### Theme Support
The dashboard automatically adapts to your theme system using CSS variables:
- `--primary`: Primary color
- `--secondary`: Secondary color
- `--background`: Background color
- `--foreground`: Text color
- `--muted-foreground`: Muted text color

### Responsive Design
All components are built with mobile-first responsive design:
- Grid layouts automatically adjust for different screen sizes
- Charts maintain aspect ratios
- Navigation adapts to touch interfaces

## Dependencies

- React 19+
- TypeScript
- Chart.js & react-chartjs-2
- Radix UI components
- Tailwind CSS
- Lucide React (icons)
- react-countup (animations)
- react-circular-progressbar

## Data Integration

### Mock Data
Currently uses mock data for demonstration. Replace with your API endpoints:

```tsx
// Replace mock data with API calls
const { data: employeeStats } = useQuery(['employee-stats'], fetchEmployeeStats);
const { data: teamStats } = useQuery(['team-stats'], fetchTeamStats);
```

### Real-time Updates
Implement real-time updates using WebSocket or polling:

```tsx
// WebSocket example
useEffect(() => {
  const ws = new WebSocket('ws://your-api/dashboard');
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateDashboardData(data);
  };
}, []);
```

## Performance Optimization

- Charts are lazy-loaded and memoized
- Data updates are debounced
- Virtual scrolling for large lists
- Efficient re-rendering with React.memo

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast color schemes
- Focus management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Adding New Widgets
1. Create component in `src/components/dashboard/widgets/`
2. Export from `index.ts`
3. Add to appropriate dashboard section

### Adding New Charts
1. Create chart component in `src/components/dashboard/charts/`
2. Register Chart.js components
3. Implement responsive options
4. Add TypeScript interfaces

### Extending Dashboard Sections
1. Modify existing sections or create new ones
2. Update the main dashboard component
3. Add role-based access controls
