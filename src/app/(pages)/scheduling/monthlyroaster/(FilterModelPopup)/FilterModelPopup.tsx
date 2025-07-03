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
import { Checkbox } from "@/components/ui/Checkbox";

const organization_dropdown_items = [
    "Choose organization",
    "D1",
    "D2",
    "D3",
    "D4",
    "D5",
];

function FilterModelPopup({ isOpen, onOpenChange, onClose }: { isOpen: boolean, onOpenChange: () => void, onClose: any }) {

    const [selectOrganization, setSelectOrganization] = useState<string>(organization_dropdown_items[0]);

    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton={true}
            size={"4xl"}
            classNames={{
                backdrop: "bg-white/75 backdrop-opacity-50",
                base: "bg-foreground text-text-primary shadow-popup rounded-[20px] p-5",
                header: "text-left px-5",
                body: "px-5",
                footer: "px-3 py-5 mt-3",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h1 className="text-xl font-bold text-primary capitalize">Filter</h1>
                            <h4 className="text-sm font-semibold text-text-secondary pb-3">Select the filter for further process</h4>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex gap-14">
                                <div className="w-full flex justify-between gap-5">
                                    <div>
                                        <div className={cn("py-2 flex flex-col text-left")}>
                                            <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                                Oraganization
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
                                        <div className={cn("py-2 flex flex-col text-left")}>
                                            <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                                Manager
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
                                        <div className={cn("py-2 flex flex-col text-left")}>
                                            <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                                Employee
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
                                        <div className={cn("py-2 flex flex-col text-left")}>
                                            <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                                Schedule
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
                                        <div className={cn("py-2 flex flex-col text-left")}>
                                            <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                                Group
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
                                    <div>
                                        <div className={cn("py-2 flex flex-col text-left")}>
                                            <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                                Version No
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
                                        <div className="flex py-2 gap-2 items-center text-sm">
                                            <Checkbox
                                                className="modal-checkbox outline-none border-[2px] w-4 h-4 border-border-grey font-semibold text-sm text-text-primary"
                                            />Apply version filter
                                        </div>
                                        <div className={cn("py-2 flex flex-col text-left")}>
                                            <label className={cn('font-bold font-base pb-1 text-text-primary')}>
                                                Day
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
                            </div>
                        </ModalBody>
                        <ModalFooter className="">
                            <CustomButton
                                variant="outline"
                                borderRadius="full"
                                width="170px"
                                height="40px"
                                onClick={onClose}
                                btnText='Clear Filter'
                            />
                            <CustomButton
                                variant="primary"
                                borderRadius="full"
                                width="170px"
                                height="40px"
                                onClick={onClose}
                                btnText='Apply'
                            />
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default FilterModelPopup
