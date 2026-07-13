import { configureStore } from "@reduxjs/toolkit";

// A factory instead of a module-level singleton: Next.js runs Server
// Components per-request on the server, so a shared store would leak
// state across requests/users. StoreProvider calls this once per
// browser session instead.
export const makeStore = () => {
  return configureStore({
    reducer: {},
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
