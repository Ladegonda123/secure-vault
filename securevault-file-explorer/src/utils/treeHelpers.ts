import { TreeItem } from '../types/tree';

export function flattenVisibleNodes(
  items: TreeItem[],
  expandedIds: Set<string>
): TreeItem[] {
  const result: TreeItem[] = [];
  for (const item of items) {
    result.push(item);
    if (item.type === 'folder' && expandedIds.has(item.id) && item.children) {
      result.push(...flattenVisibleNodes(item.children, expandedIds));
    }
  }
  return result;
}

function findAncestors(
  items: TreeItem[],
  targetId: string,
  path: TreeItem[]
): TreeItem[] | null {
  for (const item of items) {
    if (item.id === targetId) return path;
    if (item.type === 'folder' && item.children) {
      const found = findAncestors(item.children, targetId, [...path, item]);
      if (found) return found;
    }
  }
  return null;
}

export function getAncestorIds(items: TreeItem[], targetId: string): string[] {
  const ancestors = findAncestors(items, targetId, []);
  return ancestors ? ancestors.map((a) => a.id) : [];
}

export function buildBreadcrumb(items: TreeItem[], targetId: string): string[] {
  const ancestors = findAncestors(items, targetId, []);
  if (!ancestors) return [];
  const target = findNodeById(items, targetId);
  return target ? [...ancestors.map((a) => a.name), target.name] : [];
}

function findNodeById(items: TreeItem[], id: string): TreeItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.type === 'folder' && item.children) {
      const found = findNodeById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}
