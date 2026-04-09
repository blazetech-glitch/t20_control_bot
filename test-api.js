// Test script to verify AI API connectivity
const axios = require('axios');

async function testAIAPI() {
    const endpoints = [
        'https://t20-classic-ai-chat.vercel.app/api/chat',
        'https://t20-classic-ai-chat.vercel.app/chat',
        'https://t20-classic-ai-chat.vercel.app/api',
        'https://t20-classic-ai-chat.vercel.app/'
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`🧪 Testing endpoint: ${endpoint}`);

            const response = await axios.post(endpoint, {
                message: 'Hello, this is a test from T20 Control Bot',
                userId: 'test_user'
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'T20-Control-Bot-Test/1.0'
                }
            });

            if (response.data && (response.data.response || response.data.message)) {
                console.log('✅ API Connection Successful!');
                console.log('📝 Sample Response:', (response.data.response || response.data.message).substring(0, 100) + '...');
                return { success: true, endpoint };
            }

        } catch (error) {
            console.log(`❌ ${endpoint}: ${error.response?.status || 'Connection failed'}`);
        }
    }

    // Try GET request to see if it's a different API structure
    try {
        console.log('🧪 Testing GET request to base URL...');
        const response = await axios.get('https://t20-classic-ai-chat.vercel.app/', {
            timeout: 5000
        });
        console.log('📄 Base URL response:', response.data.substring(0, 200) + '...');
    } catch (error) {
        console.log('❌ Base URL GET also failed');
    }

    return { success: false };
}

testAIAPI().then(result => {
    if (result.success) {
        console.log(`🎉 AI API integration ready! Using endpoint: ${result.endpoint}`);
    } else {
        console.log('⚠️ AI API integration needs endpoint verification');
        console.log('💡 The chatbot will use fallback responses until API is available');
    }
});