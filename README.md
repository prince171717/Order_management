backend .env file

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/order_mgmt
JWT_SECRET=super_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
ADMIN_DEFAULT_EMAIL=admin@example.com
ADMIN_DEFAULT_PASSWORD=admin123


frontend env file

VITE_API_URL=http://localhost:5000/api
