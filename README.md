# Local Outreach AI

A Next.js 14 web application for discovering local businesses and automating personalized outreach campaigns.

## Features

- **Business Search** — Find shops by location, category, and search radius
- **AI Message Templates** — Customize messages with `{shop_name}`, `{location}`, and `{business_category}` placeholders
- **Batch Outreach** — Select multiple shops and send messages in one action
- **Interactive Results Table** — Track action status (Pending, Sending, Sent, Failed)
- **Dark Theme UI** — Modern, responsive design with Tailwind CSS and Lucide icons

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Lucide React icons
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/search-shops` | POST | Search for local businesses (mock data) |
| `/api/send-messages` | POST | Send outreach messages to selected shops |

### Search Shops

```json
POST /api/search-shops
{
  "location": "Mumbai, India",
  "businessCategory": "Salons",
  "radiusKm": 5,
  "messageTemplate": "Hello {shop_name}!"
}
```

### Send Messages

```json
POST /api/send-messages
{
  "messages": [
    { "id": "shop-1", "shopName": "...", "phone": "...", "message": "..." }
  ]
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── search-shops/route.ts
│   │   └── send-messages/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── SearchForm.tsx
│   └── ResultsTable.tsx
├── lib/
│   └── mock-data.ts
└── types/
    └── outreach.ts
```
