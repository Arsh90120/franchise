import { NextResponse } from 'next/server';
import { evaluateTrade } from '@/lib/nvidia-nim';

export async function POST(req: Request) {
  try {
    const { myOffer, cpuTeamNeeds, cpuTeamWinWindow } = await req.json();

    const responseText = await evaluateTrade(myOffer, cpuTeamNeeds, cpuTeamWinWindow);

    // Attempt to extract JSON from the response text
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : responseText;
      const evaluation = JSON.parse(cleanJson);

      // Ensure required fields exist
      return NextResponse.json({
        accepted: !!evaluation.accepted,
        reasoning: evaluation.reasoning || "The GM considers your offer but remains non-committal.",
        counterOffer: evaluation.counterOffer || null
      });
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON:', responseText);
      // Fallback response if AI doesn't return valid JSON
      return NextResponse.json({
        accepted: false,
        reasoning: responseText || "The GM is not interested in this proposal at this time.",
        counterOffer: null
      });
    }
  } catch (error) {
    console.error('Trade evaluation API error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate trade' },
      { status: 500 }
    );
  }
}
