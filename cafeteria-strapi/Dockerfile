# Base image using a specific Node.js version as required by the project
FROM node:20-alpine

# Set the working directory
WORKDIR /opt/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json ./
COPY package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Strapi application for production
RUN npm run build

# Expose the port Strapi runs on
EXPOSE 1337

# Command to start the Strapi application
CMD ["npm", "run", "start"]