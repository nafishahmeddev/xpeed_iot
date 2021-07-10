
const ws = require('ws');

module.exports =   function Broker(server, app){

    var _SUBSCRIBERS  = {}
    var _CLIENTS = {};

    const wss = new ws.Server({server});

    wss.on('connection', (ws) => {

        //connection is up, let's add a simple simple event
        ws.on('message', (raw) => {
            try {
                let ob = JSON.parse(raw);
                let _uid = ob._uid;
                let _event = ob._event;
                switch (_event){
                    case "login":
                        _CLIENTS[_uid] = ws;
                        if(!_SUBSCRIBERS.hasOwnProperty(_uid)){
                            _SUBSCRIBERS[_uid] = [];
                        }
                        console.log(`${_uid} : Logged In`);
                        ws.send(JSON.stringify({
                            "_uid":"BROKER",
                            "_event" : "login",
                            "_value": "Successfully logged in"
                        }));
                        break;
                    case "subscribe":
                        let _client = ob._value;
                        if(!_SUBSCRIBERS.hasOwnProperty(_client)){
                            _SUBSCRIBERS[_client] = [];
                        }
                        if(!_SUBSCRIBERS[_client].includes(_uid)){
                            _SUBSCRIBERS[_client].push(_uid);
                        }
                        console.log(`${_uid}: subscribed to ${_client}`);
                        ws.send(JSON.stringify({
                            "_uid":"BROKER",
                            "_event" : "subscribed",
                            "_value": `Successfully subscribed to ${_client}`
                        }));
                        break;
                    case "publish":
                        var _payload = ob._payload;
                        _payload._uid = _uid;
                        if(ob.hasOwnProperty("_client_uid")){
                            let _client_id = ob._client_uid;
                            if(_CLIENTS.hasOwnProperty(_client_id)){
                                let _sock = _CLIENTS[_client_id];
                                _sock.send(JSON.stringify(_payload));
                            }
                        } else {
                            var _subs = _SUBSCRIBERS[_uid];
                            _subs.forEach(_id => {
                                var _sock = _CLIENTS[_id];
                                _sock.send(JSON.stringify(_payload));
                            });
                        }
                        ws.send(JSON.stringify({
                            "_uid":"BROKER",
                            "_event" : "message_sent",
                            "_value": `Successfully message sent ${_value}`
                        }));
                        console.log(`${_uid} : Send Message => ${_value}`);
                        break;
                }
            } catch (e){
                console.log(e.message);
            }

            //log the received message and send it back to the client
            //console.log('received: %s', raw);
            //ws.send(`Hello, you sent -> ${raw}`);
        });
        //send immediatly a feedback to the incoming connection
        ws.send('Successfully connected to broker server');
    });
}
