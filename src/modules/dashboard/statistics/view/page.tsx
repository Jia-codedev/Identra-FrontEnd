"use client";

import EnhancedDashboard from "@/components/dashboard/EnhancedDashboard";

function Dashboard() {
  // You can determine user role from your auth context/store
  // For demo purposes, we'll use "manager" to show both views
  const userRole = "manager"; // This should come from your auth context
  return <EnhancedDashboard userRole={userRole as any} defaultTab="employee" />;
}

export default Dashboard;
