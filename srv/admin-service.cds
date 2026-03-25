using {cap.start as my} from '../db/schema';

@requires: 'CapStartAdmin'
service AdminService @(path: '/admin') {
    @restrict: [{
        grant: '*',
        to   : 'CapStartAdmin'
    }]
    entity Tasks as projection on my.Tasks
}
