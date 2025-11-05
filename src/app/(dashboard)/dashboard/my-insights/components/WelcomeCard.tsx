import React from "react";
import { Mail, Building2, UserCircle } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { useTranslations } from "@/hooks/use-translations";

interface WelcomeCardProps {
    isLoading: boolean;
    profile: {
        firstname_eng?: string;
        lastname_eng?: string;
        email?: string;
        organization_eng?: string;
        organization_arb?: string;
        role?: string;
    }
    greeting?: string;
}

function WelcomeCard({
    isLoading,
    profile: {
        firstname_eng,
        lastname_eng,
        email,
        organization_eng,
        organization_arb,
        role,
    },
    greeting,

}: WelcomeCardProps) {
    const { isRTL } = useLanguage();
    const { t } = useTranslations();
    
    return (
        <div className="bg-card border rounded-xl p-6 h-full">
            <p className="text-muted-foreground text-sm mb-1">{greeting || t("dashboard.welcome")},</p>
            <h2 className="text-xl font-bold text-foreground mb-6">{
                !isRTL ? `${firstname_eng || ""} ${lastname_eng || ""}` : `${lastname_eng || ""} ${firstname_eng || ""}`
            }</h2>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 p-2.5 rounded-lg shrink-0">
                        <Mail className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">{t("dashboard.email")}</p>
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
                        <p className="text-xs text-muted-foreground mb-0.5">{t("dashboard.organization")}</p>
                        <p className="text-sm text-foreground font-medium truncate">
                            {
                                !isRTL ? organization_eng : organization_arb
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="bg-green-500/10 p-2.5 rounded-lg shrink-0">
                        <UserCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">{t("dashboard.role")}</p>
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
