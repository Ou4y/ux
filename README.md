# Wayground UX Prototype (UI/UX University Project)

High-fidelity interactive frontend prototype that redesigns/simulates an enhanced Wayground experience for user testing.

This app is intentionally **mock-data only**:
- No real authentication
- No backend
- No database
- No external APIs
- Local state only (no server persistence)

## Prototype Join Code
- Valid code: `1234`

## Tech Stack
- React + Vite
- React Router
- Plain CSS (no heavy UI framework)
- Local state via React context/reducer

## What This Prototype Is For
This prototype is built for comparative usability testing:
1. Users try the original Wayground flow.
2. Users try this redesigned prototype.
3. Researchers compare feedback on clarity, engagement, and overall experience.

## Pages / Routes
- `/` Dashboard/Home
  - Join a quiz card
  - Profile progress card
  - Recent activity
  - Templates
  - Leaderboard
  - Upcoming quizzes
- `/quiz` Quiz/Exam screen
  - 10 mock questions
  - Answer card states (default/hover/selected/correct/wrong)
  - Hint, 50:50, and Class actions
  - Progress/XP/coins tracking
- `/result` Result screen
  - Score summary
  - Correct answers count
  - XP and coins earned
  - Question-by-question breakdown

## User Testing Flow
1. Open dashboard.
2. Enter `1234`.
3. Join quiz.
4. Answer questions.
5. Use **Hint** / **50:50**.
6. Finish quiz.
7. Review result.

## Error Handling Included
- Empty join code validation (`Please enter a join code.`)
- Invalid join code validation (`Invalid join code. Please check the code and try again.`)
- Direct `/result` access fallback (`No completed quiz found.`)
- Missing quiz data fallbacks (`No quiz questions available.` and invalid-question fallback)
- App-level React error boundary (`Something went wrong in the prototype.`)

## Run Locally
### 1) Install dependencies
```bash
npm install
```

### 2) Start development server
```bash
npm run dev
```

### 3) Build for production check
```bash
npm run build
```

## Notes
- Visual style and interactions are tuned to match the provided high-fidelity design PDF.
- Data is static and stored in `src/data/mockData.js`.
- All quiz/dashboard/result content is mock-only and powered by local state.
