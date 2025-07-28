# Gunakan image nginx ringan
FROM nginx:alpine

# Salin file ke folder default nginx
COPY . /usr/share/nginx/html

# Ganti konfigurasi nginx agar auto reload (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80
