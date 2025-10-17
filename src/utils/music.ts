import { LyricLine } from '@/atoms/music'

interface ParsedLRC {
  meta: LyricLine[] // 作词 / 作曲 / 制作人 等
  lyrics: LyricLine[] // 正式歌词，按 time 升序
}

type MusicLevel = 'standard' | 'higher' | 'exhigh'

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

async function getUrl(musicId: number, level: MusicLevel = 'standard') {
  const res = await fetch(
    `https://ncm-api.yuzutea.org/song/url/v1?id=${musicId}&level=${level}`
  )
  const json = await res.json()
  const url = json.data[0].url || ''
  return url
}
async function getLyric(musicId: number) {
  const res = await fetch(`https://ncm-api.yuzutea.org/lyric?id=${musicId}`)
  const json = await res.json()
  const lyric = json.lrc?.lyric || ''
  return parseLrc(lyric)
}

export async function getMusicPlayer(
  musicId: number,
  level: MusicLevel = 'standard'
) {
  const url = await getUrl(musicId, level)
  const parsedLrc = await getLyric(musicId)
  const audio = new Audio(url)
  return {
    songId: musicId,
    url,
    lyrics: parsedLrc.lyrics,
    audio,
  }
}
