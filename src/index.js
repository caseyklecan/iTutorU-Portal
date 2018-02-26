import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {
  BrowserRouter,
  Route,
  hashHistory,
} from 'react-router-dom';
import ViewProfile from './ViewProfile';


ReactDOM.render((
  <BrowserRouter>
  <div>
    <div>
      <Route path="/profile" component={ViewProfile} />
      <Route exact path='/' component = {App} />
    </div>
    {/*} <App />*/}
    </div>
  </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
