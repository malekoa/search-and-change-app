import React from "react";
import styles from "./Scrollbar.module.css";
import { useState } from "react";
import ItemSVG from "./ItemSVG";
import Modal from "./Modal";
import ItemEditForm from "./ItemEditForm";
import ItemAdd from "./ItemAdd";

function Scrollbar({ startingItemList, editable , update}) {
  const [ModalData, setModalData] = useState({
    isVisible: false,
    color: "default",
    shape: "default",
  });
  function hideModalHandler() {
    setModalData({ isVisible: false, color: "default", shape: "default" });
  }
  function onItemClicked(item, index) {
    setModalData({
      isVisible: true,
      color: item.color,
      shape: item.shape,
      index: index,
    });
  }

  const [itemList, setItemList] = useState(startingItemList);
  function changeDataHandler(newData) {
    const newItemList = [...itemList];
    newItemList[ModalData.index] = newData;
    setItemList(newItemList);
    hideModalHandler();
    update(newItemList);
  }
  function deleteItemHandler() {
    const newItemList = [...itemList];
    newItemList.splice(ModalData.index, 1);
    setItemList(newItemList);
    hideModalHandler();
    update(newItemList);
  }
  function addItemHandler() {
    const newItemList = [...itemList];
    newItemList.push({ color: "default", shape: "default" });
    setItemList(newItemList);
    hideModalHandler();
    update(newItemList);
  }

  return (
    <>
      {ModalData.isVisible && (
        <Modal onClose={hideModalHandler}>
          <ItemEditForm
            onCancel={hideModalHandler}
            onEditItem={changeDataHandler}
            onDeleteItem={deleteItemHandler}
            defaultColor={ModalData.color}
            defaultShape={ModalData.shape}
          />
        </Modal>
      )}
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
          {editable && <ItemAdd onItemAdd={addItemHandler} />}
        </div>
      </div>
    </>
  );
}

export default Scrollbar;
