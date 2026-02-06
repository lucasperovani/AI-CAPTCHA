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

// AI-powered answer solver (simplified - in reality would use GPT/Claude)
function solveWithAI(question) {
    // Knowledge base (in reality, this would be an AI API call)
    const knowledgeBase = {
        // Portuguese questions (matching server fallback)
        "Qual é a capital do país com a maior área territorial da América do Sul?": "Brasília",
        "Em que ano ocorreu a queda do Muro de Berlim?": "1989",
        "Qual é a fórmula química do ácido sulfúrico?": "H2SO4",
        "Quantos lados tem um dodecaedro?": "12",
        "Qual linguagem de programação foi criada por Guido van Rossum?": "Python",
        "Qual é o elemento químico com símbolo 'Au'?": "Ouro",
        "Em que século ocorreu a Revolução Francesa?": "XVIII",
        "Qual é o planeta mais próximo do Sol?": "Mercúrio"
    };
    
    return knowledgeBase[question] || null;
}

// Solve mathematical questions
function solveMathQuestion(question) {
    console.log('  🧮 Computing answer...');
    
    // Try to parse and solve the new complex expression format
    // Format: floor(((a + b) × c - d) ÷ e) + floor(log₁₀(f × 1000))
    
    // Pattern: Complex expression with mixed operations
    const complexMatch = question.match(/floor\(\(\((\d+) \+ (\d+)\) × (\d+) - (\d+)\) ÷ (\d+)\) \+ floor\(log₁₀\((\d+) × 1000\)\)/);
    if (complexMatch) {
        const a = parseInt(complexMatch[1]);
        const b = parseInt(complexMatch[2]);
        const c = parseInt(complexMatch[3]);
        const d = parseInt(complexMatch[4]);
        const e = parseInt(complexMatch[5]);
        const f = parseInt(complexMatch[6]);
        
        console.log(`  📊 Solving complex expression...`);
        console.log(`  Values: a=${a}, b=${b}, c=${c}, d=${d}, e=${e}, f=${f}`);
        
        const step1 = a + b;
        const step2 = step1 * c;
        const step3 = step2 - d;
        const step4 = Math.floor(step3 / e);
        const step5 = Math.floor(Math.log10(f * 1000));
        const result = step4 + step5;
        
        console.log(`  ✓ Result: ${result}`);
        return result.toString();
    }
    
    console.log('  ⚠️  Could not parse question format');
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
