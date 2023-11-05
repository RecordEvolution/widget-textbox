import type { Point, ChartDataset } from 'chart.js/auto';
export interface InputData {
    settings: Settings,
    dataseries: ChartDataset[]
}
export interface Settings {
    title: string,
    subTitle: string,
    timeseries: boolean
    xAxisLabel: string
    yAxisLabel: string
}

export interface Data {
    x: string,
    y: number
}