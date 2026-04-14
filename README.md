# StandardFlow

StandardFlow is a full-stack lesson planning platform built for educators to organize **units, lessons, standards, and weekly plans** in one structured workflow.

It allows teachers to:
- Create and manage instructional units
- Align lessons to academic standards (Common Core & CPALMS)
- Drag and drop lessons into a weekly planner
- View lesson objectives and standard alignment
- Generate structured planning workflows

Built as a production-style SaaS architecture using modern full-stack patterns.

## Tech Stack

- **Frontend:** TypeScript, Next.js (App Router), React, CSS Modules
- **Backend:** Next.js Route Handlers, MongoDB, Mongoose, Custom service layer architecture

**Architecture Highlights:**
- Domain-based modular structure (lessons, units, planner, standards)
- Service layer abstraction (business logic separated from API handlers)
- RESTful API design
- Middleware-based authentication
- Typed models and validation utilities

## Architecture Overview

StandardFlow is structured using a domain-driven modular approach: 

app/
  api/
    lessons/
    planner/
    standards/
    units/

components/
  lessons/
  planner/
  standards/
  units/

services/
  lessonService.ts
  plannerService.ts
  standardService.ts
  unitService.ts

models/
  Lesson.ts
  PlannerEntry.ts
  Standard.ts
  Unit.ts 

**Design Decisions**
- **Separation of concerns**
    - Route handlers manage HTTP requests
    - Services contain business logic
    - Models define database schema
    - Components handle presentation

- **Scalable structure** 
    - Feature-based component organization
    - Clear domain boundaries
    - Reusable service layer

- **Production thinking**
    - Error normalization
    - Centralized DB connection utility
    - Middleware authentication flow
 
```
├── 📜 README.md
├── 📁 app
│ ├── 📁 api
│ │ ├── 📁 auth
│ │ │ ├── 📁 login
│ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 📁 logout
│ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 🟨 route.ts
│ │ │ ├── 📁 signup
│ │ │ │ ├── 🟨 route.ts
│ │ ├── 📁 lessons
│ │ │ ├── 📁 [id]
│ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 🟨 route.ts
│ │ ├── 📁 planner
│ │ │ ├── 📁 all
│ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 📁 date
│ │ │ │ ├── 📁 [date]
│ │ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 📁 entry
│ │ │ │ ├── 📁 [id]
│ │ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 📁 user
│ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 📁 week
│ │ │ │ ├── 🟨 route.ts
│ │ │ │ ├── 📁 unit
│ │ │ │ │ ├── 📁 [id]
│ │ │ │ │ │ ├── 🟨 route.ts
│ │ ├── 📁 standards
│ │ │ ├── 📁 [id]
│ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 🟨 route.ts
│ │ ├── 📁 test
│ │ │ ├── 🟨 route.ts
│ │ ├── 📁 units
│ │ │ ├── 📁 [id]
│ │ │ │ ├── 📁 lessons
│ │ │ │ │ ├── 🟨 route.ts
│ │ │ │ ├── 🟨 route.ts
│ │ │ ├── 🟨 route.ts
│ ├── 📄 favicon.ico
│ ├── 🟦 layout.tsx
│ ├── 📁 lessons
│ │ ├── 📁 [id]
│ │ │ ├── 🟦 page.tsx
│ │ ├── 🟦 page.tsx
│ ├── 📁 login
│ │ ├── 🟦 page.tsx
│ ├── 🟦 page.tsx
│ ├── 📁 planner
│ │ ├── 📁 week
│ │ │ ├── 🟦 page.tsx
│ ├── 🟦 providers.tsx
│ ├── 📁 signup
│ │ ├── 🟦 page.tsx
│ ├── 📁 standards
│ │ ├── 📁 [id]
│ │ │ ├── 🟦 page.tsx
│ │ ├── 🟦 page.tsx
│ ├── 📁 units
│ │ ├── 📁 [id]
│ │ │ ├── 🟦 page.tsx
│ │ ├── 🟦 page.tsx
├── 📁 components
│ ├── 📁 auth
│ │ ├── 🟦 LoginForm.tsx
│ │ ├── 🟦 SignupForm.tsx
│ ├── 📁 common
│ │ ├── 🟦 Button.tsx
│ │ ├── 🟦 LoadingSpinner.tsx
│ │ ├── 🟦 Modal.tsx
│ ├── 📁 layout
│ │ ├── 🟦 Navbar.tsx
│ │ ├── 🟦 Sidebar.tsx
│ ├── 📁 lessons
│ │ ├── 🟦 AddLessonForm.tsx
│ │ ├── 🟦 LessonCard.tsx
│ │ ├── 🟦 LessonList.tsx
│ │ ├── 🟦 LessonObjectives.tsx
│ ├── 📁 planner
│ │ ├── 🟦 DayColumn.tsx
│ │ ├── 🟦 LessonDraggable.tsx
│ │ ├── 🟦 WeeklyPlanner.tsx
│ ├── 📁 standards
│ │ ├── 🟦 AddStandardForm.tsx
│ │ ├── 🟦 StandardCard.tsx
│ │ ├── 🟦 StandardList.tsx
│ ├── 📁 units
│ │ ├── 🟦 UnitCard.tsx
│ │ ├── 🟦 UnitLessonManager.tsx
│ │ ├── 🟦 UnitList.tsx
├── 📁 context
│ ├── 🟦 AuthContext.tsx
├── 📄 eslint.config.mjs
├── 🟨 global.d.ts
├── 📁 lib
│ ├── 🟨 auth.ts
│ ├── 🟨 db.ts
│ ├── 🟨 mongodb.ts
│ ├── 🟨 pdf.ts
├── 🟨 middleware.ts
├── 📁 models
│ ├── 🟨 Lesson.ts
│ ├── 🟨 PlannerEntry.ts
│ ├── 🟨 Standard.js
│ ├── 🟨 Standard.ts
│ ├── 🟨 Unit.ts
│ ├── 🟨 UnitLesson.ts
│ ├── 🟨 Users.ts
├── 🟨 next-env.d.ts
├── 🟨 next.config.ts
├── 🗂️ package-lock.json
├── 🗂️ package.json
├── 📄 postcss.config.mjs
├── 📁 public
│ ├── 🖼️ file.svg
│ ├── 🖼️ globe.svg
│ ├── 🖼️ next.svg
│ ├── 🖼️ vercel.svg
│ ├── 🖼️ window.svg
├── 📁 scripts
│ ├── 🟨 seedStandards.js
│ ├── 🟨 seedStandards.ts
├── 📁 services
│ ├── 🟨 authService.edge.ts
│ ├── 🟨 authService.node.ts
│ ├── 🟨 authService.ts
│ ├── 🟨 lessonClientService.ts
│ ├── 🟨 lessonService.ts
│ ├── 🟨 plannerClientService.ts
│ ├── 🟨 plannerService.ts
│ ├── 🟨 standardClientService.ts
│ ├── 🟨 standardService.ts
│ ├── 🟨 unitClientService.ts
│ ├── 🟨 unitLessonService.ts
│ ├── 🟨 unitService.ts
├── 📁 styles
│ ├── 🎨 globals.css
│ ├── 🎨 planner.css
├── 🗂️ tsconfig.json
├── 📁 utils
│ ├── 🟨 apiErrors.ts
│ ├── 🟨 constants.ts
│ ├── 🟨 date.ts
│ ├── 🟨 validators.ts

```
## Core Features

