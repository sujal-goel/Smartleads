# API Documentation

This document describes the HTTP API exposed by the Smart Leads Dashboard backend.

## Base URL

All routes are mounted under `/api`.

## Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Returns API status and environment |

## Authentication APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive a JWT | Public |
| GET | `/api/auth/me` | Get the authenticated user profile | Bearer token required |

### Register

Request body:

```json
{
  "name": "Asha Kumar",
  "email": "asha@example.com",
  "password": "secret123",
  "role": "sales"
}
```

### Login

Request body:

```json
{
  "email": "asha@example.com",
  "password": "secret123"
}
```

## Lead APIs

All lead routes require authentication.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/leads` | List leads with filtering, search, sort, and pagination | Authenticated users |
| GET | `/api/leads/:id` | Get a single lead | Authenticated users |
| POST | `/api/leads` | Create a lead | Authenticated users |
| PUT | `/api/leads/:id` | Update a lead | Admin or owner |
| DELETE | `/api/leads/:id` | Delete a lead | Admin only |
| GET | `/api/leads/export/csv` | Export filtered leads as CSV | Authenticated users |

### Lead Query Parameters

`GET /api/leads` supports these query parameters:

- `status`: `New`, `Contacted`, `Qualified`, or `Lost`
- `source`: `Website`, `Instagram`, or `Referral`
- `search`: matches lead name or email
- `sort`: `latest` or `oldest`
- `page`: page number, default `1`
- `limit`: page size, default `10`, max `50`

### Create or Update Lead

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "status": "New",
  "source": "Website",
  "notes": "Interested in a demo",
  "assignedTo": "Sales Team"
}
```

## User Management APIs

These routes require admin access.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get a user by ID |
| PATCH | `/api/users/:id/role` | Update a user role |
| DELETE | `/api/users/:id` | Delete a user |

### Update Role

Request body:

```json
{
  "role": "admin"
}
```

## Authentication Notes

- Protected routes expect `Authorization: Bearer <token>`.
- Admin users can access user-management endpoints and delete leads.
- Sales users can create and update leads, but can only update leads they created.