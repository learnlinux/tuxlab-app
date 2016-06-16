/** TuxLab Terminal - Angular 2 Directive
    Built using Wetty
**/

// Angular Imports
import { Component, ElementRef, Input } from '@angular/core';

// Import HTerm
/// <reference path="hterm_all.ts"/>
declare var io: any;
declare var lib: any;
declare var hterm: any;
declare var window: any;

@Component({
  selector: 'terminal',
  template:`
    <h1>Terminal Placeholder</h1>
  `
})
export class Terminal {
  constructor (el : ElementRef){

    var term;
    var socket = io(location.origin, {path: '/ssh'})
    var buf = '';

    function Wetty(argv) {
        this.argv_ = argv;
        this.io = null;
        this.pid_ = -1;
    }

    Wetty.prototype.run = function() {
        this.io = this.argv_.io.push();

        this.io.onVTKeystroke = this.sendString_.bind(this);
        this.io.sendString = this.sendString_.bind(this);
        this.io.onTerminalResize = this.onTerminalResize.bind(this);
    }

    Wetty.prototype.sendString_ = function(str) {
        socket.emit('input', str);
    };

    Wetty.prototype.onTerminalResize = function(col, row) {
        socket.emit('resize', { col: col, row: row });
    };

    socket.on('connect', function() {
        lib.init(function() {
            hterm.defaultStorage = new lib.Storage.Local();
            term = new hterm.Terminal();
            window.term = term;
            term.decorate(el.nativeElement);

            term.setCursorPosition(0, 0);
            term.setCursorVisible(true);
            term.prefs_.set('ctrl-c-copy', true);
            term.prefs_.set('ctrl-v-paste', true);
            term.prefs_.set('use-default-window-copy', true);

            term.runCommandClass(Wetty, document.location.hash.substr(1));
            socket.emit('resize', {
                col: term.screenSize.width,
                row: term.screenSize.height
            });

            if (buf && buf != '')
            {
                term.io.writeUTF16(buf);
                buf = '';
            }
        });
    });

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
