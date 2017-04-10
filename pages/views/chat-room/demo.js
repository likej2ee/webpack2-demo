import './demo.scss';

// 建立连接
var ws = new WebSocket('ws://localhost:8181');
var nickname = '';

ws.onopen = function(e) {
    console.log('Connection to server opened');
};

// 显示
function appendLog(type, nickname, message) {
    if (typeof message == 'undefined') {
        return;
    }
    var messages = document.getElementById('j-messages');
    var messageElem = document.createElement('li');
    var labelInfo;
    if (type === 'notification') {
        labelInfo = '<span class=\'label label-info\'>*</span>';
    } else if (type == 'nickUpdate') {
        labelInfo = '<span class=\'label label-warning\'>*</span>';
    } else {
        labelInfo = '<span class=\'label label-success\'>' +
            nickname + '</span>';
    }
    var messageText = '<h2>' + labelInfo + '&nbsp;&nbsp;' +
        message + '</h2>';
    messageElem.innerHTML = messageText;
    messages.appendChild(messageElem);
}

// 收到消息处理
ws.onmessage = function(e) {
    var data = JSON.parse(e.data);
    nickname = data.nickname;
    appendLog(data.type, data.nickname, data.message);
    console.log('ID: [%s] = %s', data.id, data.message);
};

ws.onclose = function(e) {
    var data = JSON.parse(e.data);
    nickname = data.nickname;
    appendLog(data.type, data.nickname, data.message);
    console.log('Connection closed');
};

// 发送消息
function sendMessage() {
    var messageField = document.getElementById('j-message');
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(messageField.value);
    }
    messageField.value = '';
    messageField.focus();
    return false;
}

// 修改名称
function changName() {
    var name = $('#j-name').val();
    if (ws.readyState === WebSocket.OPEN) {
        ws.send('/nick ' + name);
    }
}

$('#j-form').on('submit', sendMessage);
$('#j-send').on('click', sendMessage);
$('#j-change-name').on('click', changName);
