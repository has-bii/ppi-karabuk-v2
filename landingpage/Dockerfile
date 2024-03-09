FROM node:18-alpine AS build
WORKDIR /app

# Define build-time environment variables
ARG NEXT_PUBLIC_BLOG_TOKEN
ARG NEXT_PUBLIC_BLOG_API
ARG NEXT_PUBLIC_IMG_PROVIDER_URL

# Set environment variables for the build process
ENV NEXT_PUBLIC_BLOG_TOKEN=${NEXT_PUBLIC_BLOG_TOKEN}
ENV NEXT_PUBLIC_BLOG_API=${NEXT_PUBLIC_BLOG_API}
ENV NEXT_PUBLIC_IMG_PROVIDER_URL=${NEXT_PUBLIC_IMG_PROVIDER_URL}

COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run prisma-generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]