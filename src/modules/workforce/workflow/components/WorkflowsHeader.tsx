import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/use-translations";
import { useLanguage } from "@/providers/language-provider";

interface WorkflowsHeaderProps {
  search: string;
  onSearchChange: (search: string) => void;
  onAddWorkflow: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export const WorkflowsHeader: React.FC<WorkflowsHeaderProps> = ({
  search,
  onSearchChange,
  onAddWorkflow,
  selectedCount,
  onDeleteSelected,
}) => {
  const { t } = useTranslations();
  const { isRTL } = useLanguage();

  return (
    <div className="sticky top-0 z-10 bg-background/80 rounded-t-3xl px-4 py-8 border-b border-border">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight mb-1">
            {t("workforce.workflows_title") || "Workflows"}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-normal mb-2">
            {t("workforce.workflows_description") ||
              "Manage and automate your workflows."}
          </p>
          {selectedCount > 0 && (
            <p className="text-sm text-primary font-medium">
              {t("common.selectedCount", { count: selectedCount })}
            </p>
          )}
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 items-center">
          <div
            className={`flex items-center gap-0 bg-card/80 border border-border rounded-xl px-2 py-1 ${
              isRTL ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Input
              placeholder={t("common.search") || "Search"}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-0 bg-transparent rounded-lg focus:ring-0 focus-visible:ring-0 shadow-none text-base px-2"
            />
            <span className="mx-2 h-6 w-px bg-border" />
            {selectedCount > 0 ? (
              <Button
                onClick={onDeleteSelected}
                className="font-semibold text-base px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 transition-all shadow-none"
                variant="destructive"
              >
                <span className="hidden sm:inline">{t("common.delete")}</span>
                <span className="sm:hidden text-xl leading-none">🗑️</span>
              </Button>
            ) : (
              <Button
                onClick={onAddWorkflow}
                className="font-semibold text-base px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition-all shadow-none"
                variant="default"
              >
                <span className="hidden sm:inline">
                  + {t("workforce.add_workflow") || "Add Workflow"}
                </span>
                <span className="sm:hidden text-xl leading-none">+</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
