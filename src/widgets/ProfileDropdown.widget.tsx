import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { DropDownIcon, LogoutIcon, UserPasswordIcon } from "@/lib/svg/icons";

function ProfileDropdown() {
  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Button
          disableRipple
          isLoading={false}
          variant="light"
          className="outline-none overflow-visible p-0"
        >
          <div className="navbar-profile flex items-center h-full">
            <div 
              className="navbar-profile-letter relative w-12 h-12 rounded-lg bg-backdrop flex justify-center items-center"
            >
              <div className="text-primary font-semibold text-xl">A</div>
            </div>
            <div className="flex flex-col text-left px-2">
              <div className="navbar-profile-name text-base font-bold text-text-primary text-wrap">Anu</div>
              <p className="navbar-profile-role text-sm font-semibold text-secondary">Admin</p>
            </div>
            <span className="text-text-primary w-6">{DropDownIcon()}</span>
          </div>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dynamic Actions"
        className={`p-0 bg-foreground w-[200px] shadow-dropdown rounded-md overflow-visible`}
      >
        <DropdownItem
          className={`p-3 text-sm text-text-primary hover:text-primary hover:bg-backdrop`}
          key="change_password"
          startContent={UserPasswordIcon()}
          href="/change-password"
        >
          Change Password
        </DropdownItem>
        <DropdownItem
          className={`p-3 text-sm text-text-primary hover:text-primary hover:bg-backdrop`}
          key="logout"
          startContent={LogoutIcon()}
          href="/login"
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default ProfileDropdown;