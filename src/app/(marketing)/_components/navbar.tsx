import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-full border-b border-neutral-800">
      <div className="flex items-center justify-center">
        <div className="min-w-4xl border-x border-neutral-800">
          <div className="py-2 px-4">
            <div className="flex items-center justify-between">
              <div>nom.ai</div>
              <SignInButton>
                <Button className="border-none bg-neutral-100 text-black hover:bg-neutral-900 rounded-none">Sign In</Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
