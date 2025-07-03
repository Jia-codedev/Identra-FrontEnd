"use client";

import React, { useState } from "react";
import Image from "next/image";
import USAFlag from "../../public/usa.svg";
import UAEFlag from "../../public/uae.svg";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { DropDownIcon } from "@/lib/svg/icons";

function CountryDropdown() {

  const items = [
    {
      key: "english",
      label: "English",
      icon: USAFlag,
    },
    {
      key: "arabic",
      label: "العربية",
      icon: UAEFlag,
    },
  ];

  const [selectedItem, setSelectedItem] = useState<
    { key: string; label: string; icon: any } | undefined
  >(items[0]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          disableRipple
          isLoading={false}
          variant="light"
          className="outline-none p-0"
        >
          <div className="navbar-country-dropdown flex gap-2 items-center">
            <div className="navbar-country-flag rounded-full relative h-6 w-6">
              <Image
                src={selectedItem?.icon}
                alt={selectedItem?.label as string}
                className="w-full h-full"
              />
            </div>
            <div className="flex flex-col text-left">
              <div className="navbar-country-name text-sm font-bold text-text-primary">{selectedItem?.label}</div>
            </div>
            <span className="text-text-primary w-6">{DropDownIcon()}</span>
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
        className={`p-0 bg-foreground w-[150px] shadow-dropdown rounded-md overflow-visible`}
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            className={`p-3 text-sm text-text-primary hover:text-primary hover:bg-backdrop`}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default CountryDropdown;