const React = require('react');
const ReactDOM = require('react-dom/server');

const commands = require('./commands');
const files = require('./files');
const fileSystem = require('./fileSystem');

class Terminal extends React.Component {
  constructor() {
    super()


    this.homeDir = "/usr/isaac";
    // this.homeDir_obj = fileSystem['/']['usr']['isaac'];
    this.homeDir_obj = "";

    this.terminalHistory = [];

    this.state = {
      currentCommand: "",
      currentDir: this.homeDir,
      currentDir_obj: this.homeDir_obj,
      currentUser: "isaac"
    }

    this.onKeyUp = this.onKeyUp.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.commandFunctions = this.commandFunctions();
    this.cursorBlink = this.cursorBlink.bind(this);
  }

  componentDidMount() {
    document.getElementById('terminal__input').focus();
    this.onCommand('motd');
    this.onCommand('cd', ['~']);
  }

  onKeyPress(e) {
    e.preventDefault();
  }

  onKeyUp(e) {
    if(e.which == 13) {

      var cmd, args;
      args = this.state.currentCommand.split(' ');
      cmd = args[0];
      args.splice(0, 1);

      console.log(ReactDOM);

      this.terminalPrint(document.getElementById('terminal__currentLine').innerHTML);
      // this.terminalPrint(ReactDOM.renderToString(this.renderPrompt()))
      this.onCommand(cmd, args);
      this.reloadVariables();
      return;
    } else if(e.which == 8) {
      this.reloadVariables();
    }

    if(e.key.length != 1) return;

    this.setState({
      currentCommand: this.state.currentCommand + e.key
    });
  }

  onCommand(cmd, args, cb=null) {
    console.log('onCommand', cmd, args);

    if(!commands.hasOwnProperty(cmd)){
      this.terminalPrint("Unknown command. Type help for a list of commands\n");
      return;
    }

    var command = commands[cmd];

    switch (command.type) {
      case "simple":
        for (var i = 0; i < command.output.length; i++) {
          this.terminalPrint(command.output[i].replace(/ /g, '&nbsp;'));
        }
        break;
      case "command":
      console.log(123432);
        if (this.commandFunctions.hasOwnProperty(command.function)) {
          this.commandFunctions[command.function].bind(this, args)();
        }
        break;
      default:
        break;
    }

    this.render();

    if(cb) cb();
  }

  terminalPrint(line) {
    line = line.replace('\t', '&nbsp;&nbsp;&nbsp;&nbsp;')
    this.terminalHistory.push(line);
    this.terminalHistory.push(`<br />`);
  }

  reloadVariables() {
    this.setState({
      currentCommand: ""
    })
  }

  cursorBlink() {
    this.setState({
      showCursor: !this.state.showCursor
    })
  }

  dirGetFile(dir, filename) {
    var dirContents = dir['.$CONTENTS'];
    for (var i = 0; i < dirContents.length; i++) {
      if(dirContents[i] == filename) return filename;
    }
    return false;
  }

  resolvePath(path) {
    if(path == '~' || path == '') path = this.homeDir;
    if(path.slice(-1) == '/') path = path.slice(0, path.length - 1);

    var pathFrags = path.split('/');

    if(path.indexOf('/') == 0) {
      var newPath = '';
      var newPath_obj = fileSystem['/'];
      pathFrags.splice(0, 1);
    } else {
      var newPath = this.state.currentDir;
      var newPath_obj = this.state.currentDir_obj;
    }

    var attemptFile = false;

    for (var i = 0; i < pathFrags.length; i++) {
      if(!newPath_obj.hasOwnProperty(pathFrags[i])){
        attemptFile = true;
        break;
      }
      newPath += '/' + pathFrags[i];
      newPath_obj = newPath_obj[pathFrags[i]];
    }

    if(attemptFile) {
      if(newPath_obj.hasOwnProperty('.$CONTENTS')) {
        var file = this.dirGetFile(newPath_obj, pathFrags[i]);
        if(file) {
          newPath = newPath += '/' + pathFrags[i];
          return newPath;
        }
      }
    } else {
      return newPath;
    }

    return false;
  }

