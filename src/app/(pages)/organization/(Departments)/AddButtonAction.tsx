'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import CustomButton from '@/components/ui/CustomButton';
import Textarea from '@/components/ui/Textarea';
import { Button, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import React, { useState } from 'react'
import { SearchIcon, CalendarIcon, DropDownIcon } from "@/lib/svg/icons"
import { cn } from "@/lib/utils";

const organization_dropdown_items = [
    "All Departments",
    "D1",
    "D2",
    "D3",
    "D4",
    "D5",
];

const AllEmployeesData = [
    "DSG12 - Employee 10",
    "DSG12 - Employee 11",
    "DSG12 - Employee 12",
    "DSG12 - Employee 13",
    "DSG12 - Employee 14",
    "DSG12 - Employee 15",
    "DSG12 - Employee 16",
    "DSG12 - Employee 17",
    "DSG12 - Employee 18",
    "DSG12 - Employee 19",
    "DSG12 - Employee 20",
];

const AllOrganizationData = [
    "All Organizations",
    "All Org2",
    "All Org3",
    "All Org4",
    "All Org5",
    "All Org6",
    "All Org7",
    "All Org8",
    "All Org9",
    "All Org10",
];



function AddButtonAction({ setTab, tab }: { setTab: any, tab: any }) {

    const [selectOrganization, setSelectOrganization] = useState<string>(organization_dropdown_items[0]);

    const [allEmployees, setAllEmployees] = useState(AllEmployeesData);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

    const [allOrganization, setAllOrganization] = useState(AllOrganizationData);
    const [selectedOr, setSelectedOr] = useState<string[]>([]);

    const [check, setcheck] = useState<string[]>([]);
    const [checkedOrganization, setCheckedOrganization] = useState<string[]>([]);

    const [allEmployeesSearchQuery, setAllEmployeesSearchQuery] = useState("");
    const [selectedEmployeesSearchQuery, setSelectedEmployeesSearchQuery] = useState("");

    const [allOrganizationSearchQuery, setAllOrganizationSearchQuery] = useState("");
    const [selectedOrganizationSearchQuery, setSelectedOrganizationSearchQuery] = useState("");



    const handleRightMoveEmployee = () => {
        setSelectedEmployees([...selectedEmployees, ...check]);
        setAllEmployees(allEmployees.filter((employee: string) => !check.includes(employee)));
        setcheck([]);
    };

    const handleRightMoveOrganization = () => {
        setSelectedOr([...selectedOr, ...checkedOrganization]);
        setAllOrganization(allOrganization.filter((employee: string) => !checkedOrganization.includes(employee)));
        setCheckedOrganization([]);
    };

    const handleCheckboxChange = (employee: string) => {
        if (check.includes(employee) || checkedOrganization.includes(employee)) {
            setcheck(check.filter((emp) => emp !== employee));
            setCheckedOrganization(checkedOrganization.filter((emp) => emp !== employee));
        } else {
            setcheck([...check, employee]);
            setCheckedOrganization([...checkedOrganization, employee]);
        }
    };

    const handelDepartmentAddClose = () => {
        setTab(tab.replace("#add", ""));
        console.log("tab: ", tab)
    };

    const stylesDateInput = {
        inputWrapper: [
            "bg-foreground rounded-full border border-border-accent h-[45px] shadow-none px-4",
        ],
    };

    return (
        <div className="mx-6">
            <div className="top-dropdown w-full">
                <div className="top-dropdown-containers flex gap-2 items-center justify-between">
                    <div className='flex-1'>
                        <Dropdown
                            placement="bottom-start"
                            className=""
                        >
                            <DropdownTrigger>
                                <Button
                                    disableRipple
                                    isLoading={false}
                                    variant="light"
                                    className="text-sm font-bold p-0 block gap-1 h-full w-full"
                                >
                                    
                                    <div>
                                        <div className='bg-foreground py-3 flex items-center gap-3 px-4 rounded-full border border-border-accent'>
                                            <p className='font-normal text-sm text-secondary'>
                                                Organization <span className='text-danger font-bold mr-1'>*</span>:
                                            </p>
                                            <p className='font-normal text-sm text-text-primary'>
                                                {selectOrganization}
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
                                items={organization_dropdown_items.map(item => ({ key: item, label: item }))}
                                onAction={(key) => {
                                    const selected = organization_dropdown_items.find((item) => item === key);
                                    if (selected) {
                                        setSelectOrganization(selected);
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

                    <div className='flex-1'>
                        <DatePicker
                            isRequired
                            labelPlacement='outside-left'
                            // variant='flat'
                            color='success'
                            // defaultValue={today(getLocalTimeZone())}
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
                    </div>

                    <div className='flex-1'>
                        <DatePicker
                            isRequired
                            labelPlacement='outside-left'
                            // variant='flat'
                            color='success'
                            // defaultValue={today(getLocalTimeZone())}
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

                </div>

                <div className="bg-foreground p-6 mt-[25px] rounded-[20px]">
                    <h1 className='text-primary font-bold text-xl'>Employees</h1>

                    <div className='flex flex-row justify-between items-center max-w-[62em] m-auto'>
                        <VerticalScrollContainer
                            title='All Employees'
                            data={getFilteredData(allEmployees, allEmployeesSearchQuery)}
                            check={check}
                            handleCheckboxChange={handleCheckboxChange}
                            searchQuery={allEmployeesSearchQuery}
                            setSearchQuery={setAllEmployeesSearchQuery}
                        />

                        <div className='mt-[7rem] w-fit h-fit'>
                            <button className='m-5 w-fit h-fit' onClick={handleRightMoveEmployee}>
                                <ArrowSvg />
                            </button>
                        </div>
                        <VerticalScrollContainer
                            title='Selected Employees'
                            data={getFilteredData(selectedEmployees, selectedEmployeesSearchQuery)}
                            isSelectedContainer={true}
                            searchQuery={selectedEmployeesSearchQuery}
                            setSearchQuery={setSelectedEmployeesSearchQuery}
                        />

                    </div>
                </div>

                <div className="bg-foreground p-6 mt-[25px] rounded-[20px]">
                    <h1 className='text-primary font-bold text-xl'>Organization</h1>

                    <div className='flex flex-row justify-between items-center max-w-[62em] m-auto'>
                        <VerticalScrollContainer
                            title='All organization'
                            data={getFilteredData(allOrganization, allOrganizationSearchQuery)}
                            check={checkedOrganization}
                            handleCheckboxChange={handleCheckboxChange}
                            searchQuery={allOrganizationSearchQuery}
                            setSearchQuery={setAllOrganizationSearchQuery}
                        />

                        <div className='mt-[7rem] w-fit h-fit'>
                            <button className='m-5 w-fit h-fit' onClick={handleRightMoveOrganization}>
                                <ArrowSvg />
                            </button>
                        </div>
                        <VerticalScrollContainer
                            title='Selected organization'
                            data={getFilteredData(selectedOr, selectedOrganizationSearchQuery)}
                            isSelectedContainer={true}
                            searchQuery={selectedOrganizationSearchQuery}
                            setSearchQuery={setSelectedOrganizationSearchQuery}
                        />

                    </div>
                </div>

                <div className="bg-foreground p-6 mt-[25px] rounded-[20px]">
                    <h1 className='text-primary font-bold text-xl'>Remarks</h1>
                    <div className='my-5 p-4 border border-border-accent bg-foreground shadow-searchbar rounded-[8px]'>
                        <Textarea
                            classname='text-text-primary w-full h-auto border-none outline-none text-sm placeholder:text-secondary'
                            placeholder={'This is a sample text  This is a sample text  This is a sample text  This is a sample text  This is a sample text  This is a sample text  This is a sample text  ,This is a sample text  This is a sample text  This is a sample text  This is a sample text  This is a sample text  This is a sample text  This is a sample text  '}
                        />
                    </div>

                    <div className='w-full flex gap-5 justify-end'>
                        <CustomButton 
                            variant="outline" 
                            borderRadius="full" 
                            width="145px"
                            height="45px"
                            onClick={handelDepartmentAddClose}
                            btnText='Cancel'
                        />
                        <CustomButton 
                            variant="primary" 
                            borderRadius="full" 
                            width="145px"
                            height="45px"
                            onClick={() => alert("Save")}
                            btnText='Save'
                        />
                    </div>

                </div>
            </div>

        </div>
    )
} export default AddButtonAction



const VerticalScrollContainer = ({
    title,
    data,
    check = [],
    handleCheckboxChange = () => { },
    isSelectedContainer = false,
    searchQuery,
    setSearchQuery,
}: {
    title: string;
    data: string[];
    check?: string[];
    handleCheckboxChange?: (employee: string) => void;
    isSelectedContainer?: boolean;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
}) => (

    <div className='w-full h-full max-w-[25rem]'>
        <p className='font-bold text-center py-5 text-text-primary text-base'>{title}</p>
        <div>
            <div className="searchbar bg-foreground border border-border-accent min-w-[300px] px-4 py-3 flex items-center gap-2 shadow-searchbar rounded-full">
                <span className="text-secondary">{SearchIcon()}</span>
                <input
                    className="text-xs bg-transparent border-none outline-none font-medium text-text-primary w-full h-full placeholder-text-secondary"
                    placeholder={'Search employee, admins...'}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery?.(e.target.value)}
                />
            </div>
        </div>
        <div className='bg-foreground mt-5 shadow-searchbar rounded-[8px] flex flex-col h-[15rem] overflow-y-scroll'>

            {
                data.map((employee: any, index: number) => (
                    <div key={index} className='px-4 py-2 flex items-center gap-5 text-[15px] font-semibold text-text-primary'>
                        {!isSelectedContainer && (
                            <Checkbox
                                checked={check.includes(employee)}
                                onCheckedChange={() => handleCheckboxChange(employee)}
                                className='table-checkbox outline-none border-[2.4px] w-4 h-4 flex  justify-center items-center p-[0.45rem]'
                            />
                        )}
                        <p>{employee}</p>
                    </div>
                ))}

        </div>
    </div>

)

const ArrowSvg = () => (
    <svg className='w-16 h-16' viewBox="0 0 62 61" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1793_6315)">
            <rect x="12" y="9" width="38" height="37" rx="18.5" fill="#0078D4" />
        </g>
        <path d="M32.7851 23.6982C32.8103 23.6479 32.825 23.5931 32.8283 23.537C32.8317 23.4808 32.8237 23.4246 32.8048 23.3717C32.7859 23.3187 32.7564 23.2702 32.7183 23.2289C32.6801 23.1876 32.6339 23.1545 32.5826 23.1316L24.7476 19.6374C23.5009 19.0816 22.2084 20.3166 22.8259 21.4724L25.4526 26.3924C25.6568 26.7757 25.6568 27.2257 25.4526 27.6082L22.8259 32.5282C22.2084 33.6841 23.5009 34.9191 24.7476 34.3632L27.6843 33.0532C28.0369 32.8962 28.324 32.6217 28.4968 32.2766L32.7851 23.6982Z" fill="white" />
        <path opacity="0.6" d="M33.9437 24.1741C33.9915 24.0781 34.0746 24.0043 34.1754 23.968C34.2763 23.9317 34.3873 23.9356 34.4854 23.9791L38.5045 25.7716C39.6079 26.2632 39.6079 27.7341 38.5045 28.2257L31.0895 31.5324C31.0112 31.5671 30.924 31.5768 30.8399 31.5601C30.7558 31.5435 30.6789 31.5013 30.6197 31.4393C30.5605 31.3773 30.5218 31.2986 30.5089 31.2139C30.4961 31.1291 30.5097 31.0425 30.5479 30.9657L33.9437 24.1741Z" fill="white" />
        <defs>
            <filter id="filter0_d_1793_6315" x="0" y="0" width="62" height="61" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3" />
                <feGaussianBlur stdDeviation="6" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.629067 0 0 0 0 0.375833 0 0 0 0.18 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1793_6315" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1793_6315" result="shape" />
            </filter>
        </defs>
    </svg>

);

const getFilteredData = (data: any[], searchQuery: string) => (
    data.filter((employee) =>
        employee.toLowerCase().includes(searchQuery.toLowerCase())
    )
);