import styles from "./InfoBox.module.css";

function InfoBox() {
  return (
    <div className={styles.infobox}>
      <h2>Info</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        porttitor massa nec vehicula finibus. Donec elementum lectus leo, in
        sollicitudin neque luctus vitae. Sed sed dui odio. Ut eget tincidunt
        arcu. Sed aliquam congue dui vel accumsan. In hac habitasse platea
        dictumst. Praesent elementum arcu at justo aliquam, id molestie arcu
        eleifend. Nulla libero leo, viverra ut lacus vitae, lacinia interdum
        erat.
      </p>
    </div>
  );
}

export default InfoBox;
