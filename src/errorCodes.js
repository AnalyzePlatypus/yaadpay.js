// From https://yaadpay.docs.apiary.io/introduction/error-codes/yaadpay-error-codes-hebrew
// I translated and improved the error messages
// (I hope 😬)

const YAAD_ERRORS = {
	"400":	"Amount of Items (Hebrew: pritim) is mismatched with the transaction amount. (Invoice module)",
  "401":	"Missing first or last name. (The ClientName or ClientLName parameters are empty)",
	"402":	"Missing 'Info' parameter",
	"600":	"Receiving transaction details (J2)	Check card information - Check the integrity of the card number without checking the J2 frame",
	"700":	"Approved without charging card (Reserve a credit line without a deposit in J5)",
	"800":	"Postponed charge",
	"901":	"No permission. Your terminal or account is not allowed to use this method. Please contact support.",
	"902":	"Authentication error. Your Masof, API key, or PassP is incorrect.",
	"903":	"The number of payments configured in the terminal has been exceeded. To raise your limit please contact support."	,
	"990":	"Card details were not fully captured. Please try the card again.",
	"996":	"Your terminal or account is not allowed to use tokens. Please contact support.",
	"997":	"Invalid token",
	"998":	"Transaction cancelled by YaadPay",
	"999":	"Internal comunication error in YaadPay.",
}

exports.YAAD_ERRORS = YAAD_ERRORS;