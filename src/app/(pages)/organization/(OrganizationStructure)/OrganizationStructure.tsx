"use client";

import React from "react";
import {Accordion, AccordionItem, Avatar} from "@nextui-org/react";

export default function OrganizationStructure() {
  const itemClasses = {
    base: "py-0 w-full mx-10",
    title: "px-10 py-2.5 text-content font-lg font-bold bg-backdrop border border-tablebackdrop w-full rounded-lg",
    trigger: "py-1",
    // trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-12 flex items-center",
    // indicator: "text-medium",
    // content: "text-small px-2",
  };

  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <div className="m-10">
      <p className="accordion-header px-10 py-2.5 w-full max-w-[450px] bg-primary border border-primary rounded-lg text-white font-lg font-bold mb-5 uppercase">Chronologix Structure - Demo</p>
      <Accordion 
        selectionMode="multiple" 
        showDivider={false}
        className="p-0 flex flex-col gap-1 w-full max-w-[450px]"
        hideIndicator
        itemClasses={itemClasses}
      >
        <AccordionItem key="1" aria-label="01 - Chairman" title="01 - Chairman">
          <p className="accordion-content mx-10 mb-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">01-01 - Chairman Office</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">01-02 - Internal Audit Office</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">01-03 - Legal Affairs Office</p>
          <p className="accordion-content mx-10 mt-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">01-04 - Strategic Affairs Office</p>
        </AccordionItem>
        <AccordionItem key="2" aria-label="02 - Undersecretary" title="02 - Undersecretary">
          <p className="accordion-content mx-10 mb-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">02-01 - Corporate Communication office</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">02-02 - Under Secretary Office</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">02-03 - Operations and follow-up Office</p>
        </AccordionItem>
        <AccordionItem key="3" aria-label="03 - Corporate Support Service Centre" title="03 - Corporate Support Service Centre">
          <p className="accordion-content mx-10 mb-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">03-01 - Finance & Accounting Department</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">03-02 - General Services and Facilities Management Department</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">03-03 - Human Capital Department</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">03-04 - Information Technology Department</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">03-05 - Contracts and Procurement</p>
        </AccordionItem>
        <AccordionItem key="4" aria-label="04 - Government Procurement Office" title="04 - Government Procurement Office">
          <p className="accordion-content mx-10 mb-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">04-01 - Entity Services</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">04-02 - Planning & Standards</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">04-03 - Supplier Services</p>
        </AccordionItem>
        <AccordionItem key="5" aria-label="05 - Innovation and Future Foresight Sector" title="05 - Innovation and Future Foresight Sector">
          <p className="accordion-content mx-10 mb-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">05-01 - Future Foresight and Research</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">05-02 - Innovation lab & Partnerships</p>
        </AccordionItem>
        <AccordionItem key="6" aria-label="06 - Policies Sectore" title="06 - Policies Sector">
          <p className="accordion-content mx-10 mb-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">06-01 - Data & Statistics</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">06-02 - Human Capital</p>
          <p className="accordion-content mx-10 my-2.5 px-10 py-2 w-full max-w-[400px] bg-success border border-success rounded-lg text-white font-lg font-medium">06-03 - Technology</p>
        </AccordionItem>
      </Accordion>
    </div>
  );
}