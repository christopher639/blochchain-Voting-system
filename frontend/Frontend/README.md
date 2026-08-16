# frontend

Vite + React frontend for the Blockchain Voting prototype.

Run the dev server:

```bash
cd frontend/Frontend
npm install
npm run dev
```

Visit the app at the URL shown by Vite (usually http://localhost:5173 or similar).

Pages:
- Home — quick links
- Vote → Verify, Ballot, Receipt (mock flow)
- Dashboard — mock ledger and stats
- Project Report — `src/report/report.md`

To switch to a real backend later, implement network calls in `src/lib/api.js`.
