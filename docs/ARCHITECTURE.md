# Note-Taking Application Architecture

This document outlines the architecture of the note-taking application, describing the system components, their interactions, and the design decisions.

## System Architecture Overview

The application follows a modern, monolithic architecture within a monorepo structure:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  NestJS Backend │────▶│  Databases      │
│  (Browser)      │     │  (API Server)   │     │  (PostgreSQL/   │
│                 │◀────│                 │◀────│  MongoDB)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Key Components

1. **Frontend (React)**
   - User interface for interacting with notes
   - Client-side rendering for responsive experience
   - State management with Zustand
   - Uses JWT for authentication

2. **Backend (NestJS)**
   - RESTful API with clear endpoints
   - Authentication and authorization middleware
   - Business logic implementation
   - Database abstraction layer

3. **Databases**
   - PostgreSQL: Primary relational database for structured data (users, notes)
   - MongoDB (Optional): Document store for potentially unstructured note content

4. **Shared Package**
   - Common types and interfaces shared between frontend and backend
   - Ensures type safety across the application

## Detailed Component Architecture

### Frontend Architecture

The frontend follows a component-based architecture with clear separation of concerns:

```
Frontend
├── Components (Reusable UI components)
├── Pages (Route-based view components)
├── Stores (State management)
├── API (API client and services)
└── Utils (Helper functions and utilities)
```

**State Management**:
- Authentication state (auth store)
- Notes state (notes store)
- Local component state when appropriate

**Key Design Patterns**:
- Container/Presentational pattern
- Custom hooks for reusable logic
- Route-based code splitting

### Backend Architecture

The backend follows a modular, layered architecture:

```
Backend
├── Modules
│   ├── Users
│   ├── Notes
│   └── Auth
├── Each Module
│   ├── Controllers (Route handlers)
│   ├── Services (Business logic)
│   ├── DTOs (Data Transfer Objects)
│   └── Entities (Database models)
└── Shared
    ├── Guards (Authentication)
    ├── Decorators (Custom behavior)
    └── Filters (Exception handling)
```

**Key Design Patterns**:
- Dependency Injection
- Repository Pattern
- DTO Pattern
- Module Pattern

### Database Schema

**PostgreSQL Schema**:

```
┌────────────────┐       ┌────────────────┐
│ Users          │       │ Notes          │
├────────────────┤       ├────────────────┤
│ id (PK)        │       │ id (PK)        │
│ email          │       │ title          │
│ firstName      │       │ content        │
│ lastName       │◀─────▶│ userId (FK)    │
│ password       │       │ createdAt      │
│ createdAt      │       │ updatedAt      │
│ updatedAt      │       │                │
└────────────────┘       └────────────────┘
```

**MongoDB Schema** (Optional - for more complex note structures):

```javascript
{
  _id: ObjectId,
  originalNoteId: UUID, // Reference to PostgreSQL note
  content: String,      // Rich content
  metadata: {           // Flexible metadata
    tags: [String],
    attachments: [
      {
        type: String,
        url: String,
        ...
      }
    ],
    ...
  }
}
```

## Authentication Flow

The application uses JWT-based authentication with refresh tokens:

1. User logs in with credentials
2. Server validates credentials and issues:
   - Access token (short-lived, e.g., 15 minutes)
   - Refresh token (longer-lived, e.g., 7 days)
3. Client stores tokens securely
4. Client includes access token with each API request
5. When access token expires, client uses refresh token to get a new access token
6. If refresh token expires, user must log in again

## Key Security Considerations

1. **Authentication**: JWT tokens with proper expiration
2. **Authorization**: Role-based access control
3. **Data Protection**: Password hashing with bcrypt
4. **API Security**: Rate limiting, CORS configuration
5. **Frontend Security**: Input validation, XSS protection
6. **Database Security**: Parameterized queries prevent SQL injection

## Performance Considerations

1. **Database Indexes**: On frequently queried fields
2. **Caching**: API responses with appropriate cache headers
3. **Lazy Loading**: Component and route-based code splitting
4. **Pagination**: For lists of notes to limit data transfer
5. **Optimistic UI Updates**: For better perceived performance

## Error Handling Strategy

1. **Frontend**: Global error handling with specific error responses
2. **Backend**: Exception filters to standardize error responses
3. **Logging**: Structured logging for debugging and monitoring

## Local Development

The application is designed for local development with Docker and Docker Compose. The development environment includes:

```
┌────────────────────────────┐
│ Docker Compose             │
│                            │
│  ┌──────────┐ ┌─────────┐  │
│  │ Frontend │ │ Backend │  │
│  │Container │ │Container│  │
│  └──────────┘ └─────────┘  │
│                            │
│  ┌──────────┐ ┌─────────┐  │
│  │PostgreSQL│ │MongoDB  │  │
│  │Container │ │Container│  │
│  └──────────┘ └─────────┘  │
│                            │
└────────────────────────────┘
```

For production environments, this could be extended to use Kubernetes for more advanced orchestration.

## References
- [API Design Document](API_DESIGN.md)