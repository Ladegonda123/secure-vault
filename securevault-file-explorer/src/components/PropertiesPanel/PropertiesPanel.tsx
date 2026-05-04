import type { SelectedFile } from '../../types/tree';
import { getFileType } from '../../utils/fileHelpers';
import styles from './PropertiesPanel.module.css';

interface PropertiesPanelProps {
  selectedFile: SelectedFile | null;
}

export function PropertiesPanel({ selectedFile }: PropertiesPanelProps) {
  if (!selectedFile) {
    return (
      <div className={styles.panel}>
        <div className={styles.placeholder}>Select a file to view its details</div>
      </div>
    );
  }

  const { item, breadcrumb } = selectedFile;

  return (
    <div className={styles.panel}>
      <div className={styles.breadcrumb} title={breadcrumb.join(' › ')}>
        {breadcrumb.join(' › ')}
      </div>
      <div className={styles.divider} />
      <div className={styles.properties}>
        <div className={styles.row}>
          <span className={styles.label}>Name</span>
          <span className={styles.value}>{item.name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Type</span>
          <span className={styles.value}>{getFileType(item.name)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Size</span>
          <span className={styles.value}>{item.size ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}
