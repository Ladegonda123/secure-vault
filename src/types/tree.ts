export interface TreeItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  children?: TreeItem[];
}

export interface SelectedFile {
  item: TreeItem;
  breadcrumb: string[]; // ordered list of ancestor names ending with the file name
}
