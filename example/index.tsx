import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Audio } from '../.';
const App = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Audio />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
