'use client';
import React, { useState, useEffect } from 'react';
import { TableColumns } from "@/widgets/TableColumns.widget";
import { DataTable } from "@/widgets/DataTable.widget";
import { AllSettingsDataType } from "@/lib/types/types";
import { settings_columns } from '@/data/settings.data';

function ASTabAction({ setTab, tab }: { setTab: any, tab: any }) {

    const [currentTab, setCurrentTab] = useState<string>('All');

    const tabs = [
        { name: 'All' },
        { name: 'Notifications'},
        { name: "Server" },
        { name: 'Module' },
        { name: 'Others' },
        { name: "Verifications" },
    ];

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab);
    }

    const [datatab, setDataTab] = React.useState<string>("");

    const [data, setData] = React.useState([]);
    const [col, setCol] = React.useState<any[]>([]);
    const [searchValue, setSearchValue] = React.useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch("/settings/api?tab=" + tab);
            const result = await response.json();
            console.log(response,"hello",result);
            setData(result.data);
            setCol(
                tab === "All"
                ? TableColumns<AllSettingsDataType>(settings_columns, {} as AllSettingsDataType)
                : TableColumns<AllSettingsDataType>(settings_columns, {} as AllSettingsDataType)
            );
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    if (tab !== "") fetchData();
    }, [tab]);


  const handleSearchValue = (e: any) => {
    setSearchValue(e.target.value)
  }

    return (
        <div className="bg-foreground rounded-[20px] mx-6 p-6 pb-0">
            <header className='mb-6'>
                <h1 className='text-primary font-bold text-xl'>{currentTab === 'All' ? 'Application settings' : currentTab}</h1>
                <p className='text-text-secondary font-regular text-sm'>View the <span className='lowercase'>{currentTab}</span> settings</p>
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
            </div>
            <div className="tab-content pb-8">
                {/* {tabs.find((tab) => tab.name === currentTab)?.content} */}
                <DataTable columns={col} data={data} tab={datatab} searchValue={searchValue} customClasses=""/>
            </div>
        </div>
    )
} export default ASTabAction

