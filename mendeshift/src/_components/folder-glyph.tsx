export function TargetCorners() {
  return (
    <span className="target-corners" aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

export function FolderGlyph() {
  return (
    <svg className="directory-glyph" viewBox="0 0 96 72" fill="none" aria-hidden="true">
      <path className="directory-glyph-back" d="M7 16a6 6 0 0 1 6-6h23l9 10h38a6 6 0 0 1 6 6v36H7Z" />
      <path className="directory-glyph-file" d="M20 26h56v27H20z" />
      <path className="directory-glyph-front" d="M7 31h82v30a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4Z" />
    </svg>
  );
}
