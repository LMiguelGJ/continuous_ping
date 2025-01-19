# Usa la imagen base de Filecoin Station
FROM ghcr.io/filecoin-station/core:latest

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Instalar dependencias de Node.js localmente
RUN npm install @filecoin-station/core

# Configurar la variable de entorno FIL_WALLET_ADDRESS
ENV FIL_WALLET_ADDRESS=0x721bc9128e2d437eF874400D74346E538fa7D2E6

# Crear el directorio para el estado persistente
RUN mkdir -p /home/node/.local/state/

# Comando para iniciar el servicio
CMD ["npx", "filecoin-station", "core"]
