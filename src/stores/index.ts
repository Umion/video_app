import { defineStore } from 'pinia'
import { apiGetVideo } from '@/api/video/index'
import type { VideoModel } from '@/api/video/model'

interface TimerModel {
  total: number
  [key: number]: number;
}

interface AppState {
  videoList: VideoModel[]
  active: VideoModel | null
  timers: TimerModel
}

export const appStore = defineStore({
  id: 'app-store',
  state: (): AppState => ({
    videoList: [],
    active: null,
    timers: {
      total: 0
    }
  }),
  getters: {
    getVideos(): VideoModel[] {
      return this.videoList
    },
    getActive(): VideoModel | null {
      return this.active
    },
    getTimer(): TimerModel {
      return this.timers
    },
    getEpisode(): number | null {
      if (this.getActive) {
        const idx = this.getVideos.indexOf(this.getActive)
        return idx !== -1 ? idx + 1 : null
      }
      return null
    },
    getItemByIndex(): (idx: number) => VideoModel {
      return (idx: number) => {
        return this.getVideos[idx]
      }
    },
    getItemIndex(): (item: VideoModel | null) => number {
      return (item: VideoModel | null) => {
        return item ? this.getVideos.indexOf(item) : -1
      }
    },
    isUnlock(): (item: VideoModel) => number | null {
      return (item: VideoModel) => {
        const idx = this.getItemIndex(item)
        if (idx !== -1) {

          let total = 0;

          for (let i = 0; i < idx; i++) {
            total += this.getVideos[i].video_time
          }
          return total
        } else {
          return null
        }
      }
    },
  },
  actions: {
    setVideo(data: VideoModel[]) {
      this.videoList = data
    },
    setActive(video: VideoModel) {
      this.active = video
    },
    setTimer(data: TimerModel) {
      this.timers = data
    },

    async loadVideo() {
      apiGetVideo().then(data => {
        if (data.length) {
          this.setVideo(data)
          const timer = {
            total: this.timers.total,
            ...data.map(t => 0) // eslint-disable-line
          }
          this.setTimer(timer)
          this.setActive(data[0])
        }
      })
    },

    async init() {
      this.loadVideo()
    }

  },
})

