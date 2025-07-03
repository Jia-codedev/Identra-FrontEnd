"use client";
import React, { useState } from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

function ScheduleColorDropDown() {

  const items = [
    {
      key: "normal",
      color: "#0E6ECF",
      label: "Nor",
      badge: <div className="flex justify-center items-center w-[52px] h-[26px] rounded-[3px] bg-[#0E6ECF] text-white text-xs font-extrabold text-center">Normal</div>
    },
    {
      key: "day",
      color: "#00C875",
      label: "Day",
      badge: <div className="flex justify-center items-center w-[52px] h-[26px] rounded-[3px] bg-[#00C875] text-white text-xs font-extrabold text-center">Day</div>
    },
    {
        key: "night",
        color: "#DF2F4A",
        label: "Nit",
        badge: <div className="flex justify-center items-center w-[52px] h-[26px] rounded-[3px] bg-[#DF2F4A] text-white text-xs font-extrabold text-center">Night</div>
    },
    {
        key: "friday",
        color: "#9D50DD",
        label: "Fri",
        badge: <div className="flex justify-center items-center w-[52px] h-[26px] rounded-[3px] bg-[#9D50DD] text-white text-xs font-extrabold text-center">Friday</div>
    },
  ];

  const [selectedItem, setSelectedItem] = useState(items[0]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className={cn(
          "w-[30px] h-[25px] rounded-[3px]",
          "flex justify-center items-center",
          "text-white text-xs font-extrabold text-center",
          `bg-[${selectedItem.color}]`,
          )}
        >
          {selectedItem.label}
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        items={items}
        onAction={(key) => {
          const selected = items.find((item) => item.key === key);
          setSelectedItem(selected ?? items[0]);
        }}
        classNames={{
          base: 'px-4 py-3 bg-foreground w-[150px] shadow-dropdown rounded-md',
          list: 'flex flex-row w-auto items-center p-0 gap-3 max-h-[100px] flex-wrap',
        }}
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            className="p-0 w-auto"
            classNames={{
              base: 'p-0 w-auto',
            }}
            >
            <div className="">
              {item.badge}
            </div>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default ScheduleColorDropDown;