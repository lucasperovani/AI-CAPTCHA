const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for challenges (in production, use Redis or similar)
const challenges = new Map();

// Helper function to generate large prime numbers for factorization
function generateLargePrime() {
    // Generate a large-ish prime number (for demo purposes)
    const primes = [104729, 104743, 104759, 104761, 104773, 104779, 104789, 104801, 
                    104803, 104827, 104831, 104849, 104851, 104869, 104879, 104891];
    return primes[Math.floor(Math.random() * primes.length)];
}

// Helper function to generate complex mathematical problems
function generateMathChallenge() {
    const challengeTypes = [
        // Type 1: Large prime factorization
        () => {
            const prime1 = generateLargePrime();
            const prime2 = generateLargePrime();
            const product = prime1 * prime2;
            return {
                question: `Factorize the number ${product} into two prime factors and return the smaller prime.`,
                answer: Math.min(prime1, prime2).toString(),
                type: 'factorization'
            };
        },
        // Type 2: Complex calculation
        () => {
            const a = Math.floor(Math.random() * 1000) + 500;
            const b = Math.floor(Math.random() * 1000) + 500;
            const c = Math.floor(Math.random() * 100) + 50;
            const result = Math.floor((a * b) / c);
            return {
                question: `Calculate the integer part of (${a} × ${b}) ÷ ${c}`,
                answer: result.toString(),
                type: 'calculation'
            };
        },
        // Type 3: Modular arithmetic
        () => {
            const base = Math.floor(Math.random() * 1000) + 1000;
            const exp = Math.floor(Math.random() * 10) + 10;
            const mod = Math.floor(Math.random() * 100) + 100;
            const result = modPow(base, exp, mod);
            return {
                question: `Calculate ${base}^${exp} mod ${mod}`,
                answer: result.toString(),
                type: 'modular'
            };
        }
    ];
    
    const selectedType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    return selectedType();
}

// Modular exponentiation helper
function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

// Helper function to generate AI-style challenges
// In a real implementation, this would call an AI API like OpenAI
function generateAIChallenge() {
    const challenges = [
        {
            question: "What is the capital of the country that has the largest land area in South America?",
            answer: "Brasília"
        },
        {
            question: "If a train leaves Station A at 3:00 PM traveling at 60 mph and another train leaves Station B (200 miles away) at 3:30 PM traveling at 80 mph toward Station A, at what time will they meet?",
            answer: "4:45 PM"
        },
        {
            question: "What is the next number in this sequence: 2, 6, 12, 20, 30, ?",
            answer: "42"
        },
        {
            question: "In what year did the fall of the Berlin Wall occur?",
            answer: "1989"
        },
        {
            question: "What is the chemical formula for sulfuric acid?",
            answer: "H2SO4"
        },
        {
            question: "How many sides does a dodecahedron have?",
            answer: "12"
        },
        {
            question: "What programming language was created by Guido van Rossum?",
            answer: "Python"
        },
        {
            question: "If you have a 3x3 magic square where each row, column, and diagonal sums to 15, and the center is 5, what is the sum of the four corner numbers?",
            answer: "20"
        }
    ];
    
    return challenges[Math.floor(Math.random() * challenges.length)];
}

// API Routes

// Level 1: Generate mathematical challenge
app.post('/api/challenge/level1', (req, res) => {
    const sessionId = uuidv4();
    const challenge = generateMathChallenge();
    
    // Store challenge with answer
    challenges.set(sessionId, {
        level: 1,
        question: challenge.question,
        answer: challenge.answer,
        type: challenge.type,
        timestamp: Date.now()
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
    
    // Clean up challenge
    challenges.delete(sessionId);
    
    // Verify answer (allow some tolerance for numeric answers)
    const isCorrect = answer.toString().trim() === challenge.answer.trim();
    
    res.json({
        success: isCorrect,
        message: isCorrect ? 'Level 1 passed! Proceeding to Level 2...' : 'Incorrect answer. Please try again.',
        correctAnswer: isCorrect ? undefined : challenge.answer // Only show on failure for debugging
    });
});

// Level 2: Generate AI challenge
app.post('/api/challenge/level2', (req, res) => {
    const sessionId = uuidv4();
    const challenge = generateAIChallenge();
    
    // Store challenge with answer
    challenges.set(sessionId, {
        level: 2,
        question: challenge.question,
        answer: challenge.answer,
        timestamp: Date.now()
    });
    
    // Return only the question
    res.json({
        sessionId,
        question: challenge.question,
        level: 2
    });
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
    
    // Clean up challenge
    challenges.delete(sessionId);
    
    // Verify answer (case-insensitive, trimmed)
    const userAnswer = answer.toString().trim().toLowerCase();
    const correctAnswer = challenge.answer.toString().trim().toLowerCase();
    const isCorrect = userAnswer === correctAnswer;
    
    res.json({
        success: isCorrect,
        message: isCorrect ? 'Congratulations! You are verified as a robot/AI agent!' : 'Incorrect answer. Access denied.',
        correctAnswer: isCorrect ? undefined : challenge.answer // Only show on failure for debugging
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
