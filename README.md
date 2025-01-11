# Han - Split Bills Easily

A simple web application to help calculate and split bills among friends with PromptPay QR code generation. Built with Lit and TypeScript.

## Features

- 🧮 Easy bill splitting calculator
- 📱 Generate PromptPay QR code
- 💾 Store PromptPay ID in local storage

## Tech Stack

- [Lit](https://lit.dev/) - For building fast, lightweight web components
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [promptpay-qr](https://github.com/dtinth/promptpay-qr) - PromptPay QR Code Generator
- [qrcode](https://github.com/soldair/node-qrcode) - QR Code generation library

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Run the development server:

```bash
bun run dev
```

4. Build for production:

```bash
bun run build
```

## Usage

1. Set your PromptPay ID (phone number or national ID)
2. Enter the total bill amount
3. Specify number of people to split with
4. Scan the generated QR code with any Thai banking app
