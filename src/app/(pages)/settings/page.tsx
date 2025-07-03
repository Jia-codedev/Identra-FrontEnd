"use client";

import React, { useState, useEffect } from "react";
import Header from "./header";
import ASTabAction from "./ApplicationSettingsTabAction";
import Announcements from "./Announcements";
import { TableColumns } from "@/widgets/TableColumns.widget";
import { DataTable } from "@/widgets/DataTable.widget";
import { AllSettingsDataType, NotificationDataType } from "@/lib/types/types";
import { settings_columns,notification_columns } from "@/data/settings.data";

function Settings() {
  const [tab, setTab] = React.useState<string>("");
  const [data, setData] = React.useState([]);
  const [col, setCol] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/settings/api?tab=" + tab);
        const result = await response.json();
        console.log(result);
        setData(result.data);
        setCol(
          tab === "Application Setting"
          ? TableColumns<AllSettingsDataType>(settings_columns, {} as AllSettingsDataType)
          : tab === "Notification"
          ? TableColumns<NotificationDataType>(notification_columns, {} as NotificationDataType)
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
    <div className="page-container">
      <Header setTab={setTab} tab={tab} />
      {tab === "Application Setting" ?
        <ASTabAction setTab={setTab} tab={tab} />
      :
        <div className="bg-foreground rounded-[20px] mx-6 p-6">
          {tab === "Announcements" ?
          <Announcements /> :
          <DataTable 
            columns={col} 
            data={data} 
            tab={tab} 
            searchValue={searchValue}
            customClasses={'[&_th]:border-r [&_tr]:border-b [&_td]:border-r [&_td]:align-top border-border-accent'}
          />
          }
        </div>
      }
    </div>
  );
}

export default Settings;