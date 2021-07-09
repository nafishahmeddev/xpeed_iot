
const ws = require('ws');

module.exports =   function Broker(server){

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
                        break;
                    case "publish":
                        let _value = ob._value;
                        var _subs = _SUBSCRIBERS[_uid];
                        _subs.forEach(_id=>{
                            var _sock = _CLIENTS[_id];
                            _sock.send(JSON.stringify({
                                "_uid": _uid,
                                "_event": "message",
                                "_value": _value
                            }));
                        });
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
