const React = require('react');

class AppBar extends React.Component {
  constructor() {
    super();
  }

  render() {
    if(this.props.windows.length == 0) {
      return (
        React.createElement(
          'div',
          {id: 'appbar', style: {color: '#BDBDBD'}},
          'There are no apps open'
        )
      )
    }
    return (
      React.createElement(
        'div',
        {id: 'appbar'},
        this.props.windows.map((e, i) => {
          console.log(e);
          return React.createElement(
            'div',
            {key: i, className: 'appbar-item'},
            e.windowProps.title
          )
        })
      )
    );
  }
}

module.exports = AppBar;
