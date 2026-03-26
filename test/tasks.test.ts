import cds from '@sap/cds'

describe('CAP-Start backend', () => {
  const { GET, POST, DELETE, expect } = cds.test(__dirname + '/..')

  test('lista tarefas no TaskService com usuário autenticado', async () => {
    const response = await GET('/task/Tasks', {
      auth: { username: 'Axel', password: '123' }
    })

    expect(response.status).to.equal(200)
    expect(response.data.value).to.exist
    expect(Array.isArray(response.data.value)).to.equal(true)
  })

  test('cria tarefa no TaskService com usuário autenticado', async () => {
    const response = await POST(
      '/task/Tasks',
      {
        title: 'Tarefa criada em teste',
        description: 'Criada via Jest',
        status: 'OPEN',
        priority: 'MEDIUM',
        dueDate: '2026-04-10',
        isArchived: false
      },
      {
        auth: { username: 'Axel', password: '123' }
      }
    )

    expect([200, 201]).to.include(response.status)
  })

  test('usuário comum não acessa AdminService', async () => {
    try {
      await GET('/admin/Tasks', {
        auth: { username: 'Axel', password: '123' }
      })
      throw new Error('Era esperado 403 para usuário comum')
    } catch (error: any) {
      expect(error.response.status).to.equal(403)
    }
  })

  test('admin acessa AdminService', async () => {
    const response = await GET('/admin/Tasks', {
      auth: { username: 'Admin', password: 'admin123' }
    })

    expect(response.status).to.equal(200)
    expect(Array.isArray(response.data.value)).to.equal(true)
  })

  test('UIConfiguration reflete contexto do usuário', async () => {
    const axelResponse = await GET('/task/UIConfiguration', {
      auth: { username: 'Axel', password: '123' }
    })

    const adminResponse = await GET('/task/UIConfiguration', {
      auth: { username: 'Admin', password: 'admin123' }
    })

    expect(axelResponse.status).to.equal(200)
    expect(adminResponse.status).to.equal(200)
    expect(axelResponse.data.isAdmin).to.equal(false)
    expect(adminResponse.data.isAdmin).to.equal(true)
  })

  test('delete administrativo fica restrito a admin', async () => {
    const list = await GET('/admin/Tasks', {
      auth: { username: 'Admin', password: 'admin123' }
    })

    const firstId = list.data.value?.[0]?.ID
    expect(firstId).to.exist

    try {
      await DELETE(`/admin/Tasks(${firstId})`, {
        auth: { username: 'Axel', password: '123' }
      })
      throw new Error('Era esperado 403 no delete do usuário comum')
    } catch (error: any) {
      expect(error.response.status).to.equal(403)
    }

    const adminDelete = await DELETE(`/admin/Tasks(${firstId})`, {
      auth: { username: 'Admin', password: 'admin123' }
    })

    expect([200, 204]).to.include(adminDelete.status)
  })
})