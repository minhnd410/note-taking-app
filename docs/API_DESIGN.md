# API Design

This document outlines the API design for the Note-Taking Application, providing details on endpoints, request/response formats, and authentication.

## Base URL

```
/api
```

## Authentication

The API uses JWT tokens for authentication. Most endpoints require authentication, except for those marked as public.

### Headers

For authenticated requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Authentication Endpoints

#### Register

- **URL**: `/auth/register`
- **Method**: `POST`
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
  ```
- **Status Codes**:
  - `201`: Created
  - `400`: Bad Request
  - `409`: Conflict (Email already exists)

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Authentication**: None (Public)
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
  ```
- **Status Codes**:
  - `200`: OK
  - `401`: Unauthorized (Invalid credentials)

#### Refresh Token

- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Authentication**: Refresh Token
- **Headers**:
  ```
  Authorization: Bearer <refresh_token>
  ```
- **Response**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
  ```
- **Status Codes**:
  - `200`: OK
  - `401`: Unauthorized (Invalid or expired refresh token)

### User Profile

#### Get Current User

- **URL**: `/auth/profile`
- **Method**: `GET`
- **Authentication**: Required
- **Response**:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
  }
  ```
- **Status Codes**:
  - `200`: OK
  - `401`: Unauthorized

## Notes Endpoints

#### Get All Notes

- **URL**: `/notes`
- **Method**: `GET`
- **Request Parameters**:
  - `page`: (optional) Page number for pagination. Default is 1.
  - `limit`: (optional) Number of notes per page. Default is 20.
  - `sort`: (optional) Sort order. Default is `updatedAt:desc`.
  - `filter`: (optional) Filter by title or content
- **Authentication**: Required
- **Response**:
  ```json
  {
    "notes": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Meeting Notes",
        "excerpt": "Summary of the meeting...",
        "createdAt": "2023-01-01T12:00:00Z",
        "updatedAt": "2023-01-01T12:30:00Z"
      },
      // ...more notes
    ],
    "page": 1,
    "limit": 20,
    "totalPages": 5,
  }
  ```
- **Status Codes**:
  - `200`: OK
  - `401`: Unauthorized

#### Get Note by ID

- **URL**: `/notes/:id`
- **Method**: `GET`
- **Authentication**: Required
- **Response**:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Meeting Notes",
    "content": "# Meeting Notes\n\n- Point 1\n- Point 2",
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:30:00Z"
  }
  ```
- **Status Codes**:
  - `200`: OK
  - `401`: Unauthorized
  - `403`: Forbidden (Not the user's own note)
  - `404`: Not Found

#### Create Note

- **URL**: `/notes`
- **Method**: `POST`
- **Authentication**: Required
- **Response**:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
  ```
- **Status Codes**:
  - `201`: Created
  - `400`: Bad Request
  - `401`: Unauthorized

#### Update Note

- **URL**: `/notes/:id`
- **Method**: `PATCH`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "title": "Updated Note Title",
    "content": "# Updated Content\n\nThis note has been updated."
  }
  ```
- **Response**:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
  ```
- **Status Codes**:
  - `200`: OK
  - `400`: Bad Request
  - `401`: Unauthorized
  - `403`: Forbidden (Not the user's own note)
  - `404`: Not Found

#### Delete Note

- **URL**: `/notes/:id`
- **Method**: `DELETE`
- **Authentication**: Required
- **Response**: No content
- **Status Codes**:
  - `204`: No Content
  - `401`: Unauthorized
  - `403`: Forbidden (Not the user's own note)
  - `404`: Not Found

## Error Responses

All API errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Error message describing what went wrong",
  "error": "Bad Request"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per minute per IP address
- 1000 requests per hour per user

When rate limits are exceeded, the API responds with:

```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "Rate limit exceeded"
}
```

With an additional header:

```
Retry-After: <seconds until reset>
```

## API Documentation

The API documentation is available at `/api/docs` using Swagger UI, providing interactive documentation for all endpoints.