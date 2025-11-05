import { getServerSession } from '#auth'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

const updateSuggestionSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  status: z.enum(['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED']).optional(),
  images: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
  links: z.array(z.string().url()).optional(),
})

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

  const body = await readBody(event)

  // Validate input
  const validationResult = updateSuggestionSchema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input',
      data: validationResult.error.errors,
    })
  }

  const data = validationResult.data

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

  // Check permissions
  const isOwner = suggestion.userId === user.id
  const isAdmin = user.role === 'ADMIN'

  // Only owner can update content, only admin can update status
  if (data.status && !isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Only admins can update suggestion status',
    })
  }

  if ((data.title || data.description || data.images || data.videos || data.links) && !isOwner && !isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'You can only edit your own suggestions',
    })
  }

  // Update suggestion
  const updated = await prisma.suggestion.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.images && { images: data.images }),
      ...(data.videos && { videos: data.videos }),
      ...(data.links && { links: data.links }),
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

  return updated
})
