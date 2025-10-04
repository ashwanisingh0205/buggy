import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const redirectUri = searchParams.get('redirectUri');

    if (!code || !state || !redirectUri) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // LinkedIn OAuth configuration
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    console.log('LinkedIn callback - Environment check:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      clientIdPreview: clientId ? clientId.substring(0, 9) + "..." : "Not set"
    });

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'LinkedIn Client ID not configured. Please set LINKEDIN_CLIENT_ID environment variable.' },
        { status: 500 }
      );
    }

    if (!clientSecret) {
      return NextResponse.json(
        { success: false, error: 'LinkedIn Client Secret not configured. Please set LINKEDIN_CLIENT_SECRET environment variable.' },
        { status: 500 }
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('LinkedIn token exchange error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Failed to exchange authorization code' },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'No access token received' },
        { status: 400 }
      );
    }

    // Get user profile information
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.text();
      console.error('LinkedIn profile fetch error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch LinkedIn profile' },
        { status: 400 }
      );
    }

    const profileData = await profileResponse.json();

    // Store the LinkedIn connection data
    const linkedInData = {
      id: profileData.sub,
      firstName: profileData.given_name || '',
      lastName: profileData.family_name || '',
      email: profileData.email || '',
      accessToken,
      connectedAt: new Date().toISOString(),
    };

    // Return success response with LinkedIn data
    return NextResponse.json({
      success: true,
      message: 'LinkedIn connected successfully',
      data: linkedInData
    });

  } catch (error) {
    console.error('LinkedIn callback error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect LinkedIn account',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

