'use client';
import React, { useState } from 'react';
import {RadioGroup, Radio} from "@nextui-org/react";
import { Checkbox } from '@/components/ui/Checkbox';
import { cn } from '@/lib/utils';

function PolicyTab() {

    return (
        <div>
            <div className='flex'>
                <div className='flex flex-col items-start'>
                  <div className="py-2.5 flex gap-3 items-center text-sm">
                    <RadioGroup
                      label="Show On Report"
                      orientation="horizontal"
                      classNames={{
                        base: cn(
                          "flex-row gap-5",
                        ),
                        wrapper: "gap-10",
                        label: "w-[120px]",
                      }}
                    >
                      <Radio value="First IN / Last Out" 
                        classNames={{
                          base: cn(
                            "text-text-primary max-w-fit",
                          ),
                          label: "text-sm text-text-primary",
                          wrapper: "border-2 border-border-grey w-4 h-4",
                        }}
                      >
                        First IN/Last Out
                      </Radio>
                      <Radio value="All Transactions" 
                        classNames={{
                          base: cn(
                            "text-text-primary max-w-fit",
                          ),
                          label: "text-sm text-text-primary",
                          wrapper: "border-2 border-border-grey w-4 h-4",
                        }}
                      >
                        All Transactions
                      </Radio>
                    </RadioGroup>
                  </div>
                  <div className="py-2.5 flex gap-3 items-center text-sm">
                    <RadioGroup
                      label="Email Notification"
                      orientation="horizontal"
                      classNames={{
                        base: cn(
                          "flex-row gap-5",
                        ),
                        wrapper: "gap-10",
                        label: "w-[120px]",
                      }}
                    >
                      <Radio value="First IN / Last Out" 
                        classNames={{
                          base: cn(
                            "text-text-primary max-w-fit",
                          ),
                          label: "text-sm text-text-primary",
                          wrapper: "border-2 border-border-grey w-4 h-4",
                        }}
                      >
                        First IN/Last Out
                      </Radio>
                      <Radio value="All Transactions" 
                        classNames={{
                          base: cn(
                            "text-text-primary max-w-fit",
                          ),
                          label: "text-sm text-text-primary",
                          wrapper: "border-2 border-border-grey w-4 h-4",
                        }}
                      >
                        All Transactions
                      </Radio>
                    </RadioGroup>
                  </div>
                    <div className="py-2.5 flex gap-3 items-center text-sm">
                          <Checkbox checked
                            className="modal-checkbox outline-none border-[2px] w-4 h-4 border-border-grey font-semibold text-sm text-text-primary"
                          />Calculate Worked Hours From Schedule Start Time
                    </div>
                    <div className="py-2.5 flex gap-3 items-center text-sm">
                          <Checkbox checked
                            className="modal-checkbox outline-none border-[2px] w-4 h-4 border-border-grey font-semibold text-sm text-text-primary"
                          />Enable Default Overtime
                    </div>
                    <div className="py-2.5 flex gap-3 items-center text-sm">
                          <Checkbox
                            className="modal-checkbox outline-none border-[2px] w-4 h-4 border-border-grey font-semibold text-sm text-text-primary"
                          />Enable Default Break Hours
                    </div>
                    <div className="py-2.5 flex gap-3 items-center text-sm">
                          <Checkbox
                            className="modal-checkbox outline-none border-[2px] w-4 h-4 border-border-grey font-semibold text-sm text-text-primary"
                          />Overide Schedule On Holiday
                    </div>
                    <div className="py-2.5 flex gap-3 items-center text-sm">
                          <Checkbox checked
                            className="modal-checkbox outline-none border-[2px] w-4 h-4 border-border-grey font-semibold text-sm text-text-primary"
                          />Reduce Required Hours if Personal Permission is approved
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default PolicyTab
