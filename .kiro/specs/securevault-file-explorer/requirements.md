# SecureVault File Explorer — Requirements

## Overview

Build a dark-mode File Explorer UI for SecureVault Inc., a cloud security company serving law firms and banks.
The app renders a nested folder/file structure from `data.json` in React + TypeScript.
No component libraries (Bootstrap, MUI, Chakra) are allowed. CSS must be hand-written.

---

## Functional Requirements

### REQ-1: Recursive Tree Rendering

WHEN the application loads
THE SYSTEM SHALL read `data.json` and render the full folder/file tree recursively.

WHEN a folder is in the tree at any depth (2 levels or 20 levels)
THE SYSTEM SHALL render it correctly without UI breakage.

WHEN a folder node has no children (empty array)
THE SYSTEM SHALL still render it as a folder with an expand toggle that does nothing visually.

---

### REQ-2: Expand / Collapse Folders

WHEN a user clicks a folder node
THE SYSTEM SHALL toggle that folder between expanded (children visible) and collapsed (children hidden).

WHEN the app first loads
THE SYSTEM SHALL render all top-level folders collapsed by default.

WHEN a folder is collapsed
THE SYSTEM SHALL hide all of its descendants (not just direct children).

---

### REQ-3: File Selection & Properties Panel

WHEN a user clicks a file node
THE SYSTEM SHALL mark that file as "selected" with a distinct visual highlight.

WHEN a file is selected
THE SYSTEM SHALL display a Properties Panel showing:
  - File Name
  - File Type (derived from extension, e.g. "PDF Document", "Excel Spreadsheet")
  - File Size

WHEN a user clicks a different file
THE SYSTEM SHALL deselect the previous file and select the new one.

WHEN no file is selected
THE SYSTEM SHALL show a placeholder message in the Properties Panel (e.g. "Select a file to view details").

---

### REQ-4: Keyboard Navigation

WHEN the file explorer has focus and the user presses the Down Arrow key
THE SYSTEM SHALL move focus to the next visible item in the tree.

WHEN the file explorer has focus and the user presses the Up Arrow key
THE SYSTEM SHALL move focus to the previous visible item in the tree.

WHEN a folder node is focused and the user presses the Right Arrow key
THE SYSTEM SHALL expand that folder.

WHEN a folder node is focused and the user presses the Left Arrow key
THE SYSTEM SHALL collapse that folder.

WHEN a file node is focused and the user presses the Enter key
THE SYSTEM SHALL select that file and update the Properties Panel.

WHEN a folder node is focused and the user presses the Enter key
THE SYSTEM SHALL toggle that folder's expand/collapse state.

---

### REQ-5: Search & Filter (Bonus)

WHEN a user types in the search input
THE SYSTEM SHALL filter the visible tree to show only items whose name matches the search string (case-insensitive).

WHEN a matching file is inside a nested folder
THE SYSTEM SHALL automatically expand all ancestor folders so the matching file is visible.

WHEN the search input is cleared
THE SYSTEM SHALL restore the tree to its previous expand/collapse state.

WHEN there are no matches for a search term
THE SYSTEM SHALL display a "No results found" message in the tree area.

---

### REQ-6: Wildcard Feature — Breadcrumb Path

WHEN a user selects a file
THE SYSTEM SHALL display the full folder path to that file as a breadcrumb trail above the Properties Panel.
(e.g. 01_Legal_Department › Active_Cases › Doe_vs_MegaCorp_Inc › Case_Summary_Draft_v3.docx)

WHEN no file is selected
THE SYSTEM SHALL hide the breadcrumb or show a root-level placeholder.

This feature adds business value because lawyers and finance users work with deeply nested files.
Showing the path prevents confusion about which version of a file is open.

---

## Non-Functional Requirements

WHEN the app is rendered
THE SYSTEM SHALL use a dark-mode color palette that feels "cyber-secure, precise, and fast".

WHEN components are built
THE SYSTEM SHALL use only hand-written CSS (no Bootstrap, MUI, Chakra UI, Ant Design).
Tailwind CSS is allowed only if used to build a custom component architecture.

WHEN the codebase is reviewed
THE SYSTEM SHALL be written in React with TypeScript.
All components must be clean, readable, and not over-engineered.

WHEN the recursive tree component is reviewed
THE SYSTEM SHALL use a single recursive component (e.g. `TreeNode`) that calls itself for children.
There must be no hardcoded depth limits.
