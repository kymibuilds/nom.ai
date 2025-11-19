import { Button } from '@/components/ui/button'
import { SignOutButton } from '@clerk/nextjs'
import React from 'react'

function Page() {

  return (
    <div>
      <SignOutButton>
        <Button>Sign Out</Button>
      </SignOutButton>
    </div>

  )
}

export default Page