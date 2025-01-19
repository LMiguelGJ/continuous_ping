# Usa una imagen base adecuada, como Ubuntu
FROM ubuntu:20.04

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y curl bash docker.io

# Copiar el script al contenedor
COPY run_gotty.sh /run_gotty.sh

# Dar permisos de ejecución al script
RUN chmod +x /run_gotty.sh

# Establecer el script como el comando por defecto para ejecutar cuando se inicie el contenedor
CMD ["/bin/bash", "/run_gotty.sh"]
