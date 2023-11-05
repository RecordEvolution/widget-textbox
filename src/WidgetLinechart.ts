import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import Chart from 'chart.js/auto';
// import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
// import 'chartjs-adapter-moment';
import 'chartjs-adapter-date-fns';
import { InputData, Data } from './types.js'

export class WidgetLinechart extends LitElement {
  
  @property({type: Object}) 
  inputData = {} as InputData

  @state()
  private demoCanvas: HTMLCanvasElement | undefined = undefined;
  @state()
  private chartInstance: any | undefined = undefined;
  @state()
  private lineTitle: string = 'Line-chart';
  @state()
  private lineDescription: string = 'This is a Line-chart from the RE-Dashboard';
  @state()
  private data: Data[] = []
  @state()
  private label: string = 'Default label';
  @state()
  private color: string = '#000';
  @state()
  private chartType: string = 'line';
  @state()
  private datasets: any = []
  @state()
  private radius: number = 4;
  @state()
  private pointStyle: 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded' | 'rectRot' | 'star' | 'triangle' | false = 'circle';
  @state()
  private pointBackgroundColor: string = '#A076F9';
  @state()
  private pointBorderColor: string = '#D7BBF5';
  @state()
  private pointBorderWidth: number = 2;
  @state()
  private lineBackgroundColor: string = '#D7BBF5';
  @state()
  private lineBorderColor: string = '#D7BBF5';
  @state()
  private lineBorderWidth: number = 2;
  @state()
  private fill: boolean = false;
  @state()
  private minTime: string | null = null
  

