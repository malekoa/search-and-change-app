export const availableColors = ["red", "blue", "green", "orange", "yellow"];
export const availableShapes = ["square", "triangle", "rectangle", "circle"];

export function containsDefault(arr) {
  return (
    arr.some((e) => e.color == "default") ||
    arr.some((e) => e.shape == "default")
  );
}

export function generateRandomItems(count) {
  const items = [];

  for (let i = 0; i < count; i++) {
    items.push({
      color: availableColors[Math.floor(Math.random() * availableColors.length)],
      shape: availableShapes[Math.floor(Math.random() * availableShapes.length)],
    });
  }
  return items;
}

// export function generateRandomItems(count) {
//   const colors = ["red", "blue", "green", "orange"];
//   const shapes = ["square", "triangle", "rectangle", "circle"];
//   while (true) {
//     const items = Array.apply(null, Array(count)).map((x) => ({
//       color: colors[Math.floor(Math.random() * colors.length)],
//       shape: shapes[Math.floor(Math.random() * shapes.length)],
//     }));
//     if (itemListNotAllIdentical(items)) {
//       return items;
//     }
//   }
// }
// export function itemListNotAllIdentical(itemList) {
//   return !itemList.every(item=>itemEquals(item, itemList[0]))
// } TODO Not working



export function itemListEquals(itemList1, itemList2) {
  if (itemList1.length !== itemList2.length) {
    return false;
  }

  for (let i = 0; i < itemList1.length; i++) {
    if (!itemEquals(itemList1[i], itemList2[i])) {
      return false;
    }
  }

  return true;
}

export function itemEquals(item1, item2) {
  return item1.color === item2.color && item1.shape === item2.shape;
}

export function containsIdentcalItems(itemList) {
  for (let i = 0; i < itemList.length; i++) {
    for (let j = i + 1; j < itemList.length; j++) {
      if (itemEquals(itemList[i], itemList[j])) {
        return true;
      }
    }
  }
  return false;
}

export function generateRandomRule(itemList) {
  while (true) {
    let rule = {
      inr: itemList[Math.floor(Math.random() * itemList.length)],
      trm: itemList[Math.floor(Math.random() * itemList.length)],
      dir: Math.random() < 0.5 ? "right" : "left",
      inp: "inr",
      out: generateRandomItems(1)[0],
      cnd: "default",
    };
    if (!containsIdentcalItems([rule.inr, rule.trm, rule.out])) {
      return rule;
    }
  }
}

export function checkRule(rule, inputList , resultList , iterative = false) {
  const initiator = rule.inr;
  const terminator = rule.trm;
  const output = rule.out;
  if (rule.dir === "right") {
    inputList = inputList.reverse();
  }

  let newItemList = [];
  let transform = false;
  
  for (const item of inputList) {
    switch (item.color + item.shape) {
      case initiator.color + initiator.shape:
        if (transform) {
          newItemList.push(output);
        }
        else{
          newItemList.push(item);
        }
        break;
      case terminator.color + terminator.shape:
        transform = true;
      default:
        newItemList.push(item);
    }
  }

  if (rule.dir === "right") {
    newItemList = newItemList.reverse();
  }
  
  return itemListEquals(newItemList, resultList);
}