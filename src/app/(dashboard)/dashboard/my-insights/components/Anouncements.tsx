"use client";
import React from "react";
import { Bell, Calendar, User } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";

interface Announcement {
    id: number;
    title: string;
    description: string;
    author: string;
    date: string;
    priority?: "high" | "medium" | "low";
}

interface AnnouncementsProps {
    announcements?: Announcement[];
    onShowAll?: () => void;
}

const defaultAnnouncements: Announcement[] = [
    {
        id: 1,
        title: "Company Holiday - Thanksgiving",
        description:
            "Office will be closed on Thursday and Friday for Thanksgiving holiday. Happy holidays everyone!",
        author: "HR Department",
        date: "2025-11-20",
        priority: "high",
    },
    {
        id: 2,
        title: "New Performance Review System",
        description:
            "We're implementing a new performance review system starting next month. Training sessions will be scheduled.",
        author: "Management",
        date: "2025-11-15",
        priority: "medium",
    },
    {
        id: 3,
        title: "Team Building Event",
        description:
            "Join us for our annual team building event next Friday. Location and time details will follow.",
        author: "Events Team",
        date: "2025-11-10",
        priority: "low",
    },
];

function Announcements({
    announcements = defaultAnnouncements,
    onShowAll,
}: AnnouncementsProps) {
    const { t } = useTranslations();
    
    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case "high":
                return "border-red-500/30 bg-red-500/5";
            case "medium":
                return "border-orange-500/30 bg-orange-500/5";
            case "low":
                return "border-blue-500/30 bg-blue-500/5";
            default:
                return "border-border bg-muted/20";
        }
    };

    const getPriorityBadge = (priority?: string) => {
        switch (priority) {
            case "high":
                return (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-500">
                        {t("dashboard.high")}
                    </span>
                );
            case "medium":
                return (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-500">
                        {t("dashboard.medium")}
                    </span>
                );
            case "low":
                return (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500">
                        {t("dashboard.low")}
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-card border rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-foreground" />
                    <h3 className="text-xl font-semibold text-foreground">
                        {t("dashboard.announcements")}
                    </h3>
                </div>
                <button
                    onClick={onShowAll}
                    className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                >
                    {t("dashboard.showAll")}
                </button>
            </div>

            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground text-sm">
                            {t("dashboard.noAnnouncementsAtThisTime")}
                        </p>
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getPriorityColor(
                                announcement.priority
                            )}`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-foreground flex-1">
                                    {announcement.title}
                                </h4>
                                {getPriorityBadge(announcement.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {announcement.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{announcement.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                        {new Date(announcement.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Announcements;
