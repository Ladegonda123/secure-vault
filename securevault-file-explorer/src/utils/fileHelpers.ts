const EXT_TYPE_MAP: Record<string, string> = {
  pdf: 'PDF Document',
  docx: 'Word Document',
  xlsx: 'Excel Spreadsheet',
  png: 'PNG Image',
  txt: 'Text File',
  yaml: 'YAML Config',
  yml: 'YAML Config',
  svg: 'SVG Image',
  ttf: 'Font File',
};

const EXT_ICON_MAP: Record<string, string> = {
  pdf: '📄',
  docx: '📝',
  xlsx: '📊',
  png: '🖼',
  svg: '🖼',
  txt: '📃',
  yaml: '⚙️',
  yml: '⚙️',
  ttf: '🔤',
};

function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

export function getFileType(filename: string): string {
  return EXT_TYPE_MAP[getExtension(filename)] ?? 'File';
}

export function getFileIcon(filename: string): string {
  return EXT_ICON_MAP[getExtension(filename)] ?? '📄';
}
