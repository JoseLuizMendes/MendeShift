const palette: Record<string, string> = {
  r: "#a82b36",
  R: "var(--accent)",
  L: "#ff8e83",
  E: "var(--background)",
};

const sprite = [
  "...RRRRRRRRR...",
  "..RLLLLLRRRRr..",
  ".RLLRRRRRRRRRr.",
  "RLRRRRRRRRRRRrr",
  "RLRRRRRRRRRRRrr",
  "RLREERRREERRRrr",
  "RRERRERERRERRrr",
  "RRRRRRRRRRRRRrr",
  "RRLRERRRERRLRrr",
  "RRRRREEERRRRRrr",
  "RRRRRRRRRRRRRrr",
  "RRRRRRRRRRRRRrr",
  "RRRRRRRRRRRRRrr",
  "RRRRRRRRRRRRRrr",
  "RRR.RRR.RRR.Rrr",
  ".R...R...R...r.",
];

// Separate layers let groups of squares break away independently on exit.
const pixelGroups = Array.from({ length: 7 }, () => [] as string[]);
sprite.forEach((row, y) => {
  Array.from(row).forEach((pixel, x) => {
    const color = palette[pixel];
    if (color) {
      pixelGroups[(x * 11 + y * 5) % pixelGroups.length].push(
        `calc(var(--ghost-pixel) * ${x}) calc(var(--ghost-pixel) * ${y}) ${color}`,
      );
    }
  });
});

export function TerminalGhost({ label }: { label: string }) {
  return (
    <div className="terminal-art" role="img" aria-label={label}>
      <div className="terminal-ghost-follow">
        <div className="terminal-ghost-drift">
          <div className="terminal-ghost">
            {pixelGroups.map((group, index) => (
              <span key={index} className="terminal-ghost-pixels" style={{ boxShadow: group.join(", ") }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
