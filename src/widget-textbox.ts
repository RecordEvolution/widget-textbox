import { html, css, LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'
import { TextboxConfiguration } from './definition-schema.js'

export class WidgetTextbox extends LitElement {
    @property({ type: Object })
    inputData?: TextboxConfiguration

    version: string = 'versionplaceholder'

    static styles = css`
        :host {
            display: block;
            font-family: sans-serif;
            box-sizing: border-box;
            margin: auto;
        }

        .paging:not([active]) {
            display: none !important;
        }

        .wrapper {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            padding: 12px;
            box-sizing: border-box;
        }

        h2 {
            margin: 0;
            padding: 0px;
            color: var(--re-user-h2-color, --re-text-color, #000);
        }

        h3 {
            margin: 0;
            padding: 12px 0px;
            color: var(--re-user-h3-color, --re-text-color, #000);
        }

        p {
            margin: 0;
            color: var(--re-user-p-color, --re-text-color, #000);
        }
    `

    render() {
        if (this.inputData?.title?.color)
            this.style.setProperty('--re-user-h2-color', this.inputData?.title?.color)
        if (this.inputData?.subTitle?.color)
            this.style.setProperty('--re-user-h3-color', this.inputData?.subTitle?.color)
        if (this.inputData?.body?.color)
            this.style.setProperty('--re-user-p-color', this.inputData?.body?.color)

        return html`
            <div class="wrapper">
                <h2
                    class="paging"
                    ?active=${this.inputData?.title?.text}
                    style="font-size: ${this.inputData?.title?.fontSize}; 
              font-weight: ${this.inputData?.title?.fontWeight}; 
              background-color: ${this.inputData?.title?.backgroundColor};"
                >
                    ${this.inputData?.title?.text}
                </h2>
                <h3
                    class="paging"
                    ?active=${this.inputData?.subTitle?.text}
                    style="font-size: ${this.inputData?.subTitle?.fontSize}; font-weight: ${this.inputData
                        ?.subTitle?.fontWeight};"
                >
                    ${this.inputData?.subTitle?.text}
                </h3>
                <p
                    class="paging"
                    ?active=${this.inputData?.body?.text}
                    style="font-size: ${this.inputData?.body?.fontSize}; font-weight: ${this.inputData?.body
                        ?.fontWeight};"
                >
                    ${this.inputData?.body?.text}
                </p>
            </div>
        `
    }
}
window.customElements.define('widget-textbox-versionplaceholder', WidgetTextbox)
