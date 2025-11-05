<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-2xl font-bold text-indigo-600">SuggestHub</span>
            </NuxtLink>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                to="/suggestions"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
              >
                Suggestions
              </NuxtLink>
              <NuxtLink
                v-if="status === 'authenticated' && session?.user?.role === 'ADMIN'"
                to="/admin"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
              >
                Admin
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center">
            <div v-if="status === 'loading'" class="text-sm text-gray-500">Loading...</div>
            <div v-else-if="status === 'authenticated'" class="flex items-center space-x-4">
              <NuxtLink
                to="/suggestions/new"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                New Suggestion
              </NuxtLink>
              <div class="flex items-center space-x-3">
                <img
                  v-if="session?.user?.image"
                  :src="session.user.image"
                  :alt="session.user.name || 'User'"
                  class="h-8 w-8 rounded-full"
                />
                <span class="text-sm font-medium text-gray-700">{{ session?.user?.name }}</span>
                <button
                  @click="signOut({ callbackUrl: '/' })"
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
            <div v-else>
              <NuxtLink
                to="/auth/signin"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign In
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { data: session, status, signOut } = useAuth()
</script>
