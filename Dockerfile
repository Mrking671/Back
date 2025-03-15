# Use official Node.js Alpine image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source files
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD [ "npm", "start" ]
