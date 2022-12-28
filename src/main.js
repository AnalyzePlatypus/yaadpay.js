


const API_URL_BASE = "https://icom.yaad.net/p/?"

const ACTIONS = {
	"APISign": "APISign",
	"PAY": "pay",
	"CancelTrans": "CancelTrans",
	"soft": "soft",
	"getToken": "getToken",
	"commitTrans": "commitTrans"
}

const WHAT = {
	'VERIFY': 'VERIFY',
	'SIGN': 'SIGN'
}

"action=APISign&What=VERIFY&KEY=7110eda4d09e062aa5e4a390b0a572ac0d2c0220&PassP=yaad&Masof=0010131918&"

function createYaadPay({ apiKey, masofId, passp }) {
	return {
		credentials: {
			apiKey,
			masofId,
			passp
		},
		
		async signRequest(params) {
			const requestParamStr = ""
			const url = `
				${this.buildBasicUrl()}&action=${ACTIONS.APISign}&What=${WHAT.SIGN}&${requestParamStr}
			`;
			return url;
		},
		
		buildBasicUrl() {
			return `${API_URL_BASE}&KEY=${apiKey}&PassP=${passp}&Masof=${masofId}`;
		}
	}
}

// 
// https://icom.yaad.net/p/?action=APISign&What=SIGN&KEY=7110eda4d09e062aa5e4a390b0a572ac0d2c0220&PassP=yaad&Masof=0010131918&Order=12345678910&Info=test-api&Amount=10&UTF8=True&UTF8out=True&UserId=203269535&ClientName=Israel&ClientLName=Isareli&street=levanon+3&city=netanya&zip=42361&phone=098610338&cell=050555555555&email=test@yaad.net&Tash=2&FixTash=False&ShowEngTashText=False&Coin=1&Postpone=False&J5=False&Sign=True&MoreData=True&sendemail=True&SendHesh=True&heshDesc=[0~Item 1~1~8][0~Item 2~2~1]&Pritim=True&PageLang=HEB&tmp=1
// 
// Take the response and add it to:
// https://icom.yaad.net/p/?action=pay&
// 
// 
// Success response redirect
// https://icom.yaad.net/yaadpay/tmp/apitest/yaadsuccesspagedemo.htm?Id=12788261&CCode=0&Amount=10&ACode=0012345&Order=12345678910&Fild1=Israel%20Isareli&Fild2=test%40yaad.net&Fild3=&Sign=13cccf141e2fc2e2dd8d8201a90d58929514d97e00084cb9436cab087f1ba8c6&Bank=6&Payments=1&UserId=203269535&Brand=2&Issuer=2&L4digit=0000&street=levanon%203&city=netanya&zip=42361&cell=098610338&Coin=1&Tmonth=03&Tyear=2023&errMsg=%20(0)&Hesh=31
// 
// 
// Verify response
// https://icom.yaad.net/p/?action=APISign&What=VERIFY&KEY=7110eda4d09e062aa5e4a390b0a572ac0d2c0220&PassP=yaad&Masof=0010131918&


exports.createYaadPay = createYaadPay;