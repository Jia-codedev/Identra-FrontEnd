"use client";

import React, { useState, useEffect } from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react";
import SearchBar from "@/widgets/SearchBar.widget";
import { FiltersIcon, DropDownIcon, DeleteIcon } from "@/lib/svg/icons";
import CustomButton from "@/components/ui/CustomButton";
import { sidebar_primary } from "@/lib/routes/routes-data";
import {
    useDisclosure
} from "@nextui-org/react";
import FilterModelPopup from "./(FilterModelPopup)/FilterModelPopup";

interface SubItem {
    key: string;
    label: string;
}



function HeaderWeeklySchedule({ setTab, tab, setHeaderCall, headerCall }: { setTab: (tab: string) => void, tab: string, setHeaderCall: (headerCall: any) => void, headerCall: any }) {
    const [items, setItems] = useState<SubItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<SubItem | null | any>(tab);
    const [showActions, setShowActions] = useState(true);
    const { onOpen, isOpen, onOpenChange, onClose } = useDisclosure();


    useEffect(() => {
        if (tab === "Monthly Roster")
            setShowActions(true);
    }, [tab]),

        useEffect(() => {
            const newItems: SubItem[] = [];
            sidebar_primary.forEach(item => {
                if (item.name === "Scheduling") {
                    item.subItems.forEach(subItem => {
                        newItems.push({ key: subItem, label: subItem });
                    });
                }
            });
            setItems(newItems);
            if (newItems.length > 0) {
                setSelectedItem(newItems[1]);
            }
        }, []);

    useEffect(() => {
        if (headerCall === null) {
            setShowActions(true);
        }

    }, [headerCall, setTab]);

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
                            Scheduling
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
                                console.log("selected: ", selected)
                                setSelectedItem(selected ?? items[0]);
                                setTab(selected?.label ?? items[0].label);
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
                {(showActions && selectedItem?.label !== "Weekly Schedule#add") &&
                    (<div className="content-header-actions flex gap-3 items-center text-xs font-bold">
                        <SearchBar placeholderText={'Search here...'} />
                        <CustomButton
                            variant="primary"
                            borderRadius="lg"
                            width="auto"
                            height="35px"
                            onClick={onOpen}
                            btnText='Filters'
                            btnIcon={FiltersIcon()}
                        />
                        <CustomButton
                            variant="danger"
                            borderRadius="lg"
                            width="auto"
                            height="35px"
                            onClick={() => alert("delete")}
                            btnText='Clear'
                            btnIcon={DeleteIcon()}
                        />
                    </div>
                    )}
            </div>
            <FilterModelPopup isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
        </React.Fragment>
    );
};

export default HeaderWeeklySchedule;