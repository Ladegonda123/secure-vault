# SecureVault File Explorer

A dark-mode file explorer UI built with React 18 + TypeScript + Vite. No component libraries — all CSS is hand-written using CSS Modules.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Recursive Strategy

The tree is rendered by a single `TreeNode` component that calls itself for each child. There are no hardcoded depth limits — a folder at any nesting level renders its children by passing `depth + 1` down, which controls the `padding-left` indentation via inline style.

## Wildcard Feature: Breadcrumb Path

When a file is selected, the Properties Panel shows the full folder path as a breadcrumb trail (e.g. `01_Legal_Department › Active_Cases › Doe_vs_MegaCorp_Inc › Case_Summary_Draft_v3.docx`). This is built by `buildBreadcrumb()` in `src/utils/treeHelpers.ts`, which walks the tree recursively to collect ancestor names. Useful for deeply nested files where context matters.
