 💸 AI Money Mentor

AI Money Mentor is a financial intelligence platform that provides tax optimization, portfolio analysis, and financial planning using AI.

 🚀 Features

- 💰 Tax Wizard (Form 16 analysis)
- 📈 Portfolio X-Ray (CAMS/KFintech analysis)
- 🧭 FIRE Planner (Retirement roadmap)
- 💯 Money Health Score
- 🎯 Life Event Advisor
- ❤️ Couple Financial Planner

🛠️ Tech Stack

- React 18 + Vite
- TailwindCSS
- Recharts
- PDF.js (pdfjs-dist)
- Groq API (LLaMA 3.3 70B)

⚙️ Setup Instructions
1. Clone Repository
git clone https://github.com/your-repo/ai-money-mentor.git
cd ai-money-mentor
2. Install Dependencies
npm install
3. Run Application
npm run dev

🔐 API Key Setup
Go to https://console.groq.com
Generate API Key
Enter key in Settings page
Stored in localStorage as:
groq_api_key

📂 How It Works
Upload financial document (PDF)
PDF.js extracts text
Groq API analyzes using AI agents
JSON response parsed
Data visualized via charts & insights

⚠️ Error Handling
PDF parsing fails → demo data used
API fails → retry + error message
JSON parse fails → cleaned + retried

📱 Responsive Design
Mobile: single column
Desktop: multi-column layout

🧪 Demo Mode

If no data available:

App auto-generates realistic financial data
