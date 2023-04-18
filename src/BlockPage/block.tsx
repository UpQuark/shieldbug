import * as React from 'react';
import {createRoot} from "react-dom/client";
import BlockPage from "./BlockPage";

const container = document.getElementById('popup-root')
// @ts-ignore
const root = createRoot(container);
root.render(<BlockPage />);
