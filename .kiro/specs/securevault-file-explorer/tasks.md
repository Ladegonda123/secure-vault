# SecureVault File Explorer — Implementation Tasks

> Execute these tasks in order. Each task is atomic and independently verifiable.
> Tech stack: React 18 + TypeScript + Vite + plain CSS Modules. No component libraries.

---

## Git Commit Rules

After completing **every numbered task** (Task 1, Task 2, ... Task 10), make a git commit before moving to the next task.

Follow the **Conventional Commits** standard:

```
<type>(<scope>): <short description>
```

**Types to use:**
- `feat` — a new feature or component
- `chore` — project setup, config, scaffolding
- `refactor` — restructuring without changing behavior
- `style` — CSS / visual changes only
- `fix` — bug fix

**Examples per task:**
```
chore(scaffold): init vite react-ts project and folder structure
feat(types): add TreeItem and SelectedFile interfaces
feat(utils): add file helpers and tree traversal utilities
feat(hooks): add useTreeState hook for shared tree state
feat(search-bar): add controlled SearchBar component
feat(tree-node): add recursive TreeNode component
feat(file-explorer): add FileExplorer with keyboard navigation and search filter
feat(properties-panel): add PropertiesPanel with breadcrumb and file metadata
feat(app): wire all components and apply global CSS design tokens
chore(verify): final build check and project README
```

Keep commit messages lowercase, present tense, and under 72 characters.
Never bundle multiple tasks into one commit.

---

## Task 1: Project Scaffold

- [ ] 1.1 Run `npm create vite@latest securevault-file-explorer -- --template react-ts` to scaffold the project.
- [ ] 1.2 Delete all boilerplate: clear `App.tsx`, delete `App.css`, delete contents of `index.css` (keep the file).
- [ ] 1.3 Copy `data.json` from the repo root into `src/data.json`.
- [ ] 1.4 Create the full folder structure as defined in `design.md`:
  - `src/components/TreeNode/`
  - `src/components/FileExplorer/`
  - `src/components/PropertiesPanel/`
  - `src/components/SearchBar/`
  - `src/hooks/`
  - `src/utils/`
  - `src/types/`
- [ ] 1.5 Verify `npm run dev` starts without errors before moving on.

---

## Task 2: Type Definitions

**File:** `src/types/tree.ts`

- [ ] 2.1 Define and export the `TreeItem` interface:
  ```ts
  export interface TreeItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    size?: string;
    children?: TreeItem[];
  }
  ```
- [ ] 2.2 Define and export the `SelectedFile` interface:
  ```ts
  export interface SelectedFile {
    item: TreeItem;
    breadcrumb: string[]; // ordered list of ancestor names ending with the file name
  }
  ```

---

## Task 3: Utility Functions

**File:** `src/utils/fileHelpers.ts`

- [ ] 3.1 Implement `getFileType(filename: string): string`.
  Map extensions: `.pdf` → "PDF Document", `.docx` → "Word Document", `.xlsx` → "Excel Spreadsheet", `.png` → "PNG Image", `.txt` → "Text File", `.yaml`/`.yml` → "YAML Config", `.svg` → "SVG Image", `.ttf` → "Font File". Default: "File".
- [ ] 3.2 Implement `getFileIcon(filename: string): string`.
  Return a simple emoji string per extension: `.pdf` → "📄", `.png`/`.svg` → "🖼", `.xlsx` → "📊", `.docx` → "📝", `.txt` → "📃", `.yaml` → "⚙️", `.ttf` → "🔤", default → "📄".

**File:** `src/utils/treeHelpers.ts`

- [ ] 3.3 Implement `flattenVisibleNodes(items: TreeItem[], expandedIds: Set<string>): TreeItem[]`.
  Walk the tree in order. For each folder, include it; if its id is in `expandedIds`, recursively include its children. For files, include as-is. Return a flat array — this is the keyboard nav order.
- [ ] 3.4 Implement `getAncestorIds(items: TreeItem[], targetId: string): string[]`.
  Recursively search the tree. When `targetId` is found, return the ids of all folders on the path to it (not including the target itself).
