import React from 'react';
import { AmplifyProvider, Authenticator } from '@aws-amplify/ui-react';
import Amplify from 'aws-amplify';
import ReactDOM from 'react-dom/client';
import App from './App';
import awsExports from './aws-exports';
import { UserProvider } from './components/appuser';
import './index.css';
import reportWebVitals from './reportWebVitals';
Amplify.configure(awsExports);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AmplifyProvider>
  <Authenticator.Provider>
    <UserProvider>
      <App />
    </UserProvider>
  </Authenticator.Provider>
</AmplifyProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
