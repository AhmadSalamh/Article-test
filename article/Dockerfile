# Use an appropriate base image
FROM node:14 as build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the application code
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight base image for deployment
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default port of the web server
EXPOSE 80

# Start the web server
CMD ["nginx", "-g", "daemon off;"]