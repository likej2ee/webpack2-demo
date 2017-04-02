import './demo.scss';
// import _ from 'lodash';
import Velocity from 'velocity';
// import axios from 'axios';

Vue.component('btn-transition', {
    functional: true,
    render: function(createElement, context) {
        var data = {
            props: {
                mode: 'out-in',
                'enter-active-class': 'animated fadeIn',
                'leave-active-class': 'animated fadeOut'
            },
            on: {
                beforeEnter: function(el) {
                    console.log(el)
                },
                afterEnter: function(el) {
                    console.log(el)
                },
                beforeLeave: function(el) {
                    console.log(el)
                },
                afterLeave: function(el) {
                    console.log(el)
                }
            }
        }
        return createElement('transition', data, context.children)
    }
});

var vm = new Vue({
    el: '#example',
    data: {
        show: true,
        query: '',
        list: [{
            msg: 'Bruce Lee'
        }, {
            msg: 'Jackie Chan'
        }, {
            msg: 'Chuck Norris'
        }, {
            msg: 'Jet Li'
        }, {
            msg: 'Kung Fury'
        }]
    },
    computed: {
        computedList: function() {
            var vm = this;
            return this.list.filter(function(item) {
                return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
            })
        }
    },
    methods: {
        beforeEnter: function(el) {
            el.style.opacity = 0
            el.style.height = 0
        },
        enter: function(el, done) {
            var delay = el.dataset.index * 150;
            setTimeout(function() {
                Velocity(el, {
                    opacity: 1,
                    height: '1.6em'
                }, {
                    complete: done
                })
            }, delay)
        },
        leave: function(el, done) {
            var delay = el.dataset.index * 150;
            setTimeout(function() {
                Velocity(el, {
                    opacity: 0,
                    height: 0
                }, {
                    complete: done
                })
            }, delay)
        }
    }
});

console.log(vm);
