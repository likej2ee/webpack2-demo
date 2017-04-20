import './demo.scss';
// import _ from 'lodash';
// import Velocity from 'velocity';
// import axios from 'axios';
import $ from 'jquery';

new Vue({
    el: '#example',
    data: {
        text: '阿嘎神龙斗士来得及发熟练度解放路撒地方水电费阿斯蒂芬撒地方撒地方',
        list: [1, 212312312, 3, '阿斯顿发斯蒂芬哈萨克东方红卡萨丁说的'],
        isScroll: false
    },
    methods: {
        sendMessage: function() {
            this.list.push(this.text);

            setTimeout(function() {
                var $list = $('#j-message-list');
                var $items = $list.find('.j-message')
                var $currentItem = $items.last();

                $currentItem.parent().fadeIn(1000);

                var itemHeight = $currentItem.outerHeight();
                var itemMarginBottom = parseInt($currentItem.css('margin-bottom'));


                // $items.each(function (i) {
                //     console.log($(this).offset().top);
                //     var $this = $(this)
                //     var offsetTop = $this.offset().top
                //     if (offsetTop <= 0) {
                //         $('#j-message-shadow').width($this.outerWidth());
                //     }
                // })

                $list.stop(true, true).animate({
                    scrollTop: $list.scrollTop() + itemHeight + itemMarginBottom
                }, {
                    speed: 5000,
                    easing: 'linear'
                })

            })
            // Velocity($list[0], {
            //     translateY: -itemHeight
            // }, {
            //     duration: 500
            // });
        }
    }
})
