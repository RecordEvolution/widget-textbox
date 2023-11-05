import { html, css, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import Chart, { ChartDataset, Point } from 'chart.js/auto';

// This does not work. See comments at the end of the file.
// import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
// import 'chartjs-adapter-moment';
// import 'chartjs-adapter-date-fns';
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
    const sizer = this.shadowRoot?.getElementById('sizer') as HTMLCanvasElement;
    if (sizer)
      this.resizeObserver.observe(sizer)
  }

  updated(changedProperties: Map<string, any>) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'inputData') {
        this.applyInputData()
        return
      }
    })
  }

  applyInputData() {

    if(!this?.inputData?.settings?.title || !this?.inputData?.dataseries.length) return

    this.lineTitle = this.inputData.settings.title ?? this.lineTitle
    this.lineDescription = this.inputData.settings.subTitle ?? this.lineDescription

    this.inputData.dataseries.forEach(ds => {
      // @ts-ignore
      if (ds.borderDash) ds.borderDash = JSON.parse(ds.borderDash)
      // @ts-ignore
      // ds.data = ds.data.map(({x, y}) => {return {x: new Date(x).getTime(), y}})
      // ds.parsing = false

    })
    console.log(this.inputData.dataseries)
    // update chart info
    if (this.chartInstance) {
      this.chartInstance.data.datasets = this.inputData.dataseries
      // @ts-ignore
      this.chartInstance.options.scales.x.type = this.xAxisType()
      this.chartInstance.update('none')
    } else {
      this.createChart()
    }
  }


  xAxisType() {
    if (this.inputData.settings.timeseries) return 'time'
    const onePoint = this.inputData.dataseries?.[0].data?.[0]
    // @ts-ignore
    if (onePoint && !isNaN(onePoint.x)) return 'linear'
    return 'category'
  }

  createChart() {
    const canvas = this.shadowRoot?.querySelector('#lineChart') as HTMLCanvasElement;
		if(!canvas ) return
      this.chartInstance = new Chart(
        canvas,
        {
          type: 'line',
          data: {
            datasets: this.inputData.dataseries
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
                type: this.xAxisType(),
                title: {
                  display: !!this.inputData.settings.xAxisLabel,
                  text: this.inputData.settings.xAxisLabel
                }
              },
              y: {
                title: {
                  display: !!this.inputData.settings.yAxisLabel,
                  text: this.inputData.settings.yAxisLabel
                }
              }
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

// ############################################### WORKAROUND #######################################################################
//
// For some reason the import of that adapter is messed up. I suspect that rollup does things in the wrong order.
// Because this is an import that has side effects. i.e. it overrides the adapters of the previously imported Chart.js
// So the current solution is to execute the source code here in-line. (moving this to a local file and importing that does not work!)
// This is the source code of https://github.com/chartjs/chartjs-adapter-date-fns/blob/master/src/index.js

import {_adapters} from 'chart.js';

import {
  parse, parseISO, toDate, isValid, format,
  startOfSecond, startOfMinute, startOfHour, startOfDay,
  startOfWeek, startOfMonth, startOfQuarter, startOfYear,
  addMilliseconds, addSeconds, addMinutes, addHours,
  addDays, addWeeks, addMonths, addQuarters, addYears,
  differenceInMilliseconds, differenceInSeconds, differenceInMinutes,
  differenceInHours, differenceInDays, differenceInWeeks,
  differenceInMonths, differenceInQuarters, differenceInYears,
  endOfSecond, endOfMinute, endOfHour, endOfDay,
  endOfWeek, endOfMonth, endOfQuarter, endOfYear
} from 'date-fns';

const FORMATS = {
  datetime: 'MMM d, yyyy, h:mm:ss aaaa',
  millisecond: 'h:mm:ss.SSS aaaa',
  second: 'h:mm:ss aaaa',
  minute: 'h:mm aaaa',
  hour: 'ha',
  day: 'MMM d',
  week: 'PP',
  month: 'MMM yyyy',
  quarter: 'qqq - yyyy',
  year: 'yyyy'
};

_adapters._date.override({
  _id: 'date-fns', // DEBUG
  formats: function() {
    return FORMATS;
  },

  parse: function(value, fmt) {
    if (value === null || typeof value === 'undefined') {
      return null;
    }
    const type = typeof value;
    if (type === 'number' || value instanceof Date) {
// @ts-ignore
      value = toDate(value);
    } else if (type === 'string') {
      if (typeof fmt === 'string') {
// @ts-ignore
        value = parse(value, fmt, new Date(), this.options);
      } else {
// @ts-ignore
        value = parseISO(value, this.options);
      }
    }
// @ts-ignore
    return isValid(value) ? value.getTime() : null;
  },

  format: function(time, fmt) {
    return format(time, fmt, this.options);
  },

// @ts-ignore
  add: function(time, amount, unit) {
    switch (unit) {
    case 'millisecond': return addMilliseconds(time, amount);
    case 'second': return addSeconds(time, amount);
    case 'minute': return addMinutes(time, amount);
    case 'hour': return addHours(time, amount);
    case 'day': return addDays(time, amount);
    case 'week': return addWeeks(time, amount);
    case 'month': return addMonths(time, amount);
    case 'quarter': return addQuarters(time, amount);
    case 'year': return addYears(time, amount);
    default: return time;
    }
  },

  diff: function(max, min, unit) {
    switch (unit) {
    case 'millisecond': return differenceInMilliseconds(max, min);
    case 'second': return differenceInSeconds(max, min);
    case 'minute': return differenceInMinutes(max, min);
    case 'hour': return differenceInHours(max, min);
    case 'day': return differenceInDays(max, min);
    case 'week': return differenceInWeeks(max, min);
    case 'month': return differenceInMonths(max, min);
    case 'quarter': return differenceInQuarters(max, min);
    case 'year': return differenceInYears(max, min);
    default: return 0;
    }
  },

// @ts-ignore
  startOf: function(time, unit, weekday) {
    switch (unit) {
    case 'second': return startOfSecond(time);
    case 'minute': return startOfMinute(time);
    case 'hour': return startOfHour(time);
    case 'day': return startOfDay(time);
    case 'week': return startOfWeek(time);
// @ts-ignore
    case 'isoWeek': return startOfWeek(time, {weekStartsOn: +weekday});
    case 'month': return startOfMonth(time);
    case 'quarter': return startOfQuarter(time);
    case 'year': return startOfYear(time);
    default: return time;
    }
  },

// @ts-ignore
  endOf: function(time, unit) {
    switch (unit) {
    case 'second': return endOfSecond(time);
    case 'minute': return endOfMinute(time);
    case 'hour': return endOfHour(time);
    case 'day': return endOfDay(time);
    case 'week': return endOfWeek(time);
    case 'month': return endOfMonth(time);
    case 'quarter': return endOfQuarter(time);
    case 'year': return endOfYear(time);
    default: return time;
    }
  }
});