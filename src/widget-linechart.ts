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
  private chartInstance: Chart | undefined = undefined;
  @state()
  private lineTitle: string = 'Line-chart';
  @state()
  private lineDescription: string = 'This is a Line-chart from the RE-Dashboard';

  @state()
  private resizeObserver: ResizeObserver

  constructor() {
    super()
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) this.chartInstance.update('none');
    })
  }

  firstUpdated() {
    
    // this.applyUserSettings()
    // this.createChart()
    const sizer = this.shadowRoot?.getElementById('sizer') as HTMLCanvasElement;

    if (sizer)
      this.resizeObserver.observe(sizer)
  }

  updated(changedProperties: Map<string, any>) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'inputData') {
        this.applyUserSettings()
        return
      }
    })
  }

  applyUserSettings() {

    if(!this?.inputData?.settings?.title || !this?.inputData?.dataseries.length) return

    this.lineTitle = this.inputData.settings.title ?? this.lineTitle
    this.lineDescription = this.inputData.settings.subTitle ?? this.lineDescription

    // update chart info
    if (this.chartInstance) {
      this.chartInstance.data.datasets = this.inputData.dataseries
      this.chartInstance.update()
    } else {
      this.createChart(this.inputData.dataseries)
    }
  }

  createChart(datasets: ChartDataset[]) {
    const canvas = this.shadowRoot?.querySelector('#lineChart') as HTMLCanvasElement;
    console.log('Data', datasets, canvas)
		if(!canvas ) return
      this.chartInstance = new Chart(
        canvas,
        {
          type: 'line',
          data: {
            datasets: datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
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
                type: 'time',
                position: 'bottom',
              },
            },
          },
        }
      );
  }

  static styles = css`
  :host {
    display: block;
    color: var(--re-line-text-color, #000);
    font-family: sans-serif;
    padding: 16px;
    box-sizing: border-box;
    margin: auto;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  #sizer {
    flex: 1;
    overflow: hidden;
    position: relative;
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
        <div id="sizer">
          <canvas id="lineChart"></canvas>
        </div>
      </div>
    `;
  }
}
window.customElements.define('widget-linechart', WidgetLinechart)

