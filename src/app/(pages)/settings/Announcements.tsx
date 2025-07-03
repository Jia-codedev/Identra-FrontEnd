/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import { Button, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { DropDownIcon } from "@/lib/svg/icons"
import CustomButton from "@/components/ui/CustomButton";
import Textarea from '@/components/ui/Textarea';
import { cn } from "@/lib/utils";

const organization_dropdown_items = [
    "Choose organization",
    "D1",
    "D2",
    "D3",
    "D4",
    "D5",
];

function Announcements() {

    const [selectOrganization, setSelectOrganization] = useState<string>(organization_dropdown_items[0]);

    const stylesDateInput = {
        inputWrapper: [
            "bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 min-w-[250px] text-[15px]",
        ],
        label: [
            "text-text-primary font-semibold text-[15px]",
        ],
    };

    return (
        <div className='px-8 pt-5'>
            <div className='flex'>
                <div className='flex flex-row items-start justify-between w-full'>
                    <div className='py-2 flex text-left flex-row gap-3 items-center'>
                        <div className='font-semibold text-[15px] text-text-primary'>
                            Organization<span className="text-danger ml-1">*</span>
                        </div>
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
                                        <div className='w-[250px] bg-foreground py-2.5 flex items-center gap-3 px-3 rounded-full border border-border-grey'>
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
                    <div className='py-2 flex text-left flex-row gap-3 items-center'>
                        <div className='font-semibold text-[15px] text-text-primary'>
                            Employee<span className="text-danger ml-1">*</span>
                        </div>
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
                                        <div className='w-[250px] bg-foreground py-2.5 flex items-center gap-3 px-3 rounded-full border border-border-grey'>
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
                </div>
            </div>
            <Input inputType={'text'} inputLabel={'Subject'} placeholderText={'Enter your subject'} inputAttr={true} className={'flex-row gap-12 items-center py-5'} labelClassName={'font-semibold text-[15px]'} inputClassName={'w-full'}/>
            <div className= {cn("py-2 flex flex-row text-left gap-16")}>
                <label className={cn('font-base pb-1 text-text-primary font-semibold text-[15px]')}>
                    Body
                    <span className="text-danger ml-1">*</span>
                </label>
                <div className='p-3 w-full border-border-grey border bg-transparent  rounded-[8px]'>
                    <Textarea
                        classname='w-full h-auto min-h-[150px] border-none outline-none text-text-primary text-sm font-normal p-0 focus:outline-none focus:border-primary placeholder-text-secondary focus:ring-0'
                        placeholder={'Enter the context of body'}
                    />
                </div>
            </div>
            <div className="content-footer-actions flex gap-3 items-center justify-end my-5">
                <CustomButton 
                    variant="outline" 
                    borderRadius="full" 
                    width = "145px" 
                    height="40px"
                    onClick={() => alert("Added successfully")}
                    btnText='Cancel'
                />
                <CustomButton 
                    variant="primary" 
                    borderRadius="full" 
                    width ="145px" 
                    height="40px"
                    onClick={() => alert("Added successfully")}
                    btnText='Save'
                />
            </div>
        </div>
    )
} 

export default Announcements