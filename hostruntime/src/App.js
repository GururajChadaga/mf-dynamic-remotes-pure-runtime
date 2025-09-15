import React, { useState, useEffect, Suspense } from "react";
import { createInstance } from "@module-federation/runtime";

const mf = createInstance({
  name: "hostruntime",
  // adds react as shared module
  // version is inferred from package.json
  // there is no version check for the required version
  // so it will always use the higher version found
  shared: {
    react: {
      import: "react", // the "react" package will be used a provided and fallback module
      shareKey: "react", // under this name the shared module will be placed in the share scope
      shareScope: "default", // share scope with this name will be used
      singleton: true, // only a single version of the shared module is allowed
    },
    "react-dom": {
      singleton: true, // only a single version of the shared module is allowed
    },
  },
  remotes: [
    {
      name: "app2",
      entry: "http://localhost:3002/mf-manifest.json",
    },
    {
      name: "app3",
      entry: "http://localhost:3003/remoteEntry.js",
    },
  ],
});

console.log("sharescope", __webpack_share_scopes__);

function useDynamicImport({ module, scope }) {
  const [component, setComponent] = useState(null);

  useEffect(() => {
    if (!module || !scope) return;

    const loadComponent = async () => {
      try {
        const { default: Component } = await mf.loadRemote(
          `${scope}/${module}`
        );
        setComponent(() => Component);
      } catch (error) {
        console.error(`Error loading remote module ${scope}/${module}:`, error);
      }
    };

    loadComponent();
  }, [module, scope]);

  return component;
}

function App() {
  const [{ module, scope }, setSystem] = useState({});

  const setApp2 = () => {
    setSystem({
      scope: "app2",
      module: "Widget",
    });
  };

  const setApp3 = () => {
    setSystem({
      scope: "app3",
      module: "Widget",
    });
  };

  const Component = useDynamicImport({ module, scope });

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      }}
    >
      <h1>Dynamic System Host</h1>
      <h2>Using pure runtime</h2>
      <p>
        The Dynamic System will take advantage of Module Federation{" "}
        <strong>remotes</strong> and <strong>exposes</strong>. It will not load
        components that have already been loaded.
      </p>
      <button onClick={setApp2}>Load App 2 Widget</button>
      <button onClick={setApp3}>Load App 3 Widget</button>
      <div style={{ marginTop: "2em" }}>
        <Suspense fallback="Loading System">
          {Component ? <Component /> : null}
        </Suspense>
      </div>
    </div>
  );
}

export default App;
