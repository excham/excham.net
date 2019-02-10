const React = require('react');
const ReactDOM = require('react-dom');

const DesktopManager = require('./components/DesktopManager');


ReactDOM.render(
  React.createElement(
    DesktopManager
  ),
  document.getElementById('desktop')
);
