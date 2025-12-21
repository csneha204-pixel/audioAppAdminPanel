import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const navState = location.state as any;
  const [active, setActive] = useState(0);
  const [preselectedShow, setPreselectedShow] = useState<string | undefined>(undefined);

  // Only show the navigation bar if on episode list route, not the forms
  const isEpisodeListPage = /\/series\/[^/]+\/episodes$/.test(location.pathname);

  useEffect(() => {
    if (navState && typeof navState.topheaderTab === "number") {
      setActive(navState.topheaderTab);
    }
    if (navState && navState.preselectedShow) {
      setPreselectedShow(navState.preselectedShow);
    }
    // Clear state after using it so it doesn't persist on further navigation
    // (optional, but recommended for SPA UX)
    // window.history.replaceState({}, document.title);
  }, [navState]);

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
      {!isEpisodeListPage && (
        <>
          {active === 0 && <Series />}
          {active === 1 && <Episodes preselectedShow={preselectedShow} />}
          {active === 2 && <Carousels />}
        </>
      )}
    </>
  );
};

export default Topheader;