- [ ] 3.5 Implement `buildBreadcrumb(items: TreeItem[], targetId: string): string[]`.
  Same traversal as above, but return the **names** of all ancestors plus the target's own name as the last element.

---

## Task 4: `useTreeState` Hook

**File:** `src/hooks/useTreeState.ts`

- [ ] 4.1 Create the hook with this state:
  - `expandedIds: Set<string>` — starts as `new Set()`
  - `selectedFile: SelectedFile | null` — starts as `null`
  - `searchQuery: string` — starts as `''`
  - `focusedId: string | null` — starts as `null`
- [ ] 4.2 Implement `toggleFolder(id: string): void` — adds id to set if absent, removes if present.
- [ ] 4.3 Implement `selectFile(item: TreeItem, allItems: TreeItem[]): void` — builds breadcrumb using `buildBreadcrumb`, sets `selectedFile`.
- [ ] 4.4 Export all state and functions from the hook.

---

## Task 5: `SearchBar` Component

**File:** `src/components/SearchBar/SearchBar.tsx` and `SearchBar.module.css`

- [ ] 5.1 Build a controlled `<input type="text">` component.
  Props: `value: string`, `onChange: (val: string) => void`.
- [ ] 5.2 Add a clear button ("✕") that appears when `value` is non-empty. Clicking it calls `onChange('')`.
- [ ] 5.3 Style using CSS tokens from `design.md`. The input should have a dark background, cyan border on focus, and mono font. Minimal height, no rounded pill shapes.

---

## Task 6: `TreeNode` Component — Core Recursive Component

**File:** `src/components/TreeNode/TreeNode.tsx` and `TreeNode.module.css`

- [ ] 6.1 Define props:
  ```ts
  interface TreeNodeProps {
    item: TreeItem;
    depth: number;
    expandedIds: Set<string>;
    selectedId: string | null;
    focusedId: string | null;
    onToggleFolder: (id: string) => void;
    onSelectFile: (item: TreeItem) => void;
    onFocus: (id: string) => void;
  }
  ```
- [ ] 6.2 For **folder** items:
  - Render a row with a chevron icon (`▶` collapsed, `▼` expanded), a folder icon (📁), and the folder name.
  - Apply `padding-left: depth * 16px` as inline style for indentation.
  - On click, call `onToggleFolder(item.id)`.
  - If expanded AND has children, render each child as a `<TreeNode ... depth={depth + 1} />`.
- [ ] 6.3 For **file** items:
  - Render a row with a file icon from `getFileIcon(item.name)` and the file name.
  - Apply `padding-left: depth * 16px` as inline style.
  - On click, call `onSelectFile(item)` and `onFocus(item.id)`.
  - Apply `.selected` CSS class when `item.id === selectedId`.
- [ ] 6.4 Apply `.focused` CSS class when `item.id === focusedId` for keyboard highlight.
- [ ] 6.5 Style rows: dark background, cyan left-border on selected, subtle highlight on hover and focused states. Use `--indent-size` token.

---

## Task 7: `FileExplorer` Component

**File:** `src/components/FileExplorer/FileExplorer.tsx` and `FileExplorer.module.css`

- [ ] 7.1 Define props:
  ```ts
  interface FileExplorerProps {
    data: TreeItem[];
    expandedIds: Set<string>;
    selectedId: string | null;
    focusedId: string | null;
    searchQuery: string;
    onToggleFolder: (id: string) => void;
    onSelectFile: (item: TreeItem) => void;
    onFocusChange: (id: string) => void;
  }
  ```
- [ ] 7.2 Implement search filtering:
  - If `searchQuery` is empty, use `expandedIds` as-is.
  - If `searchQuery` is non-empty, compute `filteredExpandedIds`:
    - Walk the entire tree.
    - A node matches if `name.toLowerCase().includes(searchQuery.toLowerCase())`.
    - Any folder containing a matching descendant is added to `filteredExpandedIds`.
  - Show "No results found" message if no nodes match.
