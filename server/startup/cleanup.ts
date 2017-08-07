/*
 * Cleanup
 * destroys containers from sessions which are destroyed
 *
 */

  import * as _ from 'lodash';

  import { log } from '../imports/service/log';

  import { Sessions } from '../../both/collections/session.collection';
  import { Session, SessionStatus } from '../../both/models/session.model';
  import { Container } from '../imports/runtime/container';

  Sessions.observable.find({
    $and : [
      {
        expires : { $gt : new Date(), $exists : true }
      },
      {
        status : { $nin : [ SessionStatus.completed, SessionStatus.failed, SessionStatus.destroyed ] }
      }
    ]
  }).subscribe((sessions : Session[]) => {
      _.forEach(sessions, (session) => {

        // Destroy First to avoid Race Conditions
        Sessions.rawCollection().findAndModify(
          {
            _id : session._id
          },
          {},
          {
            $set : { status : SessionStatus.destroyed }
          },
          {
            new: true,
            upsert: false
          }
        )

        // Destroy Session
        .then(() => {
          log.info("Destroying Session "+session._id);
          _.forEach(session.containers, (container_record) => {
              Container.destroy(container_record.container_id)
                .then(() => {
                  log.info("-- Destroyed Container "+container_record.container_id);
                })
                .catch((err) => {
                  log.warn("-- Error Destroying Container "+container_record.container_id, err);
                })
          });
        })
      });
  });
