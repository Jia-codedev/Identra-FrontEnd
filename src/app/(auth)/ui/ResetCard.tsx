/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
'use client'
import React from "react";
import CustomButton from "@/components/ui/CustomButton";
import Input from "@/components/ui/Input";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

function CardComponent() {
  const router = useRouter();
  return (
    <div className="card-component-backdrop w-full h-screen flex justify-center items-center relative">
      <Image
      style={{zIndex: -1}}
        src="/bg.svg"
        alt="Time Management"
        objectFit="cover"
        layout="fill"
      />
      <div className="card-component-container bg-foreground w-[25em] p-5 flex justify-center rounded-3xl z-10 shadow-[2px_2px_10px_5px_rgba(0,0,0,0.5)]">
        <div className="card-component-content text-center w-full p-2.5">
            <h1 className="text-xl font-bold text-text-primary capitalize">Create new password</h1>
            <h4 className="text-sm font-semibold text-text-secondary pb-5">Your new password must be different from pervious password.</h4>
            <div>
              <Input inputType={'password'} inputLabel={'Password'} placeholderText={'Enter your new password'} inputAttr={true} className={''} labelClassName={''} inputClassName={''}/>
              <Input inputType={'password'} inputLabel={'Confirm Password'} placeholderText={'Confirm your new password'} inputAttr={true} className={''} labelClassName={''} inputClassName={''}/>
            </div>
            <div className="flex mt-6 justify-center gap-2">
              <CustomButton 
                variant="primary" 
                borderRadius="full" 
                width = "100%" 
                height="40px"
                onClick={() => router.push('/login')}
                btnText='Reset Password'
              />
            </div>
        </div>
      </div>
    </div>
  );
}

export default CardComponent;

