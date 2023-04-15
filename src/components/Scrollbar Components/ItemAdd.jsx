import styles from "./ItemAdd.module.css";

function ItemAdd({ onItemAdd }) {
  return (
    <>
    <button className={styles.itemaddbutton} onClick={onItemAdd}>
      <svg
        width="50"
        height="50"
        viewBox="-120 -120 240 240"
        stroke="black"
        strokeWidth="10"
      >
        <circle
          cx="0"
          cy="0"
          r="75"
          fill="gray"
          stroke="black"
          strokeWidth="10"
        />
        <line x1="-50" y1="0" x2="50" y2="0" stroke="black" strokeWidth="10" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke="black" strokeWidth="10" />
      </svg>
    </button></>
  );
}

export default ItemAdd;
