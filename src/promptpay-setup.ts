import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { sanitizeId } from './lib/utils'

@customElement('promptpay-setup')
export class PromptPaySetup extends LitElement {
  @property({ type: String })
  promptPayId = sanitizeId(window.localStorage.getItem('promptPayId') || '')

  @property({ type: String })
  inputValue = this.promptPayId

  @property({ type: Boolean })
  collapsed = !!this.promptPayId

  toggle() {
    this.collapsed = !this.collapsed
  }

  render() {
    if (this.collapsed) {
      return
    }

    return html`
      <div class="setup-container">
        <h2>Set up PromptPay</h2>
        <form @submit=${this._onSubmit}>
          <div class="input-group">
            <label for="promptpay-input">PromptPay ID</label>
            <div class="input-wrapper">
              <input
                id="promptpay-input"
                type="text"
                pattern="[0-9]*"
                inputmode="numeric"
                placeholder="Phone number or National ID"
                aria-label="PromptPay ID"
                @input=${this._onInput}
                .value=${this.inputValue}
              />
              ${this.inputValue
                ? html`<button
                    type="button"
                    class="clear-button"
                    @click=${this._clearInput}
                    aria-label="Clear input"
                  >
                    ✕
                  </button>`
                : ''}
            </div>
            <p class="hint">
              Enter your phone number or national ID without spaces or dashes
            </p>
          </div>
          <button
            type="submit"
            ?disabled=${!this.inputValue}
            class="submit-button"
          >
            Save PromptPay ID
          </button>
        </form>
        ${this.promptPayId
          ? html`<div class="current-id">
              <label>Current PromptPay ID:</label>
              <span class="value">${this.promptPayId}</span>
            </div>`
          : ''}
      </div>
    `
  }

  private _onInput(event: Event) {
    const input = event.target as HTMLInputElement
    this.inputValue = sanitizeId(input.value)
    this.dispatchEvent(
      new CustomEvent('promptpay-input', {
        detail: this.inputValue,
        bubbles: true,
        composed: true,
      })
    )
  }

  private _onSubmit(event: Event) {
    event.preventDefault()
    if (!this.inputValue) return

    window.localStorage.setItem('promptPayId', this.inputValue)
    this.promptPayId = this.inputValue
    this.collapsed = true

    this.dispatchEvent(
      new CustomEvent('promptpay-save', {
        detail: this.inputValue,
        bubbles: true,
        composed: true,
      })
    )
  }

  private _clearInput() {
    this.inputValue = ''
    this.dispatchEvent(
      new CustomEvent('promptpay-input', {
        detail: '',
        bubbles: true,
        composed: true,
      })
    )
  }

  static styles = css`
    :host {
      width: 100%;
    }

    .setup-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 400;
      color: #f5f5f5;
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 480px;
      margin: 0 auto;
      width: 100%;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    label {
      font-size: 0.75rem;
      font-weight: 400;
      color: #a3a3a3;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      padding-right: 2rem;
      border: 1px solid #404040;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      background: #262626;
      color: #f5f5f5;
      transition: border-color 0.15s ease;
    }

    input:focus {
      outline: none;
      border-color: #737373;
    }

    .clear-button {
      position: absolute;
      right: 0.5rem;
      padding: 0.125rem;
      border: none;
      background: none;
      color: #d4d4d4;
      cursor: pointer;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s ease;
    }

    .clear-button:hover {
      color: #a3a3a3;
    }

    .hint {
      margin: 0;
      font-size: 0.75rem;
      color: #737373;
    }

    .submit-button {
      padding: 0.5rem 1rem;
      background: #f5f5f5;
      color: #171717;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 400;
      transition: background-color 0.15s ease;
    }

    .submit-button:not(:disabled):hover {
      background: #e5e5e5;
    }

    .submit-button:disabled {
      background: #404040;
      color: #737373;
    }

    .current-id {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      padding: 0.75rem;
      background: #262626;
      border: 1px solid #404040;
      border-radius: 0.25rem;
    }

    .current-id .value {
      color: #f5f5f5;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'promptpay-setup': PromptPaySetup
  }
}
