"use client";
import { streamText } from "ai";
import { createTextStreamResponse } from "ai";
import {createGoogleGenerativeAI} from "@ai-sdk/google";
import useProject from "@/hooks/use-project";
import { createStreamableValue } from "@ai-sdk/rsc"
import { generateEmbedding } from "@/lib/gemini";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
})

export async function askQuestion(question: string, projectId: string){
  const stream = createStreamableValue();
  
  const queryVector = await generateEmbedding(question)
  const vectorQuery = `[${queryVector?.join(",")}
    ]`
  
  const result = await db.$querytRaw`
      SELECT "fileName","sourceCode","summary",
      1- ("summaryEmbedding"<=>#${vectorQuery}::vector) AS similartiy
      FROM "SourceCodeEmbedding"
      WHERE 1 = ("summaryEmbedding" <=>#{vectorQuery}::vector) >0.5
    `
}