import { createInstance } from "@module-federation/runtime";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";

const mf = createInstance({
  name: "app2",
  shared: {
    moment: deps.moment,
    react: {
      requiredVersion: deps.react,
      import: "react", // the "react" package will be used a provided and fallback module
      shareKey: "react", // under this name the shared module will be placed in the share scope
      shareScope: "default", // share scope with this name will be used
      // singleton: true, // only a single version of the shared module is allowed
    },
    "react-dom": {
      requiredVersion: deps["react-dom"],
      // singleton: true, // only a single version of the shared module is allowed
    },
  },
});

ReactDOM.render(<App />, document.getElementById("root"));
