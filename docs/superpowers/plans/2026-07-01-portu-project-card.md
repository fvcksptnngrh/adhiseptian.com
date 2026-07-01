# PorTU Project Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PorTU to the `/projects` page as a private internal client frontend project.

**Architecture:** Keep project data local to `pages/projects.vue`, matching the current page pattern. Update the card renderer so projects with a URL render as external anchors, while PorTU renders as a non-link article with the same visual styling.

**Tech Stack:** Nuxt 2, Vue single-file components, SCSS, Node.js verification command, `npm run build`.

---

## File Structure

- Modify: `pages/projects.vue`
  - Template: render linked cards with `<a>` and private cards with `<article>`.
  - Data: add PorTU as project `07` with no `url`.
  - Styles: keep existing `.project-card` styling and add a private-card arrow state.

## Task 1: Add Private PorTU Project Card

**Files:**
- Modify: `pages/projects.vue:27-48`
- Modify: `pages/projects.vue:103-111`
- Modify: `pages/projects.vue:217-224`

- [ ] **Step 1: Run failing source assertion**

Run:

```powershell
$s = Get-Content -Raw 'pages\projects.vue'; if ($s -notmatch "title: 'PorTU'") { throw 'PorTU project entry missing' }; if ($s -notmatch '<component') { throw 'conditional card renderer missing' }; if ($s -match "(?s)title: 'PorTU'.*?url:") { throw 'PorTU must not define a url' }; 'PorTU source check passed'
```

Expected: FAIL with `PorTU project entry missing`.

- [ ] **Step 2: Update card rendering**

Replace the current card loop in `pages/projects.vue` with:

```vue
<component
  :is="project.url ? 'a' : 'article'"
  v-for="(project, index) in filteredProjects"
  :key="project.id"
  :href="project.url || null"
  :target="project.url ? '_blank' : null"
  :rel="project.url ? 'noopener noreferrer' : null"
  :class="['project-card', !project.url ? 'project-card--private' : '']"
  data-aos="fade-up"
  :data-aos-delay="(index % 3) * 60"
>
  <div class="project-card__top">
    <span class="project-card__num">{{ project.number }}</span>
    <svg class="project-card__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path v-if="project.url" d="M7 17L17 7M17 7H7M17 7V17"/>
      <path v-else d="M5 12H19"/>
    </svg>
  </div>
  <h3 class="project-card__title">{{ project.title }}</h3>
  <p class="project-card__role">{{ project.role }}</p>
  <div class="project-card__tags">
    <span v-for="t in project.tech" :key="t" class="tag">{{ t }}</span>
  </div>
</component>
```

- [ ] **Step 3: Add PorTU project data**

Append this object after the Creative Portfolio Hub entry:

```js
{
  id: 7, number: '07',
  title: 'PorTU',
  role: 'Frontend Developer',
  category: 'Frontend',
  tech: ['React.js', 'JavaScript', 'Tailwind CSS', 'API Integration', 'Private Client Project']
}
```

- [ ] **Step 4: Add private-card hover styling**

Update the existing `.project-card` hover block so linked cards still animate the external arrow, while private cards keep the neutral line icon steady:

```scss
&:hover {
  border-color: var(--accent-cyan);
  transform: translateY(-2px);

  &:not(.project-card--private) {
    .project-card__arrow {
      transform: translate(2px, -2px);
    }
  }
}

&--private {
  cursor: default;
}
```

- [ ] **Step 5: Run source assertion again**

Run:

```powershell
$s = Get-Content -Raw 'pages\projects.vue'; if ($s -notmatch "title: 'PorTU'") { throw 'PorTU project entry missing' }; if ($s -notmatch '<component') { throw 'conditional card renderer missing' }; if ($s -match "(?s)title: 'PorTU'.*?url:") { throw 'PorTU must not define a url' }; 'PorTU source check passed'
```

Expected: PASS with `PorTU source check passed`.

- [ ] **Step 6: Run production build**

Run:

```powershell
npm run build
```

Expected: exit code `0`.

- [ ] **Step 7: Review diff**

Run:

```powershell
git diff -- pages/projects.vue
```

Expected: diff only changes the `/projects` page card renderer, PorTU data entry, and private-card styling.

## Self-Review

- Spec coverage: the plan adds PorTU to `/projects`, keeps it out of homepage and `PortfolioGrid`, uses Frontend category, and omits a URL.
- Placeholder scan: no placeholder terms or deferred implementation remain.
- Type consistency: `project.url` is the only optional field introduced, and the template branches on that exact property.
