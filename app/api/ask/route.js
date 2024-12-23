import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { question } = await req.json();

    // Appel à l'API OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // clé via env
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
      }),
    });

    const data = await response.json();
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }
    
    // Récupérer la réponse générée
    const botAnswer = data.choices?.[0]?.message?.content || 'Pas de réponse.';
    return NextResponse.json({ answer: botAnswer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur côté serveur.' }, { status: 500 });
  }
}
