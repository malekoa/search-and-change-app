import React from "react";
import { useState } from "react";
import Scrollbar from "./components/Scrollbar Components/Scrollbar";
import styles from "./App.module.css";
import Timer from "./components/Timer";
import * as ph from "./utils.js";
import RuleBox from "./components/RuleBox";
import Modal from "./components/Scrollbar Components/Modal";
import ItemEditForm from "./components/Scrollbar Components/ItemEditForm";

const length = 5;

function App() {
  const [baseItemList, setBaseItemList] = useState(ph.generateRandomItems(length));
  const [itemList, setItemList] = useState(baseItemList);
  const [rule, setRule] = useState(ph.generateRandomRule(baseItemList));
  const [ModalData, setModalData] = useState({
    isVisible: false,
    color: "default",
    shape: "default",
    index:  -1
  });
  function generateNewRule() {
    const newRule = ph.generateRandomRule(baseItemList);
    setRule(newRule);
  }
  function generateNewDataset() {
    const newDataset = ph.generateRandomItems(length);
    setBaseItemList(newDataset);
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
  }
  function addItemHandler() {
    const newItemList = [...itemList];
    newItemList.push({ color: "default", shape: "default" });
    setItemList(newItemList);
    hideModalHandler();
  }
  function checkIfValid() {
    if (ph.itemListEquals(baseItemList, itemList)) {
      console.log("Success");
    }
    else{
      console.log("Failure");
    }
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
        <Scrollbar itemList={baseItemList} editable={false} />
      </div>

      <div className={styles.text}>
        <RuleBox rule={rule}/>
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
          onClick={generateNewDataset}
        >
          Generate new dataset
        </button>
        <button
          className={styles.action}
          onClick={generateNewRule}
        >
          Generate new rule
        </button>
        <button
          className={styles.action}
          disabled={ph.containsDefault(itemList)}
          onClick={checkIfValid}
        >
          Submit
        </button>
      </div>
    </main>
  );
}

export default App;
