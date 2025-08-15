import React from "react";
import styles from "./TimelineControls.module.css";

const TimelineControls = ({ zoomLevel, onZoomIn, onZoomOut }) => {
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={onZoomOut}>
        Zoom Out
      </button>
      <span className={styles.zoomLabel}>
        Zoom: {Math.round(zoomLevel * 100)}%
      </span>
      <button className={styles.button} onClick={onZoomIn}>
        Zoom In
      </button>
    </div>
  );
};

export default TimelineControls;
