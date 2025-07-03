"use client";

import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  DatePicker,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import SearchBar from "@/widgets/SearchBar.widget";
import { AddIcon, DeleteIcon, DropDownIcon, CalendarIcon } from "@/lib/svg/icons";
import CustomButton from "@/components/ui/CustomButton";
import Input from "@/components/ui/Input";
import { sidebar_primary } from "@/lib/routes/routes-data";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";

interface SubItem {
  key: string;
  label: string;
}

const reasonmode_dropdown = [
  "Choose reason mode",
  "IN",
  "OUT",
];

function Header({ setTab, tab }: { setTab: (tab: string) => void, tab: string }) {
  const [items, setItems] = useState<SubItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SubItem | null>(null);
  const [showActions, setShowActions] = useState(true);
  const [headerTab, setHeaderTab] = useState<any | null>(null);
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const [selectReasonMode, setSelectReasonMode] = useState<string>(reasonmode_dropdown[0]);

  const stylesDateInput = {
    inputWrapper: [
      "bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 w-full placeholder-text-secondary",
    ],
  };

  const handleSchedulesAddClick = () => {
    setHeaderTab(selectedItem?.label);
    setTab(headerTab + "#add");
    setShowActions(false);
  };

  useEffect(() => {
    if (tab === "Schedules")
      setShowActions(true);
  }, [tab]),

    useEffect(() => {
      const newItems: SubItem[] = [];
      sidebar_primary.forEach(item => {
        if (item.name === "TA Master") {
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
      setHeaderTab(selectedItem.label);
      setTab(headerTab);
    }
    if (headerTab === null) {
      setShowActions(true);
    }
  }, [selectedItem, setTab, setHeaderTab, headerTab]);

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
              TA Master
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
          <SearchBar placeholderText={'Search here...'} />
          <CustomButton
            variant="success"
            borderRadius="lg"
            width="auto"
            height="35px"
            onClick={selectedItem?.label !== "Schedules" ? onOpen : handleSchedulesAddClick}
            btnText='Add'
            btnIcon={AddIcon()}
          />
          <CustomButton
            variant="danger"
            borderRadius="lg"
            width="auto"
            height="35px"
            onClick={() => alert("delete")}
            btnText='Delete'
            btnIcon={DeleteIcon()}
          />
        </div>
      </div>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
        size="2xl"
        classNames={{
          backdrop: "bg-white/75 backdrop-opacity-50",
          base: "bg-foreground text-text-primary shadow-popup rounded-[20px] p-5",
          header: "text-center p-0",
          body: "p-0",
          footer: "flex justify-center gap-2 p-0 py-5 mt-3",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="text-xl font-bold text-text-primary capitalize">{selectedItem?.label}</h1>
                <h4 className="text-sm font-semibold text-text-secondary pb-5">{selectedItem?.label} of the employee</h4>
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full gap-5">
                  <div className="w-full">
                    <Input inputType={'text'} inputLabel={'Description(English)'} placeholderText={'Enter description in english'} inputAttr={true} className={''} labelClassName={''} inputClassName={''} />
                    {(selectedItem?.label === "Holidays" || selectedItem?.label === "Ramadan Dates") ?
                      <div className={cn("py-2 flex flex-col text-left")}>
                        <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                          From Date
                          <span className="text-danger ml-1">*</span>
                        </label>
                        <DatePicker
                          isRequired
                          labelPlacement='outside-left'
                          color='success'
                          dateInputClassNames={stylesDateInput}
                          classNames={{
                            base: cn(
                              "shadow-none text-sm",
                            ),
                            selectorButton: "text-secondary",
                            calendar: "bg-text-primary font-normal text-sm text-white border-border-accent shadow-searchbar rounded-lg",
                            calendarContent: " text-secondary",
                            input: "text-sm",
                            label: "text-sm",
                          }}
                          selectorIcon={
                            CalendarIcon()
                          }
                        />
                      </div>
                      :
                      null
                    }
                    {selectedItem?.label === "Reasons" ?
                      <div>
                        <Input inputType={'text'} inputLabel={'Code'} placeholderText={'Enter code'} inputAttr={true} className={''} labelClassName={''} inputClassName={''} />
                        <Input inputType={'text'} inputLabel={'Prompt Message'} placeholderText={'Enter prompt message'} inputAttr={true} className={''} labelClassName={''} inputClassName={''} />
                      </div>
                      :
                      null
                    }
                    {selectedItem?.label !== "Reasons" ?
                      <Input inputType={'text'} inputLabel={'Remarks'} placeholderText={'Enter the remark'} inputAttr={true} className={''} labelClassName={''} inputClassName={''} />
                      :
                      null
                    }
                  </div>
                  <div className="w-full">
                    <Input inputType={'text'} inputLabel={'Description [العربية]'} placeholderText={'Enter description in arabic'} inputAttr={true} className={''} labelClassName={''} inputClassName={''} />
                    {(selectedItem?.label === "Holidays" || selectedItem?.label === "Ramadan Dates") ?
                      <div className={cn("py-2 flex flex-col text-left")}>
                        <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                          To Date
                          <span className="text-danger ml-1">*</span>
                        </label>
                        <DatePicker
                          isRequired
                          labelPlacement='outside-left'
                          color='success'
                          dateInputClassNames={stylesDateInput}
                          classNames={{
                            base: cn(
                              "shadow-none text-sm",
                            ),
                            selectorButton: "text-secondary",
                            calendar: "bg-text-primary font-normal text-sm text-white border-border-accent shadow-searchbar rounded-lg",
                            calendarContent: " text-secondary",
                            input: "text-sm",
                            label: "text-sm",
                          }}
                          selectorIcon={
                            CalendarIcon()
                          }
                        />
                      </div>
                      :
                      null
                    }
                    {selectedItem?.label === "Reasons" ?
                      <div className={cn("py-2 flex flex-col text-left")}>
                        <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                          Reason Mode
                          <span className="text-danger ml-1">*</span>
                        </label>
                        <Dropdown
                          placement="bottom-start"
                          className=""
                        >
                          <DropdownTrigger>
                            <Button
                              disableRipple
                              isLoading={false}
                              className="text-sm font-bold p-0 block gap-1 h-auto w-auto"
                            >
                              <div className='flex items-center'>
                                <div className='w-full bg-foreground py-2.5 flex items-center gap-3 px-4 rounded-full border border-border-grey'>
                                  <p className='font-normal text-sm text-text-primary'>
                                    {selectReasonMode}
                                  </p>
                                  <div className='float-right w-full flex justify-end'>
                                    <span className="text-text-primary w-5">{DropDownIcon()}</span>
                                  </div>
                                </div>
                              </div>
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Dynamic Actions"
                            items={reasonmode_dropdown.map(item => ({ key: item, label: item }))}
                            onAction={(key) => {
                              const selected = reasonmode_dropdown.find((item) => item === key);
                              if (selected) {
                                setSelectReasonMode(selected);
                              }
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
                      </div>
                      :
                      null
                    }
                    {selectedItem?.label === "Reasons" ?
                      <div className="flex justify-around py-3">
                        <div className="flex gap-2 items-center text-sm">
                          <Checkbox
                            className="modal-checkbox outline-none border-[2px] w-4 h-4 border-border-grey font-semibold text-sm text-text-primary"
                          />Web Punch
                        </div>
                        <div className="flex gap-2 items-center text-sm">
                          <Checkbox
                            className="modal-checkbox outline-none border-[2px] w-4 h-4 border-border-grey font-semibold text-sm text-text-primary"
                          />Geo Fence Required
                        </div>
                      </div>
                      : selectedItem?.label === "Holidays" ?
                        <div className="flex justify-around py-3">
                          <div className="flex gap-2 items-center text-sm">
                            <Checkbox
                              className="modal-checkbox outline-none border-[2px] w-4 h-4 border-border-grey font-semibold text-sm text-text-primary"
                            />Recurring
                          </div>
                          <div className="flex gap-2 items-center text-sm">
                            <Checkbox
                              className="modal-checkbox outline-none border-[2px] w-4 h-4 border-border-grey font-semibold text-sm text-text-primary"
                            />Public Holiday
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="justify-end">
                <CustomButton
                  variant="outline"
                  borderRadius="full"
                  width="145px"
                  height="40px"
                  onClick={onClose}
                  btnText='Cancel'
                />
                <CustomButton
                  variant="primary"
                  borderRadius="full"
                  width="145px"
                  height="40px"
                  onClick={() => alert("Added successfully")}
                  btnText='Save'
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default Header;