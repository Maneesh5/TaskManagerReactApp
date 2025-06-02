// - Mock Service Worker handlers
import { rest } from 'msw'

export const handlers = [
  // Mock API endpoints if your app makes HTTP requests
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          title: 'Mocked Task',
          priority: 'high',
          category: 'work',
          completed: false,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ])
    )
  }),

  rest.post('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.json({
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
      })
    )
  }),

  rest.put('/api/tasks/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: parseInt(req.params.id),
        ...req.body,
        updatedAt: new Date().toISOString()
      })
    )
  }),

  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
]