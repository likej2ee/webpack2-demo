import './one.scss';

// 1.
var str = "aaaabbbccccddfgh";
var obj = {};
for (var i = 0; i < str.length; i++) {
    var v = str.charAt(i);
    if (obj[v] && obj[v].value == v) {
        obj[v].count = ++obj[v].count;
    } else {
        obj[v] = {};
        obj[v].count = 1;
        obj[v].value = v;
    }
}

// 2.
for (var key in obj) {
    window.document.write(obj[key].value + '=' + obj[key].count + ''); //a=4 b=3 c=4 d=2 f=1 g=1 h=1
}

function log(){
    var args = Array.prototype.slice.call(arguments); //为了使用unshift数组方法，将argument转化为真正的数组
    args.unshift('(app)');
    console.log(args);
    console.log.apply(console, args);
}
log();
log(123, 456);

// 3.
console.log(Object.prototype.toString.call([1, 2]));
