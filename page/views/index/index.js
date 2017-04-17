import './index.scss';

// 1.
var str = 'aaaabbbccccddfgh';
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



// ES6练习
// 1. 常量
const TEST_NAME = '123';
console.log(TEST_NAME);

// 2. 解构赋值
// http://www.tuicool.com/articles/y2qYraR
var [one, two] = [1, 2];
console.log(one + two);

// 3. for of
// http://www.infoq.com/cn/articles/es6-in-depth-iterators-and-the-for-of-loop
var arr = [5, 4, 3, 7, 5];
var i = 0;
console.log('***** forof *****');
for (var item of arr) {
    console.log(i + ', item = ' + item);
    i++;
}
console.log('***** forin *****');
for (var index in arr) {
    console.log(index + ', item = ' + arr[index] + ', typeof index = ' + typeof index);
}

// 4. Set
var uniqueWords = new Set();
uniqueWords.add(1);
uniqueWords.add(2);
uniqueWords.add(3);
uniqueWords.add(1);

console.log(uniqueWords);
for (var word of uniqueWords) {
    console.log(word);
}
console.log(' forof循环结束后 word = ' + word);

// 5. Map
var myMap = new Map();
myMap.set('a', 1);
myMap.set('b', 2);
myMap.set('b', 3);

console.log(myMap);
for (let [key, value] of myMap) {
    console.log('key = ' + key + ', value = ' + value);
}
console.log(' forof循环结束后 key = ' + typeof key);
