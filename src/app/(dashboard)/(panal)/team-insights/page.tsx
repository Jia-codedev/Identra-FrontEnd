"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenericTable, TableColumn } from "@/components/common/GenericTable";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";
import {
  FiSun,
  FiUsers,
  FiClock,
  FiUserX,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
}

function StatCard({ title, value, subtitle, trend, icon }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
            <div className="flex items-center gap-2 text-xs">
              {trend && (
                <span
                  className={`flex items-center gap-1 ${
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trend.isPositive ? (
                    <FiTrendingUp className="size-3" />
                  ) : (
                    <FiTrendingDown className="size-3" />
                  )}
                  {trend.value}
                </span>
              )}
              <span className="text-muted-foreground">{subtitle}</span>
            </div>
          </div>
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data for attendance overview table
interface AttendanceRecord {
  id: number;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  date: string;
  status: "Work from office" | "Absent" | "Late arrival" | "Work from home";
  checkIn: string;
  checkOut: string;
  workHours: string;
}

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: 1,
    employeeId: "2341421",
    employeeName: "Ahmed Rashdan",
    role: "Help Desk Executive",
    department: "IT Department",
    date: "29 July 2023",
    status: "Work from office",
    checkIn: "09:02",
    checkOut: "18:00",
    workHours: "10h 3m",
  },
  {
    id: 2,
    employeeId: "3411421",
    employeeName: "Ali Alhamdan",
    role: "Senior Executive",
    department: "Marketing",
    date: "29 July 2023",
    status: "Absent",
    checkIn: "10:04",
    checkOut: "18:00",
    workHours: "9h",
  },
  {
    id: 3,
    employeeId: "2341121",
    employeeName: "Mona Alghafar",
    role: "Senior Manager",
    department: "Design",
    date: "29 July 2023",
    status: "Late arrival",
    checkIn: "10:30",
    checkOut: "18:00",
    workHours: "9h 30m",
  },
  {
    id: 4,
    employeeId: "2341421",
    employeeName: "Moustafa Adel",
    role: "Director",
    department: "Development",
    date: "29 July 2023",
    status: "Work from home",
    checkIn: "09:00",
    checkOut: "18:00",
    workHours: "10h 5m",
  },
  {
    id: 5,
    employeeId: "2341421",
    employeeName: "Jhon Neelson",
    role: "Director",
    department: "Sales",
    date: "29 July 2023",
    status: "Work from office",
    checkIn: "09:12",
    checkOut: "18:08",
    workHours: "10h 2m",
  },
  {
    id: 6,
    employeeId: "2341421",
    employeeName: "Kadi Manela",
    role: "System coordinator",
    department: "IT Department",
    date: "29 July 2023",
    status: "Work from office",
    checkIn: "9:02",
    checkOut: "18:05",
    workHours: "10h 12m",
  },
];

// Mock data for charts
const attendanceComparisonData = [
  { date: "01 Aug", attendance: 65 },
  { date: "02 Aug", attendance: 70 },
  { date: "03 Aug", attendance: 68 },
  { date: "04 Aug", attendance: 91 },
  { date: "05 Aug", attendance: 73 },
  { date: "06 Aug", attendance: 68 },
  { date: "07 Aug", attendance: 82 },
  { date: "08 Aug", attendance: 75 },
  { date: "09 Aug", attendance: 71 },
  { date: "10 Aug", attendance: 79 },
  { date: "11 Aug", attendance: 85 },
  { date: "12 Aug", attendance: 68 },
  { date: "13 Aug", attendance: 74 },
  { date: "14 Aug", attendance: 71 },
  { date: "15 Aug", attendance: 68 },
  { date: "16 Aug", attendance: 77 },
];

const weeklyAttendanceData = [
  { day: "Sunday", attendance: 55 },
  { day: "Monday", attendance: 62 },
  { day: "Tuesday", attendance: 88 },
  { day: "Wednesday", attendance: 68 },
  { day: "Thursday", attendance: 59 },
  { day: "Friday", attendance: 0 },
  { day: "Saturday", attendance: 0 },
];

export default function TeamInsights() {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [chartView, setChartView] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily"
  );

  // Table columns configuration
  const columns: TableColumn<AttendanceRecord>[] = [
    {
      key: "id",
      header: "ID",
      accessor: (item) => item.employeeId,
      width: "w-24",
    },
    {
      key: "employee",
      header: "Employee",
      accessor: (item) => item.employeeName,
      width: "w-40",
    },
    {
      key: "role",
      header: "Role",
      accessor: (item) => (
        <span className="text-muted-foreground">{item.role}</span>
      ),
    },
    {
      key: "department",
      header: "Department",
      accessor: (item) => (
        <span className="text-muted-foreground">{item.department}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      accessor: (item) => item.date,
    },
    {
      key: "status",
      header: "Status",
      accessor: (item) => {
        const statusColors = {
          "Work from office": "default",
          Absent: "destructive",
          "Late arrival": "secondary",
          "Work from home": "outline",
        } as const;
        return <Badge variant={statusColors[item.status]}>{item.status}</Badge>;
      },
    },
    {
      key: "checkIn",
      header: "Check-in",
      accessor: (item) => (
        <span className="text-primary font-medium">{item.checkIn}</span>
      ),
    },
    {
      key: "checkOut",
      header: "Check-out",
      accessor: (item) => (
        <span className="text-muted-foreground">{item.checkOut}</span>
      ),
    },
    {
      key: "workHours",
      header: "Work hours",
      accessor: (item) => item.workHours,
    },
  ];

  const handleSelectItem = (id: number | string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockAttendanceData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockAttendanceData.map((item) => item.id));
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FiSun className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">8:02:09 AM</h1>
            <p className="text-sm text-muted-foreground">Realtime Insight</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Today:</span>
          <span className="text-sm">2nd August 2023</span>
        </div>
        
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Employees"
          value="452"
          subtitle="+5 new employees added"
          trend={{ value: "+2%", isPositive: true }}
          icon={<FiUsers className="size-6" />}
        />
        <StatCard
          title="On Time"
          value="360"
          subtitle="-10(+) Less than yesterday"
          trend={{ value: "-10(+)", isPositive: false }}
          icon={<FiClock className="size-6" />}
        />
        <StatCard
          title="Absent"
          value="30"
          subtitle="+0(%) Increase than yesterday"
          trend={{ value: "+0(%)", isPositive: true }}
          icon={<FiUserX className="size-6" />}
        />
        <StatCard
          title="Late Arrival"
          value="62"
          subtitle="+5(%) Increase than yesterday"
          trend={{ value: "+5%", isPositive: false }}
          icon={<FiTrendingUp className="size-6" />}
        />
        <StatCard
          title="Early Departures"
          value="6"
          subtitle="-10(+) Less than yesterday"
          trend={{ value: "-10(+)", isPositive: true }}
          icon={<FiTrendingDown className="size-6" />}
        />
        <StatCard
          title="Time-off"
          value="42"
          subtitle="-2(+) Increase than yesterday"
          trend={{ value: "-2(+)", isPositive: true }}
          icon={<FiCalendar className="size-6" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Attendance Comparison Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendance Comparison Chart</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={chartView === "Daily" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartView("Daily")}
                >
                  Daily
                </Button>
                <Button
                  variant={chartView === "Weekly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartView("Weekly")}
                >
                  Weekly
                </Button>
                <Button
                  variant={chartView === "Monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartView("Monthly")}
                >
                  Monthly
                </Button>
                <Button variant="ghost" size="sm">
                  <FiFilter className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={attendanceComparisonData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e758fdfd" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e758fdfd" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  strokeOpacity={0.3}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  wrapperStyle={{ outline: "none" }}
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 600, marginBottom: "4px" }}
                  itemStyle={{ color: "var(--primary)", padding: "2px 0" }}
                  formatter={(value: number) => [`${value}%`, "Attendance"]}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ 
                    fill: "var(--primary)", 
                    strokeWidth: 2, 
                    r: 4,
                    stroke: "hsl(var(--background))"
                  }}
                  activeDot={{ 
                    r: 6, 
                    fill: "var(--primary)",
                    stroke: "#fff",
                    strokeWidth: 2
                  }}
                  fillOpacity={1}
                  fill="var(--primary)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Attendance Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weekly Attendance</CardTitle>
              <Button variant="ghost" size="sm">
                <FiFilter className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={weeklyAttendanceData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e758fdfd" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#b845d0" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  strokeOpacity={0.3}
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                  tickMargin={5}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  wrapperStyle={{ outline: "none" }}
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "var(--border)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 600, marginBottom: "4px" }}
                  itemStyle={{ color: "var(--primary)", padding: "2px 0" }}
                  formatter={(value: number) => [`${value}%`, "Attendance"]}
                  cursor={{ fill: "var(--border)" }}
                />
                <Bar
                  dataKey="attendance"
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Overview Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance Overview</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Quick Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9"
                />
              </div>
              <Select defaultValue="29-july-2023">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="29-july-2023">29 July 2023</SelectItem>
                  <SelectItem value="28-july-2023">28 July 2023</SelectItem>
                  <SelectItem value="27-july-2023">27 July 2023</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="default" className="gap-2">
                <FiFilter className="size-4" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <GenericTable
            data={mockAttendanceData}
            columns={columns}
            selected={selectedIds}
            page={page}
            pageSize={pageSize}
            allChecked={selectedIds.length === mockAttendanceData.length}
            getItemId={(item) => item.id}
            getItemDisplayName={(item) => item.employeeName}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            noDataMessage="No attendance records found"
            showActions={false}
          />
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Page 1 of 100</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
