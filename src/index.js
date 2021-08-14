import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './Components/App/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

/*100vh Sur Mobile*/
const metas = document.getElementsByTagName('meta');
// metas[1].content =
//   'width=device-width, height=' +
//   window.innerHeight +
//   ' initial-scale=1.0, maximum-scale=5.0,user-scalable=0';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorkerRegistration.register();
reportWebVitals();
