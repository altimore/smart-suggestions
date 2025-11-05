<template>
  <div class="px-4 sm:px-0">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="mt-2 text-sm text-gray-600">Manage suggestions and moderate content</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-500 mb-1">Total Suggestions</div>
        <div class="text-3xl font-bold text-gray-900">{{ stats.total }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-500 mb-1">Pending Review</div>
        <div class="text-3xl font-bold text-yellow-600">{{ stats.pending }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-500 mb-1">Approved</div>
        <div class="text-3xl font-bold text-green-600">{{ stats.approved }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-500 mb-1">Implemented</div>
        <div class="text-3xl font-bold text-blue-600">{{ stats.implemented }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="statusFilter"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="IMPLEMENTED">Implemented</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="typeFilter"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="SOFTWARE_FEATURE">Software Feature</option>
            <option value="PRODUCT_IDEA">Product Idea</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="votes">Most Votes</option>
            <option value="recent">Most Recent</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Suggestions Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Suggestion
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Votes
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="suggestion in data?.suggestions" :key="suggestion.id">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div>
                  <NuxtLink
                    :to="`/suggestions/${suggestion.id}`"
                    class="text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {{ suggestion.title }}
                  </NuxtLink>
                  <div class="text-sm text-gray-500">
                    by {{ suggestion.user.name }} • {{ formatDate(suggestion.createdAt) }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
              >
                {{ formatType(suggestion.type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ suggestion.voteScore }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                :value="suggestion.status"
                @change="updateStatus(suggestion.id, ($event.target as HTMLSelectElement).value)"
                class="text-sm rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="IMPLEMENTED">Implemented</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button
                @click="generateSummary(suggestion.id)"
                :disabled="suggestion._count.comments === 0"
                class="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                title="Generate AI Summary"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </button>
              <button
                @click="deleteSuggestion(suggestion.id)"
                class="text-red-600 hover:text-red-900"
                title="Delete"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const statusFilter = ref('')
const typeFilter = ref('')
const sortBy = ref('votes')

const queryParams = computed(() => ({
  status: statusFilter.value,
  type: typeFilter.value,
  sortBy: sortBy.value,
}))

const { data, refresh } = await useFetch('/api/suggestions', {
  query: queryParams,
  watch: [queryParams],
})

const stats = computed(() => {
  const all = data.value?.suggestions || []
  return {
    total: all.length,
    pending: all.filter((s) => s.status === 'PENDING').length,
    approved: all.filter((s) => s.status === 'APPROVED').length,
    implemented: all.filter((s) => s.status === 'IMPLEMENTED').length,
  }
})

const updateStatus = async (id: string, status: string) => {
  try {
    await $fetch(`/api/suggestions/${id}`, {
      method: 'PUT',
      body: { status },
    })
    refresh()
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Failed to update status')
  }
}

const generateSummary = async (id: string) => {
  try {
    await $fetch(`/api/suggestions/${id}/summarize`, {
      method: 'POST',
    })
    alert('AI summary generated successfully!')
    refresh()
  } catch (error) {
    console.error('Error generating summary:', error)
    alert('Failed to generate summary')
  }
}

const deleteSuggestion = async (id: string) => {
  if (!confirm('Are you sure you want to delete this suggestion? This cannot be undone.')) return

  try {
    await $fetch(`/api/suggestions/${id}`, {
      method: 'DELETE',
    })
    refresh()
  } catch (error) {
    console.error('Error deleting suggestion:', error)
    alert('Failed to delete suggestion')
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const formatType = (type: string) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}
</script>
