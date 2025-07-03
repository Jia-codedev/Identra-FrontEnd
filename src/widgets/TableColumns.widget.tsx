import { Column, ColumnDef, Row, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { VerticalDotsIcon, FaChevronDownIcon } from "@/lib/svg/icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import CustomButton from "@/components/ui/CustomButton";
import Input from "@/components/ui/Input";
import { MonthlyRosterDataType } from "@/lib/types/types";
import { cn } from "@/lib/utils";
import ScheduleColorDropDown from '@/widgets/ScheduleColorDropDown.widget';

export function TableColumns<T>(
  columns: string[], 
  colType: T, 
  handleMemberClick?: (data: any) => void
): ColumnDef<T, any>[] {
  let tableColumns: ColumnDef<T, any>[] = [];
  columns.forEach((col) => {
    switch (col) {
      case "select":
        tableColumns.push({
          id: col,
          header: ({ table }) => CheckBoxColumn(table, undefined),
          cell: ({ row }) => CheckBoxColumn(undefined, row),
          enableSorting: false,
          enableHiding: false,
        });
        break;

      case "members":
        tableColumns.push({
          accessorKey: col as keyof T,
          header: ({ column }) => DefaultColumn(col, column),
          cell: ({ row }) => MemberColumn(col, row, handleMemberClick),  // Pass click handler
          enableHiding: false,
        });
        break;

      case "actions":
        tableColumns.push({
          id: col,
          cell: ({ row }) => ActionsColumn(row),
          enableHiding: false,
        });
        break;

      default:
        tableColumns.push({
          accessorKey: col as keyof T, // Ensure correct accessor key type
          header: ({ column }) => DefaultColumn(col, column),
          cell: ({ row }) => DefaultColumn(col, undefined, row),
          enableSorting: true,
        });
    }
  });

  return tableColumns;
}

const CheckBoxColumn = (table?: Table<any>, row?: Row<any>) => {
  const isSelected = row ? row.getIsSelected() : table?.getIsAllPageRowsSelected();

  return (
    <div className="text-center align-middle h-5">
      <Checkbox
        className="table-checkbox outline-none border-[2.4px] w-5 h-5"
        checked={isSelected}
        onCheckedChange={() =>
          row ? row.toggleSelected(!isSelected) : table?.toggleAllPageRowsSelected(!isSelected)
        }
      />
    </div>
  );
};

const ActionsColumn = (row: Row<any>) => {
  const { onOpen, isOpen, onOpenChange } = useDisclosure();

  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown>
        <DropdownTrigger className="border-none outline-none">
          <Button disableRipple={true} isIconOnly variant="light" className="flex min-h-auto h-auto w-auto min-w-fit px-2.5">
            {VerticalDotsIcon()}
          </Button>
        </DropdownTrigger>
        <DropdownMenu className="cursor-pointer w-auto bg-foreground border border-border-accent shadow-dropdown rounded-md p-0 gap-0">
          <DropdownItem className="cursor-pointer text-content px-9 py-2 text-xs font-normal" onClick={onOpen}>Edit</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-white/75 backdrop-opacity-50",
          base: "bg-foreground text-text-primary shadow-popup rounded-[20px] p-5",
          header: "text-center p-0",
          body: "p-0",
          footer: "flex justify-center gap-2 p-0 py-5 mt-3",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="text-xl font-bold text-text-primary capitalize">Regions</h1>
                <h4 className="text-sm font-semibold text-text-secondary pb-5">Regions of the employee</h4>
              </ModalHeader>
              <ModalBody>
                <div>
                  <Input inputType={'text'} inputLabel={'Code'} placeholderText={'Enter code'} inputAttr={true} className={''} labelClassName={''} inputClassName={''} />
                  <Input inputType={'text'} inputLabel={'Description(English)'} placeholderText={'Enter description in english'} inputAttr={true} className={''} labelClassName={''} inputClassName={''} />
                  <Input inputType={'text'} inputLabel={'Description [العربية]'} placeholderText={'Enter description in arabic'} inputAttr={true} className={''} labelClassName={''} inputClassName={''} />
                </div>
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  variant="outline"
                  borderRadius="full"
                  width="100%"
                  height="40px"
                  onClick={onClose}
                  btnText='Cancel'
                />
                <CustomButton
                  variant="primary"
                  borderRadius="full"
                  width="100%"
                  height="40px"
                  onClick={() => alert("Added successfully")}
                  btnText='Save'
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div >
  );
};

const DefaultColumn = (col: string, column?: Column<any, any>, row?: Row<any>) => {
  if (column) {
    const sorting = column.getIsSorted();
    return (
      <button
        className="text-secondary font-semibold text-[15px] flex items-center capitalize gap-2"
        onClick={column.getToggleSortingHandler()}
      >
        <p>{col.split("_").join(" ")}</p>
        <span className="text-secondary">{FaChevronDownIcon()}</span>
      </button>
    );
  } else {
    return (
      <p className="font-bold text-content">
        {row?.getValue(col)}
      </p>
    );
  }
};

const MemberColumn = (col: string, row?: Row<any>, handleMemberClick?: (data: any) => void) => {
  return (
    <p
      className="font-bold text-content cursor-pointer"
      onClick={() => handleMemberClick?.(row?.getValue(col))}
    >
      {row?.getValue(col)}
    </p>
  );
};








const CheckBoxColumnMR = ({ isSelected, toggleSelection }: { isSelected: boolean, toggleSelection: () => void }) => (
  <div className="text-center align-middle h-5">
    <Checkbox
      className="table-checkbox outline-none border-[2.4px] w-5 h-5"
      checked={isSelected}
      onCheckedChange={toggleSelection}
    />
  </div>
);



export const MonthlyRoasterColumns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <CheckBoxColumnMR
        isSelected={table.getIsAllPageRowsSelected()}
        toggleSelection={() => table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected())}
      />
    ),
    cell: ({ row }) => (
      <CheckBoxColumnMR
        isSelected={row.getIsSelected()}
        toggleSelection={() => row.toggleSelected(!row.getIsSelected())}
      />
    ),
  },
  {
    accessorKey: 'number',
    header: () => <span className="font-bold">Number</span>,
  },
  {
    accessorKey: 'name',
    header: () => <span className="font-bold">Name</span>,
  },
  {
    accessorKey: 'version',
    header: () => <span className="font-bold">Version</span>,
  },
  {
    accessorKey: 'status',
    header: () => <span className="font-bold">Status</span>,
    cell: ({ row }) => <span className="text-secondary">{row.getValue('status')}</span>,
  },
  ...Array.from({ length: 31 }, (_, index) => ({
    accessorKey: `schedule[${index}]`,
    header: () => (index + 1).toString(),
    cell: ({ row }: { row: any }) => (
      <div 
        className={cn(
          'status-badge',
          'flex justify-center items-center',
          // 'w-[30px] h-[25px] rounded-[3px] bg-[#0E6ECF]',
          'text-white text-xs font-extrabold text-center capitalize',
          `${row.getValue(`schedule[${index}]`)}`
        )}
      >
        <ScheduleColorDropDown/>
        {/* {row.getValue(`schedule[${index}]`)} */}
      </div>
    ),
  })),
  {
    accessorKey: 'work_hours',
    header: () => <span className="font-bold">Work Hours</span>,
    cell: ({ row }) => <span className="text-secondary">{row.getValue('work_hours')}</span>,
  },
];