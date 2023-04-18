import ItemSVG from "../SVGs/ItemSVG";
import styles from "./RuleBox.module.css";
import ArrowSVG from "../SVGs/ArrowSVG";
import RefreshSVG from "../SVGs/RefreshSVG";

function RuleBox({ rule, editable = false, onEditRule, onGetNewRule }) {
  const disabledButton = {
    border: "none",
    outline: "none",
    background: "none",
  };
  return (
    <>
      <div className={styles.infocontainer}>
        <h3>Search: </h3>
        <div className={styles.infocontainer}>
          INR:&nbsp;
          <button
            style={!editable ? disabledButton : {}}
            disabled={!editable}
            onClick={onEditRule}
          >
            <ItemSVG color={rule.inr.color} shape={rule.inr.shape} />
          </button>
        </div>
        <div className={styles.infocontainer}>
          TRM:&nbsp;
          <button
            style={!editable ? disabledButton : {}}
            disabled={!editable}
            onClick={onEditRule}
          >
            <ItemSVG color={rule.trm.color} shape={rule.trm.shape} />
          </button>
        </div>
        <div className={styles.infocontainer}>
          DIR:&nbsp;
          <button
            style={!editable ? disabledButton : {}}
            disabled={!editable}
            onClick={onEditRule}
          >
            <ArrowSVG direction={rule.dir} />
          </button>
        </div>
        {!editable && (
          <div className={styles.infocontainer}>
            <button onClick={onGetNewRule}>
              <RefreshSVG />
            </button>
          </div>
        )}
      </div>
      <div className={styles.infocontainer}>
        <h3>Change: </h3>
        <div className={styles.infocontainer}>
          INPUT:&nbsp;
          {rule.inp.toUpperCase()}
        </div>
        <div className={styles.infocontainer}>
          OUTPUT:&nbsp;
          <button
            style={!editable ? disabledButton : {}}
            disabled={!editable}
            onClick={onEditRule}
          >
            <ItemSVG color={rule.out.color} shape={rule.out.shape} />
          </button>
        </div>
        {rule.cnd.exists && (
          <div className={styles.outline}>
            <div className={styles.infocontainer}>
              CND: {rule.cnd.target.toUpperCase()}:
              <button
                style={!editable ? disabledButton : {}}
                disabled={!editable}
                onClick={onEditRule}
              >
                <ItemSVG
                  color={rule.cnd.value.color}
                  shape={rule.cnd.value.shape}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RuleBox;
