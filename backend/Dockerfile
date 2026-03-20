FROM oven/bun:latest

WORKDIR /app

# Copy package and lock file
COPY package.json bun.lock ./

# Install dependencies (production only to keep image lean)
# If you run into issues, try `bun install` without --production
RUN bun install

# Copy all local files into the image
COPY . .

# Expose backend port
EXPOSE 3000

# Start the application
CMD ["bun", "start"]
