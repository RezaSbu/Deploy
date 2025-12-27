# استفاده از نسخه LTS Node.js برای build (استفاده از mirror برای سرعت بیشتر)
FROM registry.npmmirror.com/nodejs/node:18-alpine as build

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های package
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install

# کپی تمام فایل‌های پروژه
COPY . .

# ساخت نسخه production
RUN npm run build

# استفاده از Nginx برای سرو فایل‌های static (استفاده از mirror)
FROM registry.npmmirror.com/nginx:alpine

# کپی فایل‌های ساخته شده به پوشه nginx
COPY --from=build /app/build /usr/share/nginx/html

# کپی تنظیمات nginx سفارشی
COPY nginx.conf /etc/nginx/conf.d/default.conf

# قرار دادن پورت 80
EXPOSE 80

# اجرای nginx
CMD ["nginx", "-g", "daemon off;"]
