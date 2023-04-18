import React from "react";
import styles from "./Scrollbar.module.css";
import ItemSVG from "../SVGs/ItemSVG";
import ItemAdd from "./ItemAdd";

function Scrollbar({
  itemList,
  editable,
  onShowModal,
  onAddItem,
  highlight = [],
}) {
  function onItemClicked(item, index) {
    onShowModal({
      isVisible: true,
      color: item.color,
      shape: item.shape,
      index: index,
    });
  }
  
  const disabledButton = {
    border: "none",
    outline: "none",
    background: "none",
  };

  return (
    <>
      <div className={styles.scrollcontainer}>
        <div className={styles.buttoncontainer}>
          {itemList.map((item, index) => (
            <button
              className={styles.itembutton}
              onClick={() => onItemClicked(item, index)}
              key={index}
              style={!editable ? disabledButton : {}}
              disabled={!editable}
            >
              <ItemSVG color={item.color} shape={item.shape} />
              <p
                style={{
                  backgroundColor: highlight.includes(index)
                    ? "orange"
                    : "transparent",
                }}
              >
                {" "}
                {/* TODO: Maybe eventually round borders */}
                {index + 1}
              </p>
            </button>
          ))}
          {editable && <ItemAdd onItemAdd={onAddItem} />}
        </div>
      </div>
    </>
  );
}

export default Scrollbar;
