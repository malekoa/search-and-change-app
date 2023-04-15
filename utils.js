export const pi = 3.14;

export function containsDefault(arr) {
  return (
    arr.some((e) => e.color == "default") ||
    arr.some((e) => e.shape == "default")
  );
}

export function generateRandomItems(count) {
  const items = [];
  const colors = ["red", "blue", "green", "orange"];
  const shapes = ["square", "triangle", "rectangle", "circle"];

  for (let i = 0; i < count; i++) {
    items.push({
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    });
  }
  return items;
}
