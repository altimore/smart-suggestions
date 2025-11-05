import { getServerSession } from '#auth'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const id = getRouterParam(event, 'id')

  if (!session?.user?.email) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Suggestion ID is required',
    })
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  // Get the suggestion
  const suggestion = await prisma.suggestion.findUnique({
    where: { id },
  })

  if (!suggestion) {
    throw createError({
      statusCode: 404,
      message: 'Suggestion not found',
    })
  }

  // Check permissions - only owner or admin can delete
  const isOwner = suggestion.userId === user.id
  const isAdmin = user.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'You can only delete your own suggestions',
    })
  }

  // Delete suggestion (cascade delete will handle votes and comments)
  await prisma.suggestion.delete({
    where: { id },
  })

  return { success: true }
})
