"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { useTranslations } from '@/hooks/use-translations';
import { Clock, Calendar, FileText, Send, X } from 'lucide-react';

// Form data types
interface PermissionFormData {
  date: Date;
  type: string;
  startTime: string;
  endTime: string;
  reason: string;
}

interface LeaveFormData {
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  emergencyContact: string;
}

interface ManualPunchFormData {
  date: Date;
  punchType: string;
  time: string;
  reason: string;
  location: string;
}

// Exportable form interfaces
export interface ChatBotFormConfig {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

// Permission Form Component
export const PermissionForm: React.FC<ChatBotFormConfig> = ({ onSubmit, onCancel, initialData = {} }) => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState<PermissionFormData>({
    date: initialData.date || new Date(),
    type: initialData.type || '',
    startTime: initialData.startTime || '',
    endTime: initialData.endTime || '',
    reason: initialData.reason || '',
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: 'permission',
      data: formData,
      timestamp: new Date()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="border-0 shadow-none px-2 gap-2">
        <CardHeader className="px-0 items-center justify-center">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="w-4 h-4" />
            {t('chatbot.forms.permissionTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="date" className="text-xs">{t('chatbot.forms.date')}</Label>
              <DatePicker
                selected={formData.date}
                onSelect={(date: Date | undefined) => setFormData((prev: PermissionFormData) => ({ ...prev, date: date || new Date() }))}
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-xs">{t('chatbot.forms.permissionType')}</Label>
              <Select value={formData.type} onValueChange={(value: string) => setFormData((prev: PermissionFormData) => ({ ...prev, type: value }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder={t('chatbot.forms.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="late-arrival">{t('chatbot.forms.lateArrival')}</SelectItem>
                  <SelectItem value="early-departure">{t('chatbot.forms.earlyDeparture')}</SelectItem>
                  <SelectItem value="missing-hours">{t('chatbot.forms.missingHours')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startTime" className="text-xs">{t('chatbot.forms.startTime')}</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: PermissionFormData) => ({ ...prev, startTime: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="endTime" className="text-xs">{t('chatbot.forms.endTime')}</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: PermissionFormData) => ({ ...prev, endTime: e.target.value }))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason" className="text-xs">{t('chatbot.forms.reason')}</Label>
              <Textarea
                value={formData.reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev: PermissionFormData) => ({ ...prev, reason: e.target.value }))}
                placeholder={t('chatbot.forms.reasonPlaceholder')}
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-8 text-xs">
                <X className="w-3 h-3 mr-1" />
                {t('common.cancel')}
              </Button>
              <Button type="submit" className="flex-1 h-8 text-xs">
                <Send className="w-3 h-3 mr-1" />
                {t('common.submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Leave Form Component
export const LeaveForm: React.FC<ChatBotFormConfig> = ({ onSubmit, onCancel, initialData = {} }) => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: initialData.leaveType || '',
    startDate: initialData.startDate || new Date(),
    endDate: initialData.endDate || new Date(),
    reason: initialData.reason || '',
    emergencyContact: initialData.emergencyContact || '',
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: 'leave',
      data: formData,
      timestamp: new Date()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="border-0 shadow-none px-2 gap-2">
        <CardHeader className="pb-2 px-0 items-center justify-center">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4" />
            {t('chatbot.forms.leaveTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="leaveType" className="text-xs">{t('chatbot.forms.leaveType')}</Label>
              <Select value={formData.leaveType} onValueChange={(value: string) => setFormData((prev: LeaveFormData) => ({ ...prev, leaveType: value }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder={t('chatbot.forms.selectLeaveType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">{t('chatbot.forms.annualLeave')}</SelectItem>
                  <SelectItem value="sick">{t('chatbot.forms.sickLeave')}</SelectItem>
                  <SelectItem value="emergency">{t('chatbot.forms.emergencyLeave')}</SelectItem>
                  <SelectItem value="personal">{t('chatbot.forms.personalLeave')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startDate" className="text-xs">{t('chatbot.forms.startDate')}</Label>
                <DatePicker
                  selected={formData.startDate}
                  onSelect={(date: Date | undefined) => setFormData((prev: LeaveFormData) => ({ ...prev, startDate: date || new Date() }))}
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs">{t('chatbot.forms.endDate')}</Label>
                <DatePicker
                  selected={formData.endDate}
                  onSelect={(date: Date | undefined) => setFormData((prev: LeaveFormData) => ({ ...prev, endDate: date || new Date() }))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason" className="text-xs">{t('chatbot.forms.reason')}</Label>
              <Textarea
                value={formData.reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev: LeaveFormData) => ({ ...prev, reason: e.target.value }))}
                placeholder={t('chatbot.forms.leaveReasonPlaceholder')}
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            <div>
              <Label htmlFor="emergencyContact" className="text-xs">{t('chatbot.forms.emergencyContact')}</Label>
              <Input
                value={formData.emergencyContact}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: LeaveFormData) => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder={t('chatbot.forms.emergencyContactPlaceholder')}
                className="h-8 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-8 text-xs">
                <X className="w-3 h-3 mr-1" />
                {t('common.cancel')}
              </Button>
              <Button type="submit" className="flex-1 h-8 text-xs">
                <Send className="w-3 h-3 mr-1" />
                {t('common.submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Manual Punch Form Component
export const ManualPunchForm: React.FC<ChatBotFormConfig> = ({ onSubmit, onCancel, initialData = {} }) => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState<ManualPunchFormData>({
    date: initialData.date || new Date(),
    punchType: initialData.punchType || '',
    time: initialData.time || '',
    reason: initialData.reason || '',
    location: initialData.location || '',
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: 'manual-punch',
      data: formData,
      timestamp: new Date()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card className="border-0 shadow-none px-2 gap-2">
        <CardHeader className="pb-2 px-0 items-center justify-center">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4" />
            {t('chatbot.forms.manualPunchTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="date" className="text-xs">{t('chatbot.forms.date')}</Label>
              <DatePicker
                selected={formData.date}
                onSelect={(date: Date | undefined) => setFormData((prev: ManualPunchFormData) => ({ ...prev, date: date || new Date() }))}
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="punchType" className="text-xs">{t('chatbot.forms.punchType')}</Label>
              <Select value={formData.punchType} onValueChange={(value: string) => setFormData((prev: ManualPunchFormData) => ({ ...prev, punchType: value }))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder={t('chatbot.forms.selectPunchType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clock-in">{t('chatbot.forms.clockIn')}</SelectItem>
                  <SelectItem value="clock-out">{t('chatbot.forms.clockOut')}</SelectItem>
                  <SelectItem value="break-start">{t('chatbot.forms.breakStart')}</SelectItem>
                  <SelectItem value="break-end">{t('chatbot.forms.breakEnd')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="time" className="text-xs">{t('chatbot.forms.time')}</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ManualPunchFormData) => ({ ...prev, time: e.target.value }))}
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label htmlFor="location">{t('chatbot.forms.location')}</Label>
              <Input
                value={formData.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ManualPunchFormData) => ({ ...prev, location: e.target.value }))}
                placeholder={t('chatbot.forms.locationPlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="reason" className="text-xs">{t('chatbot.forms.reason')}</Label>
              <Textarea
                value={formData.reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((prev: ManualPunchFormData) => ({ ...prev, reason: e.target.value }))}
                placeholder={t('chatbot.forms.punchReasonPlaceholder')}
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-xs">{t('chatbot.forms.location')}</Label>
              <Input
                value={formData.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev: ManualPunchFormData) => ({ ...prev, location: e.target.value }))}
                placeholder={t('chatbot.forms.locationPlaceholder')}
                className="h-8 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-8 text-xs">
                <X className="w-3 h-3 mr-1" />
                {t('common.cancel')}
              </Button>
              <Button type="submit" className="flex-1 h-8 text-xs">
                <Send className="w-3 h-3 mr-1" />
                {t('common.submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export type { PermissionFormData, LeaveFormData, ManualPunchFormData };
