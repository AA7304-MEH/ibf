import Startup from '../models/Startup';

export class IncubatorService {
    /**
     * Get AI-driven advice for a founder based on their startup context
     */
    async getFounderAdvice(startupId: string, prompt: string): Promise<string> {
        try {
            const startup = await Startup.findById(startupId);
            if (!startup) {
                return "I couldn't find your startup details. Please ensure your startup is registered in the incubator.";
            }

            const context = `
                Startup Name: ${startup.name}
                Industry: ${startup.industry}
                Stage: ${startup.stage}
                Description: ${startup.description}
                Tagline: ${startup.tagline}
            `;

            // Simulation of AI response logic
            // In a real production environment, this would call OpenAI/Anthropic

            const lowResAdvice = this.generateMockAdvice(startup, prompt);
            return lowResAdvice;

        } catch (error) {
            console.error('Founder Copilot Error:', error);
            return "I'm having trouble connecting to my brain right now. Please try again in a moment.";
        }
    }

    private generateMockAdvice(startup: any, prompt: string): string {
        const p = prompt.toLowerCase();

        if (p.includes('market') || p.includes('competition')) {
            return `For ${startup.name} in the ${startup.industry} space, focus on your unique ${startup.tagline.toLowerCase()}. Research competitors in the ${startup.stage} phase and identify gaps in their ${startup.description.split(' ')[0]} implementation.`;
        }

        if (p.includes('fund') || p.includes('pitch')) {
            return `Since you are at the ${startup.stage} stage, emphasize your vision for ${startup.industry}. Investors want to see traction in ${startup.description.split('. ')[0]}. Refine your pitch to highlight how you're solving a specific problem.`;
        }

        if (p.includes('hiring') || p.includes('team')) {
            return `At the ${startup.stage} stage, prioritize cultural fit. Look for individuals who believe in "${startup.tagline}". You need generalists who can handle the ${startup.industry} challenges.`;
        }

        return `That's an interesting question about ${startup.name}. Considering you're in the ${startup.industry} sector, I recommend looking at how other ${startup.stage} startups handle similar challenges. Focus on your core value proposition: ${startup.description}`;
    }
}

export const incubatorService = new IncubatorService();
