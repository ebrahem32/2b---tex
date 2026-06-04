FROM node:20-slim

WORKDIR /app

# تثبيت تبعيات الـ backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# نسخ كل ملفات المشروع
COPY . .

# المنفذ الخارجي (Railway يضبطه تلقائياً عبر PORT)
EXPOSE 3000

CMD ["node", "start.js"]
