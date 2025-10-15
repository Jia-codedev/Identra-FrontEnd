import Image from "next/image";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background opacity-50">
        <div className="h-full w-full bg-gradient-to-br from-transparent via-background to-background z-20 absolute" />
        <Image
          src="/background.png"
          alt="Background Image"
          fill
          style={{ objectFit: "cover" }}
          className="object-cover relative z-0"
          priority
        />
      </div>
      {children}
    </>
  );
}

export default layout;
