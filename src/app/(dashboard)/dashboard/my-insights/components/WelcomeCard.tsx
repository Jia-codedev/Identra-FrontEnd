import React from "react";
import { Mail, Building2, UserCircle } from "lucide-react";

interface WelcomeCardProps {
    name?: string;
    email?: string;
    organization?: string;
    role?: string;
    greeting?: string;
}

function WelcomeCard({
    name = "User",
    email = "user@example.com",
    organization = "Organization",
    role = "Employee",
    greeting = "Welcome back",
}: WelcomeCardProps) {
    return (
        <div className="bg-card border rounded-xl p-6 h-full">
            <p className="text-muted-foreground text-sm mb-1">{greeting},</p>
            <h2 className="text-3xl font-bold text-foreground mb-6">{name}</h2>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 p-2.5 rounded-lg shrink-0">
                        <Mail className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                        <p className="text-sm text-foreground font-medium truncate">
                            {email}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="bg-purple-500/10 p-2.5 rounded-lg shrink-0">
                        <Building2 className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">Organization</p>
                        <p className="text-sm text-foreground font-medium truncate">
                            {organization}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="bg-green-500/10 p-2.5 rounded-lg shrink-0">
                        <UserCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">Role</p>
                        <p className="text-sm text-foreground font-medium truncate">
                            {role}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeCard;
