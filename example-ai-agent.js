#!/usr/bin/env node

/**
 * Example: How an AI Agent solves AI-CAPTCHA
 * 
 * This script demonstrates how a robot or AI agent would programmatically
 * solve the AI-CAPTCHA challenges to gain access to protected resources.
 */

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Mathematical helper functions

function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function factorize(n) {
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
            const other = n / i;
            if (isPrime(i) && isPrime(other)) {
                return [Math.min(i, other), Math.max(i, other)];
            }
        }
    }
    return null;
}

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

// AI-powered answer solver (simplified - in reality would use GPT/Claude)
function solveWithAI(question) {
    // Knowledge base (in reality, this would be an AI API call)
    const knowledgeBase = {
        "What is the capital of the country that has the largest land area in South America?": "Brasília",
        "If a train leaves Station A at 3:00 PM traveling at 60 mph and another train leaves Station B (200 miles away) at 3:30 PM traveling at 80 mph toward Station A, at what time will they meet?": "4:45 PM",
        "What is the next number in this sequence: 2, 6, 12, 20, 30, ?": "42",
        "In what year did the fall of the Berlin Wall occur?": "1989",
        "What is the chemical formula for sulfuric acid?": "H2SO4",
        "How many sides does a dodecahedron have?": "12",
        "What programming language was created by Guido van Rossum?": "Python",
        "If you have a 3x3 magic square where each row, column, and diagonal sums to 15, and the center is 5, what is the sum of the four corner numbers?": "20"
    };
    
    return knowledgeBase[question] || null;
}

// Solve mathematical questions
function solveMathQuestion(question) {
    console.log('  🧮 Computing answer...');
    
    // Try to parse and solve the question
    
    // Pattern 1: Factorization
    const factorMatch = question.match(/Factorize the number (\d+)/);
    if (factorMatch) {
        const num = parseInt(factorMatch[1]);
        console.log(`  📊 Factorizing ${num}...`);
        const factors = factorize(num);
        if (factors) {
            console.log(`  ✓ Found factors: ${factors[0]} × ${factors[1]}`);
            return factors[0].toString();
        }
    }
    
    // Pattern 2: Integer division
    const calcMatch = question.match(/Calculate the integer part of \((\d+) × (\d+)\) ÷ (\d+)/);
    if (calcMatch) {
        const a = parseInt(calcMatch[1]);
        const b = parseInt(calcMatch[2]);
        const c = parseInt(calcMatch[3]);
        const result = Math.floor((a * b) / c);
        console.log(`  ✓ Calculated: ${result}`);
        return result.toString();
    }
    
    // Pattern 3: Modular arithmetic
    const modMatch = question.match(/Calculate (\d+)\^(\d+) mod (\d+)/);
    if (modMatch) {
        const base = parseInt(modMatch[1]);
        const exp = parseInt(modMatch[2]);
        const mod = parseInt(modMatch[3]);
        const result = modPow(base, exp, mod);
        console.log(`  ✓ Computed modular exponentiation: ${result}`);
        return result.toString();
    }
    
    return null;
}

// Main AI agent function
async function aiAgentBypassCaptcha() {
    console.log('🤖 AI Agent Starting CAPTCHA Bypass...\n');
    console.log('═══════════════════════════════════════\n');
    
    try {
        // ============ LEVEL 1: Mathematical Challenge ============
        console.log('📝 LEVEL 1: Mathematical Challenge');
        console.log('─────────────────────────────────────');
        
        const level1 = await makeRequest('POST', '/api/challenge/level1');
        console.log(`Question: "${level1.question}"\n`);
        
        const answer1 = solveMathQuestion(level1.question);
        
        if (!answer1) {
            console.log('❌ Failed to solve Level 1. Aborting.');
            return;
        }
        
        console.log(`\n💡 Submitting answer: ${answer1}`);
        
        const verify1 = await makeRequest('POST', '/api/verify/level1', {
            sessionId: level1.sessionId,
            answer: answer1
        });
        
        console.log(`📨 Server response: "${verify1.message}"`);
        
        if (!verify1.success) {
            console.log('❌ Level 1 failed. Access denied.\n');
            return;
        }
        
        console.log('✅ Level 1 PASSED!\n');
        
        // ============ LEVEL 2: AI Knowledge Challenge ============
        console.log('📝 LEVEL 2: AI Knowledge Challenge');
        console.log('─────────────────────────────────────');
        
        const level2 = await makeRequest('POST', '/api/challenge/level2');
        console.log(`Question: "${level2.question}"\n`);
        
        console.log('  🧠 Querying AI knowledge base...');
        const answer2 = solveWithAI(level2.question);
        
        if (!answer2) {
            console.log('  ⚠️  Answer not in knowledge base. In production, would query GPT/Claude API.');
            console.log('❌ Level 2 failed. Access denied.\n');
            return;
        }
        
        console.log(`  ✓ Found answer in knowledge base: "${answer2}"`);
        console.log(`\n💡 Submitting answer: ${answer2}`);
        
        const verify2 = await makeRequest('POST', '/api/verify/level2', {
            sessionId: level2.sessionId,
            answer: answer2
        });
        
        console.log(`📨 Server response: "${verify2.message}"`);
        
        if (!verify2.success) {
            console.log('❌ Level 2 failed. Access denied.\n');
            return;
        }
        
        console.log('✅ Level 2 PASSED!\n');
        
        // ============ SUCCESS ============
        console.log('═══════════════════════════════════════');
        console.log('🎉 SUCCESS! AI Agent verified!');
        console.log('🔓 Access granted to protected resources');
        console.log('═══════════════════════════════════════\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the AI agent
if (require.main === module) {
    console.log('\n');
    aiAgentBypassCaptcha();
}

module.exports = { aiAgentBypassCaptcha };
