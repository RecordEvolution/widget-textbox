import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import Chart, { ChartDataset } from 'chart.js/auto';
// import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
// import 'chartjs-adapter-moment';
import 'chartjs-adapter-date-fns';
import { InputData } from './types.js'

export class WidgetLinechart extends LitElement {
  
  @property({type: Object}) 
  inputData = {} as InputData

  @state()
  private canvas: HTMLCanvasElement | undefined = undefined;
  @state()
  private chartInstance: any | undefined = undefined;
  @state()
  private lineTitle: string = 'Line-chart';
  @state()
  private lineDescription: string = 'This is a Line-chart from the RE-Dashboard';
  @state()
  private datasets: ChartDataset[] = []

  
  firstUpdated() {
    this.applyUserSettings()
    this.createChart()
  }

  updated(changedProperties: Map<string, any>) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'inputData') {
        if (this.inputData.dataseries.length !== this.datasets.length) {
          this.datasets = []
          this.applyUserSettings()
          this.createChart()
          return
        }
        this.updateLineChart(this.inputData)
        return
      }
    })
  }

  updateLineChart(inputData: InputData) {
    for (const dataserie of inputData.dataseries) {
      const dataset = this.datasets.find((d: any) => d.label === dataserie.label)
      if (dataset) dataset.data = dataserie?.data
    }
    this.chartInstance.update()
  }

  applyUserSettings() {

    if(!this?.inputData?.settings?.title || !this?.inputData?.dataseries.length) return

    // Generel
    this.lineTitle = this.inputData.settings.title ?? this.lineTitle
    this.lineDescription = this.inputData.settings.subTitle ?? this.lineDescription

    this.datasets = this.inputData.dataseries ?? []

  }

  createChart() {
    this.canvas = this.shadowRoot?.querySelector('#lineChart') as HTMLCanvasElement;
    console.log('Data', this.datasets)
		if(!this.canvas ) return
    if (!this.chartInstance) {
      this.chartInstance = new Chart(
        this.canvas,
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
            plugins: {
              title: {
                display: true,
                text: this.inputData.settings.title
              }
            }
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

  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  canvas {
    flex: 1;
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
      <div class="wrapper">
        <header>
          <h3>${this.lineTitle}</h3>
          <p>${this.lineDescription}</p>
        </header>
        <canvas id="lineChart"></canvas>
      </div>
    `;
  }
}
window.customElements.define('widget-linechart', WidgetLinechart)

