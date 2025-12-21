import React, { useState } from "react";
import styles from "./Topheader.module.css";
import Series from "../series/Series";
import Episodes from "../episodes/Episodes";
import Carousels from "../carousels/Carousels";

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
      {active === 1 && <Episodes />}
      {active === 2 && <Carousels />}
    </>
  );
};

export default Topheader;
