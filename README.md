# \<re-line-chart>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
npm i re-line-chart
```

## Usage

```html
<script type="module">
  import 're-line-chart/widget-linechart.js';
</script>

<re-line-chart></re-line-chart>
```
## Expected data format

The following format represents the available data :
```
data: {
    settings: {
      title: string,
      subTitle: string,
    },
    dataseries: [
      id: string,
      label: string,
      seriesOptions: {
        color: string,
        type: 'dots' | 'line',
        style: {
          point: {
            radius: number,
            pointStyle: 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded' | 'rectRot' | 'star' | 'triangle' | false,
            backgroundColor: string,
            borderColor: string,
            borderWidth: number
          },
          line: {
            backgroundColor: string,
            borderColor: string,
            borderWidth: number,
            fill: boolean,
          }
        }
      },
      data: [
        x: string,
        y: number
      ],
    ]
  }
```

## Interfaces

```
  interface InputData {
    settings: Settings,
    dataseries: Dataseries[]
  }
```
```
  interface Settings {
    title: string,
    subTitle: string,
  }
```
```
  interface Settings {
    title: string,
    subTitle: string,
  }
```
```
  interface Dataseries {
    id: string,
    label: string,
    seriesOptions: SeriesOptions,
    data: Data[],
  }
```
```
  interface SeriesOptions {
    type: 'dots' | 'line',
    style: Style
  }
```
```
  interface Style {
    point: Point,
    line: Line
  }
```
```
  interface Point {
    radius: number,
    pointStyle: 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded' | 'rectRot' | 'star' | 'triangle' | false,
    backgroundColor: string,
    borderColor: string,
    borderWidth: number
  }
```
```
  interface Line {
    backgroundColor: string,
    borderColor: string,
    borderWidth: number,
    fill: boolean,
  }
```
```
  interface Data {
    x: string,
    y: number
  }
```
## Style options
The following options are available for styling the overall graph and individual lines as well as the graph legend.

The `SeriesOptions` type can either be `line` or `dots`. This selection affects the following styling options.
```
  interface Point {
    radius: number,
    pointStyle: 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded' | 'rectRot' | 'star' | 'triangle' | false,
    backgroundColor: string,
    borderColor: string,
    borderWidth: number
  }


  interface Line {
    backgroundColor: string,
    borderColor: string,
    borderWidth: number,
    fill: boolean,
  }
```
## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
