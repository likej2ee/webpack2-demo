import './demo.scss';
import axios from 'axios';

var vm = new Vue({
    el: '#watch-example',
    data: {
        question: '',
        answer: 'I cannot give you an answer until you ask aquestion!'
    },
    watch: {
        // 如果 question 发生改变，这个函数就会运行
        question: function(newValue) {
            this.answer = 'Waiting for you to stop typing...';
            this.getAnswer();
        }
    },
    methods: {
        getAnswer: function() {
            var delayFn = function() {
                if (vm.question.indexOf('?') === -1) {
                    vm.answer = 'Questions usually contain a question mark. ;-'
                    return;
                }
                vm.answer = 'Thinking...'
                axios.get('https://yesno.wtf/api')
                    .then(function(response) {
                        vm.answer = response.data.answer;
                    })
                    .catch(function(error) {
                        vm.answer = 'Error! Could not reach the API. ' + error
                    });
            };

            clearTimeout(vm.$el.answerTimer); // 每次触发输入的时候清除已存在的定时器号
            vm.$el.answerTimer = setTimeout(delayFn, 500); // 延迟指定时间后执行具体业务逻辑
        }
    }
});
