# --- Build lightweight node image ---
FROM node:18-alpine

WORKDIR /app

# Copy dependencies first (for better caching)
COPY package*.json ./

RUN npm install --production

# Copy app code
COPY . .

# Expose app port
EXPOSE 4001

CMD ["node", "src/index.js"]
