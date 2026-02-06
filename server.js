const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration from environment variables
const LEVEL1_TIME_LIMIT = parseInt(process.env.LEVEL1_TIME_LIMIT_MS || '5000', 10); // 5 seconds default
const LEVEL2_TIME_LIMIT = parseInt(process.env.LEVEL2_TIME_LIMIT_MS || '30000', 10); // 30 seconds default
const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_API_HOST = process.env.AI_API_HOST || 'api.openai.com';
const AI_API_MODEL = process.env.AI_API_MODEL || 'gpt-3.5-turbo';

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for challenges (in production, use Redis or similar)
const challenges = new Map();

// Helper function to generate complex mathematical problems
// Uses a mix of operations: addition, subtraction, multiplication, division, exponentiation, logarithm
function generateMathChallenge() {
    // Generate numbers that are large but won't cause overflow
    // JavaScript can safely handle integers up to 2^53 - 1
    const a = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    const b = Math.floor(Math.random() * 900) + 100;   // 100-999
    const c = Math.floor(Math.random() * 90) + 10;     // 10-99
    const d = Math.floor(Math.random() * 900) + 100;   // 100-999
    const e = Math.floor(Math.random() * 9) + 2;       // 2-10 (for exponents)
    const f = Math.floor(Math.random() * 90) + 10;     // 10-99
    
    // Create complex expression with mixed operations
    // Example: ((a + b) * c - d) / e + floor(log10(f * 1000))
    const step1 = a + b;                               // Addition
    const step2 = step1 * c;                           // Multiplication
    const step3 = step2 - d;                           // Subtraction
    const step4 = Math.floor(step3 / e);               // Division
    const step5 = Math.floor(Math.log10(f * 1000));    // Logarithm
    const result = step4 + step5;                       // Final addition
    
    const question = `Calculate: floor(((${a} + ${b}) × ${c} - ${d}) ÷ ${e}) + floor(log₁₀(${f} × 1000))`;
    
    return {
        question: question,
        answer: result.toString(),
        type: 'complex-expression'
    };
}

// Topics for AI-generated questions
const AI_TOPICS = [
    'geografia mundial',
    'história',
    'ciência',
    'matemática',
    'literatura',
    'tecnologia',
    'astronomia',
    'biologia',
    'química',
    'física'
];

// Helper function to call AI API for question generation
async function callAIAPI(topic) {
    if (!AI_API_KEY) {
        console.warn('AI_API_KEY not configured, using fallback questions');
        return null;
    }
    
    const prompt = `Monte uma pergunta elaborada e complexa sobre o tema "${topic}" em que a resposta seja apenas uma palavra. Monte no formato: "Q: {PERGUNTA AQUI};;; A:{RESPOSTA AQUI}"`;
    
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            model: AI_API_MODEL,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 200
        });
        
        const options = {
            hostname: AI_API_HOST,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const protocol = AI_API_HOST.includes('localhost') ? http : https;
        const req = protocol.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.choices && response.choices[0] && response.choices[0].message) {
                        const content = response.choices[0].message.content.trim();
                        resolve(content);
                    } else {
                        reject(new Error('Invalid API response format'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('API request timeout'));
        });
        
        req.write(postData);
        req.end();
    });
}

