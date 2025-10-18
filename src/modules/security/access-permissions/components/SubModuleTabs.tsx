"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type SubModule = {
  sub_module_id: number;
  sub_module_name: string;
};

export default function SubModuleTabs({
  subModule,
  rolePrivileges,
  selectedRole,
  getTabs,
  toggleSubModulePermission,
  toggleTabPermission,
}: {
  subModule: SubModule;
  rolePrivileges: Record<string, any>;
  selectedRole: number | null;
  getTabs: (subModuleId: number) => Promise<any[]>;
  toggleSubModulePermission: (subModuleId: number, perm: string) => void;
  toggleTabPermission: (
    tabId: number,
    subModuleId: number,
    perm: string
  ) => void;
}) {
  const [tabs, setTabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getTabs(subModule.sub_module_id);
        if (mounted) setTabs(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [subModule.sub_module_id, getTabs]);

  const perms = ["view", "create", "edit", "delete"];

  return (
    <Accordion
      type="single"
      className="border-border bg-card p-3 rounded-2xl"
      collapsible
    >
      <AccordionItem value={`sub-${subModule.sub_module_id}`}>
        <AccordionTrigger className="py-2 flex items-center justify-between hover:no-underline">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{subModule.sub_module_name}</span>
            <Badge className="ml-2" variant="outline">
              Submodule
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              {perms.map((perm) => {
                const key =
                  `sub_${subModule.sub_module_id}_${perm}` +
                  (selectedRole ? `_role_${selectedRole}` : "");
                return (
                  <div key={perm} className="flex items-center space-x-2">
                    <Checkbox
                      checked={!!rolePrivileges[key]}
                      onCheckedChange={() =>
                        toggleSubModulePermission(subModule.sub_module_id, perm)
                      }
                      disabled={!selectedRole}
                    />
                    <Label className="capitalize">{perm}</Label>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium mb-2">Tabs</div>
              <div className="space-y-3">
                {loading && (
                  <div className="text-sm text-muted-foreground">
                    Loading tabs...
                  </div>
                )}

                {tabs.map((tab: any) => (
                  <div
                    key={tab.tab_id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="font-medium">{tab.tab_name}</div>
                      {tab.tab_description && (
                        <div className="text-sm text-muted-foreground">
                          {tab.tab_description}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {perms.map((perm) => {
                        const key =
                          `tab_${tab.tab_id}_sub_${subModule.sub_module_id}_${perm}` +
                          (selectedRole ? `_role_${selectedRole}` : "");
                        return (
                          <div
                            key={perm}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={!!rolePrivileges[key]}
                              onCheckedChange={() =>
                                toggleTabPermission(
                                  tab.tab_id,
                                  subModule.sub_module_id,
                                  perm
                                )
                              }
                              disabled={!selectedRole}
                            />
                            <Label className="capitalize">{perm}</Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {!loading && tabs.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No tabs found for this submodule.
                  </div>
                )}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
