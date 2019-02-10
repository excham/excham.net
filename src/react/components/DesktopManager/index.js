const React = require('react');

const Terminal = require('../../applications/Terminal');
const AppBar = require('../AppBar');
const Desktop = require('../Desktop');
const Window = require('../Window');

class DesktopManager extends React.Component {
  constructor() {
    super();


    this.windowWidth = document.body.clientWidth;
    this.windowHeight = document.body.clientHeight;

    this.state = {
      windows: []
    }

    this.openWindow = this.openWindow.bind(this);
  }

  componentDidMount() {
    // this.openWindow(Terminal, {title: 'Console', styles: {top: 100, height: 350, width: 600, left: this.horizontalCenter(600)}})
  }

  openWindow(windowType, windowProps, props) {
    props = props || {};

    if(windowProps.styles && windowProps.horizontalCentered) {
      windowProps.styles.left = (this.windowWidth - windowProps.styles.width) / 2;
    }

    var id = 'win' + this.state.windows.length;

    props.doWindowAction = this.doWindowAction.bind(this, id);
    windowProps.doWindowAction = props.doWindowAction;
    windowProps.key = id;

    console.log(1212, windowProps);

    this.setState({
      windows: this.state.windows.concat([
        {id: id, type: windowType, windowProps: windowProps, props: props}
      ])
    })
  }

  closeWindow(id) {
    var windows = Array.from(this.state.windows);

    windows.splice(this.getWindow(id, true), 1)

    this.setState({
      windows: windows
    })
  }

  minimizeWindow(id) {
    console.log('minimize', this.getWindow(id));
  }

  maximizeWindow(id) {
    console.log('maxamize', this.getWindow(id));
  }

  doWindowAction(id, action, args) {
    if(action == 'closeWindow' || action == 'minimizeWindow' || action == 'maximizeWindow') {
      this[action].call(this, id, args)
    }
  }

  getWindow(id, returnIndex = false) {
    for (var i = 0; i < this.state.windows.length; i++) {
      var window = this.state.windows[i];
      if(window.id == id) return returnIndex ? i : window;
    }
    return null;
  }

  render() {
    return (
      React.createElement(
        'div',
        {className: '--desktop-container'},
        React.createElement(
          Desktop,
          {openWindow: this.openWindow}
        ),
        this.state.windows.map((e, i) => {
          if(e.closed) return null;
          return React.createElement(
            Window,
            e.windowProps,
            React.createElement(
              e.type,
              e.props
            )
          );
        }),
        React.createElement(
          AppBar,
          {windows: this.state.windows}
        )
      )
    );
  }
}

module.exports = DesktopManager;
