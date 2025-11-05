<template>
  <div class="px-4 sm:px-0">
    <div v-if="pending" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-sm text-gray-500">Loading suggestion...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 rounded-lg p-4">
      <p class="text-sm text-red-800">Error loading suggestion. Please try again.</p>
    </div>

    <div v-else-if="data">
      <!-- Back button -->
      <NuxtLink
        to="/suggestions"
        class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to suggestions
      </NuxtLink>

      <!-- Main content -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-start space-x-4">
            <!-- Vote -->
            <div class="flex flex-col items-center space-y-1">
              <button
                @click="handleVote"
                :disabled="status !== 'authenticated'"
                class="group flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-colors"
                :class="[
                  data.userVote
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-300 hover:border-indigo-600 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 disabled:opacity-50',
                ]"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <span class="text-lg font-bold text-gray-700">{{ data.voteScore }}</span>
            </div>

            <!-- Title and meta -->
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <h1 class="text-3xl font-bold text-gray-900">{{ data.title }}</h1>
                <span
                  class="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="statusColor(data.status)"
                >
                  {{ formatStatus(data.status) }}
                </span>
              </div>
              <div class="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                <img
                  v-if="data.user.image"
                  :src="data.user.image"
                  :alt="data.user.name"
                  class="h-6 w-6 rounded-full"
                />
                <span>{{ data.user.name }}</span>
                <span>•</span>
                <span>{{ formatDate(data.createdAt) }}</span>
                <span>•</span>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ formatType(data.type) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="p-6 border-b border-gray-200">
          <p class="text-gray-700 whitespace-pre-wrap">{{ data.description }}</p>

          <!-- Media attachments -->
          <div v-if="data.images?.length || data.videos?.length || data.links?.length" class="mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Attachments</h3>

            <!-- Images -->
            <div v-if="data.images?.length" class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <img
                v-for="(image, index) in data.images"
                :key="index"
                :src="image"
                :alt="`Image ${index + 1}`"
                class="rounded-lg object-cover h-48 w-full"
              />
            </div>

            <!-- Videos -->
            <div v-if="data.videos?.length" class="space-y-4 mb-4">
              <video
                v-for="(video, index) in data.videos"
                :key="index"
                controls
                class="rounded-lg w-full"
              >
                <source :src="video" />
              </video>
            </div>

            <!-- Links -->
            <div v-if="data.links?.length" class="space-y-2">
              <a
                v-for="(link, index) in data.links"
                :key="index"
                :href="link"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                {{ link }}
              </a>
            </div>
          </div>
        </div>

        <!-- AI Summary -->
        <div v-if="data.commentsSummary" class="p-6 bg-indigo-50 border-b border-gray-200">
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">AI Summary</h3>
              <p class="text-gray-700">{{ data.commentsSummary }}</p>
              <p class="mt-2 text-xs text-gray-500">
                Generated {{ formatDate(data.lastSummaryAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Comments ({{ data._count.comments }})
          </h2>

          <!-- Comment form -->
          <div v-if="status === 'authenticated'" class="mb-8">
            <textarea
              v-model="newComment"
              rows="3"
              placeholder="Share your thoughts..."
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <div class="mt-2 flex justify-end">
              <button
                @click="submitComment()"
                :disabled="!newComment.trim()"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Post Comment
              </button>
            </div>
          </div>

          <!-- Comments list -->
          <div class="space-y-6">
            <CommentThread
              v-for="comment in data.comments"
              :key="comment.id"
              :comment="comment"
              :suggestion-id="data.id"
              @refresh="refresh"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { status } = useAuth()
const id = route.params.id as string
const newComment = ref('')

const { data, pending, error, refresh } = await useFetch(`/api/suggestions/${id}`)

const handleVote = async () => {
  try {
    await $fetch('/api/votes', {
      method: 'POST',
      body: {
        suggestionId: id,
        value: 1,
      },
    })
    refresh()
  } catch (error) {
    console.error('Error voting:', error)
  }
}

const submitComment = async (parentId?: string) => {
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: {
        suggestionId: id,
        content: newComment.value,
        parentId,
      },
    })
    newComment.value = ''
    refresh()
  } catch (error) {
    console.error('Error posting comment:', error)
  }
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

const formatType = (type: string) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-gray-100 text-gray-800',
    IN_REVIEW: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    IMPLEMENTED: 'bg-blue-100 text-blue-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>
