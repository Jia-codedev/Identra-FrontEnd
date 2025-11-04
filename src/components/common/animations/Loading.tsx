import React from "react";
import { Spinner } from "@/components/ui/spinner";
const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">

      <Spinner className="size-14 dark:text-white text-black" />
    </div>
  );
};

export default Loading;
