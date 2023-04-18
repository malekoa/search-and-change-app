import { React, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import RuleBox from "./components/RuleBox Components/RuleBox";
import Modal from "./components/Modal Components/Modal";
import Scrollbar from "./components/Scrollbar Components/Scrollbar";
import ItemEditForm from "./components/Modal Components/ItemEditForm";
import InfoBox from "./components/Modal Components/InfoBox";

import InfoSVG from "./components/SVGs/InfoSVG";
import SettingsSVG from "./components/SVGs/SettingsSVG";
import MenuSVG from "./components/SVGs/MenuSVG";

import styles from "./App.module.css";
import * as ph from "./utils.js";

// Initial settings
// TODO: Move these to a settings file
// TODO: Program a range for applicable settings and include them in labels
let length = 5;
let allowPartial = { inr: false, trm: false, out: false };
let partialOdds = 0.5;
let allowCondition = false;
let numberOfRules = 1;

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
  function generateNewDataset() {
    const newDataset = ph.generateRandomItems(length);
    setBaseItemList(newDataset);
    setItemList(newDataset);
    resetTimer();
  }
  function useInputAsDataset() {
    hideMenuModalHandler();
    if (5 <= itemList.length <= 30) {
      // TODO: Location where length range is used
      setBaseItemList([...itemList]);
      resetTimer();
    } else {
      toast.error("Dataset must be between 5 and 30 items", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
  }

  // Due to previous code things the editModal's visibility is tied to editModalData.isVisible
  // instead of a separate state variable.
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
  const [settingsMenuData, setSettingsMenuData] = useState({
    length: length,
    allowPartial: allowPartial,
    partialOdds: partialOdds,
    allowCondition: allowCondition,
    numberOfRules: numberOfRules,
  });
  function showSettingsModalHandler() {
    setSettingsModalIsVisible(true);
  }
  function hideSettingsModalHandler() {
    setSettingsMenuData({
      length: length,
      allowPartial: allowPartial,
      partialOdds: partialOdds,
      allowCondition: allowCondition,
      numberOfRules: numberOfRules,
    });
    setSettingsModalIsVisible(false);
  }
  function settingsChangeHandler(event) {
    const newSettingsData = { ...settingsMenuData };
    switch (event.target.id) {
      case "length":
        newSettingsData.length = event.target.value;
        break;
      case "partialINR":
        newSettingsData.allowPartial.inr = event.target.checked;
        break;
      case "partialTRM":
        newSettingsData.allowPartial.trm = event.target.checked;
        break;
      case "partialOUT":
        newSettingsData.allowPartial.out = event.target.checked;
        break;
      case "partialOdds":
        newSettingsData.partialOdds = event.target.value;
        break;
      case "allowCondition":
        newSettingsData.allowCondition = event.target.checked;
        break;
      case "numberOfRules":
        newSettingsData.numberOfRules = event.target.value;
        break;
    }
    setSettingsMenuData(newSettingsData);
  }
  function applySettingsHandler() {
    if (5 > settingsMenuData.length || settingsMenuData.length > 30) {
      toast.error("Length must be between 5 and 30.");
      return;
    }
    if (0 > settingsMenuData.partialOdds || settingsMenuData.partialOdds > 1) {
      toast.error("Partial odds must be between 0 and 1.");
      return;
    }
    if (
      1 > settingsMenuData.numberOfRules ||
      settingsMenuData.numberOfRules > 5
    ) {
      toast.error("Number of rules must be between 1 and 10.");
      return;
    }

    length = settingsMenuData.length;
    allowPartial = settingsMenuData.allowPartial;
    partialOdds = settingsMenuData.partialOdds;
    allowCondition = settingsMenuData.allowCondition;
    numberOfRules = settingsMenuData.numberOfRules;
    hideSettingsModalHandler();
  }

  const [menuModalIsVisible, setMenuModalIsVisible] = useState(false);
  function showMenuModalHandler() {
    setMenuModalIsVisible(true);
  }
  function hideMenuModalHandler() {
    setMenuModalIsVisible(false);
  }
  function showSolutionHandler() {
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

  const [rules, setRules] = useState(
    ph.generateRandomRuleset(
      baseItemList,
      allowPartial,
      partialOdds,
      allowCondition,
      numberOfRules
    ),
  );
  function generateNewRule(index = false) {
    const newRules = [...rules];
    
    if (index===false) {
      for (let i = 0; i < numberOfRules; i++) {
        newRules[i] = ph.generateRandomRule(baseItemList.concat(ph.getRulesetOutputs(newRules.slice(0, i))));
      }
    } else {
      newRules[index] = ph.generateRandomRule(baseItemList.concat(ph.getRulesetOutputs(newRules.slice(0, index))));
    }

    setRules(newRules);
    setItemList([...baseItemList]);
    resetTimer();
  }

  function submit() {
    if (ph.checkRules(rules, [...baseItemList], [...itemList])) {
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
      {/* TODO: Put modal contents as separate components */}
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
          <InfoBox />
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
                <label htmlFor="length">Length (5-30): &nbsp;&nbsp;</label>{" "}
                {/* TODO: Maybe eventually put range as option */}
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
              <div>
                <label htmlFor="allowPartialINR">
                  Allow partial INR: &nbsp;
                </label>
                <input
                  type="checkbox"
                  id="partialINR"
                  onChange={settingsChangeHandler}
                  defaultChecked={allowPartial.inr}
                />
              </div>
              <div>
                <label htmlFor="allowPartialTRM">
                  Allow partial TRM: &nbsp;
                </label>
                <input
                  type="checkbox"
                  id="partialTRM"
                  onChange={settingsChangeHandler}
                  defaultChecked={allowPartial.trm}
                />
              </div>
              <div>
                <label htmlFor="allowPartialOUT">
                  Allow partial OUT: &nbsp;
                </label>
                <input
                  type="checkbox"
                  id="partialOUT"
                  onChange={settingsChangeHandler}
                  defaultChecked={allowPartial.out}
                />
              </div>
              <div>
                <label htmlFor="partialOdds">
                  Partial odds (0.0-1.0): &nbsp;
                </label>
                <input
                  type="number"
                  id="partialOdds"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue={partialOdds}
                  onChange={settingsChangeHandler}
                />
              </div>
              <div>
                <label htmlFor="allowCondition">
                  Allow condition on change: &nbsp;
                </label>
                <input
                  type="checkbox"
                  id="allowCondition"
                  onChange={settingsChangeHandler}
                  defaultChecked={allowCondition}
                />
              </div>
              <div>
                <label htmlFor="numberOfRules">
                  Number of rules (1-5): &nbsp;
                </label>
                <input
                  type="number"
                  id="numberOfRules"
                  min="1"
                  max="5"
                  defaultValue={numberOfRules}
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
            <button onClick={useInputAsDataset}>Use input as dataset</button>
            <button disabled>Edit rule (in progress)</button>
          </div>
        </Modal>
      )}

      {solutionModalIsVisible && (
        <Modal onClose={hideSolutionModalHandler}>
          <div className={styles.solutionbox}>
            <h2>Solution</h2>
            <Scrollbar
              itemList={ph.applyRuleset(rules, baseItemList)}
              editable={false}
              highlight={ph.findDifferenceList(
                ph.applyRuleset(rules, baseItemList),
                itemList
              )}
            />{" "}
            {/* TODO: Optimize this part by computing rule twice. Maybe add a new useState/useEffect for solution */}
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
        {rules.map((rule, index) => (
          <RuleBox
            key={"Rule " + index}
            rule={rule}
            index={index}
            onGetNewRule={() => generateNewRule(index)}
          />
        ))}
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
        <button className={styles.action} onClick={() => generateNewRule()}>
          Refresh all rules
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
