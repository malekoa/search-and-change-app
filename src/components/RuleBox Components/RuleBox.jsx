import ItemSVG from "../SVGs/ItemSVG";
import styles from "./RuleBox.module.css";
import ArrowSVG from "../SVGs/ArrowSVG";

function RuleBox({ rule }) {
  return (
    <>
      <div className={styles.infocontainer}>
        <h3>Search: </h3>
        <div className={styles.infocontainer}>
          INR:
          <ItemSVG color={rule.inr.color} shape={rule.inr.shape} />
        </div>
        <div className={styles.infocontainer}>
          TRM:
          <ItemSVG color={rule.trm.color} shape={rule.trm.shape} />
        </div>
        <div className={styles.infocontainer}>
          DIR:
          <ArrowSVG direction={rule.dir} />
        </div>
      </div>
      <div className={styles.infocontainer}>
        <h3>Change: </h3>
        <div className={styles.infocontainer}>
          INPUT:
          {rule.inp}
        </div>
        <div className={styles.infocontainer}>
          OUTPUT:
          <ItemSVG color={rule.out.color} shape={rule.out.shape} />
        </div>
        {/* <div className={styles.infocontainer}>CND: {dir}</div> */}
      </div>
    </>
  );
}

export default RuleBox;
