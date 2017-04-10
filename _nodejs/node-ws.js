var WebSocket = require('ws');
var uuid = require('node-uuid');

var clientIndex = 1;
var clients = [];

wss = new WebSocket.Server({
    port: 8181
});

wss.on('connection', function(ws) {
    var clientuuid = uuid.v4();
    var nickname = 'AnonymousUser' + clientIndex;
    clientIndex += 1;
    clients.push({
        'id': clientuuid,
        'ws': ws,
        'nickname': nickname
    });
    console.log('client [%s] connected', clientuuid);

    var wsSend = function(type, clientuuid, nickname, message) {
        for (var i = 0; i < clients.length; i++) {
            var clientSocket = clients[i].ws;
            if (clientSocket.readyState === WebSocket.OPEN) {
                clientSocket.send(JSON.stringify({
                    'type': type,
                    'id': clientuuid,
                    'nickname': nickname,
                    'message': message
                }));
            }
        }
    };

    var closeSocket = function(customMessage) {
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id === clientuuid) {
                var disconnectMessage;
                if (customMessage) {
                    disconnectMessage = customMessage;
                } else {
                    disconnectMessage = nickname + ' has disconnected';
                }
                wsSend('notification', clientuuid, nickname, disconnectMessage);
                clients.splice(i, 1);
            }
        }
    };

    ws.on('message', function(message) {
        if (message.indexOf('/nick') === 0) {
            var nicknameArr = message.split(' ');
            if (nicknameArr.length >= 2) {
                var oldNickname = nickname;
                nickname = nicknameArr[1];
                var nicknameMessage = 'Client ' + oldNickname + ' change to ' + nickname;
                wsSend('nickUpdate', clientuuid, nickname, nicknameMessage);
            }
        } else {
            wsSend('message', clientuuid, nickname, message);
        }
    });

    ws.on('close', function() {
        closeSocket();
    });
});
