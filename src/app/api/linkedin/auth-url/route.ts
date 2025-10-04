import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { redirectUri } = await request.json();
    
    if (!redirectUri) {
      return NextResponse.json(
        { success: false, error: 'Redirect URI is required' },
        { status: 400 }
      );
    }

    // LinkedIn OAuth configuration
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'LinkedIn client ID not configured' },
        { status: 500 }
      );
    }

    // LinkedIn OAuth scopes
    const scopes = [
      'openid',
      'profile', 
      'email'
    ].join(' ');

    // Generate LinkedIn OAuth URL
    const authURL = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${encodeURIComponent(state)}&` +
      `scope=${encodeURIComponent(scopes)}`;

    return NextResponse.json({
      success: true,
      authURL,
      state
    });

  } catch (error) {
    console.error('LinkedIn auth URL generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate LinkedIn auth URL' },
      { status: 500 }
    );
  }
}

