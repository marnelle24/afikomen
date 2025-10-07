import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface BibleVerse {
  reference: string
  text: string
}

export async function fetchBibleVerse(reference: string, version: string): Promise<BibleVerse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file.')
    }

    console.log('Fetching verse via OpenAI:', { reference, version })
    
    const versionFullName: Record<string, string> = {
      'NIV': 'New International Version',
      'KJV': 'King James Version',
      'ESV': 'English Standard Version'
    }

    const versionName = versionFullName[version] || versionFullName['NIV']
    
    // Use OpenAI to parse the reference and get the verse
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a Bible verse assistant. When given ANY format of a Bible verse reference (e.g., "John 3:16", "john 3 16", "John chapter 3 verse 16", etc.), you should:
1. Parse and understand what verse is being requested
2. Return ONLY a valid JSON object with the standardized reference and the verse text from the specified translation

Return ONLY a JSON object in this exact format (no markdown, no code blocks, just the JSON):
{
  "reference": "Book Chapter:Verse (e.g., John 3:16)",
  "text": "The exact verse text from the translation"
}

Important: Return only the JSON object, nothing else.`
        },
        {
          role: "user",
          content: `Parse this verse reference: "${reference}" and provide the verse from ${versionName} (${version}).`
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    const responseText = completion.choices[0]?.message?.content?.trim()
    
    if (!responseText) {
      throw new Error('Could not retrieve verse. Please check your input.')
    }

    // Remove markdown code blocks if present
    let jsonText = responseText
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim()
    }

    const parsedResponse = JSON.parse(jsonText) as { reference: string; text: string }
    
    if (!parsedResponse.reference || !parsedResponse.text) {
      throw new Error('Invalid verse reference. Please try again with a valid Bible verse (e.g., "John 3:16").')
    }
    
    // Clean the reference (remove version if OpenAI added it)
    let cleanReference = parsedResponse.reference.trim()
    // Remove any existing version notation like (NIV), (KJV), (ESV)
    cleanReference = cleanReference.replace(/\s*\([A-Z]+\)\s*$/, '')
    
    // Return just the clean reference (version is stored separately in DB)
    return {
      reference: cleanReference,
      text: parsedResponse.text
    }
  } catch (error) {
    console.error('Error fetching Bible verse:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch Bible verse')
  }
}

