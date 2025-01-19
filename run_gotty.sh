#!/bin/bash

# Crear el directorio de estado y establecer los permisos
mkdir -p ./state && chmod 755 ./state

# Ejecutar el contenedor Docker con la configuración proporcionada
docker run --name station --detach \
  --env FIL_WALLET_ADDRESS=0x721bc9128e2d437eF874400D74346E538fa7D2E6 \
  -v "$(pwd)/state:/home/node/.local/state" \
  ghcr.io/filecoin-station/core

# Ver los logs del contenedor
docker logs -f station
