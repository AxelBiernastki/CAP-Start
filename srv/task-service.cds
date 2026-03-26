using { cap.start as my } from '../db/schema';

service TaskService @(path: '/task') {

  @odata.draft.enabled
  @restrict: [
    { grant: 'READ',   to: 'any' },
    { grant: 'CREATE', to: 'authenticated-user' },
    { grant: 'UPDATE', to: 'authenticated-user', where: (createdBy = $user) },
    { grant: 'DELETE', to: 'CapStartAdmin' }
  ]
  entity Tasks as projection on my.Tasks;

  @readonly
  @odata.singleton
  @restrict: [
    { grant: 'READ', to: 'any' }
  ]
  entity UIConfiguration {
    isAdmin : Boolean;
  }
}