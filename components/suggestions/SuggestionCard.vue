<template>
  <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
    <div class="flex items-start space-x-4">
      <!-- Vote Button -->
      <div class="flex flex-col items-center space-y-1">
        <button
          @click="$emit('vote', suggestion.id)"
          class="group flex flex-col items-center justify-center w-12 h-12 rounded-lg border-2 transition-colors"
          :class="[
            suggestion.userVote
              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
              : 'border-gray-300 hover:border-indigo-600 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600',
          ]"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <span class="text-sm font-medium text-gray-700">{{ suggestion.voteScore }}</span>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <NuxtLink
              :to="`/suggestions/${suggestion.id}`"
              class="text-xl font-semibold text-gray-900 hover:text-indigo-600"
            >
              {{ suggestion.title }}
            </NuxtLink>
            <div class="mt-1 flex items-center space-x-2 text-sm text-gray-500">
              <span>by {{ suggestion.user.name }}</span>
              <span>•</span>
              <span>{{ formatDate(suggestion.createdAt) }}</span>
            </div>
          </div>
          <div class="ml-4 flex-shrink-0">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="statusColor(suggestion.status)"
            >
              {{ formatStatus(suggestion.status) }}
            </span>
          </div>
        </div>

        <p class="mt-3 text-gray-600 line-clamp-2">
          {{ suggestion.description }}
        </p>

        <!-- Tags -->
        <div class="mt-4 flex items-center space-x-4">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ formatType(suggestion.type) }}
          </span>
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              {{ suggestion._count.comments }} comments
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  suggestion: any
}>()

defineEmits<{
  vote: [suggestionId: string]
}>()

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
