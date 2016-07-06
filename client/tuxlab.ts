/* TuxLab - TuxLab.ts */

// Meteor Imports
    import { Meteor } from 'meteor/meteor';
    import { Mongo }       from 'meteor/mongo';
    import 'reflect-metadata';
    import 'zone.js/dist/zone';

// Angular Imports
    import { Component, ViewEncapsulation, provide } from '@angular/core';
    import { bootstrap } from 'angular2-meteor-auto-bootstrap';

    import { APP_BASE_HREF } from '@angular/common';
    import { HTTP_PROVIDERS } from '@angular/http';
    import { RouterLink, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig } from '@angular/router-deprecated';

    import { InjectUser } from 'angular2-meteor-accounts-ui';

// Angular Material Imports
    import { MATERIAL_PROVIDERS, MATERIAL_DIRECTIVES } from 'ng2-material';
    import { MeteorComponent } from 'angular2-meteor';
    import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';

// Toolbar
    import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';

// Icon
    import { MD_ICON_DIRECTIVES, MdIconRegistry } from '@angular2-material/icon'

// UI Imports
    import { Dashboard } from "./imports/ui/pages/dashboard/dashboard"
    import { Login } from "./imports/ui/pages/account/login"
    import { Account } from "./imports/ui/pages/account/account"
    import { Err404 } from "./imports/ui/pages/error/404"
    import { TaskView } from "./imports/ui/pages/lab/taskview";
    import { CourseView } from "./imports/ui/pages/course/course";
    import { LabView } from "./imports/ui/pages/course/lablist";
    import { GradeView } from "./imports/ui/pages/course/gradelist";
    import { Explore } from "./imports/ui/pages/explore/explore";
    import { Instructor } from "./imports/ui/pages/instructor/instructor";
    import { Terms } from "./imports/ui/pages/static/terms";
    import { Privacy } from "./imports/ui/pages/static/privacy";

// Define TuxLab Component
@Component({
    selector: 'tuxlab',
    templateUrl: '/client/tuxlab.html',
    directives: [ ROUTER_DIRECTIVES,
                  MATERIAL_DIRECTIVES,
                  MD_TOOLBAR_DIRECTIVES,
                  MD_ICON_DIRECTIVES,
                  MD_SIDENAV_DIRECTIVES,
                  RouterLink ],
    viewProviders: [MdIconRegistry],
    encapsulation: ViewEncapsulation.None
})

// Define TuxLab Routes
@RouteConfig([
    { path: '/', component: Dashboard },
    { path: '/login', component: Login },
    { path: '/lab', component: TaskView },
    { path: '/course', component: CourseView },
    { path: '/labs', component: LabView },
    { path: '/grades', component: GradeView },
    { path: '/explore', component: Explore },
    { path: '/instructor', component: Instructor },
    { path: '/terms', component: Terms },
    { path: '/privacy', component: Privacy },
//  { path: '/course/:courseid', as: 'CourseView', component: CourseView },
//  { path: '/course/:courseid/users', as: 'UserList', component: UserList },
//  { path: '/course/:courseid/user/:userid', as: 'UserView', component: UserView },
//  { path: '/course/:courseid/labs', as: 'LabList', component: LabList },
//  { path: '/course/:courseid/lab/:labid', as: 'LabView', component: LabView },
    { path: '/account/:userid', component: Account },
    { path: '/**', component: Err404 }
])

@InjectUser("user")
class TuxLab extends MeteorComponent {
    user: Meteor.User;
    constructor(mdIconRegistry: MdIconRegistry) {
        super();
        // Create Icon Font
        mdIconRegistry.registerFontClassAlias('tux', 'tuxicon');
        mdIconRegistry.setDefaultFontSetClass('tuxicon');
    }
    tuxLogout() {
        Meteor.logout();
    }
    toAccount() {
        window.location.href="/account/:" + this.user._id;
    }
}    


bootstrap(TuxLab, [
	MATERIAL_PROVIDERS,
	HTTP_PROVIDERS,
	MdIconRegistry,
	ROUTER_PROVIDERS,
	provide(APP_BASE_HREF, { useValue: '/' })]);
