# Goal Spark AI (GoalPilot)

Turn ambitious goals into daily action with an AI planner, calendar, tasks, habits, and analytics in one focused workspace.

## 🚀 Running in GitHub Codespaces / Local

### 1. Configure Your Gemini API Key
Create a `.env` file in the root folder (or copy from `.env.example`):

```bash
cp .env.example .env
```

Open `.env` and paste your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey):

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

*(Note: If no API key is provided, the application gracefully enters **Standby Mode**, providing built-in contextual dynamic roadmap generators and chat responses without crashing).*

### 2. Install Dependencies & Start
In your terminal (or GitHub Codespaces terminal):

```bash
# Install dependencies
npm install

# Start the full-stack dev server (bound to port 3000)
npm run dev
```

### 3. Open Preview
In GitHub Codespaces, click the **Ports** tab or open `http://localhost:3000`.

---

## 🛠️ Tech Stack & Architecture
- **Frontend**: React 19, Tailwind CSS v4, TanStack Router & Query, Lucide Icons, Framer Motion
- **Backend Server**: Node.js Express server (`server.ts`) with Vite SPA middleware
- **AI Engine**: `@google/genai` TypeScript SDK using `gemini-3.7-flash` (server-side only, keys protected)
