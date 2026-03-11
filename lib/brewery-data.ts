export interface WeatherData {
  condition: "sunny" | "cloudy" | "rainy" | "snowy"
  temperature: number
  humidity: number
  windSpeed: number
}

export type TimeRange = "10m" | "1h" | "6h" | "12h" | "24h"

export const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "10m", label: "10分" },
  { value: "1h", label: "1時間" },
  { value: "6h", label: "6時間" },
  { value: "12h", label: "12時間" },
  { value: "24h", label: "24時間" },
]

export interface BreweryData {
  id: string
  name: string
  address: string
  prefecture: string
  ambientTemp: number
  roomTemp: number
  productTemp: number
  humidity: number
  lastUpdated: string
  status: "normal" | "warning" | "critical"
  ambientTempHistory: Record<TimeRange, Array<{ time: string; value: number }>>
  roomTempHistory: Record<TimeRange, Array<{ time: string; value: number }>>
  productTempHistory: Record<TimeRange, Array<{ time: string; value: number }>>
  humidityHistory: Record<TimeRange, Array<{ time: string; value: number }>>
  weather: WeatherData
}

function generateHistoryForRange(baseValue: number, variance: number, range: TimeRange): Array<{ time: string; value: number }> {
  let count: number
  let labelFn: (i: number) => string

  switch (range) {
    case "10m":
      count = 10
      labelFn = (i) => `${i + 1}分`
      break
    case "1h":
      count = 12
      labelFn = (i) => `${i * 5}分`
      break
    case "6h":
      count = 12
      labelFn = (i) => `${i * 30}分`
      break
    case "12h":
      count = 12
      labelFn = (i) => `${i}:00`
      break
    case "24h":
    default:
      count = 24
      labelFn = (i) => `${i}:00`
      break
  }

  return Array.from({ length: count }, (_, i) => ({
    time: labelFn(i),
    value: Math.round((baseValue + (Math.random() - 0.5) * variance) * 10) / 10,
  }))
}

function generateAllRanges(baseValue: number, variance: number): Record<TimeRange, Array<{ time: string; value: number }>> {
  return {
    "10m": generateHistoryForRange(baseValue, variance * 0.3, "10m"),
    "1h": generateHistoryForRange(baseValue, variance * 0.5, "1h"),
    "6h": generateHistoryForRange(baseValue, variance * 0.8, "6h"),
    "12h": generateHistoryForRange(baseValue, variance, "12h"),
    "24h": generateHistoryForRange(baseValue, variance, "24h"),
  }
}

