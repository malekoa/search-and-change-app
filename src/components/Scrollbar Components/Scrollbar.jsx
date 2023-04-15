import React from "react";
import styles from "./Scrollbar.module.css";
import ItemSVG from "./ItemSVG";
import ItemAdd from "./ItemAdd";

function Scrollbar({ itemList, editable, onShowModal, onAddItem }) {
  function onItemClicked(item, index) {
    onShowModal({
      isVisible: true,
      color: item.color,
      shape: item.shape,
      index: index,
    });
  }

  return (
    <>
      <div className={styles.scrollcontainer}>
        <div className={styles.buttoncontainer}>
          {itemList.map((item, index) => (
            <button
              className={styles.itembutton}
              onClick={(e) => onItemClicked(item, index)}
              key={index}
              disabled={!editable}
            >
              <ItemSVG color={item.color} shape={item.shape} />
              <p>{index + 1}</p>
            </button>
          ))}
          {editable && <ItemAdd onItemAdd={onAddItem} />}
        </div>
      </div>
    </>
  );
}

export default Scrollbar;
