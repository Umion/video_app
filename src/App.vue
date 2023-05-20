<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { VideoModel } from '@/api/video/model'
import type { OnChangeEventModel, ConfigModel } from '@/types/app'
import { appStore } from '@/stores/index'
import { getIdFromUrl } from '@/utils/helpers'
import { ElNotification } from 'element-plus'

import YouTube from 'vue3-youtube'
import VideoItem from '@/components/VideoItem.vue'
import LogoIcon from '@/components/icons/LogoIcon.vue'

const youtube = ref<any>("youtube")
const showTimers = ref<boolean>(false) // visual helper
const interval = ref<number | undefined>(undefined)
const config = ref<ConfigModel>({
  autoplay: 1,
  rel: 0
})

const store = appStore()

const startTimer = (): void => {
  if (store.getActive && store.getTimer[store.getActive.id] < store.getActive.video_time) {
    store.getTimer[store.getActive.id] += 1;
    store.getTimer.total += 1;
  }
}

const onChange = (e: OnChangeEventModel): void => {
  if (e.data === 1) {
    interval.value = setInterval(startTimer, 1000);
  } else {
    clearInterval(interval.value);
  }
}

const selectVideo = (video: VideoModel): void => {
  const link = getIdFromUrl(video.video_url)
  if (link) {
    store.setActive(video)
    youtube.value.loadVideoById(link, 5, "large")
  } else {
    console.log('invalid link');
  }
}

const goToNextEpiside = (): void => {
  const idx = store.getItemIndex(store.getActive)
  if (idx !== -1) {
    const nextEpisode = store.getItemByIndex(idx + 1)
    if (nextEpisode) {
      const unlockTime = store.isUnlock(nextEpisode)
      if (unlockTime) {
        const isUnlocked = store.getTimer.total < unlockTime
        if (isUnlocked) {
          ElNotification({
            title: 'Warning',
            message: `Episode "${nextEpisode.title}" is not available. Watch video for unlock next episode.`,
            type: 'warning',
          })
        } else {
          selectVideo(nextEpisode)
        }
      }
    } else {
      ElNotification({
        title: 'Warning',
        message: 'This is the last episode on the list',
        type: 'warning',
      })
    }

  }

}

onMounted(() => {
  store.init()
})
onUnmounted(() => {
  clearInterval(interval.value);
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
              :disabled="store.getTimer.total < store.isUnlock(item)"
              @submit="selectVideo(item)"
            ) 

      el-row(
        :gutter="20"
        class="footer"
      )
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
          el-switch(
          v-model="showTimers"
          class="mb-2"
          active-text="Show timers (visual helper)"
          )
          div(v-if="showTimers")
            div(v-if="store.getVideos.length")
              el-text totalTime: {{ store.getTimer.total }}
              el-row(
                v-for="item in store.getVideos"
                :key="item.id"
                :gutter="20"
              )
                el-col(:span="3")
                  el-text ID: {{ item.id }}
                el-col(:span="8")
                  el-text watched ({{ `${store.getTimer[item.id]} / ${item.video_time}` }})
                el-col(:span="8")
                  el-text forUnlock {{store.isUnlock(item)}}
          div(v-else)
            div
              .footer__side-title
                el-text Already watched? get access to the next episode
              button.footer__side-button(@click="goToNextEpiside") Next Episode
</template>

<style scoped lang="scss">
header {
  border-bottom: 1px solid lightgray;
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
  margin-top: 50px;

  &__title {
    margin: 0 0 20px;
  }

  &__side {
    &-title {
      text-align: center;
      margin: 20px 0;

      & * {
        font-size: 16px;
        font-weight: 600;
        color: $black;
      }
    }

    &-button {
      cursor: pointer;
      display: block;
      text-align: center;
      background: $primary;
      border: 0;
      padding: 20px 100px;
      color: $white;
      margin: auto;
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.decor {
  color: $primary
}
</style>
