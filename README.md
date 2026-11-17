# Flooring Guru — Admin Panel

Separate Next.js admin app (port **3001**).

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3001/login` and sign in with a Django **staff** user (`python manage.py createsuperuser` in `backend/`).

Requires the API at `NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000/api`).
