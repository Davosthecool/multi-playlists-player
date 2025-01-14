<script setup lang="ts">

defineProps<{ name: string, imageUrl: string}>()

</script>


<template>
    <!-- <div id="playlist-item-container">
        <img src="../assets/vue.svg" alt="">
        <p><b>{{ name }}</b></p>
    </div> -->
    <!-- <div class="card card-side bg-base-100 shadow-xl">
        <figure>
            <img
            src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
            alt="Album" />
        </figure>
        <div class="card-body">
            <h2 class="card-title">{{ name }}</h2>
        </div>
    </div> -->
    <tr>
        <td>
            <div class="flex items-center gap-3">
                <div class="avatar">
                    <div class="mask mask-squircle h-12 w-12">
                        <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt="Avatar Tailwind CSS Component" />
                    </div>
                </div>
                <div class="w-32">
                    <div class="font-bold">{{ name }}</div>
                </div>
            </div>
        </td>
    </tr>
</template>