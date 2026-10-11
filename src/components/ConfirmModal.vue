
<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Delete record?'
  },
  message: {
    type: String,
    default: 'This action cannot be undone.'
  },
  busy: Boolean
})

const emit = defineEmits(['cancel', 'confirm'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal-backdrop"
      @click.self="emit('cancel')"
    >
      <section
        class="modal-card"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="modal-symbol">!</div>
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>

        <div class="modal-actions">
          <button
            class="btn btn-quiet"
            :disabled="busy"
            @click="emit('cancel')"
          >
            Cancel
          </button>

          <button
            class="btn btn-danger"
            :disabled="busy"
            @click="emit('confirm')"
          >
            {{ busy ? 'Deleting…' : 'Yes, delete' }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
