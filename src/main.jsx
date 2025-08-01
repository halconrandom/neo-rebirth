import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/ThemeProvider"; // 👈

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f1f1f',
            color: '#fff',
          },
          success: {
            style: {
              background: '#16a34a',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
