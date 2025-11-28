"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,{
})

export async function createCheckoutSession(credits: number){
    
}