<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-0">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Create New Suggestion</h1>
      <p class="mt-2 text-sm text-gray-600">
        Share your idea with the community. Be clear and descriptive!
      </p>
    </div>

    <form @submit.prevent="submitSuggestion" class="bg-white rounded-lg shadow p-6 space-y-6">
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          Title <span class="text-red-500">*</span>
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          maxlength="200"
          placeholder="Brief, descriptive title for your suggestion"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p class="mt-1 text-xs text-gray-500">{{ form.title.length }}/200 characters</p>
      </div>

      <!-- Type -->
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
          Type <span class="text-red-500">*</span>
        </label>
        <select
          id="type"
          v-model="form.type"
          required
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a type...</option>
          <option value="SOFTWARE_FEATURE">Software Feature</option>
          <option value="PRODUCT_IDEA">Product Idea</option>
        </select>
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
          Description <span class="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="8"
          required
          placeholder="Provide a detailed description of your suggestion. What problem does it solve? How would it work?"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p class="mt-1 text-xs text-gray-500">Be as detailed as possible</p>
      </div>

      <!-- Images -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image URLs (Optional)
        </label>
        <div class="space-y-2">
          <div v-for="(image, index) in form.images" :key="index" class="flex space-x-2">
            <input
              v-model="form.images[index]"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              @click="form.images.splice(index, 1)"
              class="px-3 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            @click="form.images.push('')"
            class="text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Add Image URL
          </button>
        </div>
      </div>

      <!-- Videos -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Video URLs (Optional)
        </label>
        <div class="space-y-2">
          <div v-for="(video, index) in form.videos" :key="index" class="flex space-x-2">
            <input
              v-model="form.videos[index]"
              type="url"
              placeholder="https://example.com/video.mp4"
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              @click="form.videos.splice(index, 1)"
              class="px-3 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            @click="form.videos.push('')"
            class="text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Add Video URL
          </button>
        </div>
      </div>

      <!-- Links -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Reference Links (Optional)
        </label>
        <div class="space-y-2">
          <div v-for="(link, index) in form.links" :key="index" class="flex space-x-2">
            <input
              v-model="form.links[index]"
              type="url"
              placeholder="https://example.com"
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              @click="form.links.splice(index, 1)"
              class="px-3 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            @click="form.links.push('')"
            class="text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Add Link
          </button>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-sm text-red-800">{{ errorMessage }}</p>
      </div>

      <!-- Submit -->
      <div class="flex justify-end space-x-3">
        <NuxtLink
          to="/suggestions"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="submitting"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ submitting ? 'Creating...' : 'Create Suggestion' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const submitting = ref(false)
const errorMessage = ref('')

const form = reactive({
  title: '',
  type: '',
  description: '',
  images: [] as string[],
  videos: [] as string[],
  links: [] as string[],
})

const submitSuggestion = async () => {
  submitting.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/suggestions', {
      method: 'POST',
      body: {
        title: form.title,
        type: form.type,
        description: form.description,
        images: form.images.filter((url) => url.trim()),
        videos: form.videos.filter((url) => url.trim()),
        links: form.links.filter((url) => url.trim()),
      },
    })

    // @ts-ignore
    router.push(`/suggestions/${response.id}`)
  } catch (error: any) {
    console.error('Error creating suggestion:', error)
    errorMessage.value = error.data?.message || 'Failed to create suggestion. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