  updated(changedProperties: Map<string, any>) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'inputData') {
        if (this.inputData.dataseries.length !== this.datasets.length) {
          this.datasets = []
          this.createLineChart()
          this.renderChart()
          return
        }
        this.updateLineChart(this.inputData)
        return
      }
    })
  }

  updateLineChart(inputData: InputData) {
    for (const dataserie of this.inputData.dataseries) {
      const existingDataSerie = this.datasets.find((d: any) => d.id === dataserie.id)
      const newData = inputData.dataseries.find((ds) => ds.id === dataserie.id)?.data
      existingDataSerie.data = newData
    }
    this.chartInstance.update()
  }

  createLineChart() {

    if(!this?.inputData?.settings?.title || !this?.inputData?.dataseries.length) return

    if(this.inputData?.dataseries.length > 1) {
      // Multiple Series
      const minTimeArray = []

      for(const i of this.inputData?.dataseries) {
        // Style point
        const radius = this.inputData?.dataseries[0].seriesOptions?.style?.point?.radius ?? this.radius
        const pointStyle = this.inputData?.dataseries[0].seriesOptions?.style?.point?.pointStyle ?? this.pointStyle
        const pointBackgroundColor = this.inputData?.dataseries[0].seriesOptions?.style?.point?.backgroundColor ?? this.pointBackgroundColor
        const pointBorderColor = this.inputData?.dataseries[0].seriesOptions?.style?.point?.borderColor ?? this.pointBorderColor
        const pointBorderWidth = this.inputData?.dataseries[0].seriesOptions?.style?.point?.borderWidth ?? this.pointBorderWidth

        // Style line
        const lineBackgroundColor = this.inputData?.dataseries[0].seriesOptions?.style?.line?.backgroundColor ?? this.lineBackgroundColor
        const lineBorderColor = this.inputData?.dataseries[0].seriesOptions?.style?.line?.borderColor ?? this.lineBorderColor
        const lineBorderWidth = this.inputData?.dataseries[0].seriesOptions?.style?.line?.borderWidth ?? this.lineBorderWidth
        const fill = this.inputData?.dataseries[0].seriesOptions?.style?.line?.fill ?? this.fill

        let dataseriesStyle;

        if(i.seriesOptions.chartType === 'line') {
          dataseriesStyle = {
              backgroundColor: lineBackgroundColor,
              borderColor: lineBorderColor,
              borderWidth: lineBorderWidth,
              fill: fill,
            }
        } else {
          dataseriesStyle = {
              radius: radius,
              pointStyle: pointStyle,
              backgroundColor: pointBackgroundColor,
              borderColor: pointBorderColor,
              borderWidth: pointBorderWidth
            }
        }

        const data = {
          id: i.id,
          label: i.label,
          data: i.data,
          tension: 0.1,
          showLine: i.seriesOptions.chartType === 'line',
          dataseriesStyle
        }
        let mergedData = {...data, ...dataseriesStyle};

        this.datasets.push(mergedData)
        const minDate = this.getMinValue(i.data , 'x')
        minTimeArray.push(minDate)
      }

      this.minTime = this.getMinValue(minTimeArray).toISOString()

    } else {
        // Single Series Data
        this.data = this.inputData.dataseries[0].data ? this.inputData.dataseries[0].data  : []
        this.id = this.inputData.dataseries[0].id ? this.inputData.dataseries[0].id : this.id
        this.label = this.inputData.dataseries[0].label ? this.inputData.dataseries[0].label : this.label
        this.chartType = this.inputData.dataseries[0].seriesOptions.chartType ?? this.chartType

        // Style point
        const radius = this.inputData?.dataseries[0].seriesOptions?.style?.point?.radius ?? this.radius
        const pointStyle = this.inputData?.dataseries[0].seriesOptions?.style?.point?.pointStyle ?? this.pointStyle
        const pointBackgroundColor = this.inputData?.dataseries[0].seriesOptions?.style?.point?.backgroundColor ?? this.pointBackgroundColor
        const pointBorderColor = this.inputData?.dataseries[0].seriesOptions?.style?.point?.borderColor ?? this.pointBorderColor
        const pointBorderWidth = this.inputData?.dataseries[0].seriesOptions?.style?.point?.borderWidth ?? this.pointBorderWidth

        // Style line
        const lineBackgroundColor = this.inputData?.dataseries[0].seriesOptions?.style?.line?.backgroundColor ?? this.lineBackgroundColor
        const lineBorderColor = this.inputData?.dataseries[0].seriesOptions?.style?.line?.borderColor ?? this.lineBorderColor
        const lineBorderWidth = this.inputData?.dataseries[0].seriesOptions?.style?.line?.borderWidth ?? this.lineBorderWidth
        const fill = this.inputData?.dataseries[0].seriesOptions?.style?.line?.fill ?? this.fill

        let dataseriesStyle;

        if(this.inputData?.dataseries[0].seriesOptions?.chartType === 'line') {
          dataseriesStyle = {
              backgroundColor: lineBackgroundColor,
              borderColor: lineBorderColor,
              borderWidth: lineBorderWidth,
              fill: fill,
            }
        } else {
          dataseriesStyle = {
              radius: radius,
              pointStyle: pointStyle,
              backgroundColor: pointBackgroundColor,
              borderColor: pointBorderColor,
              borderWidth: pointBorderWidth
            }
        }

        const data = {
          id: this.id,
          label: this.label,
          data: this.data,
          tension: 0.1,
          showLine: this.chartType === 'line'
        }

        let mergedData = {...data, ...dataseriesStyle};

        const minDate = new Date(
          Math.min(
            //@ts-ignore
            ...this.data.map(element => {
              return new Date(element.x);
            }),
          ),
        );
        
        //@ts-ignore
        if(minDate == 'Invalid Date') {
          console.error('Invalid Date')
          return
        }
        this.minTime = minDate.toISOString()

        this.datasets.push(mergedData)

    }

    // Generel
    this.lineTitle = this.inputData.settings.title ?? this.lineTitle
    this.lineDescription = this.inputData.settings.subTitle ?? this.lineDescription

  }

  getMinValue(data: any, selector?: string) {
    if(selector) {
      return new Date(
        Math.min(
          //@ts-ignore
          ...data.map(element => {
            return new Date(element[selector]);
          }),
        ),
      );
    } else {
      return new Date(
        Math.min(
          //@ts-ignore
          ...data.map(element => {
            return new Date(element);
          }),
        ),
      );
    }

  }

  renderChart() {
    this.demoCanvas = this.shadowRoot?.querySelector('#lineChart') as HTMLCanvasElement;
		if(!this.demoCanvas) { return }
    console.log('the Data', this.datasets)
    if (!this.chartInstance) {
      this.chartInstance = new Chart(
        this.demoCanvas,
        {
          type: 'line',
          data: {
            datasets: this.datasets
          },
          options: {
            responsive: true,
            animations: {
              "colors": false,
              "x": false,
            },
            transitions: {
              "active": {
                "animation": {
                  "duration": 0
                }
              }
            },
            scales: {
              x: {
                // min: this.minTime ? this.minTime : '2023-06-28T10:20:32.109Z',
                type: 'time',
                // adapters: {
                //   date: {
                //     locale: enUS, 
                //   },
                // },
                // ticks: {
                //   stepSize: 10
                // },
                position: 'bottom',
                // time: {
                //   unit: 'minute'
                // }
              },
            },
          },
        }
      );
    } else {
      this.chartInstance.update()
    }
  }

  static styles = css`
  :host {
    display: inline-block;
    color: var(--re-line-text-color, #000);
    font-family: sans-serif;
    padding: 16px;
    box-sizing: border-box;
    position: relative;
    margin: auto;
  }

  header {
    display: flex;
    flex-direction: column;
    margin: 0 0 16px 0;
  }
  h3 {
    margin: 0;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  p {
    margin: 10px 0 0 0;
    max-width: 300px;
    font-size: 14px;
    line-height: 17px;
  }
`; 

  render() {
    return html`
        <header>
          <h3>${this.lineTitle}</h3>
          <p>${this.lineDescription}</p>
        </header>
        <canvas id="lineChart"></canvas>
    `;
  }

}