**Units**
- Create and manage instructional units
- Attach lessons to units
- View unit-specific lessons lists

**Lessons**
- Define lesson objectives
- Align lessons to academic standards
- Reusable lesson objects

**Standards**
- Create and manage academic standards
- Connect standards to lessons

**Weekly Planner**
- Drag-and-drop weekly planning interface
- Assign lessons to specific days
- Filter planner by week, date, or unit

## Authentication

Authentication is handled through a custom auth service layer and Next.js middleware.
- Protected API routes
- User-scoped planner data
- Server-side validation before database operations

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/triscravello/standardflow.git
cd standardflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment variables
Create a .env.local file:

MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret


### 4. Run the development server
```bash
npm run dev
```

App runs at: http://localhost:3000

## API Structure
Example routes: 

GET    /api/lessons
POST   /api/lessons
GET    /api/lessons/:id

GET    /api/planner/week
GET    /api/planner/date/:date
POST   /api/planner/entry

Business logic is handled inside service files rather than route handlers to keep controllers thin and maintainable. 

## Considerations

- Designed with future scaling in mind
- Clear domain boundaries for maintainability
- Easy to extend with role-based access, caching layer (Redis), PDF export generation, analytics dashboard, and SaaS muti-tenant support

## Roadmap

- Role-based permissions
- Lesson duplication & templates
- Planner export to PDF
- Analytics dashboard
- Classroom collaboration support

## Why I Built This

StandardFlow was built to demonstrate:
- Full-stack architecture skills
- Clean separation of concerns
- RESTful API design
- Scalable folder structure

This project reflections my transition from bootcamp grad to production-minded full-stack developer.

## Author

Tristan Cravello
Full-Stack Developer
LinkedIn: [https://www.linkedin.com/in/tristan-cravello-3b6500146/]
Portfolio: [https://triscravello.github.io/tristan-portfolio-site/]
