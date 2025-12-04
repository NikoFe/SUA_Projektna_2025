
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose the app port
#EXPOSE 3127
EXPOSE 6005
# Start the server
CMD ["npm", "run", "dev"]