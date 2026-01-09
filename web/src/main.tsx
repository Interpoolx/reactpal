import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { bootstrapFrontend } from './lib/bootstrap';

async function init() {
    // Bootstrap modular system
    await bootstrapFrontend();

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

init().catch(console.error);
