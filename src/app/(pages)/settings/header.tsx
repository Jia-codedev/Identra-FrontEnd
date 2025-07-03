"use client";

import React, { useState, useEffect } from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@nextui-org/react";
import SearchBar from "@/widgets/SearchBar.widget";
import { AddIcon, DeleteIcon, DropDownIcon } from "@/lib/svg/icons";
import CustomButton from "@/components/ui/CustomButton";
import Input from "@/components/ui/Input";
import { sidebar_secondary } from "@/lib/routes/routes-data";
import Textarea from '@/components/ui/Textarea';
import { cn } from "@/lib/utils";

interface SubItem {
    key: string;
    label: string;
}

const tabs_dropdown_items = [
    "Choose the tab",
    "Notifications",
    "Server",
    "Module",
    "Verifications",
    "Others",
  ];  

function Header({ setTab, tab }: { setTab: (tab: string) => void, tab: string }) {
    const [items, setItems] = useState<SubItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<SubItem | null>(null);
    const [headerTab, setHeaderTab] = useState<any | null>(null);
    const { onOpen, isOpen, onOpenChange } = useDisclosure();
    const [selectTabs, setSelectTabs] = useState<string>(tabs_dropdown_items[0]);

    useEffect(() => {
        const newItems: SubItem[] = [];
        sidebar_secondary.forEach(item => {
            if (item.name === "Settings") {
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
                        Settings / {selectedItem?.label} {tab === "Employees#add" ? "/ Add" : ""}

                    </p>
                </div>
                {(selectedItem?.label === "Application Setting") &&
                    (<div className="content-header-actions flex gap-3 items-center text-xs font-bold">
                        <SearchBar placeholderText={'Search here...'} />
                        <CustomButton 
                            variant="success" 
                            borderRadius="lg" 
                            width = "auto" 
                            height="35px"
                            onClick={onOpen}
                            btnText='Add'
                            btnIcon={AddIcon()}
                        />
                        <CustomButton 
                            variant="danger" 
                            borderRadius="lg" 
                            width = "auto" 
                            height="35px"
                            onClick={() => alert("delete")}
                            btnText='Delete'
                            btnIcon={DeleteIcon()}
                        />
                    </div>
                    )}
            </div>
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                hideCloseButton={true}
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
                                <div>
                                    <Input inputType={'text'} inputLabel={'Name'} placeholderText={'Enter the name'} inputAttr={true} className={''} labelClassName={''} inputClassName={''}/>
                                    <Input inputType={'text'} inputLabel={'Value'} placeholderText={'Enter the value'} inputAttr={false} className={''} labelClassName={''} inputClassName={''}/>
                                    <div className= {cn("py-2 flex flex-col text-left")}>
                                        <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                            Tab Name
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
                                                                {selectTabs}
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
                                                items={tabs_dropdown_items.map(item => ({ key: item, label: item }))}
                                                onAction={(key) => {
                                                    const selected = tabs_dropdown_items.find((item) => item === key);
                                                    if (selected) {
                                                        setSelectTabs(selected);
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
                                    <div className= {cn("py-2 flex flex-col text-left")}>
                                        <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                            Description
                                        </label>
                                        <div className='p-4  border-border-grey border bg-transparent  rounded-[8px]'>
                                            <Textarea
                                                classname='w-full h-auto border-none outline-none text-text-primary text-sm font-normal p-0 focus:outline-none focus:border-primary placeholder-text-secondary focus:ring-0'
                                                placeholder={'Enter the description'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <CustomButton 
                                    variant="outline" 
                                    borderRadius="full" 
                                    width = "100%" 
                                    height="40px"
                                    onClick={onClose}
                                    btnText='Cancel'
                                />
                                <CustomButton 
                                    variant="primary" 
                                    borderRadius="full" 
                                    width = "100%" 
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