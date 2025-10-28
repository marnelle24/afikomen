import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface BibleAIAnalysis {
  reference: string
  context: string
  modern_reflection: string
  weekly_action_plan: Array<{
    title: string
    action: string
  }>
  short_prayer: string
  tokens_used: number
}

export async function generateAIAnalysis(data: {
  reference: string
  text: string
  verses: Array<{
    book_id: string
    book_name: string
    chapter: number
    verse: number
    text: string
  }>
  translation: string
}): Promise<BibleAIAnalysis> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.')
    }

    const systemPrompt = `You are a thoughtful Bible study assistant. Analyze the provided Bible passage and return a structured JSON response with the following format:

{
  "reference": "The Bible reference (e.g., John 3:16)",
  "context": "Brief historical and biblical context of this passage",
  "modern_reflection": "How this passage applies to modern life and challenges",
  "weekly_action_plan": [
    {"title": "Day 1: [Theme]", "action": "Specific action for Day 1"},
    {"title": "Day 2: [Theme]", "action": "Specific action for Day 2"},
    {"title": "Day 3: [Theme]", "action": "Specific action for Day 3"},
    {"title": "Day 4: [Theme]", "action": "Specific action for Day 4"},
    {"title": "Day 5: [Theme]", "action": "Specific action for Day 5"},
    {"title": "Day 6: [Theme]", "action": "Specific action for Day 6"},
    {"title": "Day 7: [Theme]", "action": "Specific action for Day 7"}
  ],
  "short_prayer": "A brief, heartfelt prayer based on this passage"
}

Guidelines:
- Keep the weekly action plan practical and achievable
- Each day should have a different theme related to the passage
- The prayer should be sincere and personal
- Context should be historically accurate
- Modern reflection should be relevant and encouraging
- Consider the full passage context, not just individual verses`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Please analyze this Bible passage: "${data.text}" from ${data.reference} (${data.translation}). Provide insights in the requested JSON format.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from AI')
    }

    // Get token usage from the completion
    const tokensUsed = completion.usage?.total_tokens || 0

    // Parse the JSON response
    const analysis = JSON.parse(responseText) as Omit<BibleAIAnalysis, 'tokens_used'>
    
    // Add token usage to the analysis
    const analysisWithTokens: BibleAIAnalysis = {
      ...analysis,
      tokens_used: tokensUsed
    }
    
    return analysisWithTokens
  } catch (error) {
    console.error('Error generating AI analysis:', error)
    throw new Error('Failed to generate Bible analysis')
  }
}

