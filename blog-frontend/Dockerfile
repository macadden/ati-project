# Usa una imagen de Node.js como base
FROM node:22.11.0 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de npm y las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del frontend
COPY . .

# Construye la aplicación de React para producción
RUN npm run build

# Usa una imagen de Nginx para servir el contenido estático
FROM nginx:alpine

# Copia los archivos estáticos de React al contenedor de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia el archivo de configuración nginx.conf al contenedor
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 80 para que Nginx sirva la aplicación
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
