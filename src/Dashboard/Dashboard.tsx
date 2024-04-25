import React from "react";
import { alertProtocolTab, goToProtocolTab } from "../serviceWorkerModule";

const Dashboard = () => {
  return (
    <>
      <h1>DASHBOARD</h1>
      <br />
      <br />
      <a href="/protocol/333" target="_blank" rel="noopener noreferrer">
        <button>Go to Protocol in New Tab</button>
      </a>
      <br />
      <br />
      <button onClick={(e) => goToProtocolTab(e, 333)}>
        Focus Protocol 333
      </button>
      <br />
      <br />
      <button onClick={(e) => alertProtocolTab(e, 333)}>
        Alert Protocol 333
      </button>
    </>
  );
};

export default Dashboard;
