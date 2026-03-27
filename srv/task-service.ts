import cds, { Request } from '@sap/cds'

export default class TaskService extends cds.ApplicationService {
  async init() {
    console.log(`AQUI EU ABRI AQUI Ó`)
    this.on('READ', 'UIConfiguration', async (req: Request) => {
      return {
        isAdmin: req.user.is('CapStartAdmin')
      }
    })

    const validateTask = (req: Request) => {
      const { title, description } = req.data ?? {}

      console.log(`Titulo: ${title}, Descrição: ${description}`)
      if (!title) {
        req.error(400, 'O campo de título é obrigatório', 'title')
      }

      if (!description) {
        req.error(400, 'A tarefa deve conter uma Descrição', 'description')
      }
    }

    this.before('CREATE', 'Tasks', validateTask)
    this.before('UPDATE', 'Tasks', validateTask)
    
    await super.init()
  }
}