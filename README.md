# BatchWise

A campus discussion and placement platform for students, alumni and the Training & Placement cell. React + React Router + plain CSS, no backend — all state lives in React Context and persists to `localStorage`.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm test         # logic assertions + renders every route
```

## Demo logins

The login screen has one-click buttons for these. Passwords are in `src/data/Users.js`.

| Role | Email | Password | Lands on |
| --- | --- | --- | --- |
| Student | `ved.hule@dypcoe.edu` | `ved123` | Feed |
| Alumni | `rohan.j@dycoe.edu` | `rohan123` | Feed |
| TnP / Faculty | `amit.kulkarni@dycoe.edu` | `tnp123` | TnP dashboard |

## What's in it

**Feed** — Hot / New / Top sorting (hot decays votes against age), filters by batch, community, company and post type, pinned posts float to the top.

**Posts** — real upvote *and* downvote (one vote per user, switching sides moves the vote), threaded comments one level deep with their own voting, collapse, delete-your-own, bookmark, delete-your-own-post.

**Communities & companies** — join/leave, per-community feeds with their own sorting, company pages tabbed by interview experiences / discussions / announcements, all counts computed from real posts.

**Search** — posts, people, communities, companies and resources, with per-type tabs. Every result is clickable.

**Profiles** — `/profile` for you, `/profile/:id` for anyone; posts, karma, saved posts and an about tab.

**Chat** — pick anyone in the directory and actually send messages; threads persist.

**TnP dashboard** — drives per department, active/completed filter, placement stats, add and remove drives, record placed students.

**Everywhere** — dark mode (follows the OS on first visit, then remembers), mobile drawer navigation, keyboard focus rings, empty states, 404 route.

## Project structure

```text
src/
├── components/       Navbar, LeftSidebar, PostCard, VoteBar, Comment, FloatingActionButton, Layout
├── pages/            Home, PostDetail, Communities, CommunityDetail, Companies, CompanyDetail,
│                     Resources, Search, Bookmarks, Announcements, ChatDefault, CreatePost,
│                     Profile, Setting, Login
│   └── tnp/          TnpDashboard, JobCard, AddJobModal
├── context/          AuthContext (session), AppContext (content + actions)
├── data/             Users.js (the single user directory), Mockdata.js (content), Jobs.js
├── styles/           Styles.css (tokens + base), Shell.css (layout + components),
│                     ChatDefault.css, Announcements.css, Tnp.css
├── theme.js          light/dark
├── utils.js          timeAgo / formatDate / compact, via Intl
├── logic.test.mjs    voting + ranking assertions
└── routes.test.mjs   SSR-renders every route
```

## State & persistence

`AuthContext` stores only the logged-in user's **id** in `localStorage` and re-resolves it against the directory on load. `AppContext` persists posts, bookmarks, joined communities and read announcements under keys namespaced per user (`batchwise:<id>:*`), so two accounts on one machine don't share state. Settings → *Reset demo data* clears them.

## Theming

All colour lives in CSS custom properties on `:root` in `src/styles/Styles.css`, restated once under `[data-theme="dark"]`. To restyle the app, change the tokens — not the rules.

## Known limitations

- No backend: data is per-browser, and "sending" a chat message doesn't reach anyone.
- Passwords are plaintext in the seed data. This is a prototype, not an auth system.
- No pagination — every post renders at once.
- No markdown or image uploads in posts; line breaks are preserved, nothing else.
- Comment nesting is capped at one level by design.
