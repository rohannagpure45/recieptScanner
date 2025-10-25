import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WizardProvider } from './context/WizardContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WizardProvider>
      <App />
    </WizardProvider>
  </React.StrictMode>
);
