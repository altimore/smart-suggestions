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
      message: 'Comment ID is required',
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

  // Get the comment
  const comment = await prisma.comment.findUnique({
    where: { id },
  })

  if (!comment) {
    throw createError({
      statusCode: 404,
      message: 'Comment not found',
    })
  }

  // Check permissions - only owner or admin can delete
  const isOwner = comment.userId === user.id
  const isAdmin = user.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'You can only delete your own comments',
    })
  }

  // Delete comment (cascade delete will handle replies)
  await prisma.comment.delete({
    where: { id },
  })

  return { success: true }
})
