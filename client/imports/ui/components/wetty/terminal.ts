/** TuxLab Terminal - Angular 2 Directive
    Built using Wetty
**/

// Angular Imports
import { Component, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { MdProgressCircle, MdSpinner } from '@angular2-material/progress-circle/progress-circle';

declare var io: any;
declare var lib: any;
declare var hterm: any;
declare var window: any;

@Component({
  selector: 'terminal',
  inputs: ['username','password','host','domain','path'],
  directives: [MdProgressCircle, MdSpinner],
  template: '<div class="loading-menu"><h2>LOADING LAB...</h2><center><md-progress-circular md-mode="indeterminate"></md-progress-circular><md-spinner></md-spinner></center></div>'
})
export class Terminal {
  private _viewContainer : ViewContainerRef;
  private el : ElementRef;

  @Input() username: string;
  @Input() password: string;
  @Input() host: string;
  @Input() domain: string;
  @Input() path: string = '/wetty/socket.io';

  constructor(el : ElementRef, private viewContainer:ViewContainerRef){
    this.el = el;
     this._viewContainer = viewContainer;
  }

  public openTerminal(){
    // slf
    var slf = this;

    // Clear viewContainer
    this._viewContainer.clear();

    // Create Term
    var term;
    var buf = '';

    // Connection Defaults
    var opts = {
      // SSH Connection
      username : this.username,
      password: this.password,
      host: this.host,
      // Socket.io Connection
      domain : this.domain,
      path : this.path
    }

    // Create Query Object
    var query = "username="+opts.username+"&password="+opts.password;
    if (typeof opts.host !== "undefined")
      query = query + "&host=" + opts.host;

    // Create Socket
    var socket = io(opts.domain, {path : opts.path, query : query});

    // Define WettyTerm Object
    function WettyTerm(argv){
        this.argv_ = argv || [];
        this.pid_ = -1;
        this.io = null;
    }

    // Bind Terminal Run
    WettyTerm.prototype.run = function() {
        this.io = this.argv_.io.push();

        this.io.onVTKeystroke = this.sendString_.bind(this);
        this.io.sendString = this.sendString_.bind(this);
        this.io.onTerminalResize = this.onTerminalResize.bind(this);
    }

    WettyTerm.prototype.sendString_ = function(str) {
        socket.emit('input', str);
    };

    // Terminal Rezie
    WettyTerm.prototype.onTerminalResize = function(col, row) {
        var resizeObj = {
          cols : col,
          rows : row,
          height : window.term.div_.clientHeight,
          width :  window.term.div_.clientWidth
        }
        socket.emit('resize', resizeObj );
    };

    // Terminal Connection
    socket.on('connect', function() {
        lib.init(function() {
            hterm.defaultStorage = new lib.Storage.Local();
            term = new hterm.Terminal();
            window.term = term;

            term.decorate(slf.el.nativeElement);

            term.setCursorPosition(0, 0);
            term.setCursorVisible(true);
            term.prefs_.set('ctrl-c-copy', true);
            term.prefs_.set('ctrl-v-paste', true);
            term.prefs_.set('use-default-window-copy', true);

            term.runCommandClass(WettyTerm, document.location.hash.substr(1));

            if (buf && buf != '')
            {
                term.io.writeUTF16(buf);
                buf = '';
            }
        });
    });

    // Handles Interactive Prompts
    socket.on('prompt', function(data){
      if (!term){
        buf += data.prompt;
        return;
      }
      if (!data.echo){
        //todo hide user input
      }
      term.io.writeUTF16(data.prompt);
    });

    // Handles Regular Output
    socket.on('output', function(data) {
        if (!term) {
            buf += data;
            return;
        }
        term.io.writeUTF16(data);
    });

    socket.on('disconnect', function() {
        console.log("Socket.io connection closed");
    });
  }
}
