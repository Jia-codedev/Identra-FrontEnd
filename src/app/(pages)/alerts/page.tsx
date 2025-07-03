"use client";

import React, { useState, useEffect } from "react";
import Header from "./header";
import { TableColumns } from "@/widgets/TableColumns.widget";
import { EmailDataType, SmsDataType } from "@/lib/types/types";
import { email_columns, sms_columns } from "@/data/alerts.data";
import { DataTable } from "@/widgets/DataTable.widget";

interface SubItem {
  key: string;
  label: string;
}

function Alerts() {
  const [tab, setTab] = React.useState<string>("");
  const [data, setData] = React.useState([]);
  const [col, setCol] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/alerts/api?tab=" + tab);
        const result = await response.json();
        console.log(result);
        setData(result.data);
        setCol(
          tab === "Email"
            ? TableColumns<EmailDataType>(email_columns, {} as EmailDataType)
            : TableColumns<SmsDataType>(sms_columns, {} as SmsDataType)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (tab !== "") fetchData();
  }, [tab]);

  
  const handleSearchValue = (e : any) => {
    setSearchValue(e.target.value)
  } 
  return (
    <div className="page-container">
      <Header setTab={setTab}/>
      <div className="bg-foreground rounded-[20px] mx-6 pb-6 pt-3 px-4">
        <DataTable 
          columns={col} 
          data={data} 
          tab={tab} 
          searchValue={searchValue} 
          customClasses={'[&_th]:border-r [&_tr]:border-b [&_td]:border-r [&_td]:align-top border-border-accent'}/>
      </div>
    </div>
  );
}

export default Alerts;