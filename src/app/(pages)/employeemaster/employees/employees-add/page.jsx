"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const EmployeeAdd = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("jia");
  const [password, setPassword] = useState("g)aQ+0XjZJPU");

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const next = () => setStep((prev) => Math.min(prev + 1, 3));
  const back = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-7xl mx-auto font-sans">
      <div className="flex space-x-6 mb-6 text-sm font-medium border-b pb-2">
        {["Personal", "Credentials", "Official", "Flags"].map((label, index) => (
          <button
            key={index}
            className={`px-4 py-2 border-b-2 ${
              step === index
                ? "text-purple-700 border-purple-700 font-semibold"
                : "text-gray-500 border-transparent hover:text-purple-600"
            }`}
            onClick={() => setStep(index)}
          >
            {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <>
          <h2 className="text-xl font-semibold text-purple-600 mb-6">Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Emp No *" />
            <Input label="Emp ID *" />
            <Input label="First Name *" />
            <Input label="Last Name *" />
            <Input label="DOB *" type="date" />
            <Input label="Email *" />
            <Input label="Mobile *" />
            <Input label="Join Date *" type="date" />
          </div>
          <Buttons backText="Cancel" next={next} back={() => router.back()} />
        </>
      )}

      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold text-purple-600 mb-6">Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Username *" value={username} onChange={(e) => setUsername(e.target.value)} />
            <div className="flex items-end gap-2">
              <Input
                label="Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={generatePassword}
                className="mt-5 px-4 py-2 bg-purple-700 text-white rounded-md text-sm hover:bg-purple-800"
              >
                Create Password
              </button>
            </div>
          </div>
          <Buttons back={back} next={next} />
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold text-purple-600 mb-6">Official</h2>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox rounded-full text-purple-600" />
              <span className="ml-2 text-sm">Manager Flag</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label="Employee Type *" />
            <Select label="Location *" />
            <Select label="Citizenship *" />
            <Select label="Designation *" />
            <Select label="Organization Type *" />
            <Select label="Organization *" />
            <Select label="Grade *" />
            <Select label="Manager" />
          </div>
          <Buttons back={back} next={next} />
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-xl font-semibold text-purple-600 mb-6">Flags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {["Active", "Punch", "Overtime", "Inpayroll", "Email Notification", "Open Shift", "Geo Fench", "Calculate Monthly Missed Hours"].map(label => <Checkbox label={label} key={label} />)}
            </div>
            <div className="space-y-3">
              {["Exclude From Integration", "On Report", "Share Roster", "Include In Email", "Web Punch", "Shift", "Check In/Out Selfie"].map(label => <Checkbox label={label} key={label} />)}
            </div>
          </div>
          <Buttons back={back} nextText="Save" next={() => alert("Saved")} />
        </>
      )}
    </div>
  );
};

const Input = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-full border px-4 py-2 text-sm"
    />
  </div>
);

const Select = ({ label }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select className="mt-1 block w-full rounded-full border px-4 py-2 text-sm">
      <option>Choose {label.toLowerCase().replace("*", "").trim()}</option>
    </select>
  </div>
);

const Checkbox = ({ label }) => (
  <label className="inline-flex items-center">
    <input type="checkbox" className="form-checkbox rounded text-purple-600" />
    <span className="ml-2 text-sm">{label}</span>
  </label>
);

const Buttons = ({ backText = "Back", nextText = "Next", back, next }) => (
  <div className="flex justify-end gap-4 mt-6">
    <button onClick={back} className="px-6 py-2 border rounded-full text-gray-600 hover:bg-gray-100 text-sm">
      {backText}
    </button>
    <button onClick={next} className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 text-sm">
      {nextText}
    </button>
  </div>
);

export default EmployeeAdd;
