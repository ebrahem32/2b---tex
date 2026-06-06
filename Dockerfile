FROM node:20-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium fonts-noto-color-emoji fonts-noto-core \
    && rm -rf /var/lib/apt/lists/*

# تثبيت تبعيات الـ backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# تثبيت تبعيات خدمة واتساب
COPY whatsapp-service/package*.json ./whatsapp-service/
RUN cd whatsapp-service && npm install --omit=dev

# نسخ كل ملفات المشروع
COPY . .

# المنفذ الخارجي (Railway يضبطه تلقائياً عبر PORT)
EXPOSE 3000

CMD ["node", "start.js"]
