import twilio from 'twilio';
const URL = process.env.URL || "";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_NUMBER = process.env.TWILIO_NUMBER || "";

const DEBUG_MODE = process.env.DEBUG_MODE || true;

console.log(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
let client;
console.log(DEBUG_MODE)
if(!DEBUG_MODE || DEBUG_MODE === "false"){
    client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

function call(number, id){
  console.log('calling number', number, id);
  console.log(`${URL}/task/${id}`, DEBUG_MODE)
  if(DEBUG_MODE !== false && DEBUG_MODE !== "false")
    return;
  console.log("calling for real")
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
