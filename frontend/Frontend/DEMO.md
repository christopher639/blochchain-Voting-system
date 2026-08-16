# 2-minute demo script

1. Start the dev server:

```bash
cd frontend/Frontend
npm run dev
```

2. Open the app (Vite URL shown in terminal).

3. Demo steps (approx 2 minutes):
- Home → Click "Start voting (mock)".
- On Verify: choose a constituency, enter a Student ID (e.g. `22151215`), click "Send OTP", then "Verify & Continue".
- On Ballot: select a candidate and click "Confirm & Submit".
- On Receipt: show the vote hash; note it down.
- Open Dashboard: show total votes, counts by candidate, and raw ledger.

Notes: This is a frontend prototype using an in-memory ledger (`src/lib/ledger.js`). To persist data and perform real verification, integrate `src/lib/api.js` with the backend APIs.
