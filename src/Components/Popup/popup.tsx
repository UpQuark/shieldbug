import * as React from 'react';
import PopupApp from './PopupApp';
import {createRoot} from "react-dom/client";

const container = document.getElementById('popup-root')
// @ts-ignore
const root = createRoot(container);
root.render(<PopupApp />);
