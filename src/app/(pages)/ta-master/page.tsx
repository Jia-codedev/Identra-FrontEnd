"use client";

import React, { useState, useEffect } from "react";
import Header from "./header";
import { TableColumns } from "@/widgets/TableColumns.widget";
import { ReasonsDataType, HolidaysDataType, SchedulesDataType, RamadanDatesDataType } from "@/lib/types/types";
import { reasons_columns, holidays_columns, schedules_columns, ramadandates_columns, } from "@/data/tam.data";
import { DataTable } from "@/widgets/DataTable.widget";
import AddButtonAction from "./(Schedules)/AddButtonAction";

function TAMaster() {
  const [tab, setTab] = React.useState<string>("");
  const [data, setData] = React.useState([]);
  const [col, setCol] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/ta-master/api?tab=" + tab);
        const result = await response.json();
        setData(result.data);
        setCol(
          tab === "Reasons"
            ? TableColumns<ReasonsDataType>(reasons_columns, {} as ReasonsDataType)
            : tab === "Holidays"
            ? TableColumns<HolidaysDataType>(holidays_columns, {} as HolidaysDataType)
            : tab === "Schedules"
            ? TableColumns<SchedulesDataType>(schedules_columns, {} as SchedulesDataType)
            : TableColumns<RamadanDatesDataType>(ramadandates_columns, {} as RamadanDatesDataType)
        );
        console.log(result,tab);
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
      <Header setTab={setTab} tab={tab}/>
      {tab === "Schedules#add" ?
        <AddButtonAction setTab={setTab} tab={tab} /> :
        <div className="bg-foreground rounded-[20px] mx-6 pb-6 pt-3 px-4">
          <DataTable columns={col} data={data} tab={tab} searchValue={searchValue} customClasses=""/>
        </div>
      }
    </div>
  );
}

export default TAMaster;