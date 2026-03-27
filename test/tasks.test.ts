import cds from '@sap/cds'

describe('CAP-Start backend - Task draft flow', () => {
  const { GET, POST, PATCH, DELETE, expect } = cds.test(__dirname + '/..')

  const axel = { auth: { username: 'Axel', password: '123' } }
  const admin = { auth: { username: 'Admin', password: 'admin123' } }

  const unique = (prefix: string) => `${prefix} ${Date.now()} ${Math.floor(Math.random() * 100000)}`

  async function expectHttpError(
    fn: () => Promise<any>,
    allowedStatus: number | number[]
  ) {
    try {
      await fn()
      throw new Error(`Era esperado erro HTTP ${JSON.stringify(allowedStatus)}`)
    } catch (error: any) {
      if (!error.response) throw error
      const expected = Array.isArray(allowedStatus) ? allowedStatus : [allowedStatus]
      expect(expected).to.include(error.response.status)
    }
  }

  async function createDraftAsAxel(payload?: Record<string, any>) {
    const response = await POST(
      '/task/Tasks',
      {
        title: unique('Criado para teste'),
        description: 'Criada via Jest',
        isArchived: false,
        ...payload
      },
      axel
    )

    expect([200, 201]).to.include(response.status)
    expect(response.data.ID).to.exist
    expect(response.data.IsActiveEntity).to.equal(false)

    return response.data
  }

  async function activateDraftAsAxel(id: string) {
    const response = await POST(
      `/task/Tasks(ID=${id},IsActiveEntity=false)/draftActivate`,
      {},
      axel
    )

    expect([200, 201]).to.include(response.status)
    return response
  }

  async function createAndActivateTaskAsAxel(payload?: Record<string, any>) {
    const draft = await createDraftAsAxel(payload)
    await activateDraftAsAxel(draft.ID)
    return draft.ID
  }

  test('1) Exibe os drafts passando usuário', async () => {
    await createDraftAsAxel({ title: unique('Draft listado Axel') })

    const response = await GET('/task/Tasks?$filter=IsActiveEntity eq false', axel)

    expect(response.status).to.equal(200)
    expect(response.data.value).to.exist
    expect(Array.isArray(response.data.value)).to.equal(true)
    expect(response.data.value.some((task: any) => task.IsActiveEntity === false)).to.equal(true)
  })

  test('2) Exibe a lista dos dados salvos sem autenticação', async () => {
    const id = await createAndActivateTaskAsAxel({ title: unique('Task pública salva') })

    const response = await GET('/task/Tasks?$filter=IsActiveEntity eq true')

    expect(response.status).to.equal(200)
    expect(Array.isArray(response.data.value)).to.equal(true)
    expect(response.data.value.some((task: any) => task.ID === id && task.IsActiveEntity === true)).to.equal(true)
  })

  test('3) Cria um draft com usuário logado', async () => {
    const response = await POST(
      '/task/Tasks',
      {
        title: unique('Criado para teste'),
        description: 'Criada via Jest',
        isArchived: false
      },
      axel
    )

    expect([200, 201]).to.include(response.status)
    expect(response.data.ID).to.exist
    expect(response.data.title).to.exist
    expect(response.data.IsActiveEntity).to.equal(false)
  })

  test('4) Cria um draft sem título com usuário logado', async () => {
    const response = await POST(
      '/task/Tasks',
      {
        title: '',
        description: 'Criada via Jest',
        isArchived: false
      },
      axel
    )

    expect([200, 201]).to.include(response.status)
    expect(response.data.ID).to.exist
    expect(response.data.IsActiveEntity).to.equal(false)
    expect(response.data.title).to.equal('')
  })

  test('5) Edita o draft com o usuário correto', async () => {
    const draft = await createDraftAsAxel({ title: unique('Draft original') })

    const response = await PATCH(
      `/task/Tasks(ID=${draft.ID},IsActiveEntity=false)`,
      {
        title: 'Draft atualizado',
        isArchived: false
      },
      axel
    )

    expect([200, 204]).to.include(response.status)

    const readBack = await GET(`/task/Tasks(ID=${draft.ID},IsActiveEntity=false)`, axel)
    expect(readBack.status).to.equal(200)
    expect(readBack.data.ID).to.equal(draft.ID)
    expect(readBack.data.IsActiveEntity).to.equal(false)
    expect(readBack.data.title).to.equal('Draft atualizado')
  })

  test('6) Salva o draft com título preenchido', async () => {
    const draft = await createDraftAsAxel({ title: unique('Draft para ativar') })

    const response = await POST(
      `/task/Tasks(ID=${draft.ID},IsActiveEntity=false)/draftActivate`,
      {},
      axel
    )

    expect([200, 201]).to.include(response.status)

    const active = await GET(`/task/Tasks(ID=${draft.ID},IsActiveEntity=true)`)
    expect(active.status).to.equal(200)
    expect(active.data.ID).to.equal(draft.ID)
    expect(active.data.IsActiveEntity).to.equal(true)
  })

  test('7) Não salva o draft com título vazio', async () => {
    const draft = await createDraftAsAxel({
      title: '',
      description: 'Draft inválido para ativação'
    })

    await expectHttpError(
      () => POST(`/task/Tasks(ID=${draft.ID},IsActiveEntity=false)/draftActivate`, {}, axel),
      [400, 422]
    )
  })

  test('8) Edita a tarefa salva passando o ID com o usuário correto', async () => {
  const id = await createAndActivateTaskAsAxel({ title: unique('Tarefa ativa original') })

  const draftEdit = await POST(
    `/task/Tasks(ID=${id},IsActiveEntity=true)/draftEdit`,
    {},
    axel
  )

  expect([200, 201]).to.include(draftEdit.status)

  const draftPatch = await PATCH(
    `/task/Tasks(ID=${id},IsActiveEntity=false)`,
    {
      title: 'Tarefa atualizada',
      isArchived: false
    },
    axel
  )

  expect([200, 204]).to.include(draftPatch.status)

  const activated = await POST(
    `/task/Tasks(ID=${id},IsActiveEntity=false)/draftActivate`,
    {},
    axel
  )

  expect([200, 201]).to.include(activated.status)

  const readBack = await GET(`/task/Tasks(ID=${id},IsActiveEntity=true)`)
  expect(readBack.status).to.equal(200)
  expect(readBack.data.title).to.equal('Tarefa atualizada')
  expect(readBack.data.IsActiveEntity).to.equal(true)
})

  test('9) Admin não deleta draft pendente pelo endpoint de ativo', async () => {
  const draft = await createDraftAsAxel({ title: unique('Draft não salvo') })

  await expectHttpError(
    () => DELETE(`/task/Tasks(ID=${draft.ID},IsActiveEntity=true)`, admin),
    403
  )
})

  test('10) Admin deleta tarefa salva', async () => {
    const id = await createAndActivateTaskAsAxel({ title: unique('Tarefa para exclusão admin') })

    const response = await DELETE(`/task/Tasks(ID=${id},IsActiveEntity=true)`, admin)

    expect([200, 204]).to.include(response.status)

    await expectHttpError(
      () => GET(`/task/Tasks(ID=${id},IsActiveEntity=true)`),
      404
    )
  })
})