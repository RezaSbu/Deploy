# استفاده از نسخه LTS Node.js (استفاده از mirror چینی برای سرعت بیشتر)
FROM node:18-alpine

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی فایل package.json
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install

# کپی تمام فایل‌های پروژه
COPY . .

# قرار دادن پورت سرور
EXPOSE 8000

# اجرای سرور
CMD ["npm", "start"]
