export const availableColors = ["red", "blue", "green", "orange", "yellow"];
export const availableShapes = ["square", "triangle", "rectangle", "circle"];

export function containsDefault(arr) {
  return (
    arr.some((e) => e.color == "default") ||
    arr.some((e) => e.shape == "default")
  );
}

export function generateRandomItems(count, allowPartialDescription = false) {
  const items = [];

  for (let i = 0; i < count; i++) {
    items.push({
      color: availableColors.concat(allowPartialDescription ? ["gray"] : [])[
        Math.floor(
          Math.random() *
            (availableColors.length + (allowPartialDescription ? 1 : 0))
        )
      ],
      shape: availableShapes.concat(
        allowPartialDescription ? ["undefined"] : []
      )[
        Math.floor(
          Math.random() * availableShapes.length +
            (allowPartialDescription ? 1 : 0)
        )
      ],
    });
  }

  return items;
} // TODO: Add a check to make sure that the generated items are not identical, optimize this function by mapping instead of looping

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

export function applyPartialDescription(item, allowPartialDescription) {
  let newItem = { ...item };
  if (allowPartialDescription) {
    if (Math.random() < 0.2) {
      newItem.color = "gray";
    }
    if (Math.random() < 0.2) {
      newItem.shape = "undefined";
    }
    console.log(newItem)
  }
  return newItem;
}

export function generateRandomRule(itemList, allowPartialDescription = {inr: false, trm: false, out: false}) {
  while (true) {
    // TODO: There is a chance that this will loop forever, fix this
    let rule = {
      inr: applyPartialDescription(itemList[Math.floor(Math.random() * itemList.length)], allowPartialDescription.inr),
      trm: applyPartialDescription(itemList[Math.floor(Math.random() * itemList.length)], allowPartialDescription.trm),
      dir: Math.random() < 0.5 ? "right" : "left",
      inp: "inr",
      out: applyPartialDescription(generateRandomItems(1)[0], allowPartialDescription.out),
      cnd: "default",
    };
    if (!containsIdentcalItems([rule.inr, rule.trm, rule.out])) {
      return rule;
    }
  }
}

export function hasPartialDescription(item) {
  return item.color === "gray" || item.shape === "undefined";
}

export function applyRule(rule, itemList) {
  const initiator = rule.inr;
  const terminator = rule.trm;
  const output = rule.out;
  let itemListCopy = [...itemList];
  if (rule.dir === "right") {
    itemListCopy = itemListCopy.reverse();
  }

  let newItemList = [];
  let transform = false;
  for (const item of itemListCopy) {
    switch (item.color + item.shape) {
      case initiator.color + initiator.shape:
        if (transform) {
          newItemList.push(output);
        } else {
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

  return newItemList;
}

export function findDifferenceList(itemList1, itemList2) {
  let differenceList = [];
  for (let i = 0; i < itemList1.length; i++) {
    if (!itemEquals(itemList1[i], itemList2[i])) {
      differenceList.push(i);
    }
  }

  return differenceList;
}

export function checkRule(rule, inputList, resultList, iterative = false) {
  return itemListEquals(applyRule(rule, inputList), resultList);
}
