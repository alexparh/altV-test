Vue.prototype.window = window

var app = new Vue({
    el: '#app',
    data: {
        velocity: 0,
        fuel: 0,
    },
    methods: {
        displayVelocity(velocity) {
            this.velocity = Math.round(velocity)
        },
        displayFuel(fuelQuantity) {
            this.fuel = fuelQuantity
        },
    },
    mounted() {
        if ('alt' in window) {
            alt.on('display:Velocity', this.displayVelocity)
            alt.on('display:Fuel', this.displayFuel)
        }
    },
})
