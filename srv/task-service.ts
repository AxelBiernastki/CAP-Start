import cds from '@sap/cds'

export default class TaskService extends cds.ApplicationService {
  async init() {
    this.on('READ', 'UIConfiguration', async (req) => {
      return {
        isAdmin: req.user.is('CapStartAdmin')
      }
    })

    const validateTitle = (req: any) => {
      const title = req.data?.title
      if (typeof title === 'string' && !title.trim()) {
        req.reject(400, 'Title must not be blank')
      }
    }

    this.before('CREATE', 'Tasks', validateTitle)
    this.before('UPDATE', 'Tasks', validateTitle)

    await super.init()
  }
}