"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ScrollableCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  height?: number;
  showTimestamp?: boolean;
}

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  priority?: "low" | "medium" | "high";
}

interface AnnouncementFeedProps {
  announcements: AnnouncementItem[];
  className?: string;
  maxHeight?: number;
}

const ScrollableCard: React.FC<ScrollableCardProps> = ({
  title,
  children,
  className,
  height = 300,
}) => {
  return (
    <Card className={cn("p-3 sm:p-4", className)}>
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">{title}</h3>
      <ScrollArea className={`h-[${height}px]`}>
        {children}
      </ScrollArea>
    </Card>
  );
};

const AnnouncementFeed: React.FC<AnnouncementFeedProps> = ({
  announcements,
  className,
  maxHeight = 400,
}) => {
  const priorityColors = {
    low: "border-l-green-500",
    medium: "border-l-yellow-500",
    high: "border-l-red-500",
  };

  return (
    <ScrollableCard 
      title="Latest Announcements" 
      className={className}
      height={maxHeight}
    >
      <div className="space-y-3">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={cn(
              "border-l-4 pl-3 py-2",
              priorityColors[announcement.priority || "low"]
            )}
          >
            <h4 className="font-medium text-foreground text-sm">
              {announcement.title}
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {announcement.content}
            </p>
            <span className="text-xs text-muted-foreground">
              {new Date(announcement.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </ScrollableCard>
  );
};

export { ScrollableCard, AnnouncementFeed };
export type { AnnouncementItem };
