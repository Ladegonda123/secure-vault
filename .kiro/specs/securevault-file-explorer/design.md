# SecureVault File Explorer — Technical Design

## Tech Stack

- **Framework:** React 18 with TypeScript (Vite as build tool)
- **Styling:** Plain CSS Modules (one `.module.css` per component). No component libraries.
- **State:** React `useState` and `useRef` only — no Redux, no Zustand, no Context (state is simple enough).
- **Data:** Static import of `data.json` at the top of `App.tsx`.

---

## Project Structure

```
securevault-file-explorer/
├── public/
├── src/
│   ├── components/
│   │   ├── TreeNode/
│   │   │   ├── TreeNode.tsx          # Recursive tree node (folder + file)
│   │   │   └── TreeNode.module.css
│   │   ├── FileExplorer/
│   │   │   ├── FileExplorer.tsx      # Root tree wrapper + keyboard nav logic
│   │   │   └── FileExplorer.module.css
│   │   ├── PropertiesPanel/
│   │   │   ├── PropertiesPanel.tsx   # Selected file details + breadcrumb
│   │   │   └── PropertiesPanel.module.css
│   │   └── SearchBar/
│   │       ├── SearchBar.tsx         # Controlled input for search/filter
│   │       └── SearchBar.module.css
│   ├── hooks/
│   │   └── useTreeState.ts           # Custom hook: expand state, selected file, search filter
│   ├── utils/
│   │   ├── fileHelpers.ts            # getFileType(name), formatSize, getFileIcon
│   │   └── treeHelpers.ts            # flattenVisibleNodes(), getAncestorIds(), buildBreadcrumb()
│   ├── types/
│   │   └── tree.ts                   # TreeNode interface, SelectedFile interface
│   ├── data.json                     # Source data (copy from repo root)
│   ├── App.tsx
│   ├── App.module.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Data Types (`src/types/tree.ts`)

```ts
export interface TreeItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;           // only on files
  children?: TreeItem[];  // only on folders
}

export interface SelectedFile {
  item: TreeItem;
  breadcrumb: string[];   // array of ancestor names, e.g. ['01_Legal_Department', 'Active_Cases', 'file.pdf']
}
```

---

## Component Responsibilities

### `App.tsx`
- Imports `data.json` as `TreeItem[]`.
- Renders layout: left pane (`FileExplorer`) + right pane (`PropertiesPanel`).
- Passes down `selectedFile` state and setter.

### `FileExplorer.tsx`
- Renders `SearchBar` at the top.
- Renders the list of root-level `TreeNode` components.
- Owns the keyboard navigation logic using `useRef` on a wrapper `div` with `tabIndex={0}` and `onKeyDown`.
- Uses `flattenVisibleNodes()` util to get a flat ordered list of currently visible nodes for Up/Down navigation.

### `TreeNode.tsx` — THE KEY COMPONENT
- Accepts a single `TreeItem` prop plus callbacks.
- If `type === 'folder'`: renders a clickable folder row with expand/collapse arrow icon, then recursively renders `TreeNode` for each child when expanded.
- If `type === 'file'`: renders a clickable file row with a file icon.
- Applies a `selected` CSS class when the item matches `selectedFile`.
- Applies a `focused` CSS class when the item matches `focusedId`.
- **No depth prop needed.** CSS indentation is handled via `padding-left` passed as an inline style prop `depth * 16px`.

### `PropertiesPanel.tsx`
- Receives `selectedFile: SelectedFile | null`.
- Shows breadcrumb trail (array of names joined by `›`).
- Shows Name, Type (from `getFileType()`), and Size.
- Shows placeholder when `selectedFile` is null.

### `SearchBar.tsx`
- Controlled input, calls `onSearch(value: string)` on every keystroke.

---

## Custom Hook: `useTreeState.ts`

Manages all shared state to keep components clean:

```ts
// What it tracks:
const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
const [searchQuery, setSearchQuery] = useState('');
const [focusedId, setFocusedId] = useState<string | null>(null);

