"use client";

import React, { useState, useEffect } from "react";
import Header from "./header";
import { TableColumns } from "@/widgets/TableColumns.widget";
import { RolesDataType, PrivilegesDataType } from "@/lib/types/types";
import { roles_columns, privileges_columns } from "@/data/security.data";
import { DataTable } from "@/widgets/DataTable.widget";

function Security() {
  const [tab, setTab] = React.useState<string>("");
  const [data, setData] = React.useState([]);
  const [col, setCol] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/security/api?tab=" + tab);
        const result = await response.json();
        console.log(result);
        setData(result.data);
        setCol(
          tab === "Roles"
            ? TableColumns<RolesDataType>(roles_columns, {} as RolesDataType)
            : TableColumns<PrivilegesDataType>(privileges_columns, {} as PrivilegesDataType)
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
      <Header setTab={setTab} tab={tab}/>
      <div className="bg-foreground rounded-[20px] mx-6 pb-6 pt-3 px-4">
        <DataTable columns={col} data={data} tab={tab} searchValue={searchValue} customClasses=""/>
      </div>
    </div>
  );
}

export default Security;