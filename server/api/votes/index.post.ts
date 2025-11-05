import { getServerSession } from '#auth'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

const voteSchema = z.object({
  suggestionId: z.string(),
  value: z.number().int().min(1).max(1), // Only upvotes for now (value = 1)
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
  const validationResult = voteSchema.safeParse(body)
  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input',
      data: validationResult.error.errors,
    })
  }

  const { suggestionId, value } = validationResult.data

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

  // Check if user already voted
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_suggestionId: {
        userId: user.id,
        suggestionId,
      },
    },
  })

  if (existingVote) {
    // Remove vote (toggle behavior)
    await prisma.vote.delete({
      where: {
        userId_suggestionId: {
          userId: user.id,
          suggestionId,
        },
      },
    })

    return { action: 'removed', voteScore: await getVoteScore(suggestionId) }
  } else {
    // Add vote
    await prisma.vote.create({
      data: {
        userId: user.id,
        suggestionId,
        value,
      },
    })

    return { action: 'added', voteScore: await getVoteScore(suggestionId) }
  }
})

async function getVoteScore(suggestionId: string): Promise<number> {
  const votes = await prisma.vote.findMany({
    where: { suggestionId },
  })
  return votes.reduce((sum, v) => sum + v.value, 0)
}
