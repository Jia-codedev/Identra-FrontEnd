import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Building2, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import { IOrganizationStructure } from "../types";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

export type ChartStyle = "hierarchical" | "horizontal";

export interface ChartStyleOption {
  value: ChartStyle;
  label: string;
  description: string;
}

interface OrganizationChartProps {
  data: IOrganizationStructure[];
  style?: ChartStyle;
}

interface TreeNodeProps {
  organization: IOrganizationStructure;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ organization, level }) => {
  const { currentLocale, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(level === 0);
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

  // Get color based on hierarchy level
  const getLevelColor = (lvl: number) => {
    const colors = [
      "text-blue-600 dark:text-blue-400",
      "text-green-600 dark:text-green-400",
      "text-purple-600 dark:text-purple-400",
      "text-orange-600 dark:text-orange-400",
      "text-pink-600 dark:text-pink-400",
      "text-teal-600 dark:text-teal-400",
    ];
    return colors[lvl % colors.length];
  };

  const getBgColor = (lvl: number) => {
    const colors = [
      "bg-blue-50 dark:bg-blue-950/10 hover:bg-blue-100 dark:hover:bg-blue-950/20",
      "bg-green-50 dark:bg-green-950/10 hover:bg-green-100 dark:hover:bg-green-950/20",
      "bg-purple-50 dark:bg-purple-950/10 hover:bg-purple-100 dark:hover:bg-purple-950/20",
      "bg-orange-50 dark:bg-orange-950/10 hover:bg-orange-100 dark:hover:bg-orange-950/20",
      "bg-pink-50 dark:bg-pink-950/10 hover:bg-pink-100 dark:hover:bg-pink-950/20",
      "bg-teal-50 dark:bg-teal-950/10 hover:bg-teal-100 dark:hover:bg-teal-950/20",
    ];
    return colors[lvl % colors.length];
  };

  return (
    <div
      className={cn(
        "border-l-2 border-muted",
        isRTL && "border-l-0 border-r-2"
      )}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            "group relative flex items-center gap-2 py-1.5 px-2 text-sm transition-colors",
            getBgColor(level),
            isRTL ? "flex-row-reverse" : ""
          )}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <button className="shrink-0 hover:bg-background/50 rounded p-0.5 transition-colors">
                {isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            </CollapsibleTrigger>
          ) : (
            <span className="w-4" />
          )}

          {/* Icon */}
          <Building2
            className={cn("h-3.5 w-3.5 shrink-0", getLevelColor(level))}
          />

          {/* Organization Info */}
          <div
            className={cn(
              "flex-1 flex items-center gap-2 min-w-0",
              isRTL ? "flex-row-reverse" : ""
            )}
          >
            <span className="font-medium truncate">{orgName}</span>
            <Badge
              variant="outline"
              className="text-[10px] px-1 py-0 h-4 shrink-0"
            >
              {organization.organization_code}
            </Badge>
          </div>

          {/* Metadata */}
          <div
            className={cn(
              "flex items-center gap-3 text-xs text-muted-foreground shrink-0",
              isRTL ? "flex-row-reverse" : ""
            )}
          >
            {hasChildren && (
              <span className="text-[10px] font-medium">
                ({organization.children.length})
              </span>
            )}
            {orgType && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5"
              >
                {orgType}
              </Badge>
            )}
          </div>
        </div>
        {/* Children */}
        {hasChildren && (
          <CollapsibleContent className={cn(isRTL ? "mr-4" : "ml-4")}>
            {organization.children.map((child) => (
              <TreeNode
                key={child.organization_id}
                organization={child}
                level={level + 1}
              />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

export const OrganizationChart: React.FC<OrganizationChartProps> = ({
  data,
  style = "hierarchical",
}) => {
  const { isRTL } = useLanguage();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("text-sm", isRTL ? "text-right" : "text-left")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {data.map((org) => (
        <TreeNode key={org.organization_id} organization={org} level={0} />
      ))}
    </div>
  );
};
