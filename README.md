🚀 ExpenseTracko - Full-Stack Expense Tracker
A production-ready, minimal full-stack application to record and review personal expenses. Built with FastAPI (Python) and React (Vite), focusing on reliability, data correctness, and network resilience.

🏗️ System Architecture
The application follows a clean Client-Server architecture. To ensure production-like quality, we implemented Idempotency to handle network retries and duplicate submissions.

High-Level Design (HLD)
Code snippet
sequenceDiagram
    participant User
    participant Frontend (React)
    participant Backend (FastAPI)
    participant Database (JSON File)

    User->>Frontend: Fill Expense Form & Submit
    Frontend->>Frontend: Generate idempotency_key (UUID)
    Frontend->>Backend: POST /expenses (with key)
    
    Backend->>Database: Read current records
    alt Key already exists
        Backend-->>Frontend: Return existing record (Prevent Duplicate)
    else Key is new
        Backend->>Database: Append new record + created_at
        Backend->>Database: Save JSON
        Backend-->>Frontend: 201 Created Success
    end
    
    Frontend->>User: Update UI Table & Total Spent
✨ Features
Reliable Data Entry: Prevents duplicate entries using idempotency_key (important for flaky networks).

Live Filtering: Filter expenses by category (Food, Travel, Rent, etc.) without page reloads.

Smart Sorting: Automatically sorts entries by date (Newest First).

Dynamic Calculation: Total spent updates instantly based on the filtered list.

Responsive UI: Clean, modern dashboard built with Tailwind CSS.

🛠️ Tech Stack & Design Decisions
Backend: FastAPI (Python)
Why FastAPI? Fast performance, automatic Swagger documentation, and easy asynchronous support.

Persistence: Used JSON File Storage.

Decision: Chosen for "Zero-Config" portability. Evaluators can run the project without setting up heavy databases like PostgreSQL or Docker.

Money Handling: Used float for simplicity in this time-boxed assignment, but designed the API to be compatible with Decimal types for high-precision financial apps.

Frontend: React + Vite
State Management: React Hooks (useState, useEffect) for lightweight and fast UI updates.

Resilience: Implemented client-side UUID generation for retries. Even if a user clicks "Submit" multiple times or refreshes during a hang, the system remains consistent.

🚀 Getting Started
1. Prerequisites
Python 3.9+

Node.js 18+

2. Backend Setup
Bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn

# Start Server
uvicorn main:app --reload --port 8000
3. Frontend Setup
Bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Dev Server
npm run dev
📝 Trade-offs & Future Scope
Trade-off: Used JSON file storage instead of a relational DB to ensure the project is easy to review and run instantly.

Intentional Omission: User authentication and "Delete/Edit" features were omitted to focus on the core requirements of "Creation" and "Reliability."

Future Work: Integrating a managed database (like Supabase/Postgres) and adding Unit Tests for the API endpoints.