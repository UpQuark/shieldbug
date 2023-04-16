import {createRoot} from "react-dom/client";
import * as React from "react";
import SettingsApp from "./SettingsApp";

const container = document.getElementById('settings-root')
// @ts-ignore
const root = createRoot(container);
root.render(<SettingsApp />);