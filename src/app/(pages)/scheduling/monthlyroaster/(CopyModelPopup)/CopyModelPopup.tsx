'use client';

import CustomButton from '@/components/ui/CustomButton';
import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@nextui-org/react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { DropDownIcon } from '@/lib/svg/icons';

const years = [
    "Choose year",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
];

const months = [
    "Choose month",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];


function CopyModelPopup({ isOpen, onOpenChange, onClose }: { isOpen: boolean, onOpenChange: () => void, onClose: () => void }) {
    const [selectYears, setSelectYears] = useState<string>(years[0]);
    const [selectMonths, setSelectMonths] = useState<string>(months[0]);
    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton={true}
            classNames={{
                backdrop: "bg-white/75 backdrop-opacity-50",
                base: "bg-foreground text-text-primary shadow-popup rounded-[20px] p-5 max-w-full w-min",
                header: "text-center p-0",
                body: "p-0",
                footer: "p-0 py-5 mt-3",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h1 className="text-xl font-bold text-text-primary capitalize">Copy roaster</h1>
                            <h4 className="text-sm font-semibold text-text-secondary pb-5">Select the options for further process</h4>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex gap-14">
                                <div className="w-full flex justify-center gap-5">
                                    <div>
                                        <div className={cn("py-2 flex flex-col text-left")}>
                                            <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                                Year
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
                                                        className="text-sm font-bold p-0 block gap-1 h-auto w-[350px]"
                                                    >
                                                        <div className='flex items-center'>
                                                            <div className='w-full bg-foreground py-2.5 flex items-center gap-3 px-4 rounded-full border border-border-grey'>
                                                                <p className='font-normal text-sm text-text-primary'>
                                                                    {selectYears}
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
                                                    items={years.map(item => ({ key: item, label: item }))}
                                                    onAction={(key) => {
                                                        const selected = years.find((item) => item === key);
                                                        if (selected) {
                                                            setSelectYears(selected);
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
                                        <div className={cn("py-2 flex flex-col text-left")}>
                                            <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                                Month
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
                                                        className="text-sm font-bold p-0 block gap-1 h-auto w-[350px]"
                                                    >
                                                        <div className='flex items-center'>
                                                            <div className='w-full bg-foreground py-2.5 flex items-center gap-3 px-4 rounded-full border border-border-grey'>
                                                                <p className='font-normal text-sm text-text-primary'>
                                                                    {selectMonths}
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
                                                    items={months.map(item => ({ key: item, label: item }))}
                                                    onAction={(key) => {
                                                        const selected = months.find((item) => item === key);
                                                        if (selected) {
                                                            setSelectMonths(selected);
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
                            </div>
                        </ModalBody>
                        <ModalFooter className="">
                            <CustomButton
                                variant="outline"
                                borderRadius="full"
                                width="170px"
                                height="40px"
                                onClick={onClose}
                                btnText='Close'
                            />
                            <CustomButton
                                variant="primary"
                                borderRadius="full"
                                width="170px"
                                height="40px"
                                onClick={onClose}
                                btnText='Copy roaster'
                                className='bg-success border-success'
                            />
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default CopyModelPopup;



