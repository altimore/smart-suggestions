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

  // Only admins can trigger summarization
  if (user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      message: 'Only admins can generate summaries',
    })
  }

  // Get suggestion with comments
  const suggestion = await prisma.suggestion.findUnique({
    where: { id },
    include: {
      comments: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
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

  if (suggestion.comments.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No comments to summarize',
    })
  }

  // Generate summary using OpenAI
  const summary = await generateCommentsSummary(suggestion)

  // Update suggestion with summary
  const updated = await prisma.suggestion.update({
    where: { id },
    data: {
      commentsSummary: summary,
      lastSummaryAt: new Date(),
    },
  })

  return { summary: updated.commentsSummary }
})

async function generateCommentsSummary(suggestion: any): Promise<string> {
  const config = useRuntimeConfig()
  const apiKey = config.openaiApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'OpenAI API key not configured',
    })
  }

  // Prepare comments text
  const commentsText = suggestion.comments
    .map((c: any) => `${c.user.name || 'Anonymous'}: ${c.content}`)
    .join('\n\n')

  const prompt = `You are summarizing comments on a suggestion titled "${suggestion.title}".

Description: ${suggestion.description}

Comments:
${commentsText}

Please provide a concise summary (2-4 sentences) of the main points, concerns, and suggestions from the community discussion. Focus on actionable insights and common themes.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that summarizes community discussions on product suggestions.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating summary:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to generate summary',
    })
  }
}
