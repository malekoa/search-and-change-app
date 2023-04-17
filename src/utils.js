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

export function applyPartialDescription(
  item,
  allowPartialDescription,
  partialOdds = 0.2
) {
  let newItem = { ...item };
  if (allowPartialDescription) {
    if (Math.random() < partialOdds) {
      newItem.color = "gray";
    }
    if (Math.random() < partialOdds) {
      newItem.shape = "undefined";
    }
  }
  return newItem;
}

export function generateRandomRule(
  itemList,
  allowPartialDescription = { inr: false, trm: false, out: false },
  partialOdds = 0.2
) {
  while (true) {
    // TODO: There is a small chance that this will loop forever, fix this
    let rule = {
      inr: applyPartialDescription(
        itemList[Math.floor(Math.random() * itemList.length)],
        allowPartialDescription.inr,
        partialOdds
      ),
      trm: applyPartialDescription(
        itemList[Math.floor(Math.random() * itemList.length)],
        allowPartialDescription.trm,
        partialOdds
      ),
      dir: Math.random() < 0.5 ? "right" : "left",
      inp: "inr",
      out: applyPartialDescription(
        generateRandomItems(1)[0],
        allowPartialDescription.out,
        partialOdds
      ),
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

export function itemIncludes(partialItem, nonPartialItem) {
  switch (
    [partialItem.color === "gray", partialItem.shape === "undefined"].join()
  ) {
    case "true,false":
      return partialItem.shape === nonPartialItem.shape;
    case "false,true":
      return partialItem.color === nonPartialItem.color;
    case "true,true":
      return true;
    case "false,false":
      return itemEquals(partialItem, nonPartialItem);
  }
}

export function chooseOutput(output, currentItem) {
  switch ([output.color === "gray", output.shape === "undefined"].join()) {
    case "true,false":
      return { color: currentItem.color, shape: output.shape };
    case "false,true":
      return { color: output.color, shape: currentItem.shape };
    case "true,true":
      return currentItem;
    case "false,false":
      return output;
  }
}

export function applyRule(rule, itemList) {
  const initiator = rule.inr;
  const terminator = rule.trm;
  const output = rule.out;
  let newItemList = [];
  let transform = false;
  let itemListCopy = [...itemList];
  if (rule.dir === "right") {
    itemListCopy = itemListCopy.reverse();
  }

  // All cases of partial descriptions can be viewed thus:
  // 1. If the initiator is partial, then when checking for the initiator, we need to allow all attributes that match the partial description
  // 2. If the terminator is partial, then when checking for the terminator, we need to allow all attributes that match the partial description
  // 3. If the output is partial, then when pushing the output into the new item list, we need to refer back to the initiator

  for (const item of itemListCopy) {
    let itemToPush = null;
    console.log(item);
    if (itemIncludes(initiator, item)) {
      if (transform) {
        console.log("is initiator, transformed");
        itemToPush = chooseOutput(output, item);
      } else {
        console.log("is initiator, not transformed");
        itemToPush = item;
      }
    } 
    if (itemIncludes(terminator, item)) {
      console.log("is terminator");
      transform = true;
      if (itemToPush === null) {
        itemToPush = item;
      }
    } else {
      console.log("is not a target");
      if (itemToPush === null) {
        itemToPush = item;
      }
    }
    newItemList.push(itemToPush);
  }
  console.log(newItemList);

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
