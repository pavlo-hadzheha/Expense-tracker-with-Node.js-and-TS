<template>
  <Form>
    <input type="text" v-model="username" />
    <input type="text" v-model="password" />
  </Form>
</template>

<script setup>
const username = ref('')
const password = ref('')
</script>
