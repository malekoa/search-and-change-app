import ItemSVG from "./Scrollbar Components/ItemSVG";
import styles from "./RuleBox.module.css";
import ArrowSVG from "./ArrowSVG";

function RuleBox({ inr, trm, dir, inp, out, cnd }) {
  return (
    <>
      <div className={styles.infocontainer}>
        <h3>Search: </h3>
        <div className={styles.infocontainer}>
          INR:
          <ItemSVG color={inr.color} shape={inr.shape} />
        </div>
        <div className={styles.infocontainer}>
          TRM:
          <ItemSVG color={trm.color} shape={trm.shape} />
        </div>
        <div className={styles.infocontainer}>
          DIR:
          <ArrowSVG direction={dir} />
        </div>
      </div>
      <div className={styles.infocontainer}>
        <h3>Change: </h3>
        <div className={styles.infocontainer}>
          INPUT:
          {inp}
        </div>
        <div className={styles.infocontainer}>
          OUTPUT:
          <ItemSVG color={out.color} shape={out.shape} />
        </div>
        {/* <div className={styles.infocontainer}>CND: {dir}</div> */}
      </div>
    </>
  );
}

export default RuleBox;
