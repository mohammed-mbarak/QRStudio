🎯 QR Code Generator API (Node.js + Express + MongoDB)

A powerful backend service for generating customizable QR codes, saving them in MongoDB, and retrieving them with support for filtering and pagination.

This API supports multiple QR content types such as text, URL, email, WiFi, phone, and vCard.

🚀 Features

Generate QR codes with customizable:

Size

Margin

Dark/Light colors

QR type (text, URL, email, WiFi, phone, vCard)

Save generated QR codes to MongoDB

Retrieve a single QR code by ID

Paginated QR code listing with filters

Health check endpoint

Clean MVC folder structure (controllers, services, routes, models)

Centralized error handler + async wrapper

ES Modules support

📦 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

QRCode package

dotenv

Zod/Joi validation (optional)

ESM import/export

🗂 Folder Structure
backend/
│── src/
│   │── controllers/
│   │── services/
│   │── models/
│   │── routes/
│   │── middlewares/
│   │── utils/
│   │── config/
│   └── server.js
│── package.json
│── .env
│── .gitignore

⚙️ Environment Variables

Create a .env file in the backend root:

PORT=5000
MONGO_URI=mongodb+srv://your-mongo-url

📡 API Endpoints
Health Check
GET /api/qr/health

Generate QR Code
POST /api/qr/generate
Content-Type: application/json


Request Body Example:

{
  "data": "Hello World",
  "type": "text",
  "size": 300,
  "margin": 1,
  "colorDark": "#000000",
  "colorLight": "#ffffff"
}

Get QR Code by ID
GET /api/qr/:id

Get All QR Codes (Paginated & Filtered)
GET /api/qr?page=1&limit=10&type=text&sortBy=createdAt&sortOrder=desc

▶️ Running the Server
Install dependencies
npm install

Start development server
npm run dev

Start production server
npm start

🧪 Testing the API

You can test using:

Postman

Thunder Client

cURL

Example:

curl -X GET http://localhost:5000/api/qr/health

📝 License

MIT License — free for personal & commercial use.