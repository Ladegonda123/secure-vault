import data from './data.json';
import type { TreeItem } from './types/tree';
import { useTreeState } from './hooks/useTreeState';
import { FileExplorer } from './components/FileExplorer/FileExplorer';
import { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel';
import { SearchBar } from './components/SearchBar/SearchBar';
import styles from './App.module.css';

const treeData = data as TreeItem[];

export default function App() {
  const {
    expandedIds,
    toggleFolder,
    selectedFile,
    selectFile,
    searchQuery,
    setSearchQuery,
    focusedId,
    setFocusedId,
  } = useTreeState();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🔒</span>SecureVault
        </div>
        <div className={styles.searchWrapper}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </header>
      <div className={styles.body}>
        <div className={styles.leftPane}>
          <div className={styles.paneHeader}>File Explorer</div>
          <FileExplorer
            data={treeData}
            expandedIds={expandedIds}
            selectedId={selectedFile?.item.id ?? null}
            focusedId={focusedId}
            searchQuery={searchQuery}
            onToggleFolder={toggleFolder}
            onSelectFile={(item) => selectFile(item, treeData)}
            onFocusChange={setFocusedId}
            setFocusedId={setFocusedId}
          />
        </div>
        <div className={styles.rightPane}>
          <PropertiesPanel selectedFile={selectedFile} />
        </div>
      </div>
    </div>
  );
}
