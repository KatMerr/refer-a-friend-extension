//Returns a promise that adds an expiration and either
//1) Saves the data and returns the saved Data
//2) Gives an error
function saveData(data, expires) {
    //Default expiration = 1 week = 7 * 24 * 60 * 60 * 1000
    expires = expires ||  7 * 24 * 60 * 60 * 1000;
    let savedData = {};
    //Adding an expiration to each property. This turns an object like {"key1": "yes", "key2": "no"} into {"key1": {"data": "yes", "expires": expiration}, "key2": {"data": "no", "expires": expiration}}
    Object.keys(data).forEach(k => {
        savedData[k] = {
            data: data[k],
            expires: Date.now().valueOf() + expires
        }
    });
    return new Promise((resolve, reject) => {
        //Save the updated data to storage
        chrome.storage.sync.set(savedData, () => {
            if (chrome.runtime.lastError){
                //If there's an error with the save, reject and throw the error
                reject(chrome.runtime.lastError);
            } else {
                //Else resolve with the saved data
                resolve(savedData);
            }
        });
    });
}
//Returns a promise that either
//1) Returns the data if it exists and is not expired
//2) Returns undefined if the data doesn't exist
//3) Returns undefined if the data is expired
function getData(key){
    return new Promise((resolve, reject) => {
        //Grab data out of storage
        chrome.storage.sync.get(key, (dat) => {
            //Grab expiration information
            const {data = undefined, expires = 0} = dat[key] || {};
            //If there is no data, return undefined
            if (!data) resolve(undefined);
            if (expires < Date.now().valueOf()){
                //Data hasn't expired yet
                resolve(data);
            } else {
                //Data has expired, clear that information and reject the promise
                chrome.storage.sync.remove(key, () => {
                    if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
                    resolve(undefined);
                });
            }
        });
    });
}