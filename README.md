# AI Sales Generator

AI Sales Generator is a full-stack Next.js web application designed to automatically generate high-converting, styled landing pages using Google's Gemini AI. It supports individual page creation, bulk generation via Excel templates, live previews, and standalone HTML exports.

## 🚀 Features

- **Authentication System:** Secure credential-based login and signup using NextAuth.js, bcrypt, and JWT sessions.
- **AI Content Generation:** Deep integration with the `@ai-sdk/google` (Gemini) to turn simple product descriptions into structured sales copy (Features, Target Audience, USPs, Pricing).
- **Template Engine:** Dynamically renders generated content into predefined, beautifully styled Tailwind CSS templates (e.g., SaaS, Minimalist).
- **Bulk Processing:** Upload Excel (`.xlsx`) files to sequentially generate multiple landing pages in the background.
- **Export to HTML:** A custom HTML extraction hook that captures the live DOM and inlines Tailwind v4 compiled CSS, allowing users to download perfectly styled standalone `.html` files.
- **Real-time Dashboard:** Displays account statistics, total generated pages, daily metrics, and recent activity.
- **Account Management:** Dedicated profile settings to update user credentials.

---

## 🛠️ Tech Stack & Tools

### Frontend
- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with a custom design token system.
- **Components:** Modular UI components inspired by Radix UI and shadcn/ui.
- **Icons:** [Lucide React](https://lucide.dev/)
- **File Parsing:** `xlsx` for parsing bulk upload spreadsheets.

### Backend
- **Database:** PostgreSQL (hosted on [Supabase](https://supabase.com/)).
- **ORM:** [Prisma](https://www.prisma.io/) utilizing `@prisma/adapter-pg` and the `pg` driver for stable serverless/edge compatibility on Vercel.
- **AI SDK:** Vercel AI SDK (`ai` and `@ai-sdk/google`) for structured Gemini completions.
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Credentials Provider).
- **Validation:** [Zod](https://zod.dev/) for strict API boundary and schema validation.

---

## 🧠 Application Logic & Approach

### 1. Database Architecture
The application uses a straightforward relational model via Prisma:
- `User`: Stores authenticated users (email, hashed password, company name).
- `Page`: Relates to a `User`. Stores the raw prompt/configuration (`config`), the AI's structured JSON output (`generatedContent`), and the selected `templateId`.

### 2. AI Generation Flow
1. **Input:** The user provides a product name and description (or uploads an Excel sheet with multiple rows).
2. **Prompting:** The `/api/generate` route passes this data to Gemini with strict system instructions to return a JSON object mapping to the `PageData` type.
3. **Storage:** The generated JSON is saved to the PostgreSQL database via Prisma.
4. **Rendering:** The client fetches the `generatedContent` JSON and hydrates a React component template (e.g., `<SassTemplate />`).

### 3. Bulk Generation Approach
To avoid rate limits and memory crashes, the bulk generation feature processes Excel rows sequentially. It maps Excel columns to the `PageData` format, iterates through the rows, calls the `/api/generate` endpoint for each, and reports individual success/failure statuses back to the user interface in real-time.

### 4. HTML Export Strategy
Tailwind v4 handles CSS differently than v3. Instead of parsing class names, the application's export function iterates over `document.styleSheets` in the browser, extracts all active CSS rules (including CSS variables for themes), and injects them into a `<style>` block within a standalone HTML blob. This ensures 1:1 visual fidelity between the browser preview and the downloaded file.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g., Supabase)
- A Google Gemini API Key

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database connection
DATABASE_URL="postgres://user:password@host:port/db"

# Authentication
NEXTAUTH_SECRET="generate-a-random-32-character-string"
NEXTAUTH_URL="http://localhost:3000"

# AI Provider
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
```

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Push schema to database
npx prisma db push

# 4. Start development server
npm run dev
```

## 🚀 Production Deployment (Vercel)
When deploying to Vercel, ensure you configure the following in your project settings:
1. Override the `Build Command` to: `prisma generate && next build`
2. Add all environment variables.
3. Ensure `NEXTAUTH_URL` is set to your exact production URL (e.g., `https://my-app.vercel.app`).
