import { useId } from "react";

type Axis = "x" | "y";

function edge(axis: Axis, at: number, reverse: boolean, seam?: number) {
  const point = (along: number, offset = 0) =>
    axis === "x" ? `${along} ${at + offset}` : `${at + offset} ${along}`;

  if (seam === undefined) return `L${point(reverse ? 0 : 100)}`;

  const center = [38, 62, 47, 58, 32][seam % 5];
  const reach = (axis === "x" ? 8 : 5) * (seam % 2 === 0 ? 1 : -1);
  const points = [
    point(center - 8),
    point(center - 3),
    point(center - 11, reach),
    point(center, reach),
    point(center + 11, reach),
    point(center + 3),
    point(center + 8),
  ];

  if (reverse) points.reverse();

  return `L${points[0]} C${points.slice(1, 4).join(" ")} C${points.slice(4).join(" ")} L${point(reverse ? 0 : 100)}`;
}

function outline(index: number, count: number, columns: number) {
  const column = index % columns;
  return [
    "M0 0",
    edge("x", 0, false, index >= columns ? index - columns : undefined),
    edge("y", 100, false, column < columns - 1 && index + 1 < count ? index : undefined),
    edge("x", 100, true, index + columns < count ? index : undefined),
    edge("y", 0, true, column > 0 ? index - 1 : undefined),
    "Z",
  ].join(" ");
}

export function ProcessPieceShape({ index, count }: { index: number; count: number }) {
  const id = useId();
  const layouts = [1, 2, 3];

  return (
    <>
      <svg aria-hidden="true" className="process-piece-definitions">
        <defs>
          {layouts.map((columns) => (
            <path key={columns} id={`${id}-${columns}`} d={outline(index, count, columns)} vectorEffect="non-scaling-stroke" />
          ))}
        </defs>
      </svg>
      {[4, 8, 12, 16, 0].map((depth) => (
        <svg
          key={depth}
          aria-hidden="true"
          className={depth ? "process-piece-shape process-piece-depth" : "process-piece-shape process-piece-front"}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={depth ? { transform: `translateZ(-${depth}px)` } : undefined}
        >
          {layouts.map((columns) => (
            <use key={columns} href={`#${id}-${columns}`} data-columns={columns} />
          ))}
        </svg>
      ))}
    </>
  );
}
