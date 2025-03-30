# Use Node.js image from Docker Hub
FROM node:16

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to container
COPY package*.json ./

RUN npm install

# Copy rest of app code to container
COPY . .

# Expose port
EXPOSE 3000

# Run app
CMD ["node", "server.js"]