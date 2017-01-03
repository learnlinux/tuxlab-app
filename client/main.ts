
// Import Angular2 and MEteor Components
import "angular2-meteor-polyfills";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import { TuxLabModule } from "./imports/app";

enableProdMode();

Meteor.startup(() => {
   platformBrowserDynamic().bootstrapModule(TuxLabModule);
});
