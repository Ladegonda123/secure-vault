import type { TreeItem } from '../../types/tree';
import { TreeNode } from '../TreeNode/TreeNode';
import { flattenVisibleNodes } from '../../utils/treeHelpers';
import styles from './FileExplorer.module.css';

interface FileExplorerProps {
  data: TreeItem[];
  expandedIds: Set<string>;
  selectedId: string | null;
  focusedId: string | null;
  searchQuery: string;
  onToggleFolder: (id: string) => void;
  onSelectFile: (item: TreeItem) => void;
  onFocusChange: (id: string) => void;
  setFocusedId: (id: string | null) => void;
}

function computeFilteredExpandedIds(
  items: TreeItem[],
  query: string,
  result: Set<string>
): boolean {
  let anyMatch = false;
  for (const item of items) {
    const nameMatch = item.name.toLowerCase().includes(query.toLowerCase());
    if (item.type === 'folder' && item.children) {
      const childMatch = computeFilteredExpandedIds(item.children, query, result);
      if (nameMatch || childMatch) {
        result.add(item.id);
        anyMatch = true;
      }
    } else if (nameMatch) {
      anyMatch = true;
    }
  }
  return anyMatch;
}

export function FileExplorer({
  data,
  expandedIds,
  selectedId,
  focusedId,
  searchQuery,
  onToggleFolder,
  onSelectFile,
  onFocusChange,
  setFocusedId,
}: FileExplorerProps) {
  let activeExpandedIds = expandedIds;
  let hasResults = true;

  if (searchQuery) {
    const filtered = new Set<string>();
    hasResults = computeFilteredExpandedIds(data, searchQuery, filtered);
    activeExpandedIds = filtered;
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const nodes = flattenVisibleNodes(data, activeExpandedIds);
    const idx = focusedId ? nodes.findIndex((n) => n.id === focusedId) : -1;
    const focused = idx >= 0 ? nodes[idx] : null;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (idx < nodes.length - 1) setFocusedId(nodes[idx + 1].id);
        else if (nodes.length > 0) setFocusedId(nodes[0].id);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (idx > 0) setFocusedId(nodes[idx - 1].id);
        else if (nodes.length > 0) setFocusedId(nodes[nodes.length - 1].id);
        break;
      case 'ArrowRight':
        if (focused?.type === 'folder' && !expandedIds.has(focused.id)) {
          onToggleFolder(focused.id);
        }
        break;
      case 'ArrowLeft':
        if (focused?.type === 'folder' && expandedIds.has(focused.id)) {
          onToggleFolder(focused.id);
        }
        break;
      case 'Enter':
        if (!focused) break;
        if (focused.type === 'file') {
          onSelectFile(focused);
        } else {
          onToggleFolder(focused.id);
        }
        break;
    }
  }

  // Filter visible nodes by search query for rendering
  const renderItems = searchQuery
    ? filterVisibleItems(data, searchQuery)
    : data;

  return (
    <div
      className={styles.container}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="tree"
      aria-label="File explorer"
    >
      {!hasResults && searchQuery ? (
        <div className={styles.noResults}>No results found</div>
      ) : (
        renderItems.map((item) => (
          <TreeNode
            key={item.id}
            item={item}
            depth={0}
            expandedIds={activeExpandedIds}
            selectedId={selectedId}
            focusedId={focusedId}
            onToggleFolder={onToggleFolder}
            onSelectFile={onSelectFile}
            onFocus={onFocusChange}
          />
        ))
      )}
    </div>
  );
}

function itemMatchesQuery(item: TreeItem, query: string): boolean {
  if (item.name.toLowerCase().includes(query.toLowerCase())) return true;
  if (item.type === 'folder' && item.children) {
    return item.children.some((c) => itemMatchesQuery(c, query));
  }
  return false;
}

function filterVisibleItems(
  items: TreeItem[],
  query: string
): TreeItem[] {
  return items.filter((item) => itemMatchesQuery(item, query));
}
