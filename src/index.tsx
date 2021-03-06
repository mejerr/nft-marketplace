import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import { globalStyle } from "./styles";
const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

// @ts-ignore
declare global {
  // tslint:disable-next-line
  interface Window {
    web3: any;
    ethereum: any;
    Web3Modal: any;
    Box: any;
    box: any;
    space: any;
  }
}

ReactDOM.render(
  <BrowserRouter>
    <App />
    <ToastContainer style={{ width: "500px" }} position={toast.POSITION.TOP_CENTER} />
    <GlobalStyle />
  </BrowserRouter>,
  document.getElementById("root")
);
