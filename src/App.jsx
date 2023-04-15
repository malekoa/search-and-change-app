import React from "react";
import { useState } from "react";
import Scrollbar from "./components/Scrollbar Components/Scrollbar";
import styles from "./App.module.css";
import Timer from "./components/Timer";
import * as ph from "./utils.js";
import RuleBox from "./components/RuleBox";
import Modal from "./components/Scrollbar Components/Modal";
import ItemEditForm from "./components/Scrollbar Components/ItemEditForm";

function App() {
  const [itemList, setItemList] = useState(ph.generateRandomItems(10));
  const [ModalData, setModalData] = useState({
    isVisible: false,
    color: "default",
    shape: "default",
    index:  -1
  });
  function generateNewDataset(length) {
    console.log("Generating new dataset");
    const newDataset = ph.generateRandomItems(length);
    setItemList(newDataset);
  }

  function hideModalHandler() {
    setModalData({ isVisible: false, color: "default", shape: "default" , index:-1});
  }
  function changeDataHandler(newData) {
    const newItemList = [...itemList];
    newItemList[ModalData.index] = newData;
    setItemList(newItemList);
    hideModalHandler();
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
    <main>
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

      <div className={styles.timer}>
        <Timer />
      </div>

      <div className={styles.scrollbar}>
        <Scrollbar itemList={itemList} editable={false} />
      </div>

      <div className={styles.text}>
        <RuleBox
          inr={ph.generateRandomItems(1)[0]}
          trm={ph.generateRandomItems(1)[0]}
          dir={"Right"}
          inp={"inr"}
          out={ph.generateRandomItems(1)[0]}
        />
      </div>

      <div className={styles.scrollbar}>
        <Scrollbar
          itemList={itemList}
          editable={true}
          onShowModal={setModalData}
          onAddItem={addItemHandler}
        />
      </div>

      <div className={styles.actionscontainer}>
        <button
          className={styles.action}
          onClick={() => generateNewDataset(10)}
        >
          Generate new rule
        </button>
        <button
          className={styles.action}
          disabled={ph.containsDefault(itemList)}
        >
          Submit
        </button>
      </div>
    </main>
  );
}

export default App;
