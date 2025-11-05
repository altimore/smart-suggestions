import { getServerSession } from '#auth'
import prisma from '~/server/utils/prisma'
import { transformSuggestion } from '~/server/utils/db-helpers'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { search, type, status, sortBy = 'votes', page = '1', limit = '20' } = query

  const pageNum = parseInt(page as string)
  const limitNum = parseInt(limit as string)
  const skip = (pageNum - 1) * limitNum

  // Build where clause
  const where: any = {}

  if (search) {
    where.OR = [
      { title: { contains: search as string } },
      { description: { contains: search as string } },
    ]
  }

  if (type) {
    where.type = type
  }

  if (status) {
    where.status = status
  }

  // Determine sort order
  let orderBy: any = {}
  if (sortBy === 'votes') {
    // We'll calculate this manually after fetching
  } else if (sortBy === 'recent') {
    orderBy = { createdAt: 'desc' }
  } else if (sortBy === 'updated') {
    orderBy = { updatedAt: 'desc' }
  }

  const [suggestions, total] = await Promise.all([
    prisma.suggestion.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        votes: true,
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
      orderBy: orderBy.createdAt ? orderBy : { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.suggestion.count({ where }),
  ])

  // Calculate vote scores and sort if needed
  const suggestionsWithScores = suggestions.map((s) => {
    const voteScore = s.votes.reduce((sum, v) => sum + v.value, 0)
    return {
      ...transformSuggestion(s),
      voteScore,
      votes: undefined, // Remove full votes array from response
    }
  })

  if (sortBy === 'votes') {
    suggestionsWithScores.sort((a, b) => b.voteScore - a.voteScore)
  }

  return {
    suggestions: suggestionsWithScores,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  }
})
