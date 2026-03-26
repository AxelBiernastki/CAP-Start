import cds from '@sap/cds'

export default class TaskService extends cds.ApplicationService {
    async init() {
        this.on('READ', 'UIConfiguration', async (req) => {
            return {
                isAdmin: req.user.is('CapStartAdmin')
            }
        })

        await super.init()
    }
}