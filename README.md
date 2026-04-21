# Rayito Pharmacy Frontend

Frontend web for Rayito Pharmacy, built with React and Vite. The application includes public shopping flows, protected admin routes, product/category management, service pages, contact handling, user administration, and PDF/report support.

## Tech Stack

- React 19
- Vite / Rolldown Vite
- React Router
- Axios
- jsPDF and jsPDF AutoTable
- ESLint

## Main Features

- Public product and service browsing
- Shopping cart experience
- Admin login with protected dashboard routes
- Product and category administration
- Service, contact, user, and history modules
- API integration through a configurable backend URL

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Run the development server:

```bash
npm run dev
```

The app runs locally at:

```text
http://localhost:5173
```

## Environment Variables

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Related Repository

- Backend: https://github.com/LuisOvalleH/Backend-Rayito-Pharmacy-FAQUETSA
