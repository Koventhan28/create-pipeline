# Recipe site: Node.js + Express, single container
# Build:  docker build -f dockerfile1 -t recipe-site .
# Run:    docker run -d -p 3000:3000 --name recipe-site recipe-site

FROM node:20-alpine

ENV NODE_ENV=production \
  PORT=3000 \
  HOST=0.0.0.0

WORKDIR /app

# Install dependencies first so this layer is cached between code changes
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy only what the app needs at runtime
COPY server.js views.js ./
COPY data ./data
COPY public ./public

# Run as the unprivileged user that ships with the node image
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

CMD ["node", "server.js"]
