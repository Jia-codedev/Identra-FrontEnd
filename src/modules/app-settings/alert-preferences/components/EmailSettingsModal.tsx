"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChronEmailSetting, CreateChronEmailSettingRequest } from "../types";
import { useTranslations } from "@/hooks/use-translations";

const createEmailSettingSchema = (t: any) => z.object({
  em_smtp_name: z.string().min(1, t("appSettings.alertPreferences.validation.smtpNameRequired")),
  em_host_name: z.string().min(1, t("appSettings.alertPreferences.validation.hostNameRequired")),
  em_port_no: z.string().min(1, t("appSettings.alertPreferences.validation.portRequired")),
  em_from_email: z.string().email(t("appSettings.alertPreferences.validation.validEmailRequired")),
  em_smtp_password: z.string().min(1, t("appSettings.alertPreferences.validation.smtpPasswordRequired")),
  em_encryption: z.string().optional(),
  em_active_smtp_flag: z.boolean(),
});

type EmailSettingFormData = z.infer<ReturnType<typeof createEmailSettingSchema>>;

interface EmailSettingsModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  emailSetting: ChronEmailSetting | null;
  onClose: () => void;
  onSave: (data: CreateChronEmailSettingRequest) => void;
  isLoading?: boolean;
}

export const EmailSettingsModal: React.FC<EmailSettingsModalProps> = ({
  isOpen,
  mode,
  emailSetting,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const { t } = useTranslations();
  const emailSettingSchema = createEmailSettingSchema(t);
  
  const form = useForm<EmailSettingFormData>({
    resolver: zodResolver(emailSettingSchema),
    defaultValues: {
      em_smtp_name: "",
      em_host_name: "",
      em_port_no: "",
      em_from_email: "",
      em_smtp_password: "",
      em_encryption: "none",
      em_active_smtp_flag: false,
    },
  });

  useEffect(() => {
    if (mode === "edit" && emailSetting) {
      form.reset({
        em_smtp_name: emailSetting.em_smtp_name || "",
        em_host_name: emailSetting.em_host_name || "",
        em_port_no: emailSetting.em_port_no || "",
        em_from_email: emailSetting.em_from_email || "",
        em_smtp_password: emailSetting.em_smtp_password || "",
        em_encryption: emailSetting.em_encryption || "none",
        em_active_smtp_flag: emailSetting.em_active_smtp_flag || false,
      });
    } else {
      form.reset({
        em_smtp_name: "",
        em_host_name: "",
        em_port_no: "",
        em_from_email: "",
        em_smtp_password: "",
        em_encryption: "none",
        em_active_smtp_flag: false,
      });
    }
  }, [mode, emailSetting, form]);

  const handleSubmit = (data: EmailSettingFormData) => {
    const payload: CreateChronEmailSettingRequest = {
      ...data,
      em_encryption: data.em_encryption === "none" ? "" : (data.em_encryption as string),
    };
    onSave(payload);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" 
              ? t("appSettings.alertPreferences.addEmailSetting") 
              : t("appSettings.alertPreferences.editEmailSetting")
            }
          </DialogTitle>
          <DialogDescription>
            {t("appSettings.alertPreferences.configureSmtpSettings")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="em_smtp_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("appSettings.alertPreferences.smtpName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("appSettings.alertPreferences.smtpNamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="em_host_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("appSettings.alertPreferences.hostName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("appSettings.alertPreferences.hostNamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="em_port_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("appSettings.alertPreferences.port")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("appSettings.alertPreferences.portPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="em_encryption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("appSettings.alertPreferences.encryption")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("appSettings.alertPreferences.selectEncryption")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">{t("common.none")}</SelectItem>
                        <SelectItem value="TLS">TLS</SelectItem>
                        <SelectItem value="SSL">SSL</SelectItem>
                        <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="em_from_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("appSettings.alertPreferences.fromEmail")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder={t("appSettings.alertPreferences.fromEmailPlaceholder")} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="em_smtp_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("appSettings.alertPreferences.smtpPassword")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={t("appSettings.alertPreferences.smtpPasswordPlaceholder")} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="em_active_smtp_flag"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("appSettings.alertPreferences.activeSmtp")}</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {t("appSettings.alertPreferences.enableSmtpConfig")}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? t("common.saving") 
                  : mode === "add" 
                    ? t("appSettings.alertPreferences.addSetting") 
                    : t("appSettings.alertPreferences.updateSetting")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};