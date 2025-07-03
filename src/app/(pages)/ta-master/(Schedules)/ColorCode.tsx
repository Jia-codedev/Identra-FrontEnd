"use client";
import React, { useState } from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

function ColorCode() {

  const items = [
    {
      key: "normal",
      label: "#0E6ECF",
      icon: <span className="w-4 h-4 bg-[#0E6ECF]"/>,
    },
    {
        key: "day",
        label: "#00C875",
        icon: <span className="w-4 h-4 bg-[#00C875]"/>,
    },
    {
        key: "night",
        label: "#DF2F4A",
        icon: <span className="w-4 h-4 bg-[#DF2F4A]"/>,
    },
    {
        key: "friday",
        label: "#9D50DD",
        icon: <span className="w-4 h-4 bg-[#9D50DD]"/>,
    },
  ];

  const [selectedItem, setSelectedItem] = useState(items[0]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          disableRipple
          isLoading={false}
          variant="light"
          className="text-sm font-bold p-0 block gap-1 h-auto w-auto outline-none"
        >
          <div className="flex justify-between px-3 items-center h-10 rounded-full border bg-transparent text-text-primary border-border-grey text-sm w-[220px]">
            <div className="flex flex-row text-left">
              <div className="text-sm text-text-primary font-normal">{selectedItem.label}</div>
            </div>
            {selectedItem.icon}
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
        className={`p-0 bg-white w-[200px] shadow-dropdown rounded-md overflow-visible`}
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            className={`p-3 text-sm hover:text-blue hover:bg-dropdown-active`}
            >
            <div className="flex flex-row gap-2">
              {item.label}
              {item.icon}
            </div>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default ColorCode;