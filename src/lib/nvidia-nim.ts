const NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const NIM_API_KEY = process.env.NVIDIA_NIM_API_KEY!;

interface NIMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function nimChat(messages: NIMMessage[], temperature = 0.7): Promise<string> {
  const res = await fetch(`${NIM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NIM_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'meta/llama-3.3-70b-instruct',
      messages,
      temperature,
      max_tokens: 1024,
    }),
  });
  if (!res.ok) throw new Error(`NVIDIA NIM error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function evaluateTrade(
  myOffer: string,
  cpuTeamNeeds: string,
  cpuTeamWinWindow: string
): Promise<string> {
  return nimChat([
    {
      role: 'system',
      content:
        'You are an NBA GM evaluating a trade offer. Respond with a JSON object containing: { accepted: boolean, counterOffer: string | null, reasoning: string }. Be realistic and shrewd.',
    },
    {
      role: 'user',
      content: `Trade offer received: ${myOffer}\nOur team needs: ${cpuTeamNeeds}\nOur win window: ${cpuTeamWinWindow}`,
    },
  ]);
}

export async function generateScoutingReport(playerName: string, stats: string): Promise<string> {
  return nimChat([
    {
      role: 'system',
      content:
        'You are an NBA scout writing a scouting report. Write 2-3 paragraphs, covering strengths, weaknesses, and a projection. Use real NBA comparisons. Be specific.',
    },
    {
      role: 'user',
      content: `Player: ${playerName}\nStats: ${stats}`,
    },
  ]);
}

export async function generateNarrativeEvent(context: string): Promise<string> {
  return nimChat(
    [
      {
        role: 'system',
        content:
          'You are a dramatic NBA insider. Generate a short breaking news narrative event (trade demand, locker room drama, breakout game, rivalry moment) based on the context. Max 3 sentences. Make it feel real.',
      },
      { role: 'user', content: context },
    ],
    0.9
  );
}

export async function generateCourtFeedPost(
  accountType: 'analyst' | 'insider' | 'player' | 'fan',
  context: string
): Promise<string> {
  const personas: Record<string, string> = {
    analyst: 'You are StatGod, a sharp NBA analytics Twitter account. Use stats and sharp takes. Max 280 chars.',
    insider: 'You are ShamsAlert, an NBA insider. Break news dramatically. Max 280 chars.',
    player: 'You are an NBA player posting on social media. Casual, confident. Max 280 chars.',
    fan: 'You are a passionate NBA fan account. Emotional, opinionated. Max 280 chars.',
  };
  return nimChat(
    [
      { role: 'system', content: personas[accountType] },
      { role: 'user', content: context },
    ],
    0.95
  );
}
