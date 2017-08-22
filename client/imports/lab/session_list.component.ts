// Meteor Imports
	import { Meteor } from 'meteor/meteor';
	import { MeteorComponent } from 'angular2-meteor';

// Angular Imports
	import { Component, Input, ChangeDetectorRef } from '@angular/core';
  import { ObservableCursor } from "meteor-rxjs";
  import { Observable } from 'rxjs/Observable';

// Define Session List Class
  import template from "./session_list.component.html";
  import style from "./session_list.component.scss";

// Import Course Data
	import { Lab } from '../../../both/models/lab.model';
	import { Labs } from '../../../both/collections/lab.collection';

	import { Session, SessionStatus } from '../../../both/models/session.model';
	import { Sessions } from '../../../both/collections/session.collection';

	import { User, Role } from '../../../both/models/user.model';
	import { Users } from '../../../both/collections/user.collection';

  @Component({
    selector: 'tuxlab-session-list-item',
    template : `

    <md-card *ngIf="lab" fxLayout="row" fxLayoutAlign="start">

      <!-- Status Chip -->
      <ng-container [ngSwitch]="session?.status">
        <md-chip *ngSwitchCase="SessionStatus.creating" style="background-color:#3498db;">Active</md-chip>
				<md-chip *ngSwitchCase="SessionStatus.active" style="background-color:#3498db;">Active</md-chip>
				<md-chip *ngSwitchCase="SessionStatus.completed" style="background-color:#2ecc71;">Completed</md-chip>
				<md-chip *ngSwitchCase="SessionStatus.failed" style="background-color:#e74c3c">Failed</md-chip>
				<md-chip *ngSwitchCase="SessionStatus.destroyed" style="background-color:#e67e22">Destroyed</md-chip>
      </ng-container>

      <!-- Lab Name -->
      <h2>{{ lab.name }}</h2>

      <!-- Button -->
			<a md-button [routerLink]="['courses',lab?.course_id, 'labs', lab?._id]"><md-icon>launch</md-icon></a>
			
    </md-card>

    `,
    styles: [  ]
  })

// Export Session List Item Class
  export class SessionListItem extends MeteorComponent {
    @Input('session') session : Session;
		private SessionStatus = SessionStatus;

    private lab : Lab;

    constructor(private ref : ChangeDetectorRef) {
      super();
    }

    ngOnInit(){
      Meteor.subscribe('labs.course', this.session._id, () => {
        this.lab = Labs.findOne({ _id : this.session.lab_id });
        this.ref.markForCheck();
      })
    }
  }

  @Component({
    selector: 'tuxlab-session-list',
    template,
    styles: [ style ]
  })

// Export Session List Class
  export class SessionList extends MeteorComponent {
    private sessions : ObservableCursor<Session>;

    constructor(private ref : ChangeDetectorRef) {
      super();
    }

    ngOnInit(){

      // Get Sessions
      Meteor.subscribe('Sessions.user', () => {
        this.ref.markForCheck();
      });

      this.sessions = Sessions.observable.find({
        user_id : Meteor.userId()
      });
    }
  }
