/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import { ReactNode } from 'react'

import { openai } from '@ai-sdk/openai'
import { createAI, getMutableAIState, streamUI } from 'ai/rsc'
import { nanoid } from 'nanoid'

export interface ServerMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClientMessage {
  id: string
  role: 'user' | 'assistant'
  display: ReactNode
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  'use server'

  const history = getMutableAIState()

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ])
      }

      return <div>{content}</div>
    },
    tools: {},
  })

  return {
    id: nanoid(),
    role: 'assistant',
    display: result.value,
  }
}

// TODO: React - This needs to be configured
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
})
