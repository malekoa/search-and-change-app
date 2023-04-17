import { React , useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RuleBox from "./components/RuleBox Components/RuleBox";
import Modal from "./components/Modal Components/Modal";
import Scrollbar from "./components/Scrollbar Components/Scrollbar";
import ItemEditForm from "./components/Modal Components/ItemEditForm";

import InfoSVG from "./components/SVGs/InfoSVG";
import SettingsSVG from "./components/SVGs/SettingsSVG";
import MenuSVG from "./components/SVGs/MenuSVG";

import styles from "./App.module.css";
import * as ph from "./utils.js";

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
    newItemList[EditModalData.index] = newData;
    setItemList(newItemList);
    hideModalHandler();
  }
  function deleteItemHandler() {
    const newItemList = [...itemList];
    newItemList.splice(EditModalData.index, 1);
    setItemList(newItemList);
    hideModalHandler();
  }

  const [EditModalData, setEditModalData] = useState({
    isVisible: false,
    color: "default",
    shape: "default",
    index: -1,
  });
  function hideModalHandler() {
    setEditModalData({
      isVisible: false,
      color: "default",
      shape: "default",
      index: -1,
    });
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

  const [rule, setRule] = useState(ph.generateRandomRule(baseItemList));
  function generateNewRule() {
    const newRule = ph.generateRandomRule(baseItemList);
    setRule(newRule);
    setItemList(baseItemList)
    resetTimer();
  }
  function generateNewDataset() {
    const newDataset = ph.generateRandomItems(length);
    setBaseItemList(newDataset);
    setItemList(newDataset);
    resetTimer();
  }

  function submit() {
    if (ph.checkRule(rule, [...baseItemList], [...itemList])) {
      toast.success("Correct! Final time: " + formatTime(seconds), {
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
      {EditModalData.isVisible && (
        <Modal onClose={hideModalHandler}>
          <ItemEditForm
            onCancel={hideModalHandler}
            onEditItem={changeDataHandler}
            onDeleteItem={deleteItemHandler}
            defaultColor={EditModalData.color}
            defaultShape={EditModalData.shape}
          />
        </Modal>
      )}
      
      <div className={styles.actionscontainer}>
          <button className={styles.action}>
              <InfoSVG/>
          </button>
          <button className={styles.action}>
              <SettingsSVG/>
          </button>
          <button className={styles.action}>
              <MenuSVG/>
          </button>
      </div>

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
          onShowModal={setEditModalData}
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
