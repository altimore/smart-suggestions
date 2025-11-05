<template>
  <div class="flex space-x-3">
    <img
      v-if="comment.user.image"
      :src="comment.user.image"
      :alt="comment.user.name"
      class="h-10 w-10 rounded-full flex-shrink-0"
    />
    <div class="flex-1">
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <span class="font-medium text-gray-900">{{ comment.user.name }}</span>
            <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <button
            v-if="canDelete"
            @click="deleteComment"
            class="text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
        <p class="text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>
        <button
          v-if="status === 'authenticated'"
          @click="showReplyForm = !showReplyForm"
          class="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
        >
          Reply
        </button>
      </div>

      <!-- Reply form -->
      <div v-if="showReplyForm" class="mt-3 ml-4">
        <textarea
          v-model="replyContent"
          rows="2"
          placeholder="Write a reply..."
          class="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
        />
        <div class="mt-2 flex justify-end space-x-2">
          <button
            @click="showReplyForm = false"
            class="px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            @click="submitReply"
            :disabled="!replyContent.trim()"
            class="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Reply
          </button>
        </div>
      </div>

      <!-- Nested replies -->
      <div v-if="comment.replies?.length" class="mt-4 space-y-4 ml-4 border-l-2 border-gray-200 pl-4">
        <CommentThread
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          :suggestion-id="suggestionId"
          @refresh="$emit('refresh')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  comment: any
  suggestionId: string
}>()

const emit = defineEmits<{
  refresh: []
}>()

const { status, data: session } = useAuth()
const showReplyForm = ref(false)
const replyContent = ref('')

const canDelete = computed(() => {
  return session.value?.user?.id === props.comment.userId || session.value?.user?.role === 'ADMIN'
})

const submitReply = async () => {
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: {
        suggestionId: props.suggestionId,
        content: replyContent.value,
        parentId: props.comment.id,
      },
    })
    replyContent.value = ''
    showReplyForm.value = false
    emit('refresh')
  } catch (error) {
    console.error('Error posting reply:', error)
  }
}

const deleteComment = async () => {
  if (!confirm('Are you sure you want to delete this comment?')) return

  try {
    await $fetch(`/api/comments/${props.comment.id}`, {
      method: 'DELETE',
    })
    emit('refresh')
  } catch (error) {
    console.error('Error deleting comment:', error)
  }
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}
</script>
