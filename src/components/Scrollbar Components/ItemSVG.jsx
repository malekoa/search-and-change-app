function ItemSVG({ color, shape }) {
  return (
    <svg
      width="50"
      height="50"
      viewBox="-120 -120 240 240"
      fill={color}
      stroke="black"
      strokeWidth="10"
    >
      {shape === "circle" && <circle cx="0" cy="0" r="100" />}
      {shape === "square" && <rect x="-75" y="-75" width="150" height="150" />}
      {shape === "rectangle" && <rect x="-100" y="-60" width="200" height="120" />}
      {shape === "triangle" && <polygon points="0 -90, 100 90, -100 90" />}
    </svg>
  );
}

export default ItemSVG;
