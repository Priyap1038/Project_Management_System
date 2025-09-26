# Project_Management_System

A simplified multi-tenant **Project Management System** built with **Django + GraphQL** backend and **React + TypeScript + TailwindCSS** frontend.  
Supports project/task management, comments, and basic statistics with organization-based isolation.

---

## **Table of Contents**

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Setup Instructions](#setup-instructions)  
  - [Backend](#backend)  
  - [Frontend](#frontend)  
- [API Usage](#api-usage)  
  - [GraphQL Queries](#graphql-queries)  
  - [GraphQL Mutations](#graphql-mutations)  
- [Project Structure](#project-structure)  
- [Future Improvements](#future-improvements)  

---

## **Features**

- Multi-tenant support (organization-based data isolation)  
- CRUD operations for Projects and Tasks  
- Task comments  
- Basic project statistics (task counts, completion rates)  
- Responsive frontend with modern UI (TailwindCSS)  
- GraphQL queries and mutations  

---

## **Tech Stack**

- **Backend:** Django 4.x, Graphene-Django, PostgreSQL  
- **Frontend:** React 18+, TypeScript, TailwindCSS  
- **Database:** PostgreSQL (local setup)  

---

## **Setup Instructions**

### **1. Backend Setup**

1. Clone the repo and navigate to the backend folder:
   ```bash
   git clone <repo_url>
   cd mini-pm/backend
Create a virtual environment and activate:

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux / Mac
source .venv/bin/activate
Install dependencies:

```bash
pip install -r requirements.txt
Configure .env file:

```env
POSTGRES_DB=pm_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DJANGO_SECRET=mysecretkey
Apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
Create superuser (for admin access):

```bash
python manage.py createsuperuser
Run the backend server:

```bash
python manage.py runserver
GraphQL endpoint available at:

```arduino
http://127.0.0.1:8000/graphql/
2. Frontend Setup
Navigate to frontend folder:

```bash
cd ../frontend
Install dependencies:

```bash
npm install
If using Windows and facing node_modules issues, run:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
Start the frontend server:

```bash
npm start
Frontend will be available at:

arduino
http://localhost:3000
API Usage
GraphQL Queries
List all projects for an organization:

graphql

query {
  projectsForOrg {
    id
    name
    description
    status
    taskCount
    completedTasks
  }
}
List tasks for a project:

graphql

query {
  tasksForProject(projectId: "1") {
    id
    title
    description
    status
    assigneeEmail
  }
}
Get project statistics:

graphql

query {
  projectStats(projectId: "1") {
    total
    done
    completionRate
  }
}
GraphQL Mutations
Create a project:

graphql

mutation {
  createProject(name: "New Project", description: "Project description") {
    project {
      id
      name
    }
  }
}
Create a task:

graphql

mutation {
  createTask(projectId: "1", title: "New Task", description: "Task description") {
    task {
      id
      title
    }
  }
}
Add a comment to a task:

graphql

mutation {
  addTaskComment(taskId: "1", content: "Great job!", authorEmail: "user@example.com") {
    comment {
      id
      content
      authorEmail
    }
  }
}



Project Structure

bash

mini-pm/
├─ backend/
│  ├─ pm_backend/          # Django project
│  ├─ projects/            # App containing models, schema, middleware
│  ├─ .env                 # Environment variables
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  │  ├─ components/       # React components
│  │  ├─ App.tsx
│  │  └─ apolloClient.ts
│  ├─ package.json
│  └─ tailwind.config.js
└─ README.md
Future Improvements
Real-time updates using GraphQL subscriptions or WebSockets

Advanced filtering and search for projects/tasks

Task drag-and-drop UI

Comprehensive unit and integration tests

Docker containerization for easier deployment

CI/CD setup and automated testing

Author
Priya P – Full Stack Developer
