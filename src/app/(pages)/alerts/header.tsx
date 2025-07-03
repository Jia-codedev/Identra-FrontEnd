"use client";

import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  DatePicker,
} from "@nextui-org/react";
import SearchBar from "@/widgets/SearchBar.widget";
import CustomButton from "@/components/ui/CustomButton";
import { sidebar_secondary } from "@/lib/routes/routes-data";
import { ExportExcelIcon, CalendarIcon, DropDownIcon } from "@/lib/svg/icons"
import { cn } from "@/lib/utils";

interface SubItem {
    key: string;
    label: string;
}

function Header({ setTab }: { setTab: (tab: string) => void }) {
    const [items, setItems] = useState<SubItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SubItem | null>(null);

  useEffect(() => {
    const newItems: SubItem[] = [];
    sidebar_secondary.forEach(item => {
      if (item.name === "Alerts") {
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

  const stylesDateInput = {
    inputWrapper: [
        "bg-foreground rounded-full border border-border-accent h-[45px] shadow-none px-4 min-w-[300px] max-w-[300px]",
    ],
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
                <p className="text-secondary font-medium text-sm">
                Alerts / {selectedItem?.label}
                </p>
            </div>
            <div className="content-header-actions flex gap-3 items-center text-xs font-bold">
                <SearchBar placeholderText={'Search here...'}/>
                <CustomButton 
                    variant="success" 
                    borderRadius="lg" 
                    width = "auto" 
                    height="35px"
                    onClick={() => alert("Download")}
                    btnText='Export to excel'
                    btnIcon={ExportExcelIcon()}
                />
            </div>
        </div>
        <div className="content-filter gap-3 flex  items-center pb-6 px-6 w-fit">
            <DatePicker
                isRequired
                labelPlacement='outside-left'
                color='success'
                dateInputClassNames={stylesDateInput}
                classNames={{
                    base:  cn(
                        "shadow-none text-sm",
                    ),
                    selectorButton:"text-secondary",
                    calendar:"bg-text-primary font-normal text-sm text-white border-border-accent shadow-searchbar rounded-lg",
                    calendarContent: " text-secondary",
                    input: "text-sm",
                    label: "text-sm",
                }}
                startContent={
                <div className='w-full flex items-center gap-1 flex-row'>
                    <p className='flex flex-row font-normal text-sm text-secondary'>From Date</p>
                    <span className='text-danger font-bold mx-1'>*</span>
                    <p className='font-normal text-sm text-secondary'>:</p>
                </div>
                }
                selectorIcon={
                    CalendarIcon()
                }
            />
            <DatePicker
                isRequired
                labelPlacement='outside-left'
                color='success'
                dateInputClassNames={stylesDateInput}
                classNames={{
                    base:  cn(
                        "shadow-none text-sm",
                    ),
                    selectorButton:"text-secondary",
                    calendar:"bg-text-primary font-normal text-sm text-white border-border-accent shadow-searchbar rounded-lg",
                    calendarContent: " text-secondary",
                    input: "text-sm",
                    label: "text-sm",
                }}
                startContent={
                <div className='w-full flex items-center gap-1 flex-row'>
                    <p className='flex flex-row font-normal text-sm text-secondary'>To Date</p>
                    <span className='text-danger font-bold mx-1'>*</span>
                    <p className='font-normal text-sm text-secondary'>:</p>
                </div>
                }
                selectorIcon={
                    CalendarIcon()
                }
            />
        </div>
    </React.Fragment>
  );
};

export default Header;