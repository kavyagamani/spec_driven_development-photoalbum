---
description: "Task list for the Photo Album Organizer feature"
---

# Tasks: Photo Album Organizer

**Input**: Design documents from `/specs/001-photo-albums/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, Vite setup, and basic repository structure.

- [ ] T001 Create `src/` structure with `index.html`, `main.js`, `styles.css`, `src/sqlite/db.js`, `src/ui/album-grid.js`, `src/ui/album-view.js`, and `src/ui/drag-drop.js`
- [ ] T002 Initialize a Vite project in `package.json` with `vite` and `sql.js` dependencies
- [ ] T003 Configure ESLint and Prettier settings in `.eslintrc.json` and `.prettierrc`
- [ ] T004 Create `tests/unit/` and `tests/integration/` directories and add base test runner configuration
- [ ] T005 Add Vite dev and build scripts to `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared persistence and UI foundations that all stories depend on.

- [ ] T006 Implement the SQLite persistence layer and schema setup in `src/sqlite/db.js`
- [ ] T007 Create album and photo data loading functions in `src/sqlite/db.js`
- [ ] T008 Implement application initialization and state management in `src/main.js`
- [ ] T009 Build base UI scaffolding in `src/index.html` for the album grid and album detail panels
- [ ] T010 Implement shared styles and layout foundation in `src/styles.css`
- [ ] T011 Implement the drag-and-drop support module in `src/ui/drag-drop.js`
- [ ] T012 Create a reusable album rendering API in `src/ui/album-grid.js`
- [ ] T013 Create a reusable album detail view API in `src/ui/album-view.js`
- [ ] T014 Add database validation to ensure albums remain top-level and do not nest in `src/sqlite/db.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - View date-grouped albums (Priority: P1) 🎯 MVP

**Goal**: Render top-level albums grouped by date and verify no album nesting occurs.

**Independent Test**: Confirm the main page displays a flat album collection grouped by date labels with no nested albums.

### Implementation for User Story 1

- [ ] T015 [US1] Load albums from SQLite and provide them to `src/ui/album-grid.js`
- [ ] T016 [US1] Implement date-grouped album display logic in `src/ui/album-grid.js`
- [ ] T017 [US1] Render album cards and date labels on the main page in `src/main.js`
- [ ] T018 [US1] Add validation in `src/main.js` or `src/sqlite/db.js` to reject nested album data
- [ ] T019 [US1] Add supporting styles for album grouping and top-level album containers in `src/styles.css`

### Tests for User Story 1

- [ ] T020 [P] [US1] Write a unit test for flat album grouping and date label rendering in `tests/unit/test_album_grid.js`
- [ ] T021 [P] [US1] Write an integration test for main page album rendering in `tests/integration/test_album_rendering.js`

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Reorganize albums by drag-and-drop (Priority: P2)

**Goal**: Enable users to reorder top-level albums on the main page and persist the new order.

**Independent Test**: Confirm an album can be dragged to a new position and the new order is saved.

### Implementation for User Story 2

- [ ] T022 [US2] Implement drag source and drop target behavior in `src/ui/drag-drop.js`
- [ ] T023 [US2] Hook album reordering into the UI update flow in `src/ui/album-grid.js`
- [ ] T024 [US2] Persist album order changes to SQLite in `src/sqlite/db.js`
- [ ] T025 [US2] Add visual drag-and-drop feedback and ordering indicators in `src/styles.css`

### Tests for User Story 2

- [ ] T026 [P] [US2] Write a unit test for album reorder sorting logic in `tests/unit/test_album_reorder.js`
- [ ] T027 [P] [US2] Write an integration test for drag-and-drop album order changes in `tests/integration/test_album_reorder.js`

**Checkpoint**: User Story 2 should be independently functional with drag-and-drop persistence.

---

## Phase 5: User Story 3 - Preview photos in album tile view (Priority: P2)

**Goal**: Display photos inside an album as a tile preview grid so users can visually scan album contents.

**Independent Test**: Confirm that opening an album shows photo preview tiles that are visually distinguishable.

### Implementation for User Story 3

- [ ] T028 [US3] Implement album detail loading and photo query by `albumId` in `src/sqlite/db.js`
- [ ] T029 [US3] Render photo tile previews in `src/ui/album-view.js`
- [ ] T030 [US3] Add photo tile layout styles and responsive spacing in `src/styles.css`
- [ ] T031 [US3] Ensure the album view clearly distinguishes photo tiles from album cards in `src/ui/album-view.js`

### Tests for User Story 3

- [ ] T032 [P] [US3] Write a unit test for photo tile rendering logic in `tests/unit/test_photo_tiles.js`
- [ ] T033 [P] [US3] Write an integration test for album preview tile display in `tests/integration/test_album_view.js`

**Checkpoint**: User Story 3 should be independently functional and visually coherent.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation, validate performance and UX, and ensure the feature meets quality expectations.

- [ ] T034 [P] Document setup, development, and testing instructions in `specs/001-photo-albums/quickstart.md`
- [ ] T035 [P] Validate the implementation against the constitution principles in `.specify/memory/constitution.md`
- [ ] T036 [P] Conduct responsiveness and performance checks in `src/styles.css` and `src/main.js`
- [ ] T037 [P] Review and refine error handling for empty albums and drag-and-drop failures in `src/main.js` and `src/styles.css`
- [ ] T038 [P] Update `specs/001-photo-albums/research.md` if implementation decisions change

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: Setup must complete before foundational tasks
- **Phase 2**: Foundation must complete before story implementation
- **Phase 3+**: User stories can proceed after foundation, with US1 as MVP first
- **Phase N**: Polish tasks can run after each story is implemented

### Parallel Opportunities

- `T003`, `T004`, and `T005` can run in parallel during Setup
- `T020`, `T021`, `T026`, `T027`, `T032`, and `T033` can run in parallel with implementation once their story logic is stable
- Final polish tasks `T034` through `T038` can be executed in parallel once core stories are complete
