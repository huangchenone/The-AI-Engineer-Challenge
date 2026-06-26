### Front End

A minimal Next.js chat UI for the Mental Coach backend, with a simple white/black theme toggle.

#### Run locally

1. Start the backend (from the project root):

   ```bash
   uv run uvicorn api.index:app --reload
   ```

2. Install frontend dependencies and start the dev server:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

The frontend proxies `/api/*` requests to the FastAPI server at `http://localhost:8000` during development.

#### Theme

Click **Dark** / **Light** in the header to switch between a white background with black text and a black background with white text. Your preference is saved in `localStorage`.