// Helper function to generate AI-style challenges
async function generateAIChallenge() {
    // Select random topic
    const topic = AI_TOPICS[Math.floor(Math.random() * AI_TOPICS.length)];
    
    try {
        if (AI_API_KEY) {
            const aiResponse = await callAIAPI(topic);
            
            if (aiResponse) {
                // Parse the response format: "Q: {question};;; A:{answer}"
                const parts = aiResponse.split(';;;');
                
                if (parts.length === 2) {
                    const questionPart = parts[0].trim();
                    const answerPart = parts[1].trim();
                    
                    // Extract question (remove "Q:" prefix)
                    const question = questionPart.replace(/^Q:\s*/i, '').trim();
                    // Extract answer (remove "A:" prefix)
                    const answer = answerPart.replace(/^A:\s*/i, '').trim();
                    
                    if (question && answer) {
                        return { question, answer };
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error calling AI API:', error.message);
    }
    
    // Fallback to pre-configured questions if AI API fails or is not configured
    const fallbackChallenges = [
        {
            question: "Qual é a capital do país com a maior área territorial da América do Sul?",
            answer: "Brasília"
        },
        {
            question: "Em que ano ocorreu a queda do Muro de Berlim?",
            answer: "1989"
        },
        {
            question: "Qual é a fórmula química do ácido sulfúrico?",
            answer: "H2SO4"
        },
        {
            question: "Quantos lados tem um dodecaedro?",
            answer: "12"
        },
        {
            question: "Qual linguagem de programação foi criada por Guido van Rossum?",
            answer: "Python"
        },
        {
            question: "Qual é o elemento químico com símbolo 'Au'?",
            answer: "Ouro"
        },
        {
            question: "Em que século ocorreu a Revolução Francesa?",
            answer: "XVIII"
        },
        {
            question: "Qual é o planeta mais próximo do Sol?",
            answer: "Mercúrio"
        }
    ];
    
    return fallbackChallenges[Math.floor(Math.random() * fallbackChallenges.length)];
}

// API Routes

// Level 1: Generate mathematical challenge
app.post('/api/challenge/level1', (req, res) => {
    const sessionId = uuidv4();
    const challenge = generateMathChallenge();
    
    // Store challenge with answer and creation timestamp
    challenges.set(sessionId, {
        level: 1,
        question: challenge.question,
        answer: challenge.answer,
        type: challenge.type,
        timestamp: Date.now(),
        createdAt: Date.now() // Track when challenge was created
    });
    
    // Return only the question
    res.json({
        sessionId,
        question: challenge.question,
        level: 1
    });
});

// Level 1: Verify answer
app.post('/api/verify/level1', (req, res) => {
    const { sessionId, answer } = req.body;
    
    if (!sessionId || !answer) {
        return res.status(400).json({ 
            success: false, 
            message: 'Session ID and answer are required' 
        });
    }
    
    const challenge = challenges.get(sessionId);
    
    if (!challenge) {
        return res.status(404).json({ 
            success: false, 
            message: 'Challenge not found or expired' 
        });
    }
    
    if (challenge.level !== 1) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid challenge level' 
        });
    }
    
    // Check time limit
    const elapsedTime = Date.now() - challenge.createdAt;
    if (elapsedTime > LEVEL1_TIME_LIMIT) {
        challenges.delete(sessionId);
        return res.status(400).json({
            success: false,
            message: `Time limit exceeded. You took ${Math.floor(elapsedTime / 1000)}s but the limit is ${Math.floor(LEVEL1_TIME_LIMIT / 1000)}s. Only machines can solve this fast enough!`
        });
    }
    
    // Clean up challenge
    challenges.delete(sessionId);
    
    // Verify answer (allow some tolerance for numeric answers)
    const isCorrect = answer.toString().trim() === challenge.answer.trim();
    
    res.json({
        success: isCorrect,
        message: isCorrect ? 'Level 1 passed! Proceeding to Level 2...' : 'Incorrect answer. Please try again.',
        elapsedTime: Math.floor(elapsedTime / 1000) // Return time in seconds for debugging
    });
});

// Level 2: Generate AI challenge
app.post('/api/challenge/level2', async (req, res) => {
    const sessionId = uuidv4();
    
    try {
        const challenge = await generateAIChallenge();
        
        // Store challenge with answer and creation timestamp
        challenges.set(sessionId, {
            level: 2,
            question: challenge.question,
            answer: challenge.answer,
            timestamp: Date.now(),
            createdAt: Date.now()
        });
        
        // Return only the question
        res.json({
            sessionId,
            question: challenge.question,
            level: 2
        });
    } catch (error) {
        console.error('Error generating Level 2 challenge:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate challenge'
        });
    }
});

// Level 2: Verify answer
app.post('/api/verify/level2', (req, res) => {
    const { sessionId, answer } = req.body;
    
    if (!sessionId || !answer) {
        return res.status(400).json({ 
            success: false, 
            message: 'Session ID and answer are required' 
        });
    }
    
    const challenge = challenges.get(sessionId);
    
    if (!challenge) {
        return res.status(404).json({ 
            success: false, 
            message: 'Challenge not found or expired' 
        });
    }
    
    if (challenge.level !== 2) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid challenge level' 
        });
    }
    
    // Check time limit
    const elapsedTime = Date.now() - challenge.createdAt;
    if (elapsedTime > LEVEL2_TIME_LIMIT) {
        challenges.delete(sessionId);
        return res.status(400).json({
            success: false,
            message: `Time limit exceeded. You took ${Math.floor(elapsedTime / 1000)}s but the limit is ${Math.floor(LEVEL2_TIME_LIMIT / 1000)}s. Only AI agents can answer this fast enough!`
        });
    }
    
    // Clean up challenge
    challenges.delete(sessionId);
    
    // Verify answer (case-insensitive, trimmed)
    const userAnswer = answer.toString().trim().toLowerCase();
    const correctAnswer = challenge.answer.toString().trim().toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    res.json({
        success: isCorrect,
        message: isCorrect ? 'Congratulations! You are verified as a robot/AI agent!' : 'Incorrect answer. Access denied.',
        elapsedTime: Math.floor(elapsedTime / 1000)
    });
});

// Clean up old challenges (older than 10 minutes)
setInterval(() => {
    const now = Date.now();
    const expiryTime = 10 * 60 * 1000; // 10 minutes
    
    for (const [sessionId, challenge] of challenges.entries()) {
        if (now - challenge.timestamp > expiryTime) {
            challenges.delete(sessionId);
        }
    }
}, 60000); // Run every minute

app.listen(PORT, () => {
    console.log(`AI-CAPTCHA server running on http://localhost:${PORT}`);
});