- [ ] 7.3 Render a `<div>` with `tabIndex={0}` wrapping all `TreeNode` components. This is the keyboard focus target.
- [ ] 7.4 Implement `onKeyDown` handler on the wrapper div:
  - Get `visibleNodes = flattenVisibleNodes(data, activeExpandedIds)`.
  - `ArrowDown`: `setFocusedId` to next node. Prevent default scroll.
  - `ArrowUp`: `setFocusedId` to previous node. Prevent default scroll.
  - `ArrowRight`: if focused node is a folder and collapsed, expand it.
  - `ArrowLeft`: if focused node is a folder and expanded, collapse it.
  - `Enter`: if focused node is a file, select it. If folder, toggle it.
- [ ] 7.5 Map root-level `data` items to `<TreeNode depth={0} ... />` components.

---

## Task 8: `PropertiesPanel` Component

**File:** `src/components/PropertiesPanel/PropertiesPanel.tsx` and `PropertiesPanel.module.css`

- [ ] 8.1 Define props: `selectedFile: SelectedFile | null`.
- [ ] 8.2 When `selectedFile` is null, render a placeholder:
  ```
  Select a file to view its details
  ```
- [ ] 8.3 When `selectedFile` is set, render:
  - **Breadcrumb row**: `selectedFile.breadcrumb` joined by ` › `. Truncate with ellipsis if too long.
  - A divider line.
  - **Name:** full file name.
  - **Type:** `getFileType(selectedFile.item.name)`.
  - **Size:** `selectedFile.item.size ?? '—'`.
- [ ] 8.4 Style with the dark panel surface, muted labels, and bright values. The breadcrumb should use the muted color and mono font.

---

## Task 9: `App.tsx` — Wire Everything Together

**File:** `src/App.tsx` and `src/App.module.css`

- [ ] 9.1 Import `data.json` and cast it as `TreeItem[]`.
- [ ] 9.2 Call `useTreeState()` and destructure all state and handlers.
- [ ] 9.3 Render a two-column layout:
  - Left column (60%): header with app name, `SearchBar`, then `FileExplorer`.
  - Right column (40%): `PropertiesPanel`.
- [ ] 9.4 Wire all props — `FileExplorer` gets tree state; `PropertiesPanel` gets `selectedFile`.
- [ ] 9.5 Apply global CSS tokens to `:root` in `index.css`:
  ```css
  :root {
    --color-bg:           #0d0f14;
    --color-surface:      #161b25;
    --color-border:       #1e2a3a;
    --color-text-primary: #e2e8f0;
    --color-text-muted:   #4a6080;
    --color-accent:       #00d4ff;
    --color-selected-bg:  #0a2035;
    --color-hover-bg:     #1a2535;
    --color-folder:       #f59e0b;
    --color-file:         #60a5fa;
    --font-mono:          'JetBrains Mono', 'Fira Code', monospace;
    --font-sans:          'DM Sans', system-ui, sans-serif;
    --radius:             4px;
    --indent-size:        16px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--color-bg); color: var(--color-text-primary); font-family: var(--font-sans); }
  ```
- [ ] 9.6 Import `DM Sans` and `JetBrains Mono` from Google Fonts in `index.html`.

---

## Task 10: Final Polish & Verification

- [ ] 10.1 Verify all 5 user stories from the requirements work end-to-end:
  - [ ] Tree renders all items from `data.json` recursively.
  - [ ] Folders expand/collapse on click.
  - [ ] Clicking a file highlights it and shows the Properties Panel.
  - [ ] Keyboard nav (Up/Down/Left/Right/Enter) works correctly.
  - [ ] Search filters the tree and auto-expands ancestor folders.
  - [ ] Breadcrumb shows correct path for selected file.
- [ ] 10.2 Check that no component library is imported anywhere (grep for `@mui`, `bootstrap`, `chakra`, `antd`).
- [ ] 10.3 Check that TypeScript compiles with no errors: `npm run build`.
- [ ] 10.4 Ensure the app looks correct at 1280px wide viewport (standard laptop).
- [ ] 10.5 Add a brief `README.md` to the project root documenting:
  - Setup instructions (`npm install`, `npm run dev`).
  - Explanation of recursive strategy.
  - Explanation of wildcard feature (breadcrumb).
li