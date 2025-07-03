/* eslint-disable react/display-name */
"use client";

import React, { memo, useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/lib/svg/icons";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import LoaderWidget from "@/widgets/Loader.widget";
import { Select, SelectItem } from "@nextui-org/react";

interface DataTableProps {
  columns: ColumnDef<any>[];
  data: any;
  tab: string;
  searchValue: any;
  customClasses: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tab,
  searchValue,
  customClasses,
}: DataTableProps) {
  const [page, setPage] = React.useState(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      rowSelection,
      pagination: {
        pageIndex: page,
        pageSize: rowsPerPage,
      },
    },
  });

  const pageCount = table.getPageCount();
  const maxVisiblePages = 2;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  const startPage = Math.max(
    0,
    Math.min(page - halfVisiblePages, pageCount - maxVisiblePages)
  );
  const endPage = Math.min(pageCount, startPage + maxVisiblePages);

  const pageNumbers = Array.from(
    { length: endPage - startPage },
    (_, i) => startPage + i
  );

  return (
    <div className="table-container">
      <React.Fragment>
        <Table className={customClasses}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      // width: header.index === 0 ? 60 : "auto",
                      width: ((header.index === 0) || (header.index === columns.length - 1)) ? '4%' : `${(100 / columns.length - 2)}%`,
                    }}
                    className={
                      header.column.getIsSorted()
                        ? header.column.getIsSorted() === "asc"
                          ? "sort-asc"
                          : "sort-desc"
                        : ""
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`
                    ${row.getIsSelected() ? "bg-tablebackdrop" : ""}
                  `}
                  onClick={() => row.toggleSelected()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className=""
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="flex justify-center w-full my-10">
                <TableCell>
                  <LoaderWidget />
                </TableCell>
                {/* <TableCell>No results</TableCell> */}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="pagination-controls flex justify-between items-center mt-6 px-2.5">
          <div className="rows-per-page flex items-center gap-3 text-secondary w-full">
            <Select
              label={rowsPerPage.toString()}
              value={rowsPerPage.toString()}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              classNames={{
                base: " max-w-[70px] text-text-secondary rows-per-page-dropdown text-sm",
                trigger: "min-h-5 h-9",
                listboxWrapper: "bg-foreground rounded-md shadow-dropdown",
                mainWrapper: "border border-border-accent shadow-dropdown rounded-lg",
              }}
            >
              {[5, 10, 20, 50].map((size) => (
                <SelectItem
                  key={size}
                  className="text-text-primary gap-0 bg-foreground hover:bg-primary hover:text-white"
                >
                  {size}
                </SelectItem>
              ))}
            </Select>


            <p className="text-secondary text-[14px] font-normal">Records per page</p>
          </div>
          <div className="pagination-buttons flex items-center gap-2 text-secondary text-sm">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="p-2 border-none outline-none rounded-[5px] transform h-6 w-6 flex justify-center items-center cursor-pointer bg-backdrop"
            >
              {ArrowLeftIcon()}
            </button>
            {startPage > 0 && (
              <>
                <button
                  onClick={() => setPage(0)}
                  className="p-2 outline-none rounded-md h-6 w-6 flex justify-center items-center cursor-pointer text-sm"
                >
                  1
                </button>
                {startPage > 1 && <span className="">...</span>}
              </>
            )}
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`p-2 border-none outline-none rounded-md h-6 w-6 flex justify-center items-center text-sm cursor-pointer ${page === pageNumber
                  ? "bg-primary text-foreground"
                  : "bg-transparent text-secondary"
                  }`}
              >
                {pageNumber + 1}
              </button>
            ))}
            {endPage < pageCount && (
              <>
                {endPage < pageCount - 1 && <span className="">...</span>}
                <button
                  onClick={() => setPage(pageCount - 1)}
                  className="p-2 outline-none rounded-md h-6 w-6 flex justify-center items-center text-sm cursor-pointer"
                >
                  {pageCount}
                </button>
              </>
            )}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pageCount - 1}
              className="p-2 border-none outline-none rounded-[5px] h-6 w-6 flex justify-center items-center text-sm cursor-pointer bg-backdrop"
            >
              {ArrowRightIcon()}
            </button>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
}


interface MonthlyRoasterDataTableProps {
  columns: ColumnDef<any>[];
  data: any[];
}

