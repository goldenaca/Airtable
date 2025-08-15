import React from "react";
import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems.js";
import Timeline from "./components/Timeline";
import styles from "./App.module.css";

function App() {
  return (
    <div>
      <div className={styles.appHeader}>
        <h2>Airtable Timeline Visualization {"\u2728"}</h2>
        <h3>{timelineItems.length} timeline items</h3>
      </div>
      <Timeline items={timelineItems} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
