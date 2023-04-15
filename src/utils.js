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

export function itemListEquals(itemList1, itemList2) {
  if (itemList1.length !== itemList2.length) {
    return false;
  }

  for (let i = 0; i < itemList1.length; i++) {
    if (itemList1[i].color !== itemList2[i].color || itemList1[i].shape !== itemList2[i].shape) {
      return false;
    }
  }

  return true;
}