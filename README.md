# Bachelors Portal Netherlands

A dedicated preparation platform for international students pursuing a Bachelor's degree at a Dutch university.

The portal handles the complete student journey — from registration and interview practice booking, through IND and embassy preparation, to final travel readiness. Built as a frontend-only application with a full administrative interface for managing the entire student pipeline.

---

## Overview

Studying in the Netherlands involves a specific sequence of interviews and document requirements that most international students navigate for the first time. This portal provides structured preparation across every stage:

- **University Admission** — practice interviews for Dutch academic institutions
- **IND Application** — preparation for the Immigratie en Naturalisatiedienst residence permit interview
- **Embassy Interview** — final MVV appointment preparation
- **Document Tracking** — comprehensive checklist across all application stages
- **Study Updates** — editorial content on visa policies, university news, and student life

Each student receives a personalised portal with scheduled interviews, published results, detailed scorecards, and progress tracking throughout the entire application lifecycle.

---

## Live Demo

Once deployed, the portal is available at your chosen domain. The site includes:

- Student registration and login
- Full authenticated dashboard
- Interview booking system
- Results and detailed scorecards
- Document preparation tracker
- Study updates and editorial content
- Notification centre
- Profile and settings

---

## Technology Stack

Built with modern, stable web technologies chosen for reliability and maintainability rather than novelty.

| Layer | Technology | Purpose |
|------|-----------|---------|
| Framework | React 18 | Component-based UI |
| Build tool | Vite 5 | Fast development and optimised production builds |
| Routing | React Router 6 | Client-side navigation |
| Styling | SCSS + Bootstrap 5 | Structured styling with utility support |
| Typography | Poppins (sans-serif), Georgia (serif) | Editorial design language |
| Icons | Boxicons | Consistent iconography |
| Email delivery | EmailJS | Transactional emails without a backend |
| Data persistence | LocalStorage + JSON | Client-side state with static seed data |

No backend server. No database. All data lives in JSON files served as static assets, with client-side state managed through the browser's LocalStorage.

---

## Design Philosophy

The interface is intentionally editorial rather than dashboard-driven. Design decisions were made against a specific set of anti-patterns:

**Avoided throughout:**
- Generic SaaS card grids
- Excessive gradients and glassmorphism
- Emoji-driven UI
- Fake statistics used purely as decoration
- Dark mode toggles
- Meaningless animation

**Chosen deliberately:**
- Georgia serif for headings, echoing academic publishing traditions
- Numbered progressions (01, 02, 03) rather than icon chips
- Warm cream `#faf8f3` for elevated surfaces suggesting document paper
- Netherlands blue `#1a3a6b` and amber `#e8820c` as the primary palette
- Sharp 2px corners rather than pill-shaped rounded elements
- Real editorial photography with proper captions where relevant

The result is a portal that feels closer to a professional publication than a generic web application.

---

## Project Structure
bachelors-portal-netherlands/
├── public/
│ ├── data/ # JSON data served at runtime
│ │ ├── users.json
│ │ ├── interviews.json
│ │ ├── results.json
│ │ ├── scorecards.json
│ │ ├── blogs.json
│ │ └── ...
│ └── favicon.svg
├── src/
│ ├── assets/
│ │ └── scss/ # Global styles and design tokens
│ ├── components/ # Shared components (Modal, PortalDropdown, states)
│ ├── context/ # Auth context
│ ├── data/ # Fallback seed data
│ ├── hooks/ # Custom React hooks
│ ├── layouts/
│ │ └── AppShell/ # Sidebar + header + main layout
│ ├── pages/
│ │ ├── Register/ # Multi-step registration
│ │ ├── Login/ # Sign in with welcome animation
│ │ ├── Dashboard/ # Student command centre
│ │ ├── BookInterview/ # Interview booking wizards
│ │ ├── UpcomingInterviews/
│ │ ├── Results/
│ │ ├── Scorecard/
│ │ ├── Documents/
│ │ ├── StudyUpdates/
│ │ ├── Notifications/
│ │ ├── Profile/
│ │ ├── Settings/
│ │ └── DevTools/ # Admin interface (passphrase-protected)
│ ├── services/
│ │ ├── storageService.js # LocalStorage abstraction
│ │ ├── dataService.js # Data operations
│ │ ├── adminService.js # Admin CRUD operations
│ │ ├── emailService.js # EmailJS integration
│ │ └── remoteDataService.js # Fetches JSON on first load
│ ├── utils/
│ │ ├── imageUpload.js # Base64 image compression
│ │ └── imageUrl.js # URL normalisation
│ ├── App.jsx
│ └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── .env.example

text


---

## Getting Started

### Prerequisites

- Node.js 22 LTS or later
- npm 10 or later

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/bachelors-portal-netherlands.git
cd bachelors-portal-netherlands
Install dependencies:

Bash

npm install
Create your environment file:

Bash

cp .env.example .env
Open .env and add your configuration (see the Configuration section below).

Start the development server:

Bash

npm run dev
The portal will be available at http://localhost:5173.

Production Build
To create an optimised production build:

Bash

npm run build
The compiled output appears in dist/ and can be deployed to any static host.

To preview the production build locally:

Bash

npm run preview
Configuration
All configuration is handled through environment variables in .env:

EmailJS Integration
The portal uses EmailJS to send registration requests and interview bookings to the administrator. Only two templates are needed.

env

VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_REGISTRATION_TEMPLATE=your_registration_template_id
VITE_EMAILJS_INTERVIEW_TEMPLATE=your_interview_template_id
See EMAILJS_SETUP.md for complete template setup instructions. If EmailJS is not configured, submissions are queued locally and retried automatically when configuration becomes available.

