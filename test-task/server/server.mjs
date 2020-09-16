import * as alt from 'alt-server'
import chat from 'chat'
import FuelVehicle from './fuelVehicle'

console.log('==> Resource Has Loaded')

const spawnPos = {
    x: 813,
    y: -279,
    z: 66,
}

// Called on Server-side
alt.on('playerConnect', (player) => {
    alt.emitClient(player, 'auth:Open')
    console.log(`${player.name} has connected!`)
})

alt.on('auth:Done', exitAuthWindow)

function exitAuthWindow(player, id, username, email) {
    alt.emitClient(player, 'auth:Exit')
    console.log(`${player.name} has authenticated!`)
    alt.log(`==> ${player.name} has connected.`)
    chat.broadcast(`==> ${player.name} has joined.`)
    alt.emitClient(player, 'spawn:Player', spawnPos)
}

alt.onClient('spawn:Ready', (player, pos) => {
    player.model = 'mp_m_freemode_01'
    player.spawn(pos.x, pos.y, pos.z, 0)
})

chat.registerCmd('veh', (player, arg) => {
    if (!arg || arg.length <= 0) {
        chat.send(player, '/veh (model)')
        return
    }

    try {
        const newVehicle = new FuelVehicle(
            arg[0],
            player.pos.x,
            player.pos.y,
            player.pos.z,
            0,
            0,
            0
        )
        alt.emitClient(player, 'vehicle:SetInto', newVehicle)
    } catch (err) {
        chat.send(player, 'That model was incorrect.')
    }
})

alt.on('playerEnteredVehicle', (player, vehicle) => {
    vehicle.lockState = 0
    vehicle.manualEngineControl
    vehicle.engineOn = false
    alt.emitClient(player, 'car:Enter', vehicle)
})

alt.on('playerLeftVehicle', (player, vehicle) => {
    vehicle.stopSpendFuel()
})

alt.onClient('fuel:startSpend', (player, vehicle) => {
    vehicle.startSpendFuel(player, vehicle)
})

alt.onClient('fuel:stopSpend', (player, vehicle) => {
    vehicle.stopSpendFuel()
})
