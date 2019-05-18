import twilio from 'twilio';
const URL = process.env.URL || "";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_NUMBER = process.env.TWILIO_NUMBER || "";

const DEBUG_MODE = process.env.DEBUG_MODE || true;

console.log(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
var client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function call(number, id){
  console.log('calling number', number, id);
  const url = URL.replace('.', ' dot ').replace('/', ' slash ');
  console.log(url)
  if(DEBUG_MODE)
    return;
  client.calls
    .create({
      url: `${URL}/task/${id}`,
      to: number,  // Call this number
      from: TWILIO_NUMBER // From a valid Twilio number
    })
    .then(call => process.stdout.write(call.sid))
    .catch(console.log);
}

export {
  call
}
