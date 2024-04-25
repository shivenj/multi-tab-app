import { Switch, Route, Redirect, useLocation, useHistory } from "react-router";

import "./App.css";
import Dashboard from "./Dashboard";
import Protocol from "./Protocol";

function App() {
  return (
    <Switch>
      <Route exact path={"/"} component={Dashboard} />
      <Route exact path={"/protocol/333"} component={Protocol} />
    </Switch>
  );
}

export default App;
