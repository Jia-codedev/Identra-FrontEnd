"use client";

import React, { useState, useEffect } from "react";
import Header from "./header";
import { TableColumns } from "@/widgets/TableColumns.widget";
import { DevicesStatusDataType } from "@/lib/types/types";
import { devices_status_columns } from "@/data/devices.data";
import { DataTable } from "@/widgets/DataTable.widget";

function Devices() {
  const [tab, setTab] = React.useState<string>("");
  const [data, setData] = React.useState([]);
  const [col, setCol] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/devices/api?tab=" + tab);
        const result = await response.json();
        console.log(result);
        setData(result.data);
        setCol(
          tab === "Devices Status"
            ? TableColumns<DevicesStatusDataType>(devices_status_columns, {} as DevicesStatusDataType)
            : TableColumns<DevicesStatusDataType>(devices_status_columns, {} as DevicesStatusDataType)
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
        <DataTable columns={col} data={data} tab={tab} searchValue={searchValue} customClasses=""/>
      </div>
    </div>
  );
}

export default Devices;