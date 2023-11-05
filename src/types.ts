import type { Point } from 'chart.js/auto';
export interface InputData {
    settings: Settings,
    dataseries: Dataseries[]
}
export interface Settings {
    title: string,
    subTitle: string,
}
export interface Dataseries {
    id: string,
    label: string,
    showLine: boolean,
    data: Point[],
    radius: number,
    pointStyle: 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded' | 'rectRot' | 'star' | 'triangle' | false,
    backgroundColor: string,
    borderColor: string,
    borderWidth: number,
    fill: boolean,
}

export interface Data {
    x: string,
    y: number
}