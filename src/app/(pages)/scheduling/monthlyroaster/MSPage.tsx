"use client";

import React from 'react';
import HeaderMonthlyRoaster from './header';
import FileInput from '@/components/ui/FileInput';
import CustomButton from '@/components/ui/CustomButton';
import CopyModelPopup from './(CopyModelPopup)/CopyModelPopup';
import {
    ColumnDef,
} from '@tanstack/react-table';
import { useDisclosure } from '@nextui-org/react';
import { ImportIcon, ExportIcon, CopyIcon, PasteIcon, DeleteIcon, SaveIcon, LockIcon, UnlockIcon } from "@/lib/svg/icons";
import { DataTable, MonthlyRoasterDataTable } from '@/widgets/DataTable.widget';

interface MonthlyRoasterPageProps {
    setTab: (tab: string) => void;
    tab: string;
    col: ColumnDef<any, any>[];
    data: any[];
}


function MonthlyRoasterPage({ setTab, tab, col, data }: MonthlyRoasterPageProps) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    return (
        <div className="page-container">
            <HeaderMonthlyRoaster setTab={setTab} tab={tab} headerCall="" setHeaderCall={() => void 0} />
            <div className="flex justify-between bg-white mb-5 mx-5 rounded-[15px] items-center px-5 py-2">
                <FileInput
                    inputLabel=""
                    inputAttr={false}
                    className="flex-row gap-3 items-center"
                    labelClassName="font-semibold text-[15px]"
                    inputClassName="w-[220px]"
                    buttonClassName=""
                />
                <div className="flex gap-2">
                    <CustomButton
                        variant='primaryoutline'
                        btnText='Import'
                        btnIcon={ImportIcon()}
                        borderRadius="lg"
                        width="auto"
                        height="35px"
                        className='text-sm'
                    />
                    <CustomButton
                        variant='primaryoutline'
                        btnText='Export'
                        btnIcon={ExportIcon()}
                        borderRadius="lg"
                        width="auto"
                        height="35px"
                        className='text-sm'
                    />
                    <CustomButton
                        variant='primaryoutline'
                        btnText='Copy roaster'
                        onClick={onOpen}
                        btnIcon={CopyIcon()}
                        borderRadius="lg"
                        width="auto"
                        height="35px"
                        className='text-sm'
                    />
                    <CustomButton
                        variant='primaryoutline'
                        btnText='Copy'
                        onClick={onOpen}
                        btnIcon={CopyIcon()}
                        borderRadius="lg"
                        width="auto"
                        height="35px"
                        className='text-sm'
                    />
                    <CustomButton
                        variant='primaryoutline'
                        btnText='Paste'
                        btnIcon={PasteIcon()}
                        borderRadius="lg"
                        width="auto"
                        height="35px"
                        className='text-sm'
                        disabled
                    />
                </div>
            </div>
            <div className="bg-foreground rounded-[20px] mx-6 pb-6 pt-3 px-4">
                <MonthlyRoasterDataTable columns={col} data={data} />
            </div>
            <div className='table-cta mx-5 my-6 flex text-xs font-bold justify-end gap-3 items-center'>
                <CustomButton
                    variant="primary"
                    borderRadius="lg"
                    width="auto"
                    height="35px"
                    onClick={onOpen}
                    btnText='Save'
                    btnIcon={SaveIcon()}
                />
                <CustomButton
                    variant="success"
                    borderRadius="lg"
                    width="auto"
                    height="35px"
                    onClick={onOpen}
                    btnText='Finalize'
                    btnIcon={LockIcon()}
                />
                <CustomButton
                    variant="success"
                    borderRadius="lg"
                    width="auto"
                    height="35px"
                    onClick={onClose}
                    btnText='Un-finalize'
                    btnIcon={UnlockIcon()}
                    className='text-[#979797] bg-[#F3F3F3] border-[#E7E7E7]'
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
            <CopyModelPopup isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
        </div>
    );
}

export default MonthlyRoasterPage;
