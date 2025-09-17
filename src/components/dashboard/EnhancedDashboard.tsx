"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmployeeDashboardSection from "./sections/EmployeeDashboardSection";
import TeamDashboardSection from "./sections/TeamDashboardSection";
import { User, Users, Settings, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedDashboardProps {
  userRole?: "employee" | "manager" | "admin";
  defaultTab?: "employee" | "team";
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  userRole = "employee",
  defaultTab = "employee",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const canViewTeamDashboard = userRole === "manager" || userRole === "admin";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000 opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative p-4">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Welcome back! Ready to make today amazing? ✨
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90"
              >
                <Settings className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Dashboard Content */}
        <motion.div variants={itemVariants}>
          {canViewTeamDashboard ? (
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as any)}
            >
              <TabsList className="grid w-full max-w-md border pb-10 rounded-lg grid-cols-2 mb-6 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
                <TabsTrigger
                  value="employee"
                  className="flex items-center gap-2 px-4 py-2 transition-colors duration-150 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground focus:outline-none"
                >
                  <User className="w-4 h-4" />
                  Self View
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="flex items-center gap-2 px-4 py-2 transition-colors duration-150 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground focus:outline-none"
                >
                  <Users className="w-4 h-4" />
                  Team View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="employee" className="mt-0">
                <motion.div
                  key="employee"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EmployeeDashboardSection />
                </motion.div>
              </TabsContent>

              <TabsContent value="team" className="mt-0">
                <motion.div
                  key="team"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TeamDashboardSection />
                </motion.div>
              </TabsContent>
            </Tabs>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <EmployeeDashboardSection />
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div variants={itemVariants}>
          <Card className="p-4 mt-8 bg-card/60 backdrop-blur-sm border-border/50 ">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Last updated: {new Date().toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-primary/20 rounded-full text-xs font-medium border border-border/50">
                  {userRole === "admin" && "🔑 Administrator View"}
                  {userRole === "manager" && "👥 Manager View"}
                  {userRole === "employee" && "👤 Employee View"}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancedDashboard;
