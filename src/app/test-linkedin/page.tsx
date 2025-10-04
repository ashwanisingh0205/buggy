"use client";
import { useState } from 'react';

export default function LinkedInTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      // Test config endpoint first
      const configResponse = await fetch('/api/linkedin/config');
      const configData = await configResponse.json();
      console.log('Config response:', configData);
      
      // Test POST endpoint
      const postResponse = await fetch('/api/linkedin/auth-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirectUri: 'http://localhost:3000/auth/linkedin/callback'
        })
      });
      
      const postData = await postResponse.json();
      console.log('POST response:', postData);
      
      const combinedResult = {
        config: configData,
        authUrl: postData
      };
      
      setResult(JSON.stringify(combinedResult, null, 2));
    } catch (error) {
      console.error('Test error:', error);
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Configuration Test</h1>
      <p className="mb-4 text-gray-600">This will test both the configuration and auth URL generation</p>
      <button
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test LinkedIn Configuration'}
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
        {result || 'Click the button to test the configuration'}
      </pre>
    </div>
  );
}
