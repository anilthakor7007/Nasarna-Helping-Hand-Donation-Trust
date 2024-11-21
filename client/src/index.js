import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import { Provider } from "react-redux";
import store from "../src/store/store";
import { ToastContainer} from 'react-toastify';
import AppRoutes from "./routes";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
  <BrowserRouter>
    <ToastContainer />
    <AppRoutes />
  </BrowserRouter>
</Provider>

);
