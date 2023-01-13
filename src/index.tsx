import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/js/dist/dropdown.js'
import { legacy_createStore as createStore} from 'redux'
import { useReducer } from './components/reducer/useReducer';
import { Provider } from 'react-redux'; 
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const store = createStore(useReducer)
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
