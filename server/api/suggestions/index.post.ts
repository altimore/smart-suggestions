import { getServerSession } from '#auth'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

const createSuggestionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  type: z.enum(['SOFTWARE_FEATURE', 'PRODUCT_IDEA']),
  images: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
  links: z.array(z.string().url()).optional(),
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
  const validationResult = createSuggestionSchema.safeParse(body)
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

  // Create suggestion
  const suggestion = await prisma.suggestion.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      images: data.images || [],
      videos: data.videos || [],
      links: data.links || [],
      userId: user.id,
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

  return suggestion
})