export const MonthlyRoasterDataTable = memo(({ columns, data }: MonthlyRoasterDataTableProps) => {

  const [page, setPage] = React.useState(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowsPerPage, setRowsPerPage] = React.useState(5);


  const flattenedData = React.useMemo(() => {
    return data.flatMap((categoryData: { rows: any[]; category: any; subcategory: any; }) =>
      categoryData.rows.map((row) => ({
        ...row,
        category: categoryData.category,
        subcategory: categoryData.subcategory,
      }))
    );
  }, [data]);
  
  const table = useReactTable({
    data: flattenedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
  
    state: {
      sorting,
      rowSelection,
      pagination: {
        pageIndex: page,
        pageSize: rowsPerPage,
      },
    },
  });
  

  const pageCount = table.getPageCount();
  const maxVisiblePages = 2;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  const startPage = Math.max(
    0,
    Math.min(page - halfVisiblePages, pageCount - maxVisiblePages)
  );
  const endPage = Math.min(pageCount, startPage + maxVisiblePages);

  const pageNumbers = Array.from(
    { length: endPage - startPage },
    (_, i) => startPage + i
  );


  return (
    <div className="table-container">
      <React.Fragment>
        <Table className="w-full table-auto">
          <TableHeader className="">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="p-2 text-center text-sm font-semibold text-secondary">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <React.Fragment key={row.id}>
                {index === 0 && (
                  <React.Fragment>
                    <TableRow className="bg-[#DADFEC] font-black text-[15px]">
                      <TableCell colSpan={columns.length} className="px-4 py-2 font-black">
                        {flattenedData[index]?.category}
                      </TableCell>

                    </TableRow>

                    <TableRow className=' bg-[#EDEFF6]'>
                      <TableCell colSpan={columns.length} className="px-4 py-2 pl-10 font-extrabold text-[15px]">
                        {flattenedData[index]?.subcategory}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>

                )}
                <TableRow className={`${row.getIsSelected() ? 'bg-tablebackdrop' : ''}`}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="p-1 text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <div className="pagination-controls flex justify-between items-center mt-6 px-2.5">
          <div className="rows-per-page flex items-center gap-3 text-secondary w-full">
            <Select
              label={rowsPerPage.toString()}
              value={rowsPerPage.toString()}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              classNames={{
                base: " max-w-[70px] text-text-secondary rows-per-page-dropdown text-sm",
                trigger: "min-h-5 h-9",
                listboxWrapper: "bg-foreground rounded-md shadow-dropdown",
                mainWrapper: "border border-border-accent shadow-dropdown rounded-lg",
              }}
            >
              {[5, 10, 20, 50].map((size) => (
                <SelectItem
                  key={size}
                  className="text-text-primary gap-0 bg-foreground hover:bg-primary hover:text-white"
                >
                  {size}
                </SelectItem>
              ))}
            </Select>


            <p className="text-secondary text-[14px] font-normal">Records per page</p>
          </div>
          <div className="pagination-buttons flex items-center gap-2 text-secondary text-sm">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="p-2 border-none outline-none rounded-[5px] transform h-6 w-6 flex justify-center items-center cursor-pointer bg-backdrop"
            >
              {ArrowLeftIcon()}
            </button>
            {startPage > 0 && (
              <>
                <button
                  onClick={() => setPage(0)}
                  className="p-2 outline-none rounded-md h-6 w-6 flex justify-center items-center cursor-pointer text-sm"
                >
                  1
                </button>
                {startPage > 1 && <span className="">...</span>}
              </>
            )}
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`p-2 border-none outline-none rounded-md h-6 w-6 flex justify-center items-center text-sm cursor-pointer ${page === pageNumber
                  ? "bg-primary text-foreground"
                  : "bg-transparent text-secondary"
                  }`}
              >
                {pageNumber + 1}
              </button>
            ))}
            {endPage < pageCount && (
              <>
                {endPage < pageCount - 1 && <span className="">...</span>}
                <button
                  onClick={() => setPage(pageCount - 1)}
                  className="p-2 outline-none rounded-md h-6 w-6 flex justify-center items-center text-sm cursor-pointer"
                >
                  {pageCount}
                </button>
              </>
            )}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pageCount - 1}
              className="p-2 border-none outline-none rounded-[5px] h-6 w-6 flex justify-center items-center text-sm cursor-pointer bg-backdrop"
            >
              {ArrowRightIcon()}
            </button>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
})
