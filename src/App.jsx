import React from "react";
import { useState } from "react";
import Scrollbar from "./components/Scrollbar Components/Scrollbar";
import styles from "./App.module.css";
import Timer from "./components/Timer";
import * as ph from "./utils.js"
import RuleBox from "./components/RuleBox";


function App() {
  const [itemList, setItemList] = useState(ph.generateRandomItems(10));
  function updateItemList(newItemList) {
    setItemList(newItemList);
  }

  function generateNewDataset(length) {
    console.log('Generating new dataset');
    const newDataset = ph.generateRandomItems(length);
    setItemList(newDataset);
  }
  

  return (
    <main>
      <div className={styles.timer}>
        <Timer />
      </div>

      <div className={styles.scrollbar}>
        <Scrollbar startingItemList={itemList} editable={false} />
      </div>

      <div className={styles.text}>
        <RuleBox inr={ph.generateRandomItems(1)[0]} trm={ph.generateRandomItems(1)[0]} dir={'Right'} inp={'inr'} out={ph.generateRandomItems(1)[0]}/>
      </div>


      <div className={styles.scrollbar}>
        <Scrollbar
          startingItemList={itemList}
          editable={true}
          update={updateItemList}
        />
      </div>

      <div className={styles.actionscontainer}>
        <button className={styles.action} onClick={()=>generateNewDataset(10)}>Generate new rule</button>
        <button className={styles.action} disabled={ph.containsDefault(itemList)}>Submit</button>
      </div>
    </main>
  );
}

export default App;
