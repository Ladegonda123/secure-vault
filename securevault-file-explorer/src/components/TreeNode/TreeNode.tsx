import type { TreeItem } from '../../types/tree';
import { getFileIcon } from '../../utils/fileHelpers';
import styles from './TreeNode.module.css';

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

export function TreeNode({
  item,
  depth,
  expandedIds,
  selectedId,
  focusedId,
  onToggleFolder,
  onSelectFile,
  onFocus,
}: TreeNodeProps) {
  const isExpanded = expandedIds.has(item.id);
  const isSelected = item.id === selectedId;
  const isFocused = item.id === focusedId;
  const indentStyle = { paddingLeft: `${depth * 16 + 8}px` };

  if (item.type === 'folder') {
    return (
      <div>
        <div
          className={`${styles.row} ${styles.folder} ${isFocused ? styles.focused : ''}`}
          style={indentStyle}
          onClick={() => onToggleFolder(item.id)}
          onMouseEnter={() => onFocus(item.id)}
          role="button"
          aria-expanded={isExpanded}
          tabIndex={-1}
        >
          <span className={styles.chevron}>{isExpanded ? '▼' : '▶'}</span>
          <span className={styles.folderIcon}>📁</span>
          <span className={styles.name}>{item.name}</span>
        </div>
        {isExpanded && item.children && item.children.map((child) => (
          <TreeNode
            key={child.id}
            item={child}
            depth={depth + 1}
            expandedIds={expandedIds}
            selectedId={selectedId}
            focusedId={focusedId}
            onToggleFolder={onToggleFolder}
            onSelectFile={onSelectFile}
            onFocus={onFocus}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles.row} ${styles.file} ${isSelected ? styles.selected : ''} ${isFocused ? styles.focused : ''}`}
      style={indentStyle}
      onClick={() => { onSelectFile(item); onFocus(item.id); }}
      role="button"
      tabIndex={-1}
    >
      <span className={styles.fileIcon}>{getFileIcon(item.name)}</span>
      <span className={styles.name}>{item.name}</span>
    </div>
  );
}
