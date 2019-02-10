const React = require('react');

const Applications = require('../../applications');

class Desktop extends React.Component {
  constructor() {
    super();

    this.openNewTerminal = this.openNewTerminal.bind(this);
  }

  openNewTerminal() {
    this.props.openWindow(
      Applications.Terminal,
      {title: 'Console', styles: {top: 100, height: 350, width: 600}, horizontalCentered: true}
    )
  }

  render() {
    return React.createElement(
      'div',
      {className: 'desktop'},
      React.createElement(
        'div',
        {className: 'desktop-icons'},
        React.createElement(
          'div',
          {className: 'desktop-icon', onClick: this.openNewTerminal},
          'terminal'
        ),
      )
    );
  }
}

module.exports = Desktop;
