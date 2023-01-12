# YaadPay.js
[![CI](https://github.com/AnalyzePlatypus/yaadpay.js/actions/workflows/test.yml/badge.svg)](https://github.com/AnalyzePlatypus/yaadpay.js/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/yaadpay.js.svg)](https://badge.fury.io/js/yaadpay.js)

An unofficial JavaScript SDK for [YaadPay](https://yaadpay.yaad.net/yaadpay/)!

- 🚀 Make API calls against YaadPay's official REST API
- ⚠️ Extracts error messages from the occasional Yaad HTML error page
- 😅 Adds helpful error messages to all those pesky `CCode`s (From the [offical docs]('https://yaadpay.docs.apiary.io/#introduction/error-codes/yaadpay-error-codes-hebrew'))

> Official YaadPay API docs are [here](https://yaadpay.docs.apiary.io/#introduction).

❗ This package is not ready. Please do not use it yet.

## Installation

```
npm install yaadpay.js
```

## Usage

```js
const { createYaadPay } = require('yaadpay.js');

// Create an instance.
// (These are the offical YaadPay test API keys)
const yaad = createYaadPay({
	apiKey: "7110eda4d09e062aa5e4a390b0a572ac0d2c0220",
	masofId: "0010131918",
	passp: "yaad"
});	


// Sign a YaadPay URL
let params = { /* Example later */ } 
const signedPaymentUrl = await yaad.signUrl(params);


// All params are optional for signing, but then the request won't do much!
params = {
	Amount: 10, // amount of currency
	Order: "12345678910",
	Info: "test-api",
	UTF8: true,
	UTF8out: true,
	UserId: "203269535",
	ClientName: "Israel",
	ClientLName: "Isareli",
	street: "levanon 3",
	city: "netanya",
	zip: "42361",
	phone: "098610338",
	cell: "050555555555",
	email: "test@yaad.net",
	Tash: 2, // Maxiumum allowed payments
	FixTash: false,
	ShowEngTashText: false,
	Coin: 1, // Currency 1 = ILS, 2 = USD, 3 = EUR, 4 = GBP
	Postpone: false,
	J5: false,
	Sign: true,
	MoreData: true,
	sendemail: true,
	SendHesh: true, // Send an email receipt
	heshDesc: "[0~Item 1~1~8][0~Item 2~2~1]", // Line items
	Pritim: true, // Show line items
	PageLang: "HEB", // Page language: ENG or HEB
	tmp: 1 // Form Template to use
}

```

## Legal

YaadPay is a registered trademark of Yaad Payments Ltd. All rights reserved.
Learn more about YaadPay [here](https://yaadpay.yaad.net/yaadpay/)

## Thank You

Development sponsored by [razorUX](razorux.com)