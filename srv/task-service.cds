using {cap.start as my} from '../db/schema';

@requires: 'authenticated-user'
service TaskService @(path: '/task') {

    @odata.draft.enabled
    @restrict: [
        {
            grant: 'READ',
            to   : 'authenticated-user'
        },
        {
            grant: 'CREATE',
            to   : 'authenticated-user'
        },
        {
            grant: 'UPDATE',
            to   : 'authenticated-user'
        }
    ]
    entity Tasks as projection on my.Tasks;
}
