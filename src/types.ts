import type { Point, ChartDataset } from 'chart.js/auto';
export interface InputData {
    settings: Settings,
    dataseries: Dataseries[]
}
export interface Settings {
    title: string,
    subTitle: string,
    timeseries: boolean
    xAxisLabel: string
    yAxisLabel: string
}

export interface Dataseries {
    label: string
    order: number
    type: string
    showLine: boolean
    radius: number
    pointStyle: string
    backgroundColor: string
    borderColor: string
    borderWidth: number
    borderDash: string
    fill: boolean
    data: Data[]
}

export interface Data {
    x: string,
    y: number,
    pivot: string
}