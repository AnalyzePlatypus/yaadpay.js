require('dotenv').config()

const { createYaadPay } = require('../src/main.js');

const API_KEY = 'FAKE_API_KEY';
const MASOF_ID = "FAKE_MASOF_ID";
const PASSP = "FAKE_PASSP"

const DEFAULT_ARGS = {
	apiKey: API_KEY,
	masofId: MASOF_ID,
	passp: PASSP
}

const SIGN_REQUEST_PARAMS = {
	Order: "12345678910",
	Info: "test-api",
	Amount: 10,
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
	Tash: 2,
	FixTash: false,
	ShowEngTashText: false,
	Coin: 1,
	Postpone: false,
	J5: false,
	Sign: true,
	MoreData: true,
	sendemail: true,
	SendHesh: true,
	heshDesc: "[0~Item 1~1~8][0~Item 2~2~1]",
	Pritim: true,
	PageLang: "HEB",
	tmp: 1
}

test('Constructor has no errors', () => {
	
	expect(() =>{
		const yaad = createYaadPay(DEFAULT_ARGS);	
	}).not.toThrow();
	
});

describe('Signing URls', () => {
	test('Generates the same URL params to sign as in the docs', async () => {
	
		const expectedUrl = "https://icom.yaad.net/p/?action=APISign&What=SIGN&KEY=7110eda4d09e062aa5e4a390b0a572ac0d2c0220&PassP=yaad&Masof=0010131918&Order=12345678910&Info=test-api&Amount=10&UTF8=True&UTF8out=True&UserId=203269535&ClientName=Israel&ClientLName=Isareli&street=levanon+3&city=netanya&zip=42361&phone=098610338&cell=050555555555&email=test@yaad.net&Tash=2&FixTash=False&ShowEngTashText=False&Coin=1&Postpone=False&J5=False&Sign=True&MoreData=True&sendemail=True&SendHesh=True&heshDesc=[0~Item 1~1~8][0~Item 2~2~1]&Pritim=True&PageLang=HEB&tmp=1";
		
		const yaad = createYaadPay({
				apiKey: "7110eda4d09e062aa5e4a390b0a572ac0d2c0220",
				masofId: "0010131918",
				passp: "yaad"
			});	
		
		const urlToSign = await yaad.buildSignedRequestUrl({
				KEY: "7110eda4d09e062aa5e4a390b0a572ac0d2c0220",
				PassP: "yaad",
				Masof: "0010131918",
				Order: "12345678910",
				Info: "test-api",
				Amount: 10,
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
				Tash: 2,
				FixTash: false,
				ShowEngTashText: false,
				Coin: 1,
				Postpone: false,
				J5: false,
				Sign: true,
				MoreData: true,
				sendemail: true,
				SendHesh: true,
				heshDesc: "[0~Item 1~1~8][0~Item 2~2~1]",
				Pritim: true,
				PageLang: "HEB",
				tmp: 1
			})
					
			const expectedParams = Array.from(new URLSearchParams(expectedUrl.replace('https://icom.yaad.net/p/?', '')).entries()).sort();
			const actualParams = Array.from(new URLSearchParams(urlToSign.replace('https://icom.yaad.net/p/?', '')).entries()).sort();
				
			expect(actualParams).toEqual(expectedParams)
	});
	
	test('Generates a correctly formatted URL', async () => {
	
		const expectedUrl = "https://icom.yaad.net/p/?action=APISign&What=SIGN&Order=12345678910&Info=test-api&Amount=10&UTF8=True&UTF8out=True&UserId=203269535&ClientName=Israel&ClientLName=Isareli&street=levanon+3&city=netanya&zip=42361&phone=098610338&cell=050555555555&email=test%40yaad.net&Tash=2&FixTash=False&ShowEngTashText=False&Coin=1&Postpone=False&J5=False&Sign=True&MoreData=True&sendemail=True&SendHesh=True&heshDesc=%5B0%7EItem+1%7E1%7E8%5D%5B0%7EItem+2%7E2%7E1%5D&Pritim=True&PageLang=HEB&tmp=1&KEY=7110eda4d09e062aa5e4a390b0a572ac0d2c0220&PassP=yaad&Masof=0010131918";
		
		const yaad = createYaadPay({
				apiKey: "7110eda4d09e062aa5e4a390b0a572ac0d2c0220",
				masofId: "0010131918",
				passp: "yaad"
			});	
		
		const actualUrl = await yaad.buildSignedRequestUrl(SIGN_REQUEST_PARAMS)
	
				
		expect(actualUrl).toEqual(expectedUrl)
	});
	
	test('Signs the URL from the server', async () => {
		const yaad = createYaadPay({
			apiKey: process.env.YAADPAY__API_KEY,
			masofId: process.env.YAADPAY__MASOF_ID,
			passp: process.env.YAADPAY__PASSP
		});	
		
		const expectedSignedUrl = 'https://icom.yaad.net/p/?action=pay&Amount=10&ClientLName=Isareli&ClientName=Israel&Coin=1&FixTash=False&Info=test-api&J5=False&Masof=0010131918&MoreData=True&Order=12345678910&PageLang=HEB&Postpone=False&Pritim=True&SendHesh=True&ShowEngTashText=False&Sign=True&Tash=2&UTF8=True&UTF8out=True&UserId=203269535&action=pay&cell=050555555555&city=netanya&email=test%40yaad.net&heshDesc=%5B0~Item%201~1~8%5D%5B0~Item%202~2~1%5D&phone=098610338&sendemail=True&street=levanon%203&tmp=1&zip=42361&signature=908f05b9905e64bed97f3fbdb800151cb175069b5053bfda55d48d716db441c8';
		const actualSignedUrl = await yaad.signUrl(SIGN_REQUEST_PARAMS);
		
		expect(actualSignedUrl).toBe(expectedSignedUrl);
	})
	
	describe('success verification', () => {
		test('Generates the verify URL', async () => {
			const yaad = createYaadPay({
				apiKey: process.env.YAADPAY__API_KEY,
				masofId: process.env.YAADPAY__MASOF_ID,
				passp: process.env.YAADPAY__PASSP
			});	
			
			const inputUrl = 'https://icom.yaad.net/yaadpay/tmp/apitest/yaadsuccesspagedemo.htm?Id=12788261&CCode=0&Amount=10&ACode=0012345&Order=12345678910&Fild1=Israel%20Isareli&Fild2=test%40yaad.net&Fild3=&Sign=13cccf141e2fc2e2dd8d8201a90d58929514d97e00084cb9436cab087f1ba8c6&Bank=6&Payments=1&UserId=203269535&Brand=2&Issuer=2&L4digit=0000&street=levanon%203&city=netanya&zip=42361&cell=098610338&Coin=1&Tmonth=03&Tyear=2023&errMsg=%20(0)&Hesh=31';
			
			const expectedUrl = 'https://icom.yaad.net/p/?action=APISign&What=VERIFY&Id=12788261&CCode=0&Amount=10&ACode=0012345&Order=12345678910&Fild1=Israel+Isareli&Fild2=test%40yaad.net&Fild3=&Sign=13cccf141e2fc2e2dd8d8201a90d58929514d97e00084cb9436cab087f1ba8c6&Bank=6&Payments=1&UserId=203269535&Brand=2&Issuer=2&L4digit=0000&street=levanon+3&city=netanya&zip=42361&cell=098610338&Coin=1&Tmonth=03&Tyear=2023&errMsg=+%280%29&Hesh=31&KEY=7110eda4d09e062aa5e4a390b0a572ac0d2c0220&PassP=yaad&Masof=0010131918';
			const actualUrl = await yaad.buildVerifyTransactionSuccessUrl({ yaadSuccessURL: inputUrl });
			
			expect(actualUrl).toBe(expectedUrl);
		})
		
		test('Succeeds on a good success URL from the server', async () => {
			const yaad = createYaadPay({
				apiKey: process.env.YAADPAY__API_KEY,
				masofId: process.env.YAADPAY__MASOF_ID,
				passp: process.env.YAADPAY__PASSP
			});	
			
			const inputUrl = 'https://icom.yaad.net/yaadpay/tmp/apitest/yaadsuccesspagedemo.htm?Id=12788261&CCode=0&Amount=10&ACode=0012345&Order=12345678910&Fild1=Israel%20Isareli&Fild2=test%40yaad.net&Fild3=&Sign=13cccf141e2fc2e2dd8d8201a90d58929514d97e00084cb9436cab087f1ba8c6&Bank=6&Payments=1&UserId=203269535&Brand=2&Issuer=2&L4digit=0000&street=levanon%203&city=netanya&zip=42361&cell=098610338&Coin=1&Tmonth=03&Tyear=2023&errMsg=%20(0)&Hesh=31';
			const response = await yaad.verifyTransactionSuccess({ yaadSuccessURL: inputUrl });
			
			expect(response.success).toBe(true);
		})
		
		test('Returns formatted payment details', async () => {
			const yaad = createYaadPay({
				apiKey: process.env.YAADPAY__API_KEY,
				masofId: process.env.YAADPAY__MASOF_ID,
				passp: process.env.YAADPAY__PASSP
			});	
			
			const inputUrl = 'https://icom.yaad.net/yaadpay/tmp/apitest/yaadsuccesspagedemo.htm?Id=12788261&CCode=0&Amount=10&ACode=0012345&Order=12345678910&Fild1=Israel%20Isareli&Fild2=test%40yaad.net&Fild3=&Sign=13cccf141e2fc2e2dd8d8201a90d58929514d97e00084cb9436cab087f1ba8c6&Bank=6&Payments=1&UserId=203269535&Brand=2&Issuer=2&L4digit=0000&street=levanon%203&city=netanya&zip=42361&cell=098610338&Coin=1&Tmonth=03&Tyear=2023&errMsg=%20(0)&Hesh=31';
			

			const expected = {
			   "transactionId": "123",
			   "addressCity": "netanya",
			   "addressStreet": "levanon 3",
			   "addressZip": "42361",
			   "cardExpiryMonth": "03",
			   "cardExpiryYear": "2023",
			   "cardNetwork": "Visa",
			   "cardProcessor": "Leumi Card",
			   "cellPhoneNumber": "098610338",
			   "creditCardConfirmationCode": "0012345",
			   "creditCardIssuer": "Visa Cal",
			   "currencyCode": "ILS",
			   "email": "test@yaad.net",
			   "errorMessage": " (0)",
			   "fullName": "Israel Isareli",
			   "invoiceNumber": "31",
			   "lastFourDigits": "0000",
			   "orderId": "12345678910",
			   "paymentCount": "1",
			   "phone": "",
			   "signature": "13cccf141e2fc2e2dd8d8201a90d58929514d97e00084cb9436cab087f1ba8c6",
			   "transactionAmount": "10",
			   "transactionId": "12788261",
			   "userId": "203269535",
			   "yaadCCode": "0",
				 "humanReadable": {
		       "amount": "10 ILS",
		       "amountWithPaymentCount": "10 ILS in 1 payment",
		       "paymentMethod": "Visa Cal card ending in 0000",
				 },
				 "success": true,
				}
			
			const actual = await yaad.verifyTransactionSuccess({ yaadSuccessURL: inputUrl });
			
			expect(actual).toStrictEqual(expected);
		})
		
		test('Fails on a bad success URL from the server', async () => {
			const yaad = createYaadPay({
				apiKey: process.env.YAADPAY__API_KEY,
				masofId: process.env.YAADPAY__MASOF_ID,
				passp: process.env.YAADPAY__PASSP
			});	
			
			const inputUrl = 'https://icom.yaad.net/yaadpay/tmp/apitest/yaadsuccesspagedemo.htm?Id=1_2788261&CCode=0&Amount=10&ACode=0012345&Order=12345678910&Fild1=Israel%20Isareli&Fild2=test%40yaad.net&Fild3=&Sign=13cccf141e2fc2e2dd8d8201a90d58929514d97e00084cb9436cab087f1ba8c6&Bank=6&Payments=1&UserId=203269535&Brand=2&Issuer=2&L4digit=0000&street=levanon%203&city=netanya&zip=42361&cell=098610338&Coin=1&Tmonth=03&Tyear=2023&errMsg=%20(0)&Hesh=31';
			
			let error;
			try {
				await yaad.verifyTransactionSuccess({ yaadSuccessURL: inputUrl });
			} catch(e) {
				error = e;
			}
			
			expect(error.message).toBe('❗ Got Yaadpay API Error: CCode 200 - (unknown error)');
		})
	})
	
	test('Should extract any Yaad errors from HTML', async () => {
		const yaad = createYaadPay({
			apiKey: 'blah blah blah',
			masofId: 'phil',
			passp: 'nope'
		});	
		
		let errorMessage;
		try {
			await yaad.signUrl(SIGN_REQUEST_PARAMS);
		} catch (error) {
			errorMessage = error.message;
		}
		
		expect(errorMessage).toMatch(/Masof Error$/);
	})
	
	test('Should throw Yaad CCode errors with translation', async () => {
		const yaad = createYaadPay({
			apiKey: process.env.YAADPAY__API_KEY,
			masofId: process.env.YAADPAY__MASOF_ID,
			passp: process.env.YAADPAY__PASSP
		});	
		
		let errorMessage;
		try {
			await yaad._networkRequest({url: 'https://icom.yaad.net/p/?action=APISign&What=SIGN&Masof=4501335024'});
		} catch (error) {
			errorMessage = error.message;
		}
		
		const expectedError = '❗ Got Yaadpay API Error: CCode 902 - Authentication error. Your Masof, API key, or PassP is incorrect.'
		
		expect(errorMessage).toBe(expectedError);
	})
	
});


