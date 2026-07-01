# PorTU Project Card Design

## Context

The portfolio has a dedicated `/projects` page implemented in `pages/projects.vue`. That page owns its own inline project list and renders each project as a card with filter support. The homepage and `PortfolioGrid` component have separate project data and are out of scope for this update.

## Goal

Add PorTU to the `/projects` page as a private internal client project. The card should communicate the work clearly without linking to a private client resource.

## Scope

- Add one new project card to `pages/projects.vue`.
- Keep the change limited to the `/projects` page.
- Do not add PorTU to the homepage featured work or `components/PortfolioGrid.vue`.
- Preserve the existing card layout and filter behavior.

## Project Entry

- Title: `PorTU`
- Number: `07`
- Role: `Frontend Developer`
- Category: `Frontend`
- Tech tags: `React.js`, `JavaScript`, `Tailwind CSS`, `API Integration`, `Private Client Project`
- Link behavior: no external link because the project is for a private internal client team.

## Rendering Behavior

Existing project cards are anchors because all current projects have public URLs. PorTU should avoid a dead or misleading link. The `/projects` card renderer should support both linked and private entries by rendering:

- an anchor when `project.url` exists
- a non-link article/card when `project.url` is absent

Both variants should keep the same visual card style, hover treatment, title, role, and tag layout.

## Testing

Verification should confirm:

- PorTU appears on `/projects`.
- PorTU appears when the `Frontend` filter is active.
- PorTU does not navigate to an empty or fake URL.
- Existing linked projects still open externally.
- The Nuxt build completes successfully.

## Self-Review

- No placeholder fields remain.
- Scope is limited to `/projects`.
- The private-project behavior is explicit.
- The design does not require changes to unrelated project displays.
