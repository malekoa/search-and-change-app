import ItemSVG from "../SVGs/ItemSVG";
import styles from "./RuleBox.module.css";
import ArrowSVG from "../SVGs/ArrowSVG";

function RuleBox({ rule }) {
  return (
    <>
      <div className={styles.infocontainer}>
        <h3>Search: </h3>
        <div className={styles.infocontainer}>
          INR:&nbsp;&nbsp;
          <ItemSVG color={rule.inr.color} shape={rule.inr.shape} />
        </div>
        <div className={styles.infocontainer}>
          TRM:&nbsp;&nbsp;
          <ItemSVG color={rule.trm.color} shape={rule.trm.shape} />
        </div>
        <div className={styles.infocontainer}>
          DIR:&nbsp;&nbsp;
          <ArrowSVG direction={rule.dir} />
        </div>
      </div>
      <div className={styles.infocontainer}>
        <h3>Change: </h3>
        <div className={styles.infocontainer}>
          INPUT:&nbsp;
          {rule.inp.toUpperCase()}
        </div>
        <div className={styles.infocontainer}>
          OUTPUT:&nbsp;&nbsp;
          <ItemSVG color={rule.out.color} shape={rule.out.shape} />
        </div>
        {rule.cnd.display && (
          <div className={styles.outline}>
            <div className={styles.infocontainer}>
              CND: {rule.cnd.target.toUpperCase()}:
              <ItemSVG
                color={rule.cnd.value.color}
                shape={rule.cnd.value.shape}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RuleBox;
