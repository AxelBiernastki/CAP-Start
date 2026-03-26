import cds from '@sap/cds'

describe('CAP-Start backend', () => {
  const { GET, POST, PATCH, DELETE, expect } = cds.test(__dirname + '/..')

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
    expect(response.data.ID).to.exist
    expect(response.data.title).to.equal('Tarefa criada em teste')
  })

  test('usuário comum não acessa AdminService', async () => {
    try {
      await GET('/admin/Tasks', {
        auth: { username: 'Axel', password: '123' }
      })
      throw new Error('Era esperado 403 para usuário comum')
    } catch (error: any) {
      if (!error.response) throw error
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
      if (!error.response) throw error
      expect(error.response.status).to.equal(403)
    }
  })

  test('admin consegue excluir no AdminService', async () => {
    const created = await POST(
      '/task/Tasks',
      {
        title: 'Tarefa para exclusão admin',
        description: 'Será excluída pelo admin',
        status: 'OPEN',
        priority: 'LOW',
        dueDate: '2026-12-31',
        isArchived: false
      },
      {
        auth: { username: 'Axel', password: '123' }
      }
    )

    const id = created.data.ID
    expect(id).to.exist

    const adminDelete = await DELETE(`/admin/Tasks(${id})`, {
      auth: { username: 'Admin', password: 'admin123' }
    })

    expect([200, 204]).to.include(adminDelete.status)
  })

  test('usuario comum atualiza a propria tarefa', async () => {
    const created = await POST(
      '/task/Tasks',
      {
        title: 'Task ownership Axel',
        description: 'Criada pelo Axel',
        status: 'OPEN',
        priority: 'MEDIUM',
        dueDate: '2026-12-31',
        isArchived: false
      },
      { auth: { username: 'Axel', password: '123' } }
    )

    const id = created.data.ID
    expect(id).to.exist

    const updated = await PATCH(
      `/task/Tasks(${id})`,
      { title: 'Task ownership Axel atualizada' },
      { auth: { username: 'Axel', password: '123' } }
    )

    expect([200, 204]).to.include(updated.status)
  })

  test('usuario comum nao atualiza tarefa de outro usuario', async () => {
    const created = await POST(
      '/task/Tasks',
      {
        title: 'Task ownership Admin',
        description: 'Criada pelo admin',
        status: 'OPEN',
        priority: 'HIGH',
        dueDate: '2026-12-31',
        isArchived: false
      },
      { auth: { username: 'Admin', password: 'admin123' } }
    )

    const id = created.data.ID
    expect(id).to.exist

    try {
      await PATCH(
        `/task/Tasks(${id})`,
        { title: 'Nao deveria atualizar' },
        { auth: { username: 'Axel', password: '123' } }
      )
      throw new Error('Era esperado 401 ou 403 no update de tarefa de outro usuario')
    } catch (error: any) {
      if (!error.response) throw error
      expect([401, 403]).to.include(error.response.status)
    }
  })

  test('admin pode atualizar qualquer tarefa no TaskService', async () => {
    const created = await POST(
      '/task/Tasks',
      {
        title: 'Task ownership Axel 2',
        description: 'Criada pelo Axel',
        status: 'OPEN',
        priority: 'LOW',
        dueDate: '2026-12-31',
        isArchived: false
      },
      { auth: { username: 'Axel', password: '123' } }
    )

    const id = created.data.ID
    expect(id).to.exist

    const updated = await PATCH(
      `/task/Tasks(${id})`,
      { title: 'Atualizada pelo admin' },
      { auth: { username: 'Admin', password: 'admin123' } }
    )

    expect([200, 204]).to.include(updated.status)
  })

  test('nao cria task com title vazio', async () => {
    try {
      await POST(
        '/task/Tasks',
        {
          title: '   ',
          description: 'Invalida',
          status: 'OPEN',
          priority: 'MEDIUM',
          dueDate: '2026-12-31',
          isArchived: false
        },
        { auth: { username: 'Axel', password: '123' } }
      )

      throw new Error('Era esperado erro de validacao para title vazio')
    } catch (error: any) {
      if (!error.response) throw error
      expect(error.response.status).to.equal(400)
    }
  })
})