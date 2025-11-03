"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Folder, Settings } from "lucide-react";

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
  const perms = ["view", "create", "edit", "delete"];

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

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`sub-${subModule.sub_module_id}`}>
        {/* Header */}
        <AccordionTrigger className="px-5 py-3 flex items-center justify-between rounded-lg bg-muted hover:bg-muted/80 transition">
          <div className="flex items-center space-x-2">
            <Folder size={18} />
            <span className="font-medium text-foreground">
              {subModule.sub_module_name}
            </span>
            <Badge variant="outline" className="ml-2">
              Submodule
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {loading ? "Loading..." : `${tabs.length} Tabs`}
          </span>
        </AccordionTrigger>

        {/* Expandable Content */}
        <AccordionContent className="pt-4 ">
          <div className="overflow-x-auto border border-border rounded-xl overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">Type</th>
                  <th className="px-4 py-3 text-right font-medium">Name</th>
                  {perms.map((perm) => (
                    <th
                      key={perm}
                      className="px-4 py-3 text-center capitalize font-medium"
                    >
                      {perm}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Submodule Row */}
                <tr className="border-b border-border hover:bg-muted/40 transition">
                  <td className="px-4 py-3 text-right font-medium flex items-center justify-end gap-1">
                    <Shield size={14} />
                    Submodule
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {subModule.sub_module_name}
                  </td>
                  {perms.map((perm) => {
                    const key =
                      `sub_${subModule.sub_module_id}_${perm}` +
                      (selectedRole ? `_role_${selectedRole}` : "");
                    return (
                      <td key={perm} className="px-4 py-3 text-center">
                        <Switch
                          checked={!!rolePrivileges[key]}
                          onCheckedChange={() =>
                            toggleSubModulePermission(
                              subModule.sub_module_id,
                              perm
                            )
                          }
                          disabled={!selectedRole}
                        />
                      </td>
                    );
                  })}
                </tr>

                {/* Tabs Rows */}
                {tabs.map((tab) => (
                  <tr
                    key={tab.tab_id}
                    className="border-b border-border hover:bg-muted/40 transition"
                  >
                    <td className="px-4 py-3 text-right font-medium flex items-center justify-end gap-1">
                      <Settings size={14} />
                      Tab
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {tab.tab_name}
                    </td>
                    {perms.map((perm) => {
                      const key =
                        `tab_${tab.tab_id}_sub_${subModule.sub_module_id}_${perm}` +
                        (selectedRole ? `_role_${selectedRole}` : "");
                      return (
                        <td key={perm} className="px-4 py-3 text-center">
                          <Switch
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
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Fallback */}
                {!loading && tabs.length === 0 && (
                  <tr>
                    <td
                      colSpan={perms.length + 2}
                      className="text-center py-4 text-muted-foreground italic"
                    >
                      No tabs found for this submodule.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
