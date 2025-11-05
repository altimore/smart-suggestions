import { getServerSession } from '#auth'
import prisma from '~/server/utils/prisma'
import { transformSuggestion } from '~/server/utils/db-helpers'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const session = await getServerSession(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Suggestion ID is required',
    })
  }

  const suggestion = await prisma.suggestion.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      votes: true,
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        where: {
          parentId: null, // Only get top-level comments
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
  })

  if (!suggestion) {
    throw createError({
      statusCode: 404,
      message: 'Suggestion not found',
    })
  }

  // Calculate vote score
  const voteScore = suggestion.votes.reduce((sum, v) => sum + v.value, 0)

  // Check if current user has voted
  let userVote = null
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (user) {
      userVote = suggestion.votes.find((v) => v.userId === user.id)
    }
  }

  return {
    ...transformSuggestion(suggestion),
    voteScore,
    userVote: userVote?.value || null,
    votes: undefined, // Remove full votes array
  }
})
