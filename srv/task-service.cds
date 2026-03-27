using {cap.start as my} from '../db/schema';

service TaskService @(path: '/task') {

  @odata.draft.enabled
  @restrict: [
    {
      grant: 'READ',
      to   : 'any'
    },
    {
      grant: 'CREATE',
      to   : 'authenticated-user'
    },
    {
      grant: 'UPDATE',
      to   : 'authenticated-user',
      where: (createdBy = $user)
    },
    {
      grant: 'DELETE',
      to   : 'CapStartAdmin'
    },
    {
      grant: 'advanceToInProgress',
      to   : 'authenticated-user',
      where: (createdBy = $user)
    },
    {
      grant: 'advanceToDone',
      to   : 'authenticated-user',
      where: (createdBy = $user)
    },
    {
      grant: 'advanceToInProgress',
      to   : 'CapStartAdmin'
    },
    {
      grant: 'advanceToDone',
      to   : 'CapStartAdmin'
    }
  ]
  entity Tasks as projection on my.Tasks
    actions {
      @from: #Aberta @to: #Fazendo
      action advanceToInProgress() returns Tasks;

      @from: #Fazendo @to: #Concluida
      action advanceToDone() returns Tasks;
    };
  
  annotate Tasks with @flow.status: status;

  @readonly
  @odata.singleton
  @restrict: [{
    grant: 'READ',
    to   : 'any'
  }]
  entity UIConfiguration {
    isAdmin : Boolean;
  }
}
