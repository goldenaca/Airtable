import React from "react";
import styles from "./TimelineGrid.module.css";

const TimelineGrid = ({ monthMarkers, timelineHeight, timelinePadding }) => {
  return (
    <div className={styles.gridContainer}>
      {monthMarkers.map((marker, index) => (
        <div key={index}>
          <div
            className={styles.monthLine}
            style={{
              left: `${marker.position}px`,
              top: `${timelinePadding / 2}px`,
              height: `${timelineHeight - timelinePadding}px`,
            }}
          />
          <div
            className={styles.monthText}
            style={{
              left: `${marker.position + 5}px`,
              top: `${timelinePadding / 2 - 20}px`,
            }}
          >
            {marker.date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineGrid;
