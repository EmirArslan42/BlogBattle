import React from "react";
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/authSlice";

import Home from "./pages/Home";
import Login from "./pages/Login";
import BlogForm from "./pages/BlogForm";
import MatchPage from "./pages/MatchPage";
import Register from "./pages/Register";
import Vote from "./pages/Vote";
import Navbar from "./components/Navbar";

const store = configureStore({ reducer: { auth: authReducer } });

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/add-blog" element={<BlogForm />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/vote" element={<Vote />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default App;
