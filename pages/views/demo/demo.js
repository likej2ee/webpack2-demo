import './demo.scss'

let vm = new Vue({
    el: '#app',
    data: {
        message: '2s后内容变化'
    },
    computed: {},
    methods: {
        init() {
            this.changeMessage()
        },
        changeMessage() {
            setTimeout(() => {
                this.message = 'change message'
            }, 2000)
        }
    }
})

vm.init()
