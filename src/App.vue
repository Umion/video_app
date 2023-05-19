<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import type { VideoModel } from '@/api/video/model'
import { appStore } from '@/stores/index'
import { getIdFromUrl } from '@/utils/helpers'

import YouTube from 'vue3-youtube'
import VideoItem from '@/components/VideoItem.vue'
import LogoIcon from '@/components/icons/LogoIcon.vue'

const youtube = ref("youtube")
const interval = ref(null)
const config = ref({
  autoplay: 1,
  rel: 0
})

const store = appStore()

function startTimer() {
  if (store.getTimer[store.getActive.id] < store.getActive.video_time) {
    store.getTimer[store.getActive.id] += 1;
    store.getTimer.total += 1;
  }
}

function onChange(e: Event): void {
  if (e.data === 1) {
    interval.value = setInterval(startTimer, 1000);
  } else {
    clearInterval(interval.value);
  }
}

const selectVideo = (video: VideoModel) => {
  const link = getIdFromUrl(video.video_url)
  if (link) {
    store.setActive(video)
    youtube.value.loadVideoById(link, 5, "large")
  } else {
    console.log('invalid link');
  }
}

const isUnlock = (item: VideoModel) => {
  const idx = store.getVideos.indexOf(item)
  if (idx !== -1) {

    let total = 0;

    for (let i = 0; i < idx; i++) {
      total += store.getVideos[i].video_time
    }
    return total
  }

}

onMounted(() => {
  store.init()
})
onUnmounted(() => {
  clearInterval(timer.value);
})
</script>

<template lang="pug">
.common-layout
  el-container
    el-header
      LogoIcon
    el-main
      el-row
        el-col
          h1.main__title
            | Lorem ipsum dolor 
            span.decor sit amet 
            | consectetur, adipisicing elit. Atque non fugiat suscipit, impedit exercitationem
          el-space(
            direction="vertical"
            style="width: 100%"
          )
            el-text(
              v-if="store.getActive"
              tag="b"
              class="main__description"
            )
              span.decor Episode {{ store.getEpisode }} 
              |  {{ store.getActive.title }}

      el-row(:gutter="20")
        el-col(:span="15")
          YouTube(
            v-if="store.getVideos.length"
            ref="youtube"
            :src="store.getVideos[0].video_url"
            :vars="config"
            width="100%"
            height="400"
            @state-change="onChange"
          )
          el-empty(
            v-else
            description="Loading"
          )
        el-col(:span="9")
          el-scrollbar(height="400px")
            VideoItem(
              v-for="item in store.getVideos" 
              :key="item.id"
              :item="item"
              :video-id="getIdFromUrl(item.video_url)"
              :disabled="store.getTimer.total < isUnlock(item)"
              @submit="selectVideo(item)"
            ) 

      el-row(:gutter="20")
        el-col(
          :span="15"
          style="border-right: 1px solid black"
        )
          h2.footer__title
            | In this episode you will learn
          el-text(
            v-if="store.getActive"
            tag="p"
            class="footer__description"
          ) {{ store.getActive.description }}
        el-col(:span="9")
          div(v-if="store.getVideos.length")
            div total: {{ store.getTimer.total }}
            div(
              v-for="item in store.getVideos"
              :key="item.id"
            ) videoId: {{ item.id }} watched ({{ `${store.getTimer[item.id]} / ${item.video_time}` }}) || forUnlock: {{isUnlock(item)}}
</template>

<style scoped lang="scss">
header {
  text-align: center;

  svg {
    width: 50px
  }
}

.main {
  &__title {
    max-width: 900px;
    margin: 0 auto 20px;
    text-align: center;
  }

  &__description {
    color: $black
  }
}

.footer {
  &__title {
    margin: 0 0 20px;
  }

}

.decor {
  color: $primary
}

.el-row {
  margin-bottom: 20px;
}
</style>
