import styles from "./ItemEditForm.module.css";
import { useState } from "react";
import ItemSVG from "../SVGs/ItemSVG";
import { availableColors , availableShapes } from "../../utils";


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
              {availableColors.map((color) => (
                <option value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
              ))}
            </select>
          </label>

          <label>
            Shape:{"  "}
            <select defaultValue={(defaultShape=='add')?'default':defaultShape} onChange={shapeChangeHandler}>
              <option value="default" disabled hidden>
                Choose a shape
              </option>
              {availableShapes.map((shape) => (
                <option value={shape}>{shape.charAt(0).toUpperCase() + shape.slice(1)}</option>
              ))}
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
