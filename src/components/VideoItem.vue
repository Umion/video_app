<script setup lang="ts">
import { defineProps } from 'vue'
import type { VideoModel } from '@/api/video/model'
import PlayIcon from '@/components/icons/PlayIcon.vue'
import BlockIcon from '@/components/icons/BlockIcon.vue'

const props = defineProps<{
  item: VideoModel
  videoId: string
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const submit = () => {
  if (!props.disabled) emit('submit')
}

</script>

<template lang="pug">
.item(
  :class="{disabled}"
  @click="submit"
)
  .item__preview
    el-image(
      class="item__preview-img"
      :src="`https://img.youtube.com/vi/${props.videoId}/0.jpg`"
      fit="fill"
    )
    BlockIcon(v-if="props.disabled")
    PlayIcon(v-else)
  .item__content {{ props.item.title }}
</template>

<style scoped lang="scss">
.item {
  display: flex;
  margin-bottom: 20px;
  margin-right: 15px;
  background: $primary;
  cursor: pointer;
  height: 70px;

  &.disabled {
    background: $grey;
    cursor: not-allowed;
  }

  &__preview {
    position: relative;

    &-img {
      width: 120px;
      height: 100%;
      filter: brightness(40%)
    }
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px
  }

  &__content {
    flex-grow: 1;
    display: flex;
    align-items: center;
    color: $white;
    padding: 15px
  }
}
</style>
