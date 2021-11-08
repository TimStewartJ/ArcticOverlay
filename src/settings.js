const Store = require('electron-store');

const store = new Store ();

exports.write = (key, value) => {
    store.set(key, value);
    return value;
}

exports.read = key => {
    return store.get(key);
}
