
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
    seriesOptions: SeriesOptions,
    data: Data[],
}
export interface SeriesOptions {
    chartType: 'dots' | 'line',
    style: Style
}
export interface Style {
    point: Point,
    line: Line
}
export interface Point {
    radius: number,
    pointStyle: 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded' | 'rectRot' | 'star' | 'triangle' | false,
    backgroundColor: string,
    borderColor: string,
    borderWidth: number
}
export interface Line {
    backgroundColor: string,
    borderColor: string,
    borderWidth: number,
    fill: boolean,
}
export interface Data {
    x: string,
    y: number
}