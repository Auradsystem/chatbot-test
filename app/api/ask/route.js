import { NextResponse } from 'next/server';

export async function POST(req) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*"); // Autorise toutes les origines
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Répond aux requêtes préliminaires CORS
    return new NextResponse(null, { headers });
  }

  try {
    const { question } = await req.json();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Clé API depuis Vercel
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
      }),
    });

    const data = await response.json();
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500, headers });
    }

    const botAnswer = data.choices?.[0]?.message?.content || 'Pas de réponse.';
    return NextResponse.json({ answer: botAnswer }, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur côté serveur.' }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  // Répond aux requêtes OPTIONS
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new NextResponse(null, { headers });
}
