const React = require('react');

// Todo:
//  - Move mouse events for dragging window into #desktop scope

class Window extends React.Component {
  constructor() {
    super();

    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    // Some sort of bug means I can't directly call props.doWindowAction,
    // instead I must ensure the event was a click
    this.closeWindow = this.onWindowAction.bind(this, 'closeWindow');
    this.minimizeWindow = this.onWindowAction.bind(this, 'minimizeWindow');
  }

  componentWillMount() {
    this.setState({
      styles: this.props.styles
    })
  }

  onMouseUp() {
    this.setState({
      windowMove: {
        move: false
      }
    });
  }

  onMouseDown(e) {
    if(e.target.className == 'window-close')
      return;
    if(this.state.windowMove && this.state.windowMove.move)
      return;

    e.preventDefault();

    var clickX = e.clientX,
        clickY = e.clientY,
        windowX = this.state.styles.left,
        windowY = this.state.styles.top,

        x = clickX - windowX,
        y = clickY - windowY;

    this.setState({
      windowMove: {
        move: true,

        clickX: clickX,
        clickY: clickY,
        windowX: windowX,
        windowY: windowY,
        x: x,
        y: y
      }
    })
  }

  onMouseMove(e) {
    if(this.state.windowMove && this.state.windowMove.move) {
      var windowMove = this.state.windowMove,
          dy = e.pageY - windowMove.clickY,
          dx = e.pageX - windowMove.clickX,
          x = windowMove.windowX + dx,
          y = windowMove.windowY + dy;

      var styles = Object.assign({}, this.state.styles);

      styles.left = x;
      styles.top = y;

      this.setState({
        styles: styles
      })
    }
  }

  onWindowAction(action, e) {
    if(e.type != 'click') return;
    this.props.doWindowAction(action);
  }

  render() {
    return (
      React.createElement(
        'div',
        {className: 'window', style: this.state.styles},
        React.createElement(
          'div',
          {className: 'window-header', onMouseUp: this.onMouseUp, onMouseDown: this.onMouseDown, onMouseMove: this.onMouseMove, onMouseOut: this.onMouseUp},
          this.props.title,
          React.createElement(
            'div',
            {className: 'window-close', onClick: this.closeWindow},
            'x'
          ),
          React.createElement(
            'div',
            {className: 'window-close', onClick: this.minimizeWindow},
            '_'
          )
        ),
        React.createElement(
          'div',
          {className: 'window-content', style: {height: this.state.styles.height - 24}},
          this.props.children
        )
      )
    );
  }
}

module.exports = Window;
