const OpenTok = require('opentok');
const apiKey = process.env.TOKBOX_API_KEY;
const secret = process.env.TOKBOX_API_SECRET;
const opentok = new OpenTok(apiKey, secret);

export default opentok;