Developer Tools Access
The admin interface at /dev-tools is protected by a passphrase. Set it in your .env file:

env

VITE_DEV_TOOLS_PASSPHRASE=your_secret_passphrase
If this variable is not set, the developer tools are completely disabled.

Remote Data Source (Optional)
By default, the portal fetches JSON data from /data/ inside the deployed site. To source data from an external URL (such as a GitHub raw endpoint), override this:

env

VITE_REMOTE_DATA_URL=https://raw.githubusercontent.com/username/repo/main/data
Leave blank to use the standard public/data/ folder.

Data Model
The portal operates on eleven collections stored as JSON files:

Collection	Purpose
users.json	Student accounts with credentials and identity information
interviews.json	Scheduled practice interviews with Google Meet links
interviewRequests.json	Pending interview booking requests
registrationRequests.json	New account applications awaiting approval
results.json	Interview results with scores and feedback
scorecards.json	Detailed performance scorecards with dynamic criteria
notifications.json	User-facing portal notifications
documents.json	Document catalogue and per-user preparation status
blogs.json	Editorial articles on Netherlands study topics
universities.json	Dutch university reference data
settings.json	Default user preferences
Each file follows a consistent structure with a dataVersion field for future schema migrations.

Administrative Interface
A comprehensive administrative interface is available at /dev-tools for managing every aspect of the portal.

Available management sections
Users — Create, edit, view credentials, suspend, and activate student accounts. New accounts receive auto-generated usernames and passwords ready to share with students.

Requests — Two tabs for the two request types:

Registration requests submitted by prospective students
Interview booking requests from existing students
Approving a registration request instantly creates an active account. Approving an interview request opens the scheduling form.

Interviews — Schedule new practice interviews or manage existing ones. Each interview requires a Google Meet link (created separately at meet.google.com), a date, time, duration, interviewer name, and optional instructions. Students are automatically notified when interviews are scheduled.

Results — Create interview results with scores, feedback, and recommendations. Results can be saved as drafts (hidden from students) or published (visible with automatic notification). Grades are computed automatically from percentage scores.

Scorecards — Build detailed performance reports with fully dynamic criteria. Add any number of assessment criteria per scorecard, each with individual scores, maximum values, and feedback. Include recognised strengths, areas for growth, and overall panel comments.

Notifications — Send custom notifications to any user or group of users. Notifications appear in the student's notification centre with optional action links.

Documents — Read-only overview of every student's document preparation progress across all stages.

Data Management — Publish changes to production by downloading the complete JSON bundle. Also supports full backups, imports from previous backups, and safe collection resets.

Publishing workflow
When you make administrative changes, they exist only in your browser's LocalStorage. To publish them so all users can see:

Open Developer Tools at /dev-tools
Navigate to the Data section
Click Download publish bundle — eleven JSON files download to your computer
Copy the downloaded files into your project's public/data/ folder
Commit and push to your Git repository
Your hosting provider redeploys automatically
All visitors see the update on their next page load
Administrative work is preserved across page refreshes. The remote seed only runs on first visit to a browser, ensuring no accidental data loss.

Deployment
The portal is designed for deployment to any static hosting provider. Recommended:

Netlify — Automatic deploys from GitHub, generous free tier
Vercel — Similar workflow, excellent performance
Cloudflare Pages — Fast global CDN
General deployment process
Push your repository to GitHub
Connect your hosting provider to the repository
Configure build settings:
Build command: npm run build
Publish directory: dist
Add environment variables in the hosting provider's dashboard (same variables as .env)
Deploy
Client-side routing is handled through a rewrite rule directing all requests to index.html. Most modern hosts detect Vite projects and configure this automatically.

Development Approach
The application was built in strict phases, with each phase tested and locked before proceeding to the next. This structured approach kept the codebase manageable and prevented interdependent breakage.

Phase summary
Phase	Focus
4	Registration system
5	Authentication and sessions
6	Application shell (sidebar, header, mobile navigation)
7	Student dashboard
8	Interview booking (three wizards for University, IND, Embassy)
9	EmailJS integration with retry queue
10	Upcoming interviews with live countdown
11	Results with visibility controls
12	Detailed scorecards with dynamic criteria
13	Interactive document checklist
14	Study updates and editorial content
15	Notification centre
16	Student profile
17	User settings
18	Loading, error, empty, and success states
19	Popups and contextual guidance
20	Comprehensive responsive design
22	Accessibility improvements
23	Administrative interface
24	Remote data system with publish workflow
Limitations
Being a frontend-only application, certain constraints are inherent to the architecture:

User-generated data (registrations, interview requests) exists only in the submitting user's browser. EmailJS notifications alert the administrator, who then adds the user manually through the admin interface.
LocalStorage is not real authentication or authorisation. The admin passphrase gate is convenience, not security.
Data changes require a manual publish step (download JSON, commit to repository, redeploy).
The application does not support real-time collaboration between users.
For production deployment at scale, integration with a real backend (Supabase, Firebase, or a custom API) would address these constraints while allowing most of the existing frontend code to remain unchanged.

Design Credits
The visual language draws inspiration from Dutch design traditions — clarity, restraint, and functional beauty. Colour choices reference the Dutch national palette without literal use. Editorial photography sources are attributed where relevant within the interface.

Fonts used:

Poppins — Google Fonts, Open Font License
Georgia — System serif fallback
Icons via Boxicons — MIT License.

License
This project is provided as-is for educational and portfolio purposes.

Contact
For questions, suggestions, or collaboration inquiries, open an issue in this repository or reach out through the channels listed in the project owner's GitHub profile.

