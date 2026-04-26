# CampusConnect Sequence Diagram

This document contains the sequence diagram for the CampusConnect project, illustrating the main user flows and interactions between components.

## Main User Flows

### 1. User Registration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as Database (Prisma)
    participant E as Email Service

    U->>F: Navigate to /register
    F->>F: Display Register Form
    U->>F: Enter email and click "Send OTP"
    F->>B: POST /auth/register {email}
    B->>DB: Check if user exists
    DB-->>B: User data or null
    alt User exists
        B-->>F: Error: User already exists
        F-->>U: Show error message
    else User doesn't exist
        B->>B: Generate OTP
        B->>DB: Store OTP temporarily
        DB-->>B: OTP stored
        B->>E: Send OTP email
        E-->>B: Email sent confirmation
        B-->>F: Success: OTP sent
        F-->>U: Redirect to /verify-otp
    end

    U->>F: Enter OTP and click "Verify"
    F->>B: POST /otp/verify {email, otp}
    B->>DB: Verify OTP
    DB-->>B: OTP valid/invalid
    alt Invalid OTP
        B-->>F: Error: Invalid OTP
        F-->>U: Show error message
    else Valid OTP
        B->>DB: Create user record
        DB-->>B: User created
        B-->>F: Success with user data
        F-->>U: Redirect to /complete-profile
    end

    U->>F: Fill profile details and submit
    F->>B: POST /auth/complete-profile {userData}
    B->>DB: Update user profile
    DB-->>B: Profile updated
    B-->>F: Success
    F-->>U: Redirect to home page
```

### 2. User Login Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as Database (Prisma)

    U->>F: Navigate to /login
    F->>F: Display Login Form
    U->>F: Enter email/password and click "Sign In"
    F->>B: POST /auth/login {email, password}
    B->>DB: Validate credentials
    DB-->>B: User data or null
    alt Invalid credentials
        B-->>F: Error: Invalid credentials
        F-->>U: Show error message
    else Valid credentials
        B->>B: Generate JWT token
        B->>B: Set HTTP-only cookie
        B-->>F: Success with user data
        F->>F: Store user in localStorage
        F-->>U: Redirect to home page
    end
```

### 3. Event Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as Database (Prisma)
    participant C as Cloudinary

    U->>F: Navigate to /create-event
    F->>F: Display Event Form
    U->>F: Fill event details and upload image
    F->>C: Upload image to Cloudinary
    C-->>F: Image URL
    F->>B: POST /event/create {eventData, imageUrl}
    B->>B: Validate event data
    B->>DB: Create event record
    DB-->>B: Event created
    B-->>F: Success
    F-->>U: Redirect to /events
```

### 4. Club Management Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as Database (Prisma)

    U->>F: Navigate to /clubs
    F->>B: GET /club/all
    B->>DB: Fetch all clubs
    DB-->>B: Clubs data
    B-->>F: Clubs list
    F-->>U: Display clubs

    U->>F: Click "Request to Join" on a club
    F->>B: POST /club/request {clubId, userId}
    B->>DB: Create club request
    DB-->>B: Request created
    B-->>F: Success
    F-->>U: Show success message

    Note over U,B: Admin can view requests at /club-requests
    U->>F: Navigate to /club-requests (if admin)
    F->>B: GET /club/requests
    B->>DB: Fetch pending requests
    DB-->>B: Requests data
    B-->>F: Display requests
    U->>F: Approve/Reject request
    F->>B: POST /club/approve or /club/reject {requestId}
    B->>DB: Update request status
    DB-->>B: Status updated
    B-->>F: Success
```

### 5. Profile and Authentication Management

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as Database (Prisma)

    F->>B: GET /auth/me (on app load)
    B->>B: Verify JWT token from cookie
    B->>DB: Fetch user data
    DB-->>B: User data
    B-->>F: User data
    F->>F: Update user state

    U->>F: Navigate to /profile
    F->>F: Display profile with user data

    U->>F: Update profile and submit
    F->>B: PUT /auth/update-profile {updatedData}
    B->>DB: Update user record
    DB-->>B: Profile updated
    B-->>F: Success
    F->>F: Update local user state

    Note over F,B: Token expires after 12 hours
    F->>B: GET /auth/me (periodic check)
    B-->>F: 401 Unauthorized
    F->>B: POST /auth/logout
    B->>B: Clear cookie
    F->>F: Clear localStorage
    F-->>U: Redirect to /login
```

## System Architecture Overview

```mermaid
graph TB
    A[User] --> B[Frontend<br/>React + Vite]
    B --> C[Backend<br/>Express.js]
    C --> D[Database<br/>PostgreSQL via Prisma]
    C --> E[Email Service<br/>Nodemailer]
    C --> F[File Storage<br/>Cloudinary]
    C --> G[Authentication<br/>JWT + Cookies]

    B --> H[Routing<br/>React Router]
    C --> I[Validation<br/>Joi Schemas]
    C --> J[Middleware<br/>Auth, Error Handling]
```

## Key Components

- **Frontend**: React application with routing, forms, and API integration
- **Backend**: Express.js server with RESTful APIs
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Email**: Nodemailer for OTP delivery
- **File Upload**: Multer for handling file uploads, Cloudinary for storage
- **Validation**: Joi schemas for input validation
- **Error Handling**: Centralized error handling middleware

This sequence diagram covers the main user journeys in the CampusConnect application, showing how users can register, login, create events, manage clubs, and maintain their profiles.