import alt from 'alt-server';
import { MSGS } from './messages';
import { fetchDatabaseInstance } from 'simplymongo';
import bcrypt from 'bcryptjs';
import chalk from 'chalk';

alt.onClient('auth:Try', handleAuthAttempt);
alt.on('auth:Done', debugDoneAuth);

async function handleAuthAttempt(player, username, password, email) {
    if (!player || !player.valid) {
        return;
    }

    if (!username || !password) {
        alt.emitClient(player, 'auth:Error', MSGS.UNDEFINED);
    }

    if (email) {
        handleRegistration(player, email, username, password);
        return;
    }

    handleLogin(player, username, password);
}

async function handleRegistration(player, email, username, password) {
    const db = await fetchDatabaseInstance();
    const emails = await db.fetchAllByField('email', email, 'accounts');
    if (emails.length >= 1) {
        alt.emitClient(player, 'auth:Error', MSGS.EXISTS);
        return;
    }

    const usernames = await db.fetchAllByField('username', username, 'accounts');
    if (usernames.length >= 1) {
        alt.emitClient(player, 'auth:Error', MSGS.EXISTS);
        return;
    }

    const document = {
        email,
        username,
        password: await bcrypt.hash(password, 10)
    };

    const dbData = await db.insertData(document, 'accounts', true);
    alt.emit('auth:Done', player, dbData._id.toString(), dbData.username, dbData.email);
}

async function handleLogin(player, username, password) {
    const db = await fetchDatabaseInstance();
    const accounts = await db.fetchAllByField('username', username, 'accounts');
    if (accounts.length <= 0) {
        alt.emitClient(player, 'auth:Error', MSGS.INCORRECT);
        return;
    }
    const comparedPasswword = await bcrypt.compare(password, accounts[0].password)
    if (!comparedPasswword) {
        alt.emitClient(player, 'auth:Error', MSGS.INCORRECT);
        return;
    }

    alt.emit('auth:Done', player, accounts[0]._id.toString(), accounts[0].username, accounts[0].email);
}

// Simply to log a successful authentication to console
function debugDoneAuth(player, id, username, email) {
    console.log(chalk.cyanBright(`[OS] Authenticated - ${username} - ${id}`));
}
