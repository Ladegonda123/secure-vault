import { useState } from 'react';
import type { TreeItem, SelectedFile } from '../types/tree';
import { buildBreadcrumb } from '../utils/treeHelpers';

export function useTreeState() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedId, setFocusedId] = useState<string | null>(null);

  function toggleFolder(id: string): void {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectFile(item: TreeItem, allItems: TreeItem[]): void {
    const breadcrumb = buildBreadcrumb(allItems, item.id);
    setSelectedFile({ item, breadcrumb });
    setFocusedId(item.id);
  }

  return {
    expandedIds,
    toggleFolder,
    selectedFile,
    selectFile,
    searchQuery,
    setSearchQuery,
    focusedId,
    setFocusedId,
  };
}
