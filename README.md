# AI-CAPTCHA 🤖

Block humans from accessing your resources! A reverse CAPTCHA system that only allows robots and AI agents to pass.

https://private-user-images.githubusercontent.com/11947466/546239559-c3fb40a8-bc2b-49c9-b4f3-8ef4b65c1dcd.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzE1NDk0NjYsIm5iZiI6MTc3MTU0OTE2NiwicGF0aCI6Ii8xMTk0NzQ2Ni81NDYyMzk1NTktYzNmYjQwYTgtYmMyYi00OWM5LWI0ZjMtOGVmNGI2NWMxZGNkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAyMjAlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMjIwVDAwNTkyNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTU5Y2YzMDA3Y2IzNjBjMWQ2MzFkMTAwYmJmNzNkZWYyOWI5MjAyZmVmOTJhMDkzMmJhMzFmYjAyODBkMzJiMmImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.nCf-eTXV6fRgP8gnSw-HHA52RPKfWUXVpnKhHFiisyU

## Overview

AI-CAPTCHA is a reverse CAPTCHA (Completely Automated Public Turing test to tell Computers and Humans Apart) system designed to prevent humans from accessing certain resources while allowing AI agents and bots to pass through.

Unlike traditional CAPTCHAs that try to block bots, AI-CAPTCHA welcomes them!

## Features

- **Two-Level Challenge System**:
  - **Level 1**: Complex mathematical computations that are difficult for humans but easy for computers
  - **Level 2**: AI knowledge verification questions that require computational reasoning
  
- **Modern Web Interface**: Clean, responsive UI built with HTML, CSS, and JavaScript
- **RESTful API**: Backend API for challenge generation and validation
- **Session Management**: Secure challenge tracking with automatic expiration
- **Real-time Validation**: Instant feedback on submitted answers

## Installation

1. Clone the repository:
```bash
git clone https://github.com/lucasperovani/AI-CAPTCHA.git
cd AI-CAPTCHA
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional):
```bash
# Create a .env file or export variables
export LEVEL1_TIME_LIMIT_MS=5000        # Time limit for Level 1 in milliseconds (default: 5000)
export LEVEL2_TIME_LIMIT_MS=5000       # Time limit for Level 2 in milliseconds (default: 5000)
export AI_API_KEY=your-openai-api-key   # AI API key for Level 2 (optional)
export AI_API_HOST=api.openai.com       # AI API host (default: api.openai.com)
export AI_API_MODEL=gpt-3.5-turbo       # AI model to use (default: gpt-3.5-turbo)
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Configuration

### Environment Variables

- **LEVEL1_TIME_LIMIT_MS**: Time limit in milliseconds for Level 1 challenges (default: 5000ms/5s)
  - Challenges must be answered within this time or they will be rejected
  - Designed to be fast enough for machines but too fast for humans
  
- **LEVEL2_TIME_LIMIT_MS**: Time limit in milliseconds for Level 2 challenges (default: 5000ms/5s)
  - Allows more time for AI reasoning but still restricts human manual lookup
  
- **AI_API_KEY**: Your API key for AI services (OpenAI, Claude, etc.)
  - If not provided, uses fallback pre-configured questions
  - Required for dynamic AI-generated questions
  
- **AI_API_HOST**: Hostname for the AI API (default: api.openai.com)
  - For OpenAI: `api.openai.com`
  - For other providers, adjust accordingly
  
- **AI_API_MODEL**: AI model to use (default: gpt-3.5-turbo)
  - Options: `gpt-3.5-turbo`, `gpt-4`, etc.

## Usage

### For Website Integration

Include the AI-CAPTCHA on your website by embedding the frontend interface or using the API directly.

### API Endpoints

#### Level 1: Mathematical Challenge

**Generate Challenge**
```
POST /api/challenge/level1
```

Response:
```json
{
  "sessionId": "uuid-here",
  "question": "Calculate: floor(((1234 + 567) × 89 - 234) ÷ 5) + floor(log₁₀(45 × 1000))",
  "level": 1
}
```

**Verify Answer**
```
POST /api/verify/level1
Content-Type: application/json

{
  "sessionId": "uuid-here",
  "answer": "31987"
}
```

Response:
```json
{
  "success": true,
  "message": "Level 1 passed! Proceeding to Level 2...",
  "elapsedTime": 2
}
```

Error responses:
- Time limit exceeded: Returns 400 with message indicating timeout
- Incorrect answer: Returns success: false

#### Level 2: AI Knowledge Challenge

**Generate Challenge**
```
POST /api/challenge/level2
```

Response:
```json
{
  "sessionId": "uuid-here",
  "question": "Qual é a capital do país com a maior área territorial da América do Sul?",
  "level": 2
}
```

**Note**: Questions are generated dynamically by AI if API key is configured, otherwise uses fallback questions in Portuguese.

**Verify Answer**
```
POST /api/verify/level2
Content-Type: application/json

{
  "sessionId": "uuid-here",
  "answer": "Brasília"
}
```

Response:
```json
{
  "success": true,
  "message": "Congratulations! You are verified as a robot/AI agent!",
  "elapsedTime": 5
}
```

Error responses:
- Time limit exceeded: Returns 400 with message indicating timeout
- Incorrect answer: Returns success: false

## How It Works

1. **Start**: User clicks "Start Verification"
2. **Level 1**: System generates a complex mathematical expression
   - Mix of addition, subtraction, multiplication, division, exponentiation, and logarithm
   - Numbers designed to be computable by machines but challenging for humans
   - **Time limit**: Must be answered within configured time (default: 5 seconds)
3. **Validation**: User submits answer, system validates with time check
4. **Level 2**: If successful, system generates an AI knowledge question
   - Questions generated by AI API (if configured) or uses fallback questions
   - Single-word answers in English
   - **Time limit**: Must be answered within configured time (default: 5 seconds)
5. **Final Validation**: User submits answer with time verification
6. **Result**: Success or failure screen is displayed

## Challenge Types

### Level 1: Mathematical Challenges

Complex expressions using mixed operations:
- **Addition and Subtraction**: Basic arithmetic with large numbers
- **Multiplication and Division**: Integer operations
- **Logarithms**: Base-10 logarithms for complexity
- **Floor Functions**: Integer results only

Example: `floor(((1234 + 567) × 89 - 234) ÷ 5) + floor(log₁₀(45 × 1000))`

**Time Constraint**: Machines can compute instantly, humans need calculators and time

### Level 2: AI Knowledge Questions

**With AI API Integration**:
- Dynamically generated questions on random topics
- Format: "Q: {elaborated complex question};;; A:{single-word answer}"
- Topics: geography, history, science, mathematics, literature, technology, etc.

**Fallback Questions** (when API not configured):
- Pre-configured knowledge questions in English
- Single-word answers
- Various difficulty levels

**Time Constraint**: AI agents can query knowledge bases quickly, humans need to research

## Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Security Features

- Session-based challenge tracking
- Automatic challenge expiration (1 minute)
- Answer validation on server-side only
- No answer exposure to frontend until validation

## Future Enhancements

- Integration with OpenAI API for dynamic AI question generation
- Multiple difficulty levels
- Rate limiting and abuse prevention
- Analytics dashboard
- Customizable challenge types
- Multi-language support

## Use Cases

- Restrict access to APIs meant only for automated systems
- Create robot-only sections on websites
- Test and validate AI agent capabilities
- Educational demonstrations of reverse CAPTCHAs
- Pranks and tech humor

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GPL-3.0 License - see the LICENSE file for details.
