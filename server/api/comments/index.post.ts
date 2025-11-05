import { getServerSession } from '#auth'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

const commentSchema = z.object({
  suggestionId: z.string(),
  content: z.string().min(1).max(5000),
  parentId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user?.email) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const body = await readBody(event)

  // Validate input
  const validationResult = commentSchema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input',
      data: validationResult.error.errors,
    })
  }

  const { suggestionId, content, parentId } = validationResult.data

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

  // Check if suggestion exists
  const suggestion = await prisma.suggestion.findUnique({
    where: { id: suggestionId },
  })

  if (!suggestion) {
    throw createError({
      statusCode: 404,
      message: 'Suggestion not found',
    })
  }

  // If parentId provided, check if parent comment exists
  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    })

    if (!parentComment || parentComment.suggestionId !== suggestionId) {
      throw createError({
        statusCode: 404,
        message: 'Parent comment not found',
      })
    }
  }

  // Create comment
  const comment = await prisma.comment.create({
    data: {
      content,
      userId: user.id,
      suggestionId,
      parentId: parentId || null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })

  return comment
})
