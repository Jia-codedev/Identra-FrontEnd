import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Users,
  ChevronDown,
  ChevronRight,
  Minus,
} from "lucide-react";
import { IOrganizationStructure } from "../types";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

interface OrganizationSchematicDiagramProps {
  data: IOrganizationStructure[];
}

interface OrgNodeProps {
  organization: IOrganizationStructure;
  level: number;
}

const OrgNode: React.FC<OrgNodeProps> = ({ organization, level }) => {
  const { isRTL } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasChildren = organization.children && organization.children.length > 0;

  const orgName = isRTL
    ? organization.organization_arb || organization.organization_eng
    : organization.organization_eng || organization.organization_arb;

  const orgType = organization.organization_types
    ? isRTL
      ? organization.organization_types.organization_type_arb ||
        organization.organization_types.organization_type_eng
      : organization.organization_types.organization_type_eng ||
        organization.organization_types.organization_type_arb
    : "";

  const location = organization.locations
    ? isRTL
      ? organization.locations.location_arb ||
        organization.locations.location_eng
      : organization.locations.location_eng ||
        organization.locations.location_arb
    : "";

  const getLevelColor = (lvl: number) => {
    const colors = [
      "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
      "border-emerald-600 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20",
      "border-violet-600 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/30 dark:to-violet-900/20",
      "border-amber-600 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20",
      "border-rose-600 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20",
    ];
    return colors[lvl % colors.length];
  };

  const getIconColor = (lvl: number) => {
    const colors = [
      "text-blue-700 dark:text-blue-400",
      "text-emerald-700 dark:text-emerald-400",
      "text-violet-700 dark:text-violet-400",
      "text-amber-700 dark:text-amber-400",
      "text-rose-700 dark:text-rose-400",
    ];
    return colors[lvl % colors.length];
  };

  const getLevelLabel = (lvl: number) => {
    const labels = ["ROOT", "LEVEL 1", "LEVEL 2", "LEVEL 3", "LEVEL 4"];
    return labels[lvl] || `LEVEL ${lvl}`;
  };

  // Calculate indentation based on level
  const indentWidth = level * 60;

  return (
    <div className="org-node-wrapper w-full relative">
      {/* Organization Card with Level Indicator */}
      <div className="flex items-start gap-0 mb-4">
        {/* Level Connector Line - Proper tree structure */}
        {level > 0 && (
          <div
            className="relative flex items-center"
            style={{ width: `${indentWidth}px`, height: "100%" }}
          >
            {/* Horizontal line from vertical parent line to dot - aligned to actual card center */}
            <div
              className="absolute h-[2px] bg-border"
              style={{
                left: "8px",
                right: "0",
                top: "70px", // Badge (20px) + margin (8px) + card padding/center (~42px)
              }}
            />
            {/* Connection dot aligned at the end of horizontal line */}
            <div
              className="absolute w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm"
              style={{
                right: "-6px",
                top: "64px", // Align with horizontal line center
              }}
            />
          </div>
        )}

        {/* Organization Card */}
        <div className="flex-1">
          {/* Level Badge */}
          <div className="mb-2">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-2 py-0.5 font-bold",
                level === 0 &&
                  "bg-blue-100 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-400",
                level === 1 &&
                  "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-600 text-emerald-700 dark:text-emerald-400",
                level === 2 &&
                  "bg-violet-100 dark:bg-violet-900/30 border-violet-600 text-violet-700 dark:text-violet-400",
                level >= 3 &&
                  "bg-amber-100 dark:bg-amber-900/30 border-amber-600 text-amber-700 dark:text-amber-400"
              )}
            >
              {getLevelLabel(level)}
            </Badge>
          </div>

          <div
            className={cn(
              "org-card relative px-6 py-4 rounded-xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl bg-card",
              getLevelColor(level),
              level === 0 && "border-[3px]"
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div
              className={cn(
                "flex items-start gap-3",
                isRTL ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn("p-2.5 rounded-lg bg-muted/50 shadow-sm")}>
                <Building2 className={cn("h-6 w-6", getIconColor(level))} />
              </div>

              <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                <h3
                  className={cn(
                    "font-bold mb-1.5 text-foreground",
                    level === 0 ? "text-lg" : "text-base"
                  )}
                >
                  {orgName}
                </h3>

                <div
                  className={cn(
                    "flex flex-wrap gap-2 mb-2",
                    isRTL ? "flex-row-reverse" : ""
                  )}
                >
                  <Badge
                    variant="outline"
                    className="text-xs px-2.5 py-0.5 font-semibold"
                  >
                    {organization.organization_code}
                  </Badge>
                  {orgType && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-2.5 py-0.5 font-medium"
                    >
                      {orgType}
                    </Badge>
                  )}
                </div>

                {location && (
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs text-muted-foreground",
                      isRTL ? "flex-row-reverse" : ""
                    )}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{location}</span>
                  </div>
                )}

                {hasChildren && (
                  <div
                    className={cn(
                      "flex items-center gap-1.5 text-xs text-muted-foreground mt-2",
                      isRTL ? "flex-row-reverse" : ""
                    )}
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      {organization.children.length}{" "}
                      {organization.children.length === 1
                        ? "Sub-unit"
                        : "Sub-units"}
                    </span>
                  </div>
                )}
              </div>

              {/* Collapse/Expand Button */}
              {hasChildren && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className={cn(
                    "p-1.5 rounded-lg hover:bg-accent transition-colors"
                  )}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Children - Indented Layout with proper tree lines */}
      {hasChildren && !isCollapsed && (
        <div className="org-children relative">
          {/* Vertical line connecting children - positioned at children's level */}
          <div
            className="absolute w-[2px] bg-border"
            style={{
              left: `${(level + 1) * 60 + 8}px`, // Position at next level (children's indentation)
              top: "-70px", // Start from parent card center (where horizontal line connects)
              bottom: "16px",
            }}
          />
          {organization.children.map((child) => (
            <OrgNode
              key={child.organization_id}
              organization={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const OrganizationSchematicDiagram: React.FC<
  OrganizationSchematicDiagramProps
> = ({ data }) => {
  const { isRTL } = useLanguage();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "org-chart-container w-full overflow-auto p-6 bg-muted/30 rounded-lg border",
        isRTL ? "text-right" : "text-left"
      )}
      dir={isRTL ? "rtl" : "ltr"}
      style={{ minHeight: "500px", maxHeight: "calc(100vh - 220px)" }}
    >
      <div className="w-full">
        {data.map((org) => (
          <OrgNode key={org.organization_id} organization={org} level={0} />
        ))}
      </div>
    </div>
  );
};
