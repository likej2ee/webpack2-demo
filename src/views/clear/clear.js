import './clear.scss';
import $ from 'jquery';
import iSlider from 'iSlider';

var vm = new Vue({
    el: '#app',
    data: {
        title: 'dfdfd',
        show: true
    },
    methods: {
        start: function() {
            var $view = $(this.$el);
            $view.find('.page-1').addClass('active');
            $view.find('.page-2').addClass('active');
        }
    }
})

var data = [{
    content: document.getElementById('j-page-1')
}, {
    content: `
        <div class="page page-2">
            2222
        </div>
    `
}];

var islider = new iSlider({
    dom: document.getElementById('j-islider-wrapper'),
    data: data,
    isVertical: true,
    isLooping: false,
    isDebug: false,
    isAutoplay: false,
    animateType: 'rotate'
});
