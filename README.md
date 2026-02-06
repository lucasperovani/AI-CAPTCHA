# AI-CAPTCHA 🤖

Block humans from accessing your resources! A reverse CAPTCHA system that only allows robots and AI agents to pass.

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

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

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
  "question": "Calculate the integer part of (1234 × 5678) ÷ 91",
  "level": 1
}
```

**Verify Answer**
```
POST /api/verify/level1
Content-Type: application/json

{
  "sessionId": "uuid-here",
  "answer": "76890"
}
```

Response:
```json
{
  "success": true,
  "message": "Level 1 passed! Proceeding to Level 2..."
}
```

#### Level 2: AI Knowledge Challenge

**Generate Challenge**
```
POST /api/challenge/level2
```

Response:
```json
{
  "sessionId": "uuid-here",
  "question": "What is the capital of the country that has the largest land area in South America?",
  "level": 2
}
```

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
  "message": "Congratulations! You are verified as a robot/AI agent!"
}
```

## How It Works

1. **Start**: User clicks "Start Verification"
2. **Level 1**: System generates a complex mathematical problem
   - Prime factorization
   - Complex arithmetic calculations
   - Modular arithmetic
3. **Validation**: User submits answer, system validates
4. **Level 2**: If successful, system generates an AI knowledge question
5. **Final Validation**: User submits answer
6. **Result**: Success or failure screen is displayed

## Challenge Types

### Level 1: Mathematical Challenges

- **Prime Factorization**: Find prime factors of large numbers
- **Complex Calculations**: Multi-step arithmetic operations
- **Modular Arithmetic**: Exponentiation with modulo operations

### Level 2: AI Knowledge Questions

- General knowledge questions
- Logic puzzles
- Pattern recognition
- Scientific facts
- Historical data

## Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Security Features

- Session-based challenge tracking
- Automatic challenge expiration (10 minutes)
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

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This project is intended for educational and experimental purposes. Use responsibly and in accordance with applicable laws and regulations.
