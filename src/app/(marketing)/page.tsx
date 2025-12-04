import React from 'react'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

const LandingPage = () => {
  return (
    <div>
      <SignInButton>
        <Button>Sign In</Button>
      </SignInButton>
    </div>
  )
}

export default LandingPage