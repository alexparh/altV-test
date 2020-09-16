Vue.prototype.window = window

var app = new Vue({
    el: '#app',
    data: {
        show: false,
    },
    methods: {
        start() {
            if ('alt' in window) {
                alt.emit('car:Start')
            }
        },
        drownOut() {
            if ('alt' in window) {
                alt.emit('car:DrownOut')
            }
        },
    },
})