export const breweries: BreweryData[] = [
  {
    id: "0001",
    name: "石川酒造",
    address: "東京都福生市熊川1番地",
    prefecture: "東京都",
    ambientTemp: 15.2,
    roomTemp: 18.5,
    productTemp: 8.3,
    humidity: 62,
    lastUpdated: "2分前",
    status: "normal",
    ambientTempHistory: generateAllRanges(15, 2),
    roomTempHistory: generateAllRanges(18.5, 2),
    productTempHistory: generateAllRanges(8.3, 1.5),
    humidityHistory: generateAllRanges(62, 8),
    weather: { condition: "cloudy", temperature: 14.8, humidity: 58, windSpeed: 3.2 },
  },
  {
    id: "0002",
    name: "落酒造",
    address: "岡山県真庭市落合垂水124",
    prefecture: "岡山県",
    ambientTemp: 14.8,
    roomTemp: 17.2,
    productTemp: 7.9,
    humidity: 58,
    lastUpdated: "1分前",
    status: "normal",
    ambientTempHistory: generateAllRanges(14.8, 2),
    roomTempHistory: generateAllRanges(17.2, 2),
    productTempHistory: generateAllRanges(7.9, 1.5),
    humidityHistory: generateAllRanges(58, 8),
    weather: { condition: "sunny", temperature: 13.5, humidity: 52, windSpeed: 2.8 },
  },
  {
    id: "0003",
    name: "千古乃岩酒造",
    address: "岐阜県土岐市駄知町2177-1",
    prefecture: "岐阜県",
    ambientTemp: 18.1,
    roomTemp: 20.6,
    productTemp: 10.2,
    humidity: 71,
    lastUpdated: "3分前",
    status: "warning",
    ambientTempHistory: generateAllRanges(18.1, 3),
    roomTempHistory: generateAllRanges(20.6, 3),
    productTempHistory: generateAllRanges(10.2, 2),
    humidityHistory: generateAllRanges(71, 10),
    weather: { condition: "rainy", temperature: 16.2, humidity: 75, windSpeed: 4.5 },
  },
  {
    id: "0004",
    name: "サンプル酒造A",
    address: "XX県XX市XX町1-2-3",
    prefecture: "XX県",
    ambientTemp: 12.5,
    roomTemp: 15.8,
    productTemp: 6.1,
    humidity: 55,
    lastUpdated: "1分前",
    status: "normal",
    ambientTempHistory: generateAllRanges(12.5, 2),
    roomTempHistory: generateAllRanges(15.8, 2),
    productTempHistory: generateAllRanges(6.1, 1),
    humidityHistory: generateAllRanges(55, 7),
    weather: { condition: "sunny", temperature: 12.1, humidity: 50, windSpeed: 2.3 },
  },
  {
    id: "0005",
    name: "サンプル酒造B",
    address: "XX県XX市XX町4-5-6",
    prefecture: "XX県",
    ambientTemp: 22.3,
    roomTemp: 24.1,
    productTemp: 12.8,
    humidity: 78,
    lastUpdated: "5分前",
    status: "critical",
    ambientTempHistory: generateAllRanges(22.3, 4),
    roomTempHistory: generateAllRanges(24.1, 4),
    productTempHistory: generateAllRanges(12.8, 2.5),
    humidityHistory: generateAllRanges(78, 12),
    weather: { condition: "rainy", temperature: 20.5, humidity: 82, windSpeed: 5.1 },
  },
  {
    id: "0006",
    name: "サンプル酒造C",
    address: "XX県XX市XX町7-8-9",
    prefecture: "XX県",
    ambientTemp: 16.7,
    roomTemp: 19.3,
    productTemp: 9.1,
    humidity: 64,
    lastUpdated: "2分前",
    status: "normal",
    ambientTempHistory: generateAllRanges(16.7, 2),
    roomTempHistory: generateAllRanges(19.3, 2),
    productTempHistory: generateAllRanges(9.1, 1.5),
    humidityHistory: generateAllRanges(64, 8),
    weather: { condition: "cloudy", temperature: 15.8, humidity: 61, windSpeed: 3.1 },
  },
  {
    id: "0007",
    name: "サンプル酒造D",
    address: "XX県XX市XX町10-11-12",
    prefecture: "XX県",
    ambientTemp: 13.9,
    roomTemp: 16.4,
    productTemp: 7.2,
    humidity: 59,
    lastUpdated: "1分前",
    status: "normal",
    ambientTempHistory: generateAllRanges(13.9, 2),
    roomTempHistory: generateAllRanges(16.4, 2),
    productTempHistory: generateAllRanges(7.2, 1),
    humidityHistory: generateAllRanges(59, 7),
    weather: { condition: "sunny", temperature: 13.2, humidity: 55, windSpeed: 2.4 },
  },
  {
    id: "0008",
    name: "サンプル酒造E",
    address: "XX県XX市XX町13-14-15",
    prefecture: "XX県",
    ambientTemp: 17.5,
    roomTemp: 20.2,
    productTemp: 9.7,
    humidity: 67,
    lastUpdated: "2分前",
    status: "normal",
    ambientTempHistory: generateAllRanges(17.5, 2),
    roomTempHistory: generateAllRanges(20.2, 2),
    productTempHistory: generateAllRanges(9.7, 1.5),
    humidityHistory: generateAllRanges(67, 9),
    weather: { condition: "cloudy", temperature: 16.8, humidity: 64, windSpeed: 3.3 },
  },
  {
    id: "0009",
    name: "サンプル酒造F",
    address: "XX県XX市XX町16-17-18",
    prefecture: "XX県",
    ambientTemp: 14.2,
    roomTemp: 17.8,
    productTemp: 8.1,
    humidity: 61,
    lastUpdated: "3分前",
    status: "normal",
    ambientTempHistory: generateAllRanges(14.2, 2),
    roomTempHistory: generateAllRanges(17.8, 2),
    productTempHistory: generateAllRanges(8.1, 1),
    humidityHistory: generateAllRanges(61, 8),
    weather: { condition: "sunny", temperature: 13.9, humidity: 57, windSpeed: 2.6 },
  },
]

export function getBreweryById(id: string): BreweryData | undefined {
  return breweries.find((b) => b.id === id)
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "normal":
      return "正常"
    case "warning":
      return "警告"
    case "critical":
      return "異常"
    default:
      return ""
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "normal":
      return "text-chart-2"
    case "warning":
      return "text-chart-4"
    case "critical":
      return "text-destructive"
    default:
      return "text-muted-foreground"
  }
}
