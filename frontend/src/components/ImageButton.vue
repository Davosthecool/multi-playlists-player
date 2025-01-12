<template>
    <button class="image-button" @click="onClick">
      <img :src="imagePath" :alt="altText" class="button-image" />
      <slot />
    </button>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  
  export default defineComponent({
    name: 'ImageButton',
    props: {
      image: {
        type: String,
        required: true,
      },
      altText: {
        type: String,
        default: 'Button image',
      },
    },
    emits: ['click'],
    setup(props, { emit }) {
      const imagePath = computed(() => new URL(`../assets/${props.image}`, import.meta.url).href);

      const onClick = () => {
        emit('click');
      };

      return {
        imagePath,
        onClick,
      };
    },
  });
  </script>
  
  <style scoped>
  .image-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    cursor: pointer;

    max-width: 50px;
    max-height: 50px;
    border-radius: 5px;
    padding: 5px;
    background-color: black;
  }
  
  .button-image {
    width: 45px;
    height: 45px;
    object-fit: scale-down;
  }
  </style>
  