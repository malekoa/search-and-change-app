import { React , useState, useEffect } from "react";

import RuleBox from "./components/RuleBox Components/RuleBox";
import Modal from "./components/Modal";
import Scrollbar from "./components/Scrollbar Components/Scrollbar";

import styles from "./App.module.css";
import * as ph from "./utils.js";
import ItemEditForm from "./components/ItemEditForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const length = 20;

function App() {
  const [baseItemList, setBaseItemList] = useState(
    ph.generateRandomItems(length)
  );
  const [itemList, setItemList] = useState(baseItemList);
  function addItemHandler() {
    const newItemList = [...itemList];
    newItemList.push({ color: "default", shape: "default" });
    setItemList(newItemList);
    hideModalHandler();
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

  const [ModalData, setModalData] = useState({
    isVisible: false,
    color: "default",
    shape: "default",
    index: -1,
  });
  function hideModalHandler() {
    setModalData({
      isVisible: false,
      color: "default",
      shape: "default",
      index: -1,
    });
  }

  const [rule, setRule] = useState(ph.generateRandomRule(baseItemList));
  function generateNewRule() {
    const newRule = ph.generateRandomRule(baseItemList);
    setRule(newRule);
    resetTimer();
  }
  function generateNewDataset() {
    const newDataset = ph.generateRandomItems(length);
    setBaseItemList(newDataset);
    setItemList(newDataset);
    resetTimer();
  }

  const [isPaused, setPaused] = useState(false);
  function pauseTimer() {
    setPaused(true);
  }
  function resumeTimer() {
    setPaused(false);
  }

  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);
  function resetTimer() {
    setSeconds(0);
    resumeTimer();
  }
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }

  function submit() {
    if (ph.checkRule(rule, baseItemList, itemList)) {
      toast.success("Correct!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      pauseTimer();
    } else {
      toast.error("Wrong!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
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
        {<p>Time Elapsed: {formatTime(seconds)}</p>}
      </div>

      <div className={styles.scrollbar}>
        <Scrollbar itemList={baseItemList} editable={false} />
      </div>

      <div className={styles.text}>
        <RuleBox rule={rule} />
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
        <button className={styles.action} onClick={generateNewDataset}>
          Generate new dataset
        </button>
        <button className={styles.action} onClick={generateNewRule}>
          Generate new rule
        </button>
        {!isPaused ? (
          <button className={styles.action} onClick={pauseTimer}>
            Pause
          </button>
        ) : (
          <button className={styles.action} onClick={resumeTimer}>
            Resume
          </button>
        )}
        <button
          className={styles.action}
          disabled={ph.containsDefault(itemList)}
          onClick={submit}
        >
          Submit
        </button>
      </div>
      <ToastContainer />
    </main>
  );
}

export default App;
