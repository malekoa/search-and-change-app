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

export function getItemVariation(item) {
  return {
    color:
      item.color === "gray"
        ? availableColors[Math.floor(Math.random() * availableColors.length)]
        : item.color,
    shape:
      item.shape === "undefined"
        ? availableShapes[Math.floor(Math.random() * availableShapes.length)]
        : item.shape,
  };
}

export function hasPartialDescription(item) {
  return item.color === "gray" || item.shape === "undefined";
}

export function pickDistinctItems(itemList, count) {
  let items = [];
  for (const item of itemList) {
    if (!items.some((i) => itemEquals(i, item))) {
      items.push(item);
    }
    if (items.length == count) {
      return items;
    }
  }
  return false;
}

export function generateRandomItem(cannotInclude = [], iterations = 0) {
  let item = generateRandomItems(1)[0];
  if (iterations === 0) {
    let unusedColors = availableColors.filter(
      (c) => !cannotInclude.some((i) => i.color === c)
    );
    if (unusedColors.length !== 0) {
      item.color =
        unusedColors[Math.floor(Math.random() * unusedColors.length)];
      return item;
    }
    let unusedShapes = availableShapes.filter(
      (s) => !cannotInclude.some((i) => i.shape === s)
    );
    if (unusedShapes.length !== 0) {
      item.shape =
        unusedShapes[Math.floor(Math.random() * unusedShapes.length)];
      return item;
    }
  }
  if (iterations >= 1000) {
    console.log("Could not generate random item");
    return false;
  }
  if (cannotInclude.some((i) => itemEquals(i, item))) {
    return generateRandomItem(cannotInclude, iterations + 1);
  }
  return item;
}

export function generateRandomRule(
  itemList,
  allowPartialDescription = { inr: false, trm: false, out: false },
  partialOdds = 0.2,
  allowCondition = true
) {
  const ruleItems = pickDistinctItems(itemList, 2);
  let rule;

  if (ruleItems) {
    rule = {
      inr: applyPartialDescription(
        ruleItems[0],
        allowPartialDescription.inr,
        partialOdds
      ),
      trm: applyPartialDescription(
        ruleItems[1],
        allowPartialDescription.trm,
        partialOdds
      ),
      dir: Math.random() < 0.5 ? "right" : "left",
      inp: "inr",
      out: null,
      cnd: null,
    };
    rule.out = applyPartialDescription(
      // TODO: For now, the condition will only be possible if the terminator is partial. There's a lot of expansion possibilities here
      generateRandomItem([rule.inr, rule.trm]),
      allowPartialDescription.out,
      partialOdds
    );
    rule.cnd = {
      target: "trm",
      value: getItemVariation(rule.trm),
      exists:
        hasPartialDescription(rule.trm) && allowCondition
          ? Math.random() < 0.5
          : false,
    };
  } else {
    console.log("Could not generate random rule");
    return false;
  }
  if (!containsIdentcalItems([rule.inr, rule.trm, rule.out])) {
    // TODO: Currently does not allow identical INR, TRM and OUT without iterative application
    return rule;
  } else {
    return generateRandomRule(itemList, allowPartialDescription, partialOdds);
  }
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
  // TODO: Maybe destructure this idk
  const initiator = rule.inr;
  const terminator = rule.trm;
  const direction = rule.dir;
  const input = rule.inp;
  const output = rule.out;
  const condition =
    rule.cnd.exists && rule.cnd.target === "trm" ? rule.cnd.value : null;

  let newItemList = [];
  let transform = false;
  let itemListCopy = [...itemList];
  if (direction === "right") {
    itemListCopy = itemListCopy.reverse();
  }

  // All cases of partial descriptions can be viewed thus:
  // 1. If the initiator is partial, then when checking for the initiator, we need to allow all attributes that match the partial description
  // 2. If the terminator is partial, then when checking for the terminator, we need to allow all attributes that match the partial description
  // 3. If the output is partial, then when pushing the output into the new item list, we need to refer back to the initiator

  if (input === "inr") {
    // TODO: Currently only supports initiator as input, no idea what to do with terminator as input
    for (const item of itemListCopy) {
      let itemToPush = null;
      if (itemIncludes(initiator, item)) {
        if (transform) {
          itemToPush = chooseOutput(output, item);
        } else {
          itemToPush = item;
        }
      }
      if (itemIncludes(terminator, item)) {
        transform = !condition || itemEquals(condition, item);
        if (itemToPush === null) {
          itemToPush = item;
        }
      } else {
        if (itemToPush === null) {
          itemToPush = item;
        }
      }
      newItemList.push(itemToPush);
    }
  }

  if (direction === "right") {
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
