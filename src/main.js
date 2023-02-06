const fetch = require('isomorphic-fetch');

const { YAAD_RESPONSE_CODES } = require('./errorCodes');

const API_URL_BASE = "https://icom.yaad.net/p/"

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

const HTTP_STATUS = {
	SUCCESS: 200
}

const CCODE_SUCCESS = "CCODE_SUCCESS"

const YAAD_ERROR_HTML_IMAGE_TAG = '<img src="/yaadpay/6.0/Images/failMark.png">'

const CARD_PROCESSOR_CODES = {
	"1": "Isracard",
	"2": "Visa Cal",
	"3": "Diners",
	"4": "Amex",
	"6": "Leumi Card"
}

const CARD_NETWORK_CODES = {
	"0": "PL",
	"1": "MasterCard",
	"2": "Visa",
	"3": "Maestro",
	"5": "Isracard"
}

const CARD_ISSUER_CODES = {
	"1": "Isracard",
	"2": "Visa Cal",
	"3": "Diners",
	"4": "Amex",
	"5": "JCB or Leumi Card"
}

const CURRENCY_CODES = {
	"1": "ILS",
	"2": "USD",
	'3': "EUR",
	"4": "GBP"
}


const SUCCESS_DETAILS_USER_FRIENDLY_KEY_MAP = {
   "ACode": "creditCardConfirmationCode",
   "Amount": "transactionAmount",
   "Bank": "cardProcessor",
   "Brand": "cardNetwork",
   "CCode": "yaadCCode",
   "Coin": "currencyCode",
   "Fild1": "fullName",
   "Fild2": "email",
   "Fild3": "phone",
   "Hesh": "invoiceNumber",
   "Id": "transactionId",
   "Issuer": "creditCardIssuer",
   "L4digit": "lastFourDigits",
   "Order": "orderId",
   "Payments": "paymentCount",
   "Sign": "signature",
   "Tmonth": "cardExpiryMonth",
   "Tyear": "cardExpiryYear",
   "UserId": "userId",
   "cell": "cellPhoneNumber",
   "errMsg": "errorMessage",
	 "city": "addressCity",
   "street": "addressStreet",
   "zip": "addressZip",
}

function translateTransactionSuccessObjectKeys(obj) {
	let translated =  translateObjectKeys({ obj, keyMap: SUCCESS_DETAILS_USER_FRIENDLY_KEY_MAP });
	
	translated.cardProcessor = CARD_PROCESSOR_CODES[translated.cardProcessor];
	translated.creditCardIssuer = CARD_ISSUER_CODES[translated.creditCardIssuer];
	translated.cardNetwork = CARD_NETWORK_CODES[translated.cardNetwork];
	translated.currencyCode = CURRENCY_CODES[translated.currencyCode];
	translated.humanReadable = {
		amount: `${translated.transactionAmount} ${translated.currencyCode}`,
		amountWithPaymentCount: `${translated.transactionAmount} ${translated.currencyCode} in ${translated.paymentCount} payment${ translated.paymentCount > 1 ? 's' : ''}`,
		paymentMethod: `${translated.creditCardIssuer || ''} ${translated.cardNetwork || ''} card ending in ${translated.lastFourDigits}`
	}
	
	translated._raw = obj;
	
	return translated;
}

function translateObjectKeys({ obj, keyMap }) {
	return Object.fromEntries(
		Object.entries(obj).map(([k,v]) => {			
			return [
				(keyMap[k] || k),
				v
			];
		})
	)
} 

function createYaadPay({ apiKey, masofId, passp }) {
	
	return {
		credentials() {
			return {
				KEY: apiKey,
				PassP: passp,
				Masof: masofId,
			}
		},
		
		async signUrl(params) {
			const url = this.buildSignedRequestUrl(params);
			const signedUrlFragment =  await this._networkRequest({ url, method: 'GET' }); 
			return 'https://icom.yaad.net/p/?action=pay&' + signedUrlFragment;
		},
		
		async verifyTransactionSuccess({ yaadSuccessURL }) {
			console.log('ℹ️ Verifying transaction success')
			const url = this.buildVerifyTransactionSuccessUrl({ yaadSuccessURL });
			const response =  await this._networkRequest({ url, method: 'GET' }); 
			if(response == CCODE_SUCCESS) {
				console.log('✅  Transaction success confirmed');
				
				const params = Object.fromEntries(new URL(yaadSuccessURL).searchParams);
				
				
				return {
					success: true,
					...translateTransactionSuccessObjectKeys(params)
				};
			}
			console.log('❗ Transaction failed!');
			return {
				success: false
			};
		},
		
		buildVerifyTransactionSuccessUrl({ yaadSuccessURL }) {
			const url = new URL(yaadSuccessURL);
			const params = Object.fromEntries(url.searchParams);
			
			const verificationUrl = this.buildUrl({ action: ACTIONS.APISign, what: WHAT.VERIFY, params });
			return verificationUrl; 
		},
		
		buildSignedRequestUrl(params) {
			return this.buildUrl({
				action: ACTIONS.APISign,
				what: WHAT.SIGN,
				params,
			})
		},
		
		buildUrl({ action, what, params }) {
			const urlSearchParams = new URLSearchParams({
				action,
				What: what,
				...params,
				...this.credentials()
			});
							
			const url = `${ API_URL_BASE }?${ urlSearchParams.toString() }`.
				replaceAll('true', 'True').
				replaceAll('false', 'False');
			
			return url;
		},
		
		async _networkRequest({ url, method = 'GET' }) {
			console.log(`🛫 Fetching URL: ${url}`);
			
			const response =  await fetch(url, { method })
			
			console.log(`🛬 Fetch complete: ${response.status}`);
			
			if(response.status !== HTTP_STATUS.SUCCESS) {
				throw new Error(`Got non-OK HTTP response ${response.status}`)
			}
			
			const text = await response.text();
			console.log(text);
			
			const HAS_CCODE_SUCCESS__REGEX = /CCode=0/
			
			if(text.match(HAS_CCODE_SUCCESS__REGEX)) {
				return CCODE_SUCCESS;
			}
			
			const HAS_CCODE_ERROR__REGEX = /CCode=/
			
			if(text.match(HAS_CCODE_ERROR__REGEX)) {
				const errorCode = text?.replace(/CCode=/, '')?.trim()
				
				throw new Error(`❗ Got Yaadpay API Error: CCode ${errorCode} - ${YAAD_RESPONSE_CODES[errorCode] || '(unknown error)'}`)
			}
			
			if(text.includes(YAAD_ERROR_HTML_IMAGE_TAG)) {
				const markerText = '<p><font face="arial" size="3" color="#3F3F3F">'
				const errorStrOffset = text.indexOf(markerText) + markerText.length
				const errorMessage = text.substring(errorStrOffset).replace('</font></p></td></tr></table>', '');
				
				throw new Error(`❗ Got Yaadpay API Error:  ${errorMessage}`)
			}
			return text;
		}
	}
}

exports.createYaadPay = createYaadPay;