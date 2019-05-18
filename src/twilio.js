import twilio from 'twilio';
const URL = process.env.URL || "";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_NUMBER || "";

console.log(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
var client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function call(number, id){
  console.log('calling number', number, id);
  client.calls
    .create({
      url: `${URL}/task/${id}`,
      to: number.number,  // Call this number
      from: TWILIO_NUMBER // From a valid Twilio number
    })
    .then(call => process.stdout.write(call.sid))
    .catch(console.log);
}

export {
  call
}