  pathToPathObj(path) {
    var pathFrags = path.split('/');
    var path_obj = fileSystem['/'];

    for (var i = 1; i < pathFrags.length; i++) {
      path_obj = path_obj[pathFrags[i]];
    }

    return path_obj;
  }

  renderPrompt() {
    return React.createElement(
      'span',
      {id: 'terminal__currentLine'},
      React.createElement(
        'span',
        {className: 'terminal__prompt'},
        'isaac@excham.net'
      ),
      ':',
      React.createElement(
        'span',
        {className: 'terminal__dir'},
        this.state.currentDir.replace(this.homeDir, '~')
      ),
      React.createElement(
        'span',
        {className: 'terminal__promptDollarSignThing'},
        '$'
      ),
      React.createElement(
        'span',
        {id: 'terminal__command'},
        this.state.currentCommand,
      )
    )
  }

  render() {
    return React.createElement(
      'div',
      {id: 'terminalWrapper'},
      React.createElement(
        'div',
        {id: 'terminal'},
        React.createElement(
          'div',
          {className: 'terminal__history'},
          this.terminalHistory.map((e, i) => React.createElement(
            'span',
            {key: i, dangerouslySetInnerHTML: {__html: e}}
          ))
        ),
        this.renderPrompt(),
        React.createElement(
          'span',
          {id: 'terminal__cursor', style: {display: this.state.showCursor ? 'inline-block' : 'none'}},
          '|'
        ),
        React.createElement(
          'input',
          {id: 'terminal__input', onKeyUp: this.onKeyUp, onKeyPress: this.onKeyPress}
        )
      )
    );
  }

  commandFunctions() {
    return {
      cd: function (args) {
        var path = args[0] || '';
        var newDir = this.resolvePath(path);
        console.log('commandFunctions.cd', args, path, newDir);
        if(newDir && !files.hasOwnProperty(newDir)) {
          this.setState({
            currentDir: newDir,
            currentDir_obj: this.pathToPathObj(newDir)
          })
        } else {
          console.log(1212);
          this.terminalPrint("Unable to find directory");
        }
      },
      cwd: function () {
        this.terminalPrint(this.state.currentDir);
      },
      cat: function (args) {
        if(!args[0]) {
          this.terminalPrint("You must specify a file to read.");
        }
        var path = this.resolvePath(args[0]);
        if(files.hasOwnProperty(path)) {
          var file = files[path];
          if(file.hasOwnProperty('owner')){
            if(file['owner'] !== this.state.currentUser){
              this.terminalPrint("You do not have permission to view this file");
              return;
            }
          }
          var fileContents = file['.$CONTENTS'];
          for (var i = 0; i < fileContents.length; i++) {
            this.terminalPrint(fileContents[i]);
          }
        } else {
          this.terminalPrint("Unable to find file.");
        }
      },
      clear: function () {
        this.terminalHistory = [];
      },
      ls: function () {
        var dirs = Object.keys(this.state.currentDir_obj);
        this.terminalPrint("Type&nbsp;&nbsp;Name", dirs)
        for (var i = 0; i < dirs.length - 1; i++) {
          this.terminalPrint('dir&nbsp;&nbsp;&nbsp;' + dirs[i]);
        }
        var files = this.state.currentDir_obj['.$CONTENTS'];
        for (var i = 0; i < files.length; i++) {
          this.terminalPrint('file&nbsp;&nbsp;' + files[i]);
        }
      },
      sudo: function (args) {
        var user_tmp = this.state.currentUser;
        this.setState({
          currentUser: "root"
        }, _ => {
          var cmd = args[0];
          args.splice(0, 1);
          console.log(this.state.currentUser);
          this.onCommand(cmd, args);

          this.setState({
            currentUser: user_tmp
          })
        })
      },
      open: function (args) {
        var path = this.resolvePath(args[0]);
        if(files.hasOwnProperty(path)) {
          var file = files[path];
          if(file.hasOwnProperty('owner')){
            if(file['owner'] !== this.state.currentUser){
              this.terminalPrint("You do not have permission to view this file");
              return;
            }
          }
          var fileContents = file['.$CONTENTS'];
          window.open(fileContents);
        } else {
          this.terminalPrint("Unable to find file.");
        }
      },
      whoami: function (args) {
        this.terminalPrint(this.state.currentUser);
      }
    }
  }
}

module.exports = Terminal;
