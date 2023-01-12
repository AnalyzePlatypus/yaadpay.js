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


