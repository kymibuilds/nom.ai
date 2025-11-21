import { Button } from "@/components/ui/button";
import React from "react";

function Page() {
  return (
    <>
      <div className="h-screen w-full bg-neutral-50 px-4 py-4">
        <div className="flex items-center justify-center">
          <h1 className="text-white text-6xl">get shit done</h1>
          <Button className="rounded-full bg-[#121212] hover:bg-[#121212]" size={"sm"}>Login</Button>
        </div>
      </div>
    </>
  );
}

export default Page;
