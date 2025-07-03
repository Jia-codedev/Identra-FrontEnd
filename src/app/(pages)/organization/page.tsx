"use client";

import React, { useState, useEffect } from "react";
import Header from "./header";
import { TableColumns } from "@/widgets/TableColumns.widget";
import { DataTable } from "@/widgets/DataTable.widget";
import { DepartmentsDataType, OrganizationTypesDataType } from "@/lib/types/types";
import { departments_columns, organizationtypes_columns } from "@/data/org.data";
import AddButtonAction from "./(Departments)/AddButtonAction";
import OrganizationStructure from "./(OrganizationStructure)/OrganizationStructure";

function Organization() {
  const [tab, setTab] = React.useState<string>("");
  const [data, setData] = React.useState([]);
  const [col, setCol] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/organization/api?tab=" + tab);
        const result = await response.json();
        console.log(result);
        setData(result.data);
        setCol(
          tab === "Departments"
            ? TableColumns<DepartmentsDataType>(departments_columns, {} as DepartmentsDataType)
            : TableColumns<OrganizationTypesDataType>(organizationtypes_columns, {} as OrganizationTypesDataType)
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
      <div className="">
        {tab === "Organization Structure" ?
          <div className="bg-foreground rounded-[20px] mx-6 pb-6 pt-3 px-4">
            <OrganizationStructure />
          </div>
          :
          (tab === "Departments#add") ?
            <AddButtonAction setTab={setTab} tab={tab} />

            :
            <div className="bg-foreground rounded-[20px] mx-6 pb-6 pt-3 px-4">
              <DataTable columns={col} data={data} tab={tab} searchValue={searchValue} customClasses=""/>
            </div>
        }
      </div>
    </div>
  );
}

export default Organization;