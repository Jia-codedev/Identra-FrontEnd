"use client";

import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { DropDownIcon, PunchInIcon, PunchOutIcon } from "@/lib/svg/icons";
import CustomButton from "@/components/ui/CustomButton";
import { sidebar_primary } from "@/lib/routes/routes-data";

interface SubItem {
    key: string;
    label: string;
}

function Header({ setTab, tab }: { setTab: (tab: string) => void, tab : string }) {
  const [items, setItems] = useState<SubItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SubItem | null>(null);

  useEffect(() => {
    const newItems: SubItem[] = [];
    sidebar_primary.forEach(item => {
      if (item.name === "Dashboard") {
        item.subItems.forEach(subItem => {
          newItems.push({ key: subItem, label: subItem });
        });
      }
    });
    setItems(newItems);
    if (newItems.length > 0) {
      setSelectedItem(newItems[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setTab(selectedItem.label);
    }
  }, [selectedItem, setTab]);

  const getBreadcrumb = () => {
    const handleClick = (tabName: string) => {
        setTab(tabName);
    };

    const baseBreadcrumb = (
        <>

            {selectedItem ? (
                <>
                    <a
                        href="#"
                        onClick={() => setSelectedItem(items[0])}
                        className="text-secondary no-underline cursor-pointer"
                    >
                        Dashboard
                    </a>
                    {" / "}
                    <a
                        href="#"
                        onClick={() => handleClick(selectedItem.label)}
                        className="text-secondary  cursor-pointer"
                    >
                        {selectedItem.label}
                    </a>
                </>
            ) : (
                <></>
            )}
        </>
    );

    if (tab?.includes("#add")) {
        return (
            <>
                {baseBreadcrumb} {" / "}
                <span className="text-secondary">Add</span>
            </>
        );
    }

    return baseBreadcrumb;
};



  return (
    <React.Fragment>
      <div className="flex justify-between content-header p-6">
        <div className="content-header-dropdown text-text-primary">
          <Dropdown
            placement="bottom-start"
            className="p-0" 
          >
            <DropdownTrigger>
              <Button
                disableRipple
                isLoading={false}
                variant="light"
                className="text-2xl font-bold w-fit p-0 gap-1 text-text-primary"
              >
                <div>
                  {selectedItem ? (
                    <div className="flex items-center gap-2">
                      {selectedItem?.label}            
                      <span className="text-text-primary w-8">{DropDownIcon()}</span>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dynamic Actions"
              items={items}
              onAction={(key) => {
                const selected = items.find((item) => item.key === key);
                setSelectedItem(selected ?? items[0]);
              }}
              className="p-0 bg-foreground w-full shadow-dropdown rounded-lg overflow-hidden"
            >
              {(item) => (
                <DropdownItem
                  className={`p-2 text-text-primary hover:text-primary hover:bg-backdrop`}
                  key={item.key}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          <div className="text-secondary font-medium text-sm">
            {getBreadcrumb()}
          </div>
        </div>
        <div className="content-header-actions flex gap-3 items-center text-xs font-bold">
          <CustomButton 
            variant="success" 
            borderRadius="lg" 
            width = "auto" 
            height="35px"
            btnText='Punch In'
            btnIcon={PunchInIcon()}
            // className="bg-gradient-to-r from-[#0078D4] to-[#003E6E]"
          />
          <CustomButton 
            variant="danger" 
            borderRadius="lg" 
            width = "auto" 
            height="35px"
            btnText='Punch Out'
            btnIcon={PunchOutIcon()}
            // className="bg-gradient-to-r from-[#0078D4] to-[#003E6E]"
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Header;