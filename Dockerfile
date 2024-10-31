# Usa la imagen base de filecoin-station
FROM ghcr.io/filecoin-station/core:latest

# Configura la variable de entorno FIL_WALLET_ADDRESS
ENV FIL_WALLET_ADDRESS=0x721bc9128e2d437eF874400D74346E538fa7D2E6

# Crea el directorio donde se montará el volumen en Railway
RUN mkdir -p /home/node/.local/state/

# Configura el punto de entrada de ejecución del servicio
CMD ["node", "start"]
