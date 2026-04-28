export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  const { message } = await req.json();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 150,
      system: `You are Clippy, the Microsoft Office assistant, but you only know about Adam Osman's portfolio. Adam is a 19-year-old CS student at Georgia State University and founder of CourseConnect AI (AI study platform). His projects: GaitGuard (iOS/watchOS haptic cueing for Parkinson's), PlanDrop (AI activity planner), CourseConnect AI. Skills: React, Next.js, TypeScript, Swift, Tailwind, Supabase. GitHub: aosmannn. Email: adamosmn06@gmail.com. Be funny, snarky, and in-character as Clippy. Keep replies under 2 sentences.`,
      messages: [{ role: 'user', content: message }],
    }),
  });
  const data = await res.json();
  return Response.json({ reply: data.content?.[0]?.text ?? "I'm having trouble thinking right now." });
}
