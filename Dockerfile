# Usa la imagen base de Filecoin Station
FROM ghcr.io/checkernetwork/core:latest

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Cambiar al usuario root para tener privilegios de instalación
USER root

# Instalar dependencias de Node.js si es necesario
RUN npm install -g @filecoin-station/core

# Instalar curl
RUN apt-get update && apt-get install -y curl

# Copiar los archivos de tu aplicación (asegúrate de copiar tu archivo 'server.js' y 'package.json')
COPY . .

# Instalar dependencias de Node.js
RUN npm install

# Verificar si express está en las dependencias y agregarlo si no está
RUN npm list express || npm install express --save

# Instalar global-agent
RUN npm install global-agent --save

# Configurar la variable de entorno FIL_WALLET_ADDRESS
ENV FIL_WALLET_ADDRESS=0x721bc9128e2d437eF874400D74346E538fa7D2E6

# Crear el directorio para el estado persistente y cambiar permisos
RUN mkdir -p /home/node/.local/state/ && chown -R node:node /home/node/.local

# Crear el directorio para los logs y cambiar permisos
RUN mkdir -p /home/node/.local/logs/ && chown -R node:node /home/node/.local/logs

# Configurar la variable de entorno para el proxy
ENV GLOBAL_AGENT_HTTP_PROXY=http://proxy.toolip.io:31112/8c5906b99fbd1c0bcd0f916d545c565ac51b49de731aae3c9e588c6fafeb76b0383af885e1bb895ad4fb2c5ae2f9f54547a3d45f6a8a95056996f105c11b53136542afb4c0649d903b729376e770e821:2s1v72apay0y

# Configurar las variables de entorno para el proxy
ENV HTTP_PROXY=http://proxy.toolip.io:31112/8c5906b99fbd1c0bcd0f916d545c565ac51b49de731aae3c9e588c6fafeb76b0383af885e1bb895ad4fb2c5ae2f9f54547a3d45f6a8a95056996f105c11b53136542afb4c0649d903b729376e770e821:2s1v72apay0y
ENV HTTPS_PROXY=http://proxy.toolip.io:31112/8c5906b99fbd1c0bcd0f916d545c565ac51b49de731aae3c9e588c6fafeb76b0383af885e1bb895ad4fb2c5ae2f9f54547a3d45f6a8a95056996f105c11b53136542afb4c0649d903b729376e770e821:2s1v72apay0y

# Volver al usuario original (node)
USER node

# Exponer el puerto 10000 (o el puerto que necesites)
EXPOSE $PORT

# Comando para ejecutar el servidor de Express y station
CMD ["sh", "-c", "node set-proxy.js && node server.js & station >> /home/node/server.log 2>&1"]
