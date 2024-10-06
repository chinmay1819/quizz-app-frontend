# Use the official Node.js image to build the application
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build --prod

# Use a lightweight web server to serve the application
FROM nginx:alpine

# Copy the built Angular application from the previous stage
COPY --from=build /app/dist/quizui /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
