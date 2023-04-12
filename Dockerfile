# Build the frontend
FROM node:18.15 AS frontend-builder
WORKDIR /app/frontend
COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install
COPY ./frontend ./
RUN yarn build

# Build the backend
FROM golang:1.20 AS backend-builder
WORKDIR /app
COPY go.mod go.sum ./
COPY docker-compose.yml ./
RUN go mod download
COPY . .
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist
RUN CGO_ENABLED=0 go build -o main ./cmd/main.go

# Final stage: create a minimal container with the built executable
FROM alpine:3.16
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=backend-builder /app/main .
COPY --from=backend-builder /app/.env.production ./.env.production
COPY --from=backend-builder /app/frontend/dist /app/frontend/dist
COPY --from=backend-builder /app/frontend/dist/images /app/frontend/dist
EXPOSE 8080
CMD ["/app/main"]
