import React, { useState } from "react";
import styles from "./Topheader.module.css";
import Series from "../series/Series";

const options = [
  { label: "SERIES" },
  { label: "EPISODES" },
  { label: "CAROUSELS" },
];

const Topheader: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className={styles.topheaderBar}>
        {options.map((opt, idx) => (
          <span
            key={opt.label}
            className={
              styles.topheaderOption +
              (active === idx ? " " + styles.active : "")
            }
            onClick={() => setActive(idx)}
          >
            {opt.label}
          </span>
        ))}
      </div>
      {active === 0 && <Series />}
    </>
  );
};

export default Topheader;
