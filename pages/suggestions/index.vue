<template>
  <div class="px-4 sm:px-0">
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Suggestions</h1>
        <p class="mt-2 text-sm text-gray-700">Browse and vote on community suggestions</p>
      </div>
      <NuxtLink
        v-if="status === 'authenticated'"
        to="/suggestions/new"
        class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        New Suggestion
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search suggestions..."
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="statusFilter"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
            <option value="IMPLEMENTED">Implemented</option>
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

    <!-- Suggestions List -->
    <div v-if="pending" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-sm text-gray-500">Loading suggestions...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 rounded-lg p-4">
      <p class="text-sm text-red-800">Error loading suggestions. Please try again.</p>
    </div>

    <div v-else-if="data?.suggestions.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <p class="text-gray-500">No suggestions found. Be the first to create one!</p>
    </div>

    <div v-else class="space-y-4">
      <SuggestionCard
        v-for="suggestion in data?.suggestions"
        :key="suggestion.id"
        :suggestion="suggestion"
        @vote="handleVote"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="data?.pagination && data.pagination.totalPages > 1"
      class="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow"
    >
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === data.pagination.totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing page <span class="font-medium">{{ currentPage }}</span> of
            <span class="font-medium">{{ data.pagination.totalPages }}</span>
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === data.pagination.totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { status } = useAuth()
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const sortBy = ref('votes')
const currentPage = ref(1)

const queryParams = computed(() => ({
  search: searchQuery.value,
  type: typeFilter.value,
  status: statusFilter.value,
  sortBy: sortBy.value,
  page: currentPage.value,
}))

const { data, pending, error, refresh } = await useFetch('/api/suggestions', {
  query: queryParams,
  watch: [queryParams],
})

const handleVote = async (suggestionId: string) => {
  try {
    await $fetch('/api/votes', {
      method: 'POST',
      body: {
        suggestionId,
        value: 1,
      },
    })
    refresh()
  } catch (error) {
    console.error('Error voting:', error)
  }
}

// Reset to page 1 when filters change
watch([searchQuery, typeFilter, statusFilter, sortBy], () => {
  currentPage.value = 1
})
</script>
