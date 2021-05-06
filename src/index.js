import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './Components/App/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorkerRegistration.register();
reportWebVitals();
