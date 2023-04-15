import styles from "./ItemEditForm.module.css";
import { useState } from "react";
import ItemSVG from "./ItemSVG";

function ItemEditForm({
  onCancel,
  onDeleteItem,
  onEditItem,
  defaultColor,
  defaultShape,
}) {
  const [selectedColor, setSelectedColor] = useState((defaultShape=='add')?'default':defaultColor);
  const [selectedShape, setSelectedShape] = useState((defaultShape=='add')?'default':defaultShape);

  function colorChangeHandler(event) {
    setSelectedColor(event.target.value);
  }
  function shapeChangeHandler(event) {
    setSelectedShape(event.target.value);
  }

  function deleteItemHandler() {
    onDeleteItem();
    onCancel();
  }

  function submitHandler(event) {
    event.preventDefault();
    const itemData = {
      color: selectedColor,
      shape: selectedShape,
    }
    onEditItem(itemData);
    onCancel();
  }

  return (
    <div>
      <form className={styles.form} onSubmit={submitHandler}>
        <div>
          <label>
            Color:{"  "}
            <select defaultValue={(defaultShape=='add')?'default':defaultColor} onChange={colorChangeHandler}>
              <option value="default" disabled hidden>
                Choose a color
              </option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="orange">Orange</option>
            </select>
          </label>

          <label>
            Shape:{"  "}
            <select defaultValue={(defaultShape=='add')?'default':defaultShape} onChange={shapeChangeHandler}>
              <option value="default" disabled hidden>
                Choose a shape
              </option>
              <option value="square">Square</option>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="triangle">Triangle</option>
            </select>
          </label>
          <ItemSVG color={selectedColor} shape={selectedShape} /> {/*TODO: Align image with dropdowns*/}
        </div>
        <p className={styles.actions}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" onClick={deleteItemHandler}>
            Delete
          </button>
          <button disabled={selectedColor=='default' || selectedShape== 'default'}>Submit</button>
        </p>
      </form>
    </div>
  );
}

export default ItemEditForm;
