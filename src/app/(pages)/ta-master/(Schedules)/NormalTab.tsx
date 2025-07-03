'use client';
import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import { Button, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { Checkbox } from "@/components/ui/Checkbox";
import ColorCode from './ColorCode';
import {TimeInput} from "@nextui-org/react";
import {Time} from "@internationalized/date";
import { CalendarIcon, ClockIcon, DropDownIcon } from "@/lib/svg/icons"

const organization_dropdown_items = [
    "Choose organization",
    "D1",
    "D2",
    "D3",
    "D4",
    "D5",
];

const schedule_location_dropdown_items = [
    "Choose schedule location",
    "Main",
    "Branch 1",
    "Branch 2",
];

function NormalTab() {
 
    const [selectOrganization, setSelectOrganization] = useState<string>(organization_dropdown_items[0]);
    const [selectScheduleLocation, setSelectScheduleLocation] = useState<string>(schedule_location_dropdown_items[0]);

    const stylesDateInput = {
        inputWrapper: [
            "bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-3 min-w-[220px] text-[15px]",
        ],
        label: [
            "text-text-primary font-semibold text-[15px]",
        ],
    };

    return (
        <div>
            <div className='flex justify-evenly gap-20'>
                <div className='flex flex-col items-end'>
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
                                        <div className='w-[220px] bg-foreground py-2.5 flex items-center gap-3 px-3 rounded-full border border-border-grey'>
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
                    <Input inputType={'text'} inputLabel={'Code'} placeholderText={'Enter code'} inputAttr={true} className={'flex-row gap-3 items-center'} labelClassName={'font-semibold text-[15px]'} inputClassName={'w-[220px]'}/>
                    <div>
                        <div className='py-2 flex text-left flex-row gap-3 items-center justify-end'>
                            <TimeInput
                                isRequired
                                label="In Time 1" 
                                labelPlacement="outside-left"
                                color='success'
                                placeholderValue={new Time(9)}
                                classNames={{
                                    base: "text-text-primary max-w-fit gap-3",
                                    inputWrapper:"bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 min-w-[220px] text-[15px]",
                                    input: "text-[15px] text-text-primary",
                                    label: "font-base text-text-primary font-semibold text-[15px]",
                                }}
                                endContent={
                                    <span className="text-primary w-4">{ClockIcon()}</span>
                                }
                            />
                        </div>
                        <div className='py-2 flex text-left flex-row gap-3 items-center'>
                            <TimeInput
                                label="Required Work Hours" 
                                labelPlacement="outside-left"
                                color='success'
                                placeholderValue={new Time(9)}
                                classNames={{
                                    base: "text-text-primary max-w-fit gap-3",
                                    inputWrapper:"bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 min-w-[220px] text-[15px]",
                                    input: "text-[15px] text-text-primary",
                                    label: "font-base text-text-primary font-semibold text-[15px]",
                                }}
                                endContent={
                                    <span className="text-primary w-4">{ClockIcon()}</span>
                                }
                            />
                        </div>
                    </div>
                    <div> 
                        <div className='py-2 flex text-left flex-row gap-3 items-center justify-end'>
                            <TimeInput
                                label="In Time 2" 
                                labelPlacement="outside-left"
                                color='success'
                                placeholderValue={new Time(9)}
                                classNames={{
                                    base: "text-text-primary max-w-fit gap-3",
                                    inputWrapper:"bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 min-w-[220px] text-[15px]",
                                    input: "text-[15px] text-text-primary",
                                    label: "font-base text-text-primary font-semibold text-[15px]",
                                }}
                                endContent={
                                    <span className="text-primary w-4">{ClockIcon()}</span>
                                }
                            />
                        </div>
                        <div className='py-2 flex text-left flex-row gap-3 items-center'>
                            <TimeInput
                                label="Required Work Hours" 
                                labelPlacement="outside-left"
                                color='success'
                                placeholderValue={new Time(9)}
                                classNames={{
                                    base: "text-text-primary max-w-fit gap-3",
                                    inputWrapper:"bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 min-w-[220px] text-[15px]",
                                    input: "text-[15px] text-text-primary",
                                    label: "font-base text-text-primary font-semibold text-[15px]",
                                }}
                                endContent={
                                    <span className="text-primary w-4">{ClockIcon()}</span>
                                }
                            />
                        </div>
                    </div>
                    <div>
                        <div className='py-2 flex text-left flex-row gap-3 items-center justify-end'>
                            <TimeInput
                                label="In Time 3" 
                                labelPlacement="outside-left"
                                color='success'
                                placeholderValue={new Time(9)}
                                classNames={{
                                    base: "text-text-primary max-w-fit gap-3",
                                    inputWrapper:"bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 min-w-[220px] text-[15px]",
                                    input: "text-[15px] text-text-primary",
                                    label: "font-base text-text-primary font-semibold text-[15px]",
                                }}
                                endContent={
                                    <span className="text-primary w-4">{ClockIcon()}</span>
                                }
                            />
                        </div>
                        <div className='py-2 flex text-left flex-row gap-3 items-center'>
                            <TimeInput
                                label="Required Work Hours" 
                                labelPlacement="outside-left"
                                color='success'
                                placeholderValue={new Time(9)}
                                classNames={{
                                    base: "text-text-primary max-w-fit gap-3",
                                    inputWrapper:"bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 min-w-[220px] text-[15px]",
                                    input: "text-[15px] text-text-primary",
                                    label: "font-base text-text-primary font-semibold text-[15px]",
                                }}
                                endContent={
                                    <span className="text-primary w-4">{ClockIcon()}</span>
                                }
                            />
                        </div>
                    </div>
                    <Input inputType={'text'} inputLabel={'Grace In (Minutes)'} placeholderText={'0'} inputAttr={false} className={'flex-row gap-3 items-center'} labelClassName={'font-semibold text-[15px]'} inputClassName={'w-[220px]'}/>
                    <Input inputType={'text'} inputLabel={'Flexible (Minutes)'} placeholderText={'0'} inputAttr={false} className={'flex-row gap-3 items-center'} labelClassName={'font-semibold text-[15px]'} inputClassName={'w-[220px]'}/>
                    <div className='py-2 flex text-left flex-row gap-3 items-center'>
                        <DatePicker 
                            label="Inactive Date" 
                            color='success'
                            labelPlacement="outside-left"
                            dateInputClassNames={stylesDateInput}
                            classNames={{
                                base: "text-text-primary max-w-fit gap-3",
                                selectorButton:"text-text-primary",
                                calendar:"bg-text-primary font-normal text-sm text-white border-border-grey shadow-searchbar rounded-lg",
                                calendarContent: " text-secondary",
                                input: "text-[15px] text-text-primary",
                            }}
                            selectorIcon={
                                CalendarIcon()
                            }
                        />
                    </div>
                </div>
                <div className='flex flex-col items-end'>
                    <div className='py-2 flex text-left flex-row gap-3 items-center'>
                        <div className='font-semibold text-[15px] text-text-primary'>
                            Schedule Location<span className="text-danger ml-1">*</span>
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
                                        <div className='w-[220px] bg-foreground py-2.5 flex items-center gap-3 px-3 rounded-full border border-border-grey'>
                                            <p className='font-normal text-sm text-text-primary'>
                                                {selectScheduleLocation}
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
                                items={schedule_location_dropdown_items.map(item => ({ key: item, label: item }))}
                                onAction={(key) => {
                                    const selected = schedule_location_dropdown_items.find((item) => item === key);
                                    if (selected) {
                                        setSelectScheduleLocation(selected);
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
                            Color<span className="text-danger ml-1">*</span>
                        </div>
                        <ColorCode/>
                    </div>
                    <div>
                        <div className='py-2 flex text-left flex-row gap-3 items-center'>
                            <TimeInput
                                isRequired
                                label="Out Time 1" 
                                labelPlacement="outside-left"
                                color='success'
                                placeholderValue={new Time(9)}
                                classNames={{
                                    base: "text-text-primary max-w-fit gap-3",
                                    inputWrapper:"bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 min-w-[220px] text-[15px]",
                                    input: "text-[15px] text-text-primary",
                                    label: "font-base text-text-primary font-semibold text-[15px]",
                                }}
                                endContent={
                                    <span className="text-primary w-4">{ClockIcon()}</span>
                                }
                            />
                        </div>
                        <div className='flex flex-col items-center mb-2'>
                            <div className="flex gap-2 items-center text-sm">
                                <Checkbox
                                className="modal-checkbox outline-none border-[2px] w-3 h-3 border-border-grey font-semibold text-sm text-text-primary"
                                />Open Shift
                            </div>
                            <div className="flex gap-2 items-center text-sm">
                                <Checkbox
                                className="modal-checkbox outline-none border-[2px] w-3 h-3 border-border-grey font-semibold text-sm text-text-primary"
                                />Night Shift
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='py-2 flex text-left flex-row gap-3 items-center'>
                            <TimeInput
                                label="Out Time 2" 
                                labelPlacement="outside-left"
                                color='success'
                                placeholderValue={new Time(9)}
                                classNames={{
                                    base: "text-text-primary max-w-fit gap-3",
                                    inputWrapper:"bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 min-w-[220px] text-[15px]",
                                    input: "text-[15px] text-text-primary",
                                    label: "font-base text-text-primary font-semibold text-[15px]",
                                }}
                                endContent={
                                    <span className="text-primary w-4">{ClockIcon()}</span>
                                }
                            />
                        </div>
                        <div className='flex flex-col items-center mb-2'>
                            <div className="flex gap-2 items-center text-sm">
                                <Checkbox
                                className="modal-checkbox outline-none border-[2px] w-3 h-3 border-border-grey font-semibold text-sm text-text-primary"
                                />Open Shift
                            </div>
                            <div className="flex gap-2 items-center text-sm">
                                <Checkbox
                                className="modal-checkbox outline-none border-[2px] w-3 h-3 border-border-grey font-semibold text-sm text-text-primary"
                                />Night Shift
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='py-2 flex text-left flex-row gap-3 items-center'>
                            <TimeInput
                                label="Out Time 3" 
                                labelPlacement="outside-left"
                                color='success'
                                placeholderValue={new Time(9)}
                                classNames={{
                                    base: "text-text-primary max-w-fit gap-3",
                                    inputWrapper:"bg-foreground rounded-full border border-border-grey h-[40px] shadow-none px-4 min-w-[220px] text-[15px]",
                                    input: "text-[15px] text-text-primary",
                                    label: "font-base text-text-primary font-semibold text-[15px]",
                                }}
                                endContent={
                                    <span className="text-primary w-4">{ClockIcon()}</span>
                                }
                            />
                        </div>
                        <div className='flex flex-col items-center mb-2'>
                            <div className="flex gap-2 items-center text-sm">
                                <Checkbox
                                className="modal-checkbox outline-none border-[2px] w-3 h-3 border-border-grey font-semibold text-sm text-text-primary"
                                />Open Shift
                            </div>
                            <div className="flex gap-2 items-center text-sm">
                                <Checkbox
                                className="modal-checkbox outline-none border-[2px] w-3 h-3 border-border-grey font-semibold text-sm text-text-primary"
                                />Night Shift
                            </div>
                        </div>
                    </div>
                    <Input inputType={'text'} inputLabel={'Grace Out (Minutes)'} placeholderText={'0'} inputAttr={false} className={'flex-row gap-3 items-center'} labelClassName={'font-semibold text-[15px]'} inputClassName={'w-[220px]'}/>
                </div>
            </div>
        </div>
    )
} 

export default NormalTab
