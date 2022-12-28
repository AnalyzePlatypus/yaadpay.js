const { createYaadPay } = require('../src/main.js');

const API_KEY = 'FAKE_API_KEY';
const MASOF_ID = "FAKE_MASOF_ID";
const PASSP = "FAKE_PASSP"

const DEFAULT_ARGS = {
	apiKey: API_KEY,
	masofId: MASOF_ID,
	passp: PASSP
}

test('Constructor has no errors', () => {
	
	expect(() =>{
		const yaad = createYaadPay(DEFAULT_ARGS);	
		console.log(yaad)
	}).not.toThrow();
	
});


// test('Builds URL correctly', async () => {
// 	const yaad = createYaadPay(DEFAULT_ARGS);	
// 	
// 	const expected = "https://icom.yaad.net/p/?action=APISign&What=SIGN&KEY=7110eda4d09e062aa5e4a390b0a572ac0d2c0220&PassP=yaad&Masof=0010131918&Order=12345678910&Info=test-api&Amount=10&UTF8=true&UTF8out=true&UserId=203269535&ClientName=Israel&ClientLName=Isareli&street=levanon+3&city=netanya&zip=42361&phone=098610338&cell=050555555555&email=test@yaad.net&Tash=2&FixTash=false&ShowEngTashText=false&Coin=1&Postpone=false&J5=false&Sign=true&MoreData=true&sendemail=true&SendHesh=true&heshDesc=[0~Item 1~1~8][0~Item 2~2~1]&Pritim=true&PageLang=HEB&tmp=1";
// 	
// 	const params = {
// 		action: "APISign",
// 		What: "SIGN",
// 		KEY: "7110eda4d09e062aa5e4a390b0a572ac0d2c0220",
// 		PassP: "yaad",
// 		Masof: "0010131918",
// 		Order: "12345678910",
// 		Info: "test-api",
// 		Amount: 10,
// 		UTF8: true,
// 		UTF8out: true,
// 		UserId: "203269535",
// 		ClientName: "Israel",
// 		ClientLName: "Isareli",
// 		street: "levanon+3",
// 		city: "netanya",
// 		zip: "42361",
// 		phone: "098610338",
// 		cell: "050555555555",
// 		email: "test@yaad.net",
// 		Tash: 2,
// 		FixTash: false,
// 		ShowEngTashText: false,
// 		Coin: 1,
// 		Postpone: false,
// 		J5: false,
// 		Sign: true,
// 		MoreData: true,
// 		sendemail: true,
// 		SendHesh: true,
// 		heshDesc: "[0~Item 1~1~8][0~Item 2~2~1]",
// 		Pritim: true,
// 		PageLang: "HEB",
// 		tmp: 1
// 	}
// 	
// 	const actual = await yaad.signRequest(params)
// 	
// 	expect(actual).toBe(expected)
// });


