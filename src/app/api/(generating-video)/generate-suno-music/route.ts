import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { prompt } = await request.json()

  const url = 'https://api.piapi.ai/api/suno/v1/music'
  const options = {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.SUNO_API_KEY as string,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      mv: "chirp-v3-5",
      input: {
        gpt_description_prompt: prompt,
        make_instrumental: true
      }
    })
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}