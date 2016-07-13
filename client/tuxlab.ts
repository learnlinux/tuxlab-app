/* TuxLab - TuxLab.ts */

// Meteor Imports
    import { Meteor } from 'meteor/meteor';
    import { Mongo } from 'meteor/mongo';
    import 'reflect-metadata';
    import 'zone.js/dist/zone';

// Angular Imports
    import { Component, ViewEncapsulation, provide } from '@angular/core';
    import { bootstrap } from 'angular2-meteor-auto-bootstrap';

    import { APP_BASE_HREF } from '@angular/common';
    import { HTTP_PROVIDERS } from '@angular/http';

// Angular Material Imports
    import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
    import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'
    import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
    import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
    import { MeteorComponent } from 'angular2-meteor';

// Routes
    import { ROUTER_DIRECTIVES, RouterConfig } from '@angular/router';
    import { ROUTE_PROVIDERS } from './routes.ts'

// Define TuxLab Component
@Component({
    selector: 'tuxlab',
    templateUrl: '/client/tuxlab.html',
    directives: [ ROUTER_DIRECTIVES,
                  MATERIAL_DIRECTIVES,
                  MD_TOOLBAR_DIRECTIVES,
                  MD_ICON_DIRECTIVES,
                  MD_SIDENAV_DIRECTIVES,
                 ],
    viewProviders: [MdIconRegistry]
})

class TuxLab extends MeteorComponent {
    user: Meteor.User;
		userId = Meteor.userId();
    constructor(mdIconRegistry: MdIconRegistry) {
        super();
        // Create Icon Font
        mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
        mdIconRegistry.setDefaultFontSetClass('tuxicon');
    }
    tuxLogout() {
        Meteor.logout();
        window.location.href = "/";
    }
}

bootstrap(TuxLab, [
	MATERIAL_PROVIDERS,
	HTTP_PROVIDERS,
	MdIconRegistry,
	ROUTE_PROVIDERS,
	provide(APP_BASE_HREF, { useValue: '/' })]);
