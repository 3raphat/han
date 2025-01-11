import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import ppqr from 'promptpay-qr'
import qrcode from 'qrcode'
import { sanitizeId } from './lib/utils'

interface AmountChangeEvent extends CustomEvent {
  detail: {
    amount: number
    totalAmount: number
    noOfPeople: number
  }
}

@customElement('qr-render')
export class QrRender extends LitElement {
  @property({ type: String })
  promptPayId = sanitizeId(window.localStorage.getItem('promptPayId') || '')

  @property({ type: Number })
  amount = 0

  @property({ type: Number })
  totalAmount = 0

  @property({ type: Number })
  noOfPeople = 1

  firstUpdated() {
    this._renderQrCode()
    window.addEventListener('amount-change', ((e: AmountChangeEvent) => {
      this.amount = e.detail.amount
      this.totalAmount = e.detail.totalAmount
      this.noOfPeople = e.detail.noOfPeople
      this._renderQrCode()
    }) as EventListener)
  }

  updated() {
    this._renderQrCode()
  }

  render() {
    if (!this.promptPayId) {
      return html`
        <div class="no-id-message">
          <p>Please set your PromptPay ID first</p>
        </div>
      `
    }

    const splitInfo =
      this.noOfPeople > 1
        ? html`<div class="split-info">
            <div class="total-amount">
              <span class="label">Total:</span> ฿${this.totalAmount.toFixed(2)}
            </div>
            <div class="split-details">
              <span class="people">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                ${this.noOfPeople} people</span
              >
              <span class="divider">•</span>
              <span class="per-person">฿${this.amount.toFixed(2)} each</span>
            </div>
          </div>`
        : html`<div class="split-info single">
            <div class="total-amount">฿${this.amount.toFixed(2)}</div>
          </div>`

    return html`
      <div class="qr-card">
        ${splitInfo}
        <div class="qr-wrapper">
          <canvas id="qr-canvas" width="256" height="256"></canvas>
        </div>
        <div class="promptpay-id">
          <span class="label">PromptPay ID:</span>
          <span class="id">${this.promptPayId}</span>
          <button type="button" class="edit-button" @click=${this._showSetup}>
            edit
          </button>
        </div>
      </div>
    `
  }

  private _showSetup() {
    const setup = document.querySelector('promptpay-setup')
    if (setup) {
      setup.toggle()
    }
  }

  private _renderQrCode() {
    if (!this.promptPayId) {
      return
    }

    const payload = ppqr(this.promptPayId, { amount: this.amount })
    const canvas = this.renderRoot.querySelector('#qr-canvas')
    if (canvas) {
      qrcode.toCanvas(
        canvas,
        payload,
        {
          scale: 10,
          margin: 1,
          errorCorrectionLevel: 'L',
        },
        (error) => {
          if (error) {
            window.alert('Error rendering QR code')
            console.error(error)
          }
        }
      )
    }
  }

  static styles = css`
    .qr-card {
      height: auto;
      width: 100%;
      background: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }

    .no-id-message {
      text-align: center;
      padding: 1rem;
      color: #737373;
      font-size: 0.875rem;
    }

    .split-info {
      width: 100%;
      text-align: center;
    }

    .total-amount {
      font-size: 1.5rem;
      font-weight: 400;
      color: #f5f5f5;
      margin-bottom: 0.25rem;
    }

    .label {
      color: #a3a3a3;
      font-weight: 400;
    }

    .split-details {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #a3a3a3;
      font-size: 0.875rem;
    }

    .split-details .people {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.25rem;
    }

    .divider {
      color: #404040;
    }

    .per-person {
      font-weight: 400;
      color: #f5f5f5;
    }

    .qr-wrapper {
      background: #ffffff;
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid #404040;
    }

    canvas {
      width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
    }

    .promptpay-id {
      font-size: 0.75rem;
      display: flex;
      gap: 0.25rem;
      align-items: center;
      color: #a3a3a3;
    }

    .edit-button {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      font-size: 0.75rem;
      color: #a3a3a3;
      cursor: pointer;
      text-decoration: underline;
    }

    .edit-button:hover {
      color: #737373;
    }

    .promptpay-id .id {
      color: #f5f5f5;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'qr-render': QrRender
  }
}
