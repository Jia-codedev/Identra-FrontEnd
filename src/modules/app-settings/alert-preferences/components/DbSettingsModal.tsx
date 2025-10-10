"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChronDbSetting, CreateChronDbSettingRequest } from "../types";

interface DbSettingsModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  dbSetting: ChronDbSetting | null;
  onClose: () => void;
  onSave: (data: CreateChronDbSettingRequest) => void;
  isLoading?: boolean;
}

export const DbSettingsModal: React.FC<DbSettingsModalProps> = ({
  isOpen,
  mode,
  dbSetting,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateChronDbSettingRequest>();

  const connectDbFlag = watch("connect_db_flag");

  useEffect(() => {
    if (mode === "edit" && dbSetting) {
      reset({
        db_databasetype: dbSetting.db_databasetype || "",
        db_databasename: dbSetting.db_databasename || "",
        db_host_name: dbSetting.db_host_name || "",
        db_port_no: dbSetting.db_port_no || "",
        db_username: dbSetting.db_username || "",
        db_password: dbSetting.db_password || "",
        connect_db_flag: dbSetting.connect_db_flag || false,
      });
    } else {
      reset({
        db_databasetype: "",
        db_databasename: "",
        db_host_name: "",
        db_port_no: "",
        db_username: "",
        db_password: "",
        connect_db_flag: false,
      });
    }
  }, [mode, dbSetting, reset]);

  const handleFormSubmit = (data: CreateChronDbSettingRequest) => {
    onSave(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Database Setting" : "Edit Database Setting"}
          </DialogTitle>
          <DialogDescription>
            Configure database connection settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="db_databasetype">Database Type</Label>
              <Select onValueChange={(value) => setValue("db_databasetype", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SQL Server">SQL Server</SelectItem>
                  <SelectItem value="MySQL">MySQL</SelectItem>
                  <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                  <SelectItem value="Oracle">Oracle</SelectItem>
                  <SelectItem value="SQLite">SQLite</SelectItem>
                </SelectContent>
              </Select>
              {errors.db_databasetype && (
                <p className="text-sm text-red-500">Database type is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="db_databasename">Database Name</Label>
              <Input
                id="db_databasename"
                placeholder="e.g., chronexaDB"
                {...register("db_databasename", { required: "Database name is required" })}
              />
              {errors.db_databasename && (
                <p className="text-sm text-red-500">{errors.db_databasename.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="db_host_name">Host Name</Label>
              <Input
                id="db_host_name"
                placeholder="e.g., localhost"
                {...register("db_host_name", { required: "Host name is required" })}
              />
              {errors.db_host_name && (
                <p className="text-sm text-red-500">{errors.db_host_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="db_port_no">Port Number</Label>
              <Input
                id="db_port_no"
                placeholder="e.g., 1433"
                {...register("db_port_no", { required: "Port number is required" })}
              />
              {errors.db_port_no && (
                <p className="text-sm text-red-500">{errors.db_port_no.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="db_username">Username</Label>
              <Input
                id="db_username"
                placeholder="Database username"
                {...register("db_username")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="db_password">Password</Label>
              <Input
                id="db_password"
                type="password"
                placeholder="Database password"
                {...register("db_password")}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Connect to Database</Label>
              <div className="text-sm text-muted-foreground">
                Enable database connection
              </div>
            </div>
            <Switch
              checked={connectDbFlag}
              onCheckedChange={(value) => setValue("connect_db_flag", value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : mode === "add" ? "Add Setting" : "Update Setting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};