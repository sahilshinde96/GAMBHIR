import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, reviewType } = await req.json();

    if (!code || !reviewType) {
      return new Response(
        JSON.stringify({ error: 'Code and review type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('Gemini API key not found');
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Define prompts for different review types
    const prompts = {
      review: `You are an expert code reviewer. Analyze this code and provide comprehensive feedback on:
- Code quality and best practices
- Performance considerations
- Security implications
- Maintainability
- Overall assessment

Code to review:
${code}

Please provide detailed, constructive feedback.`,

      errors: `You are a bug detection expert. Analyze this code and identify:
- Syntax errors
- Logic errors
- Runtime errors
- Potential exceptions
- Edge cases that might cause issues

Code to analyze:
${code}

Focus specifically on finding bugs and potential issues.`,

      improvements: `You are a code optimization expert. Analyze this code and suggest:
- Performance optimizations
- Better algorithms or data structures
- Code readability improvements
- Memory usage optimizations
- Best practice implementations

Code to optimize:
${code}

Focus on actionable improvements that will make the code better.`,

      refactor: `You are a refactoring expert. Analyze this code and suggest:
- Structural improvements
- Design pattern applications
- Code organization enhancements
- Modularity improvements
- Clean code principles

Code to refactor:
${code}

Provide specific refactoring suggestions with examples where possible.`
    };

    const systemPrompt = prompts[reviewType as keyof typeof prompts] || prompts.review;

    console.log(`Analyzing code with ${reviewType} review type using Gemini`);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze code with Gemini' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis generated';

    console.log('Code analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        analysis,
        reviewType,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-code function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});