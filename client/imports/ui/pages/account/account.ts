// Meteor Imports
    import { Meteor } from 'meteor/meteor';

// Angular Imports
    import { Component, ViewEncapsulation, provide } from '@angular/core';
    import { ActivatedRoute } from '@angular/router';
    import { InjectUser } from 'angular2-meteor-accounts-ui';

// Angular Material Imports
    import { MATERIAL_DIRECTIVES } from 'ng2-material';
    import { MeteorComponent } from 'angular2-meteor';

// Define Account Component
@Component({
  selector: 'tuxlab-account',
  templateUrl: '/client/imports/ui/pages/account/account.html',
  directives: [
    MATERIAL_DIRECTIVES
  ]
})

// Accounts Class
@InjectUser('user')
export default class Account extends MeteorComponent {
  user: Meteor.User;
  userid: string;
  cur_user: boolean;

  constructor(private route: ActivatedRoute) {
    super();
  }

  public getUserProfile(){
    if(this.cur_user){
      return this.user.profile;
    }
    else{
      return Meteor.call('getUserProfile',[this.userid]);
    }
  }

  ngOnInit(){
    this.userid = this.route.snapshot.params['userid'];
    this.cur_user = typeof this.userid === "undefined" || this.userid === null || this.userid === Meteor.userId();
  }

}
