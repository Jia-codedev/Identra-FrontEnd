'use client';
import React, { useState } from 'react';
import NormalTab from "./NormalTab";
import RamadanTab from "./RamadanTab";
import PolicyTab from "./PolicyTab";
import CustomButton from '@/components/ui/CustomButton';

function AddButtonAction({ setTab, tab }: { setTab: any, tab: any }) {

    const [currentTab, setCurrentTab] = useState<string>('Normal');

    const tabs = [
        { name: 'Normal', content: <NormalTab/> },
        { name: 'Ramadan', content: <RamadanTab/> },
        { name: "Policy", content: <PolicyTab/> },
    ];

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab);
    }

    const handelSchedulesAddClose = () => {
        setTab(tab.replace("#add", ""));
        console.log("tab: ", tab)
    };

    return (
        <div className="bg-foreground rounded-[20px] mx-6 p-6 pb-0">
            <header className='mb-6'>
                <h1 className='text-primary font-bold text-xl'>{currentTab}</h1>
                <p className='text-text-secondary font-regular text-sm'>Enter the <span className='lowercase'>{currentTab}</span> information for the process</p>
            </header>
            <div className='tab-container'>
                <div className="tab-headers flex gap-20 border-b border-border-accent">
                    {tabs.map((tab, index) => (
                        <div key={index}
                            className={`tab-header cursor-pointer text-base relative py-3 px-2
                                ${currentTab === tab.name
                                ? 'font-semibold text-primary after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:rounded-full after:bg-primary'
                                : 'text-secondary font-semibold'
                                }`}
                            onClick={() => handleTabChange(tab.name)}>
                            {tab.name}
                        </div>
                    ))}
                </div>
                <div className="tab-content pt-5 py-8">
                    {tabs.find((tab) => tab.name === currentTab)?.content}
                    <div className='w-full flex gap-5 justify-end mt-6'>
                        <CustomButton 
                            variant="outline" 
                            borderRadius="full" 
                            width="145px"
                            height="45px"
                            onClick={handelSchedulesAddClose}
                            btnText='Cancel'
                        />
                        <CustomButton 
                            variant="primary" 
                            borderRadius="full" 
                            width="145px"
                            height="45px"
                            onClick={handelSchedulesAddClose}
                            btnText='Next'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
} export default AddButtonAction

