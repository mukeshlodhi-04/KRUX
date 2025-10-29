<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1tWDy-ckBUxrBYJppJgKHW_9wpQ9kJIBI

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the Gemini / Google GenAI API key for local development

   - Create a `.env.local` file at the project root (it should be gitignored) and add:

     ```env
     VITE_GOOGLE_API_KEY=your_google_genai_api_key_here
     ```

   - Or export it in your shell for a single run (bash):

     ```bash
     export VITE_GOOGLE_API_KEY="your_google_genai_api_key_here"
     npm run dev
     ```

   - PowerShell (single session):

     ```powershell
     $env:VITE_GOOGLE_API_KEY = 'your_google_genai_api_key_here'
     npm run dev
     ```

   Important: Do NOT commit your API key. For production, don't expose API keys in client-side code — use a server-side proxy or backend to hold secrets.

3. Run the app:
   `npm run dev`
