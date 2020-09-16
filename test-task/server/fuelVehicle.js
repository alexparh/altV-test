import * as alt from 'alt-server'

export default class FuelVehicle extends alt.Vehicle {
    constructor(model, posx, posy, posz) {
        super(model, posx, posy, posz, 0, 0, 0)
        this.fuel = 100
    }

    startSpendFuel = (player, vehicle) => {
        this.interval = setInterval(() => {
            alt.emitClient(player, 'fuel:Quantity', this.fuel)
            if (this.fuel < 1) {
                alt.emitClient(player, 'fuel:End', vehicle)
                return
            }
            this.fuel--
        }, 1000)
    }

    stopSpendFuel = () => {
        clearInterval(this.interval)
    }
}
