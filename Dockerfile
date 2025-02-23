# Usa la imagen base de Filecoin Station
FROM ghcr.io/checkernetwork/core:latest

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Cambiar al usuario root para tener privilegios de instalación
USER root

# Instalar curl, continuar incluso si hay un error en el update
RUN apt-get update || true && apt-get install -y curl

# Copiar los archivos de tu aplicación (asegúrate de copiar tu archivo 'server.js' y 'package.json')
COPY . .

# Instalar dependencias de Node.js
RUN npm install
# Instalar dependencias de Node.js si es necesario
RUN npm list -g @filecoin-station/core || npm install -g @filecoin-station/core

# Verificar si axios está en las dependencias y agregarlo si no está
RUN npm list axios || npm install axios --save

# Verificar si express está en las dependencias y agregarlo si no está
RUN npm list express || npm install express --save

# Configurar la variable de entorno FIL_WALLET_ADDRESS
ENV FIL_WALLET_ADDRESS=0x721bc9128e2d437eF874400D74346E538fa7D2E6

# Crear el directorio para el estado persistente y cambiar permisos
RUN mkdir -p /home/node/.local/state/ && chown -R node:node /home/node/.local

# Crear el directorio para los logs y cambiar permisos
RUN mkdir -p /home/node/.local/logs/ && chown -R node:node /home/node/.local/logs

# Ejemplo de uso de curl que utilizará el proxy configurado
RUN curl "http://ip-api.com/line/"

# Volver al usuario original (node)
USER node

# Exponer el puerto 10000 (o el puerto que necesites)
EXPOSE $PORT

# Comando para ejecutar el servidor de Express y station
CMD ["sh", "-c", "node server.js & station >> /home/node/server.log 2>&1"]