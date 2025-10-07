import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface VerseInsight {
  verse_content: string
  context: string
  modern_reflection: string
  weekly_action_plan: Array<{
    title: string
    action: string
  }>
  short_prayer: string
}

export async function generateVerseInsight(
  verseText: string,
  reference: string,
  version: string
): Promise<VerseInsight> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.')
    }
    const systemPrompt = `You are a thoughtful Bible study assistant. Analyze the provided Bible verse and return a structured JSON response with the following format:

{
  "verse_content": "The exact verse text with verse numbers and separate each verse with a new line",
  "context": "Brief historical and biblical context of this verse",
  "modern_reflection": "How this verse applies to modern life and challenges",
  "weekly_action_plan": [
    {"title": "Day 1: [Theme]", "action": "Specific action for Day 1"},
    {"title": "Day 2: [Theme]", "action": "Specific action for Day 2"},
    {"title": "Day 3: [Theme]", "action": "Specific action for Day 3"},
    {"title": "Day 4: [Theme]", "action": "Specific action for Day 4"},
    {"title": "Day 5: [Theme]", "action": "Specific action for Day 5"},
    {"title": "Day 6: [Theme]", "action": "Specific action for Day 6"},
    {"title": "Day 7: [Theme]", "action": "Specific action for Day 7"}
  ],
  "short_prayer": "A brief, heartfelt prayer based on this verse"
}

Guidelines:
- Keep the weekly action plan practical and achievable
- Each day should have a different theme related to the verse
- The prayer should be sincere and personal
- Context should be historically accurate
- Modern reflection should be relevant and encouraging`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Please analyze this Bible verse: "${verseText}" from ${reference} (${version}). Provide insights in the requested JSON format.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    const insight = JSON.parse(responseText) as VerseInsight
    
    return insight
  } catch (error) {
    console.error('Error generating AI insight:', error)
    throw new Error('Failed to generate verse insight')
  }
}
