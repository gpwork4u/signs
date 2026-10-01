export type Element = "fire" | "earth" | "air" | "water"

export interface Sign {
  id: string
  name: string
  glyph: string
  from: [number, number]
  to: [number, number]
  // 圖片缺失時替代背景的光暈色
  element: Element
}

// tools/build_share.sh 會用正規表達式讀這份資料，請維持 `id: "...", name: "...", ... from: [m, d], to: [m, d]` 的寫法
export const SIGNS: Sign[] = [
  { id: "capricorn", name: "摩羯座", glyph: "♑", from: [12, 22], to: [1, 19], element: "earth" },
  { id: "aquarius", name: "水瓶座", glyph: "♒", from: [1, 20], to: [2, 18], element: "air" },
  { id: "pisces", name: "雙魚座", glyph: "♓", from: [2, 19], to: [3, 20], element: "water" },
  { id: "aries", name: "牡羊座", glyph: "♈", from: [3, 21], to: [4, 19], element: "fire" },
  { id: "taurus", name: "金牛座", glyph: "♉", from: [4, 20], to: [5, 20], element: "earth" },
  { id: "gemini", name: "雙子座", glyph: "♊", from: [5, 21], to: [6, 21], element: "air" },
  { id: "cancer", name: "巨蟹座", glyph: "♋", from: [6, 22], to: [7, 22], element: "water" },
  { id: "leo", name: "獅子座", glyph: "♌", from: [7, 23], to: [8, 22], element: "fire" },
  { id: "virgo", name: "處女座", glyph: "♍", from: [8, 23], to: [9, 22], element: "earth" },
  { id: "libra", name: "天秤座", glyph: "♎", from: [9, 23], to: [10, 23], element: "air" },
  { id: "scorpio", name: "天蠍座", glyph: "♏", from: [10, 24], to: [11, 22], element: "water" },
  { id: "sagittarius", name: "射手座", glyph: "♐", from: [11, 23], to: [12, 21], element: "fire" },
]

export const ELEMENT_HUE: Record<Element, string> = {
  fire: "#ff8a4c",
  earth: "#9fcf7a",
  air: "#9fd8ff",
  water: "#5fd0c8",
}

export function signFromDate(date: Date): Sign {
  // 以 月*100+日 比較；摩羯座跨年需特別處理
  const md = (date.getMonth() + 1) * 100 + date.getDate()
  for (const s of SIGNS) {
    const from = s.from[0] * 100 + s.from[1]
    const to = s.to[0] * 100 + s.to[1]
    if (from <= to ? md >= from && md <= to : md >= from || md <= to) return s
  }
  return SIGNS[0]
}

export function rangeText(s: Sign): string {
  return `${s.from[0]}/${s.from[1]} – ${s.to[0]}/${s.to[1]}`
}
