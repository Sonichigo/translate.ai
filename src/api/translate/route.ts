import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const { text, sourceLang, targetLang } = await request.json();

    // Validate input
    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
    const API_KEY = process.env.AZURE_OPENAI_API_KEY;
    const DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

    if (!AZURE_ENDPOINT || !API_KEY || !DEPLOYMENT_NAME) {
      return NextResponse.json(
        { error: 'Missing Azure OpenAI configuration' }, 
        { status: 500 }
      );
    }

    // Full Azure OpenAI API URL
    const url = `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2024-08-01-preview`;

    // Construct the translation request payload
    const payload = {
      messages: [{ 
        role: 'user', 
        content: `Translate the following text from ${sourceLang} to ${targetLang}:

"${text}"

Only provide the translated text without any additional commentary or explanation.`
      }],
      max_tokens: 300,
      temperature: 0.3,
      model: DEPLOYMENT_NAME
    };

    // Make the API call
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY
      }
    });

    // Extract the translated text
    const translatedText = response.data.choices[0].message.content?.trim() || '';

    // Return the translation
    return NextResponse.json({
      originalText: text,
      translatedText,
      sourceLang,
      targetLang
    });

  } catch (error) {
    const err = error as any;
    console.error('Detailed Translation Error:', err.response?.data || err);
    return NextResponse.json(
      { 
        error: 'Translation failed', 
        details: err.response?.data || err 
      }, 
      { status: 500 }
    );
  }
}

// CORS handling
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, api-key'
    }
  });
}