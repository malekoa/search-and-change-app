import { React, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RuleBox from "./components/RuleBox Components/RuleBox";
import Modal from "./components/Modal Components/Modal";
import Scrollbar from "./components/Scrollbar Components/Scrollbar";
import ItemEditForm from "./components/Modal Components/ItemEditForm";

import InfoSVG from "./components/SVGs/InfoSVG";
import SettingsSVG from "./components/SVGs/SettingsSVG";
import MenuSVG from "./components/SVGs/MenuSVG";

import ItemSVG from "./components/SVGs/ItemSVG";

import styles from "./App.module.css";
import * as ph from "./utils.js";

let length = 5;

function App() {
  const [baseItemList, setBaseItemList] = useState(
    ph.generateRandomItems(length)
  );
  const [itemList, setItemList] = useState(baseItemList);
  function addItemHandler() {
    const newItemList = [...itemList];
    newItemList.push({ color: "default", shape: "default" });
    setItemList(newItemList);
    hideEditModalHandler();
  }
  function changeDataHandler(newData) {
    const newItemList = [...itemList];
    newItemList[editModalData.index] = newData;
    setItemList(newItemList);
    hideEditModalHandler();
  }
  function deleteItemHandler() {
    const newItemList = [...itemList];
    newItemList.splice(editModalData.index, 1);
    setItemList(newItemList);
    hideEditModalHandler();
  }

  const [editModalData, setEditModalData] = useState({
    isVisible: false,
    color: "default",
    shape: "default",
    index: -1,
  });
  function hideEditModalHandler() {
    setEditModalData({
      isVisible: false,
      color: "default",
      shape: "default",
      index: -1,
    });
  }

  const [infoModalIsVisible, setInfoModalIsVisible] = useState(false);
  function showInfoModalHandler() {
    setInfoModalIsVisible(true);
  }
  function hideInfoModalHandler() {
    setInfoModalIsVisible(false);
  }

  const [isPaused, setPaused] = useState(false);
  function pauseTimer() {
    setPaused(true);
  }
  function resumeTimer() {
    setPaused(false);
  }

  // settingsMenuData is used to store the data in the settings modal until the user clicks "Apply"
  // after which the data is copied to the actual settings. On hideSettingsModalHandler, the data is reset to the actual settings.
  // To add more settings, add the setting to the state, add a new case to the settingsChangeHandler,
  // add the setting to the applySettingsHandler and reset the data in hideSettingsModalHandler.
  const [settingsModalIsVisible, setSettingsModalIsVisible] = useState(false);
  const [settingsMenuData, setSettingsMenuData] = useState({ length: length });
  function showSettingsModalHandler() {
    setSettingsModalIsVisible(true);
  }
  function hideSettingsModalHandler() {
    setSettingsMenuData({ length: length });
    setSettingsModalIsVisible(false);
  }
  function settingsChangeHandler(event) {
    const newSettingsData = { ...settingsMenuData };
    if (event.target.id === "length") {
      newSettingsData.length = event.target.value;
    }
    setSettingsMenuData(newSettingsData);
  }
  function applySettingsHandler() {
    length = settingsMenuData.length;
    hideSettingsModalHandler();
    console.log("Settings applied. Length = " + length);
  }

  const [menuModalIsVisible, setMenuModalIsVisible] = useState(false);
  function showMenuModalHandler() {
    setMenuModalIsVisible(true);
  }
  function hideMenuModalHandler() {
    setMenuModalIsVisible(false);
  }
  function showSolutionHandler() {
    hideMenuModalHandler();
    showSolutionModalHandler();
    pauseTimer();
  }
  function resetInputHandler() {
    hideMenuModalHandler();
    setItemList(baseItemList);
  }

  const [solutionModalIsVisible, setSolutionModalIsVisible] = useState(false);
  function showSolutionModalHandler() {
    setSolutionModalIsVisible(true);
  }
  function hideSolutionModalHandler() {
    setSolutionModalIsVisible(false);
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
    setItemList(baseItemList);
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
      <ItemSVG color={'grey'} shape={'undefined'} />
      {editModalData.isVisible && (
        <Modal onClose={hideEditModalHandler}>
          <ItemEditForm
            onCancel={hideEditModalHandler}
            onEditItem={changeDataHandler}
            onDeleteItem={deleteItemHandler}
            defaultColor={editModalData.color}
            defaultShape={editModalData.shape}
          />
        </Modal>
      )}

      {infoModalIsVisible && (
        <Modal onClose={hideInfoModalHandler}>
          <div className={styles.infobox}>
            <h2>Info</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque porttitor massa nec vehicula finibus. Donec elementum
              lectus leo, in sollicitudin neque luctus vitae. Sed sed dui odio.
              Ut eget tincidunt arcu. Sed aliquam congue dui vel accumsan. In
              hac habitasse platea dictumst. Praesent elementum arcu at justo
              aliquam, id molestie arcu eleifend. Nulla libero leo, viverra ut
              lacus vitae, lacinia interdum erat.
            </p>
          </div>
        </Modal>
      )}

      {settingsModalIsVisible && (
        <Modal
          onClose={hideSettingsModalHandler}
          className={styles.settingsmodal}
        >
          <div className={styles.settingsbox}>
            <h2>Settings</h2>
            <div>
              <div>
                <label htmlFor="length">Length: &nbsp;&nbsp;</label>
                <input
                  type="number"
                  id="length"
                  name="length"
                  min="5"
                  max="30"
                  defaultValue={length}
                  onChange={settingsChangeHandler}
                />
              </div>
              <div className={styles.actionscontainer}>
                <button onClick={applySettingsHandler}>Confirm</button>
                <button onClick={hideSettingsModalHandler}>Cancel</button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {menuModalIsVisible && (
        <Modal onClose={hideMenuModalHandler}>
          <div>
            <button onClick={showSolutionHandler}>Show/Compare Solution</button>
            <button onClick={resetInputHandler}>Reset Input</button>
          </div>
        </Modal>
      )}

      {solutionModalIsVisible && (
        <Modal onClose={hideSolutionModalHandler}>
          <div className={styles.solutionbox}>
            <h2>Solution</h2>
            <Scrollbar
              itemList={ph.applyRule(rule, baseItemList)}
              editable={false}
              highlight={ph.findDifferenceList(
                ph.applyRule(rule, baseItemList),
                itemList
              )}
            />{" "}
            {/* Insert proper solution and highlights here */}
          </div>
        </Modal>
      )}

      <div className={styles.actionscontainer}>
        <button className={styles.action} onClick={showInfoModalHandler}>
          <InfoSVG />
        </button>
        <button className={styles.action} onClick={showSettingsModalHandler}>
          <SettingsSVG />
        </button>
        <button className={styles.action} onClick={showMenuModalHandler}>
          <MenuSVG />
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
