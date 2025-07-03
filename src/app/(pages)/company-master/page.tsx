"use client";

import React, { useState, useEffect } from "react";
import Header from "./header";
import { TableColumns } from "@/widgets/TableColumns.widget";
import { RegionsDataType, NationalitiesDataType, DesignationsDataType, GradesDataType } from "@/lib/types/types";
import { regions_columns, nationalities_columns, designations_columns, grades_columns } from "@/data/cm.data";
import { DataTable } from "@/widgets/DataTable.widget";

function CompanyMaster() {
  const [tab, setTab] = React.useState<string>("");
  const [data, setData] = React.useState([]);
  const [col, setCol] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/company-master/api?tab=" + tab);
        const result = await response.json();
        console.log(result);
        setData(result.data);
        setCol(
          tab === "Regions"
            ? TableColumns<RegionsDataType>(regions_columns, {} as RegionsDataType)
            : tab === "Nationalities"
            ? TableColumns<NationalitiesDataType>(nationalities_columns, {} as NationalitiesDataType)
            : tab === "Designations"
            ? TableColumns<DesignationsDataType>(designations_columns, {} as DesignationsDataType)
            : TableColumns<GradesDataType>(grades_columns, {} as GradesDataType)
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
      <Header setTab={setTab} tab={tab} />
      <div className="bg-foreground rounded-[20px] mx-6 pb-6 pt-3 px-4">
        <DataTable columns={col} data={data} tab={tab} searchValue={searchValue} customClasses=""/>
      </div>
    </div>
  );
}

export default CompanyMaster;