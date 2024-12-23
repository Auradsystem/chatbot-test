import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(req) {
  try {
    const { question } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
      }),
    });

    const data = await response.json();
    if (data.error) {
      return NextResponse.json(
        { error: data.error.message },
        { status: 500, headers: corsHeaders }
      );
    }

    const botAnswer = data.choices?.[0]?.message?.content || 'Pas de réponse.';
    return NextResponse.json({ answer: botAnswer }, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur côté serveur.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    { message: 'Utilisez la méthode POST pour poser des questions.' },
    { headers: corsHeaders }
  );
}
