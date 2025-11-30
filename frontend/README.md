QR Code Generator (Monorepo: Frontend + Backend)

A full-stack QR code generator application built with React.js (Vite) for the frontend and Node.js + Express + MongoDB for the backend.
Generate customizable QR codes for text, URLs, emails, WiFi, phone, and vCard with storage and history support.

🚀 Features

Frontend

Dynamic QR code generation

Customizable QR types: text, URL, email, phone, WiFi, vCard

Custom size, margin, and colors

Responsive UI with live preview

Error handling and loading states

Modern design using Tailwind CSS

Unit and integration tests for components and state management

Backend

Generate QR codes via API

Store generated QR codes in MongoDB

Fetch single QR code or paginated history

Health check endpoint

Rate limiting and CORS support

MVC structure with services and controllers

Unit tests for services and controllers

Integration tests for API endpoints

📦 Tech Stack

Frontend

React.js (Vite)

Zustand (state management)

Tailwind CSS

Axios for API requests

Jest + React Testing Library for unit/integration tests

Backend

Node.js

Express.js

MongoDB + Mongoose

QRCode generation library

Jest + Supertest for unit and integration tests

Zod/Joi for request validation (if used)

dotenv

Helmet / Rate-limiting for security

🗂 Folder Structure
root/
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   └── main.jsx
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── public/
│   ├── package.json
│   └── .env
│
│── backend/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── config/
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md

⚙️ Environment Variables
Frontend (frontend/.env)
VITE_API_URL=http://localhost:5000   # Development
VITE_API_URL=https://api.yourdomain.com  # Production

Backend (backend/.env)
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/qrappdb
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100


For production, change NODE_ENV=production and update MONGO_URI and CORS_ORIGIN to your live domains.

📡 API Endpoints (Backend)

Health Check
GET /api/qr/health
Returns API status.

Generate QR Code
POST /api/qr/generate

{
  "data": "Hello World",
  "type": "text",
  "size": 300,
  "margin": 1,
  "colorDark": "#000000",
  "colorLight": "#ffffff"
}


Get QR by ID
GET /api/qr/:id

Get Paginated QR History
GET /api/qr?page=1&limit=10&type=text&sortBy=createdAt&sortOrder=desc

▶️ Running the Project
Backend
cd backend
npm install
npm run dev        # Development
npm start          # Production

Frontend
cd frontend
npm install
npm run dev        # Development
npm run build      # Production build


Serve the production frontend with Vercel, Netlify, or Nginx

Make sure VITE_API_URL points to the deployed backend URL

🧪 Testing
Backend

Unit Tests: test services, controllers, and utility functions

Integration Tests: test API endpoints using Supertest

Example:

cd backend
npm run test


Health check endpoint, QR generation, fetching by ID, and pagination are covered

Error handling scenarios also tested

Frontend

Unit Tests: test React components and Zustand store logic

Integration Tests: test UI interactions such as form submission and QR preview

Example:

cd frontend
npm run test


Components like QRGenerator, QRPreview, and InputField are tested

API call simulation with mocked Axios responses

Loading, error, and success states tested

📝 License

MIT License – free for personal and commercial use.