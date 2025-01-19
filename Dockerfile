# Usa la imagen base de Filecoin Station
FROM ghcr.io/filecoin-station/core:latest

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Cambiar al usuario root para tener privilegios de instalación
USER root

# Instalar dependencias de Node.js si es necesario
RUN npm install -g @filecoin-station/core

# Copiar los archivos de tu aplicación (asegúrate de copiar tu archivo 'server.js' y 'package.json')
COPY . .

# Instalar dependencias de Node.js
RUN npm install

# Verificar si express está en las dependencias y agregarlo si no está
RUN npm list express || npm install express --save

# Configurar la variable de entorno FIL_WALLET_ADDRESS
ENV FIL_WALLET_ADDRESS=0x721bc9128e2d437eF874400D74346E538fa7D2E6

# Crear el directorio para el estado persistente y cambiar permisos
RUN mkdir -p /home/node/.local/state/ && chown -R node:node /home/node/.local

# Volver al usuario original (node)
USER node

# Exponer el puerto 10000 (o el puerto que necesites)
EXPOSE $PORT

# Comando para ejecutar el servidor de Express y station
CMD ["sh", "-c", "node server.js & station"]
