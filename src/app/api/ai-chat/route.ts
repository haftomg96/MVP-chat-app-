import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await validateSession(token)
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Simple AI response (you can integrate OpenAI API here)
    const aiResponse = await generateAIResponse(message)

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateAIResponse(message: string): Promise<string> {
  // Use OpenRouter API
  if (process.env.OPENROUTER_API_KEY) {
    // Try multiple free models in order of preference
    const freeModels = [
      'meta-llama/llama-3.2-3b-instruct:free',
      'google/gemini-flash-1.5',
      'nousresearch/hermes-3-llama-3.1-405b:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'qwen/qwen-2-7b-instruct:free',
    ]

    for (const model of freeModels) {
      try {
        // console.log(`Trying model: ${model}`)
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
            'X-Title': 'Chat App',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are a helpful AI assistant in a chat application. Provide concise, friendly, and helpful responses.',
              },
              {
                role: 'user',
                content: message,
              },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          // console.log(`✅ Success with model: ${model}`)
          return data.choices[0].message.content
        } else {
          const errorData = await response.json()
          // console.log(`❌ Model ${model} failed:`, errorData.error?.message)
          // Try next model
          continue
        }
      } catch (error) {
        // console.log(`❌ Model ${model} error:`, error)
        // Try next model
        continue
      }
    }

    console.log('⚠️ All models failed, using fallback responses')
  }

  // Fallback to simple responses if API key is not set or all models fail
  const responses = [
    "That's interesting! Tell me more.",
    "I understand. How can I help you with that?",
    "Thanks for sharing! What else would you like to discuss?",
    "I'm here to help. What would you like to know?",
    "That's a great question! Let me think about that.",
    "I'd be happy to assist you with that. Could you provide more details?",
    "Interesting perspective! What made you think of that?",
    "I see what you mean. Let's explore that further.",
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
