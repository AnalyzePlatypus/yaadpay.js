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
```

### Create a YaadPay payment link

```js
// All params are optional for signing, but then the request won't do much without them :)
let params = {
	Amount: 10, // Payment amount
	Coin: 1, // Currency code (1 = ILS, 2 = USD, 3 = EUR, 4 = GBP)
	
	// Configure the page
	Info: "A test payment. Thanks for the business!", // Description string shown to the user
	PageLang: "HEB", // Page language: ENG or HEB
	heshDesc: "[0~Item 1~1~8][0~Item 2~2~1]", // Line items
	Pritim: true, // Show line items
	tmp: 1 // HTML Template to use for the form. YaadPay provides 16 templates out of the box. You can add a custom one at additioanl cost by contacting Yaad support. See https://yaadpay.docs.apiary.io/introduction/selecting-template/our-templates
	
	
	// Order info
	Order: "12345678910", // Order number from your system. This is an opaque string that's stored for your convenience
	UserId: "203269535", // User ID from your system. This is an opaque string that's stored for your convenience
	
	
	// Prefill  user info for the form
	ClientName: "Israel",
	ClientLName: "Isareli",
	street: "levanon 3",
	city: "netanya",
	zip: "42361",
	phone: "098610338",
	cell: "050555555555",
	email: "test@yaad.net",
	
	// Monthly payments
	Tash: 2, // Maximum allowed monthly payments
	FixTash: false, // Prevent the user from editing the amount of monthly payments
	ShowEngTashText: true, // Show monthly breakdown 
	
	// Other
	Postpone: false,
	J5: false, 
	Sign: true, // Append a cryptographic signature to the URL so it can be verified by Yaad's servers. Required by default, can be disabled on their dashboard
	MoreData: true,
	sendemail: true,
	SendHesh: true, // Send the customer an email receipt
	UTF8: true, // Inform the server that your Strings are encoded in UTF-8
	UTF8out: true, // Request that server responses be encoded in UTF-8
}

// Returns a payment URL for the user
const signedPaymentUrl = await yaad.signUrl(params);
```

### Verify a transaction

```js
const inputUrl = "****" // Success redirect URL from YaadPay after checkout success;

// Returns true on success, throws with error on failure
await yaad.verifyTransactionSuccess({ yaadSuccessURL: inputUrl });
```

## To-do

- [x] Verify payment
- [ ] 429 retry with binexp backoff 

## Legal

YaadPay is a registered trademark of Yaad Payments Ltd. All rights reserved.

Learn more about YaadPay [here](https://yaadpay.yaad.net/yaadpay/).

## Thank You

Development sponsored by [razorUX](razorux.com)