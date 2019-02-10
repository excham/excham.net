# excham.net
#### the code powering my _(new)(unreleased)_ site.

this was meant to just be a basic interactive terminal-like website. Now it's, well.... this.

#### Install
```
git pull https://github.com/excham/excham.net.git
cd excham.net
npm install
```

#### Build
To build, run the usual `./node_modules/.bin/webpack`. Then open up `dist/index.html` and you should be good to go.

#### Todo:
 - Add a web browser (to open links, rather than opening them in a new tab)
 - Add a text editor (nothing fancy, just to fallback on when `open` is used on a file that isn't just a url [eg. ~/contact/\*])
 - A _graphical_ file explorer for those who are not terminal-inclined, in case they just want contact info
 - Add animations when apps are minimized/maximized
 - Use urls to directly open/run commands (seems kinda dangerous tho)
 - Super cool but probably wont happen: some sort of CTF thing.

#### Known bugs:
 - Dragging windows can be annoying if the mouse leaves the window's header
