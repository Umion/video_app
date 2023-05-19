import { VideoModel } from './model'
import { mockData } from './mockData'

export const apiGetVideo = (): Promise<VideoModel[]> => {
  return Promise.resolve(mockData)
}
