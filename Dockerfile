FROM ghcr.io/filecoin-station/core:latest
ENV FIL_WALLET_ADDRESS=0x721bc9128e2d437eF874400D74346E538fa7D2E6
RUN mkdir -p /home/node/.local/state/
CMD ["node", "start"]
