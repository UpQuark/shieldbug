import * as React from 'react';
import {createRoot} from "react-dom/client";
import SettingsApp from "./SettingsApp";

const container = document.getElementById('settings-root')
// @ts-ignore
const root = createRoot(container);
root.render(<SettingsApp />);
