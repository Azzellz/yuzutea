import { MusicPlay, LyricLine } from '@/atoms/music'
import { useEffect, useState } from 'react'

interface ParsedLRC {
  meta: LyricLine[] // 作词 / 作曲 / 制作人 等
  lyrics: LyricLine[] // 正式歌词，按 time 升序
}

/**
 * 解析 LRC 格式（支持毫秒）
 * @param raw 整个 .lrc 文件内容
 */
export function parseLrc(raw: string): ParsedLRC {
  const meta: LyricLine[] = []
  const lyrics: LyricLine[] = []

  // 匹配两种行：
  // 1. [mm:ss.xxx] 文字
  // 2. [mm:ss.xxx] 标签: 值
  const TIME_REGEX = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

  raw.split(/\r?\n/).forEach((line) => {
    line = line.trim()
    if (!line) return

    const m = TIME_REGEX.exec(line)
    if (!m) return // 跳过无效行

    const min = +m[1]
    const sec = +m[2]
    const ms = +m[3].padEnd(3, '0') // 补齐 3 位
    const time = min * 60_000 + sec * 1_000 + ms

    const text = line.replace(TIME_REGEX, '').trim()

    // 判断是不是“标签: 值”形式的元数据
    if (text.includes(':')) {
      meta.push({ time, text })
    } else {
      lyrics.push({ time, text })
    }
  })

  // 按时间升序（方便后续二分查找）
  lyrics.sort((a, b) => a.time - b.time)
  meta.sort((a, b) => a.time - b.time)

  return { meta, lyrics }
}

export function useMusic(
  musicId: number,
  level: 'standard' | 'higher' | 'exhigh' = 'standard'
) {
  const [data, setData] = useState<MusicPlay>()
  const [audio, setAudio] = useState<HTMLAudioElement>()
  async function getUrl() {
    const res = await fetch(
      `https://ncm-api.yuzutea.org/song/url/v1?id=${musicId}&level=${level}`
    )
    const json = await res.json()
    const url = json.data[0].url || ''
    return url
  }
  async function getLyric() {
    const res = await fetch(`https://ncm-api.yuzutea.org/lyric?id=${musicId}`)
    const json = await res.json()
    const lyric = json.lrc?.lyric || ''
    return parseLrc(lyric)
  }
  async function fetchData() {
    const url = await getUrl()
    const parsedLrc = await getLyric()
    setData({
      url,
      lyrics: parsedLrc.lyrics,
    })
    setAudio(new Audio(url))
  }
  useEffect(() => {
    fetchData()
  }, [musicId, level])

  return { data, audio }
}
