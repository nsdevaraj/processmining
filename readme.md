# Process Mining System

A full-stack web application for mining, analyzing, and visualizing business processes.  
Built using **React** for the frontend, **Hapi.js** for the backend, and **DuckDB** for embedded analytics.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [frontend and backend setup](#available-scripts)
- [API Endpoints](#api-endpoints)

---

## Features

- Upload and process event logs (CSV, XES, etc.)
- Run DuckDB SQL queries over event logs
- Visualize process flows and statistics
- REST API using Hapi.js
- Lightweight embedded analytics (DuckDB)

---

## Tech Stack

| Layer    | Technology             |
| -------- | ---------------------- |
| Frontend | React, Axios, Tailwind |
| Backend  | Node.js, Hapi.js       |
| Database | DuckDB (Embedded SQL)  |

---

## frontend and backend setup

### Backend

- `npm install` – install all package for backend
- `npm run dev` – Start Hapi server with nodemon

### Frontend

- `npm install` – Run React app in dev mode
- `npm run dev` – Build for production

---

### Sample Event Log File

You can download or view a sample event log file here (also available in sample-logs folder) for testing use this event_log.csv:  
[event_log_sample.csv](./event_log_sample.csv)

This file can be used for testing with the `/upload` endpoint.

---

### API Endpoints

| Method        | Endpoint    | Description                                           |
| ------------- | ----------- | ----------------------------------------------------- |
| `GET`         | `/`         | Health check (returns "Hello world")                  |
| `POST`        | `/upload`   | Uploads a file (CSV), max 100MB                       |
| `POST`        | `/filters`  | Returns dynamic filters for frontend from DuckDB file |
| `GET`         | `/overview` | Returns overview page data (without filters)          |
| `POST`        | `/overview` | Returns filtered overview page data                   |
| `GET`, `POST` | `/{any*}`   | Redirects any unknown route to `/`                    |

You can test the endpoints using Postman or Curl.

---
