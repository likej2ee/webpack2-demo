import './demo.scss';
// import _ from 'lodash';
// import Velocity from 'velocity';
// import axios from 'axios';
import $ from 'jquery';

var vm = new Vue({
    el: '#example',
    data: {},
    methods: {
        init() {
            require(['rangeslider', 'rangeslidercss'], function() {
                $('#j-volume').rangeslider({

                    // Feature detection the default is `true`.
                    // Set this to `false` if you want to use
                    // the polyfill also in Browsers which support
                    // the native <input type="range"> element.
                    polyfill: false,

                    // Default CSS classes
                    rangeClass: 'rangeslider',
                    disabledClass: 'rangeslider--disabled',
                    horizontalClass: 'rangeslider--horizontal',
                    verticalClass: 'rangeslider--vertical',
                    fillClass: 'rangeslider__fill',
                    handleClass: 'rangeslider__handle',

                    // Callback function
                    onInit: function() {},

                    // // Callback function
                    // onSlide: function(position, value) {
                    //     console.log(position);
                    //     console.log(value);
                    // },
                    //
                    // // Callback function
                    // onSlideEnd: function(position, value) {
                    //     console.log(position);
                    //     console.log(value);
                    // }
                });
            })
        }
    }
})
vm.init()