// What it exposes:
return {
  expandedIds,
  toggleFolder,      // (id: string) => void
  selectedFile,
  selectFile,        // (item: TreeItem, ancestors: TreeItem[]) => void
  searchQuery,
  setSearchQuery,
  focusedId,
  setFocusedId,
};
```

---

## Utility Functions (`src/utils/`)

### `treeHelpers.ts`

```ts
// Returns a flat array of all currently visible TreeItem nodes in DOM order.
// Used for keyboard Up/Down navigation.
export function flattenVisibleNodes(
  items: TreeItem[],
  expandedIds: Set<string>
): TreeItem[]

// Returns the ids of all ancestor folders for a given node id.
// Used by search to auto-expand parent folders.
export function getAncestorIds(
  items: TreeItem[],
  targetId: string
): string[]

// Returns the breadcrumb string array for a selected file.
export function buildBreadcrumb(
  items: TreeItem[],
  targetId: string
): string[]
```

### `fileHelpers.ts`

```ts
// Maps file extension to a human-readable type label.
export function getFileType(filename: string): string
// e.g. 'report.pdf' => 'PDF Document'
//      'data.xlsx'  => 'Excel Spreadsheet'
//      'image.png'  => 'PNG Image'
//      'notes.txt'  => 'Text File'

// Returns a simple emoji or SVG icon name for the file type.
export function getFileIcon(filename: string): string
```

---

## Search / Filter Logic

When `searchQuery` is non-empty:
1. Walk the full tree recursively.
2. A node **matches** if its `name` includes the query (case-insensitive).
3. A folder is **included** if any of its descendants match.
4. If a folder is included, force its id into `expandedIds` (pass to `TreeNode` as a merged set).
5. When query is cleared, revert to the user's manual `expandedIds`.

Implementation: compute a `filteredExpandedIds` derived value inside `FileExplorer.tsx` on every render — no extra state needed.

---

## Keyboard Navigation Logic

Inside `FileExplorer.tsx`, on `onKeyDown`:
1. Call `flattenVisibleNodes(data, expandedIds)` to get ordered visible items.
2. Find index of `focusedId` in this list.
3. `ArrowDown` → move to index + 1.
4. `ArrowUp` → move to index - 1.
5. `ArrowRight` → if focused item is a folder, add to `expandedIds`.
6. `ArrowLeft` → if focused item is a folder, remove from `expandedIds`.
7. `Enter` → if focused item is a file, call `selectFile`. If folder, toggle.

---

## CSS Design Tokens (App.module.css or global `:root`)

```css
:root {
  --color-bg:           #0d0f14;   /* near-black background */
  --color-surface:      #161b25;   /* panel/sidebar surfaces */
  --color-border:       #1e2a3a;   /* subtle borders */
  --color-text-primary: #e2e8f0;   /* main text */
  --color-text-muted:   #4a6080;   /* muted/secondary text */
  --color-accent:       #00d4ff;   /* cyan accent — "cyber-secure" feel */
  --color-selected-bg:  #0a2035;   /* selected file highlight */
  --color-hover-bg:     #1a2535;   /* hover state */
  --color-folder:       #f59e0b;   /* amber folder icon */
  --color-file:         #60a5fa;   /* blue file icon */
  --font-mono:          'JetBrains Mono', 'Fira Code', monospace;
  --font-sans:          'DM Sans', system-ui, sans-serif;
  --radius:             4px;
  --indent-size:        16px;
}
```

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│  SecureVault                              [search]   │
├──────────────────────────┬──────────────────────────┤
│                          │                          │
│   FILE EXPLORER          │   PROPERTIES             │
│                          │                          │
│   📁 01_Legal_Dept       │   breadcrumb path        │
│     📁 Active_Cases      │   ─────────────────      │
│       📁 Doe_vs_...      │   Name: file.pdf         │
│         📄 Email.pdf     │   Type: PDF Document     │
│         🖼 Leak.png      │   Size: 4.2 MB           │
│       📁 Smith_Estate    │                          │
│   📁 02_Finance_Team     │                          │
│   📁 03_IT_Security      │                          │
│   📁 Shared_Resources    │                          │
│   📄 README_First.txt    │                          │
│   📄 .gitignore          │                          │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
```
