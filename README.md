<!-- BACHELORS PORTAL NETHERLANDS · dutch blue #1a3a6b / amber #e8820c · editorial aesthetic · widgets verified 2026-09-12 -->

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:1a3a6b,100:e8820c&height=195&section=header&text=BACHELORS%20PORTAL%20NL&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=36&desc=admission%20%C2%B7%20ind%20%C2%B7%20embassy%20%E2%80%94%20the%20complete%20student%20journey&descSize=16&descAlignY=60" alt="Bachelors Portal NL" />

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=18&duration=2600&pause=900&color=E8820C&center=true&vCenter=true&width=760&height=95&lines=university+%E2%86%92+ind+%E2%86%92+embassy+%E2%80%94+the+full+journey;booking+%C2%B7+scorecards+%C2%B7+documents+%C2%B7+updates;frontend-only+%C2%B7+json+data+%C2%B7+emailjs" alt="typing" />

<p>
  <img src="https://img.shields.io/badge/react-18-0d1117?style=for-the-badge&logo=react&logoColor=61dafb" alt="react" />
  <img src="https://img.shields.io/badge/vite-5-0d1117?style=for-the-badge&logo=vite&logoColor=bd34fe" alt="vite" />
  <img src="https://img.shields.io/badge/router-6-0d1117?style=for-the-badge&logo=reactrouter&logoColor=ca4245" alt="router" />
  <img src="https://img.shields.io/badge/scss%20%2B%20bootstrap-5-0d1117?style=for-the-badge&logo=sass&logoColor=cc6699" alt="styling" />
  <img src="https://img.shields.io/badge/emailjs-x3%20accounts-e8820c?style=for-the-badge&logoColor=white" alt="emailjs" />
  <img src="https://img.shields.io/badge/backend-none-1a3a6b?style=for-the-badge&logoColor=white" alt="no backend" />
</p>

</div>

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:1a3a6b,50:e8820c,100:1a3a6b&height=3" alt="" />

## ▍$ cat brief.txt

A dedicated preparation platform for international students pursuing a **Bachelor's
degree at a Dutch university**. The portal shepherds each student through the entire
pipeline — registration and interview practice, IND and embassy preparation, document
readiness, final travel checks — with a personalised dashboard and a full administrative
back-office. **Frontend-only** by architecture: JSON data layer, LocalStorage state,
EmailJS for all transactional mail (spread across three accounts for volume headroom).

```yaml
audience  : international applicants to NL universities
scope     : student portal + protected admin interface (/dev-tools)
data      : 11 json collections · localstorage · versioned (dataVersion)
mail      : emailjs — registration + interview templates
deploy    : any static host (netlify · vercel · cloudflare pages)
```

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:1a3a6b,50:e8820c,100:1a3a6b&height=3" alt="" />

## ▍$ cat journey.map — the student pipeline

```
01 ▸  UNIVERSITY ADMISSION   practice interviews for dutch academic institutions
02 ▸  IND APPLICATION        residence-permit interview preparation (immigratie & naturalisatiedienst)
03 ▸  EMBASSY INTERVIEW      final mvv appointment readiness
04 ▸  DOCUMENT TRACKING      live checklist across every application stage
05 ▸  STUDY UPDATES          editorial feed — visa policy, university news, student life
```

Each student gets a personal portal: scheduled interviews, published results,
detailed scorecards, notifications, and progress tracking across the whole lifecycle.

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:1a3a6b,50:e8820c,100:1a3a6b&height=3" alt="" />

## ▍$ ls features/

| STUDENT SIDE | ADMIN SIDE (`/dev-tools`, passphrase-gated) |
|---|---|
| ▸ multi-step registration + login ▸ authenticated dashboard ▸ 3 booking wizards ▸ results + scorecards ▸ document checklist ▸ notification centre ▸ profile + settings | ▸ users — create / suspend / activate ▸ requests — approve registrations + bookings ▸ interviews — schedule w/ google meet links ▸ results — draft → publish + auto grades ▸ scorecards — fully dynamic criteria ▸ notifications — targeted sends ▸ data — publish bundles, backups, resets |

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:1a3a6b,50:e8820c,100:1a3a6b&height=3" alt="" />

## ▍$ cat design.manifesto

An **editorial** interface, not a dashboard clone. Decisions made against a
deliberate anti-pattern list:

<table>
<tr><th>AVOIDED</th><th>CHOSEN</th></tr>
<tr><td valign="top">

▸ generic saas card grids
▸ gradients + glassmorphism
▸ emoji-driven ui
▸ decorative fake statistics
▸ dark mode toggles
▸ meaningless animation

</td><td valign="top">

▸ **Georgia serif** headings — academic publishing
▸ **numbered progressions** (01, 02, 03) over icon chips
▸ warm cream `#faf8f3` — document-paper surfaces
▸ **Netherlands blue `#1a3a6b` + amber `#e8820c`**
▸ sharp **2px corners** — no pill shapes
▸ real photography with captions, where relevant

</td></tr>
</table>

The result reads like a professional publication, not a web app template.

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:1a3a6b,50:e8820c,100:1a3a6b&height=3" alt="" />

## ▍$ cat stack.json

<div align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,sass,bootstrap,js,html,css&perline=9" alt="stack" />
</div>

<br/>

| LAYER | TECH | PURPOSE |
|---|---|---|
| framework | React 18 | component-based ui |
| build | Vite 5 | fast dev, optimized bundles |
| routing | React Router 6 | client-side navigation |
| styling | SCSS + Bootstrap 5 | design tokens + utilities |
| type | Poppins · Georgia | editorial voice |
| icons | Boxicons | consistent iconography |
| mail | EmailJS (×3) | transactional email, no server |
| data | LocalStorage + JSON | client state over seed data |

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:1a3a6b,50:e8820c,100:1a3a6b&height=3" alt="" />

## ▍$ ./setup.sh

```bash
# requires node 22 lts · npm 10+
git clone https://github.com/mhjahed/bachelors-studyportal-nl.git
cd bachelors-studyportal-nl

npm install
cp .env.example .env        # fill in below, then:
npm run dev                 # → http://localhost:5173
npm run build               # → dist/  (deploy to any static host)
```

**`.env`** — everything is environment-driven:

```env
# emailjs — registration + interview templates
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_REGISTRATION_TEMPLATE=
VITE_EMAILJS_INTERVIEW_TEMPLATE=

# admin interface — disabled entirely if unset
VITE_DEV_TOOLS_PASSPHRASE=

# optional external data source (default: /data inside the site)
# VITE_REMOTE_DATA_URL=https://raw.githubusercontent.com/<user>/<repo>/main/data
```

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:1a3a6b,50:e8820c,100:1a3a6b&height=3" alt="" />

## ▍$ ls public/data/     — 11 collections

| COLLECTION | HOLDS |
|---|---|
| `users.json` | student accounts, credentials, identity |
| `interviews.json` | scheduled practice interviews (+ meet links) |
| `interviewRequests.json` | pending booking requests |
| `registrationRequests.json` | new account applications |
| `results.json` | scores, feedback, draft/published |
| `scorecards.json` | dynamic-criteria performance reports |
| `notifications.json` | user-facing notifications |
| `documents.json` | document catalogue + per-user status |
| `blogs.json` | editorial articles |
| `universities.json` | dutch university reference data |
| `settings.json` | default preferences |

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:1a3a6b,50:e8820c,100:1a3a6b&height=3" alt="" />

## ▍$ cat publish.workflow

Admin edits live in the operator's LocalStorage until deliberately published:

```
/dev-tools → data → "download publish bundle"  (pulls all 11 json files)
            → copy into public/data/
            → git commit && push
            → host redeploys → live for every visitor
```

Local admin work survives refreshes; the remote seed runs once per browser —
no accidental data loss.

## ▍$ tree src/

```
src/
├── assets/scss/        design tokens, global styles
├── components/         modal, dropdowns, state blocks
├── context/            auth context
├── hooks/              custom react hooks
├── layouts/AppShell/   sidebar + header + main
├── pages/              register · login · dashboard · bookinterview
│                       upcoming · results · scorecard · documents
│                       studyupdates · notifications · profile · settings
│                       devtools (admin interface)
├── services/           storage · data · admin · emailjs · remote fetch
└── utils/              image compression · url normalisation
```

<img width="100%" src="https://capsule-render.vercel.app/api?type=rect&color=0:1a3a6b,50:e8820c,100:1a3a6b&height=3" alt="" />

## ▍$ cat honest-limitations.txt

▸ user submissions exist in the submitter's browser — EmailJS alerts the admin, who creates the account manually
▸ LocalStorage is convenience, not security — the passphrase gate is not auth
▸ data changes require the manual publish workflow above
▸ no real-time collaboration between users

*At scale, swap the data layer for supabase / firebase / a custom api — most of the frontend survives unchanged.*

<br/>

<div align="center">

`design language: dutch clarity — restraint, function, beauty` · fonts: poppins (ofl) · georgia · icons: boxicons (mit)
`built end-to-end by` **[MH JAHED](https://github.com/mhjahed)** · `mhjahed@proton.me`

</div>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:e8820c,100:1a3a6b&height=110&section=footer" alt="" />
