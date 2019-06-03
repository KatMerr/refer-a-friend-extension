const productsURL = `https://api.mlab.com/api/1/databases//refer-a-friend/collections/Products?q={"pending": false}&apiKey=${mlabAPI}`;


chrome.runtime.onInstalled.addListener(function() {
    //First need to check the products list to be certain the information hasn't expired yet
    getData("products")
    .then((products) => {
        //Products either don't exist, or are expired, so we need to populate that list
        if (!products)
        {
            $.ajax({
                url: productsURL,
            })
            .done((products) => {
                //For easier reference, we need to make a list of all possible urls that we'll need to activate the extension on
                const urls = [];
                products.map((prod) => {
                    const url = (prod.url) ? prod.url.toLowerCase() : undefined;
                    if (url && urls.indexOf(url) < 0) {
                        urls.push(url);
                    };
                });
                //The data object to be saved, saving both the overall products list and possible matching urls
                const data = {products: products, urls: urls};
                //Save the data object, add an expiration of 20s in this case
                saveData(data, 20000)
                    .then(console.log)
                    .catch(console.log);
            })
            .catch(console.log);
        }
    });
    
    //On new tab, tab update, etc's completion and if its the active tab, we need to check whether or not the extension is active
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status == "complete" && tab.active){
            //This needs to be done in order to 'activate' the show and hide pageAction methods
            chrome.pageAction.show(tabId);
            chrome.pageAction.hide(tabId);
            var currentUrl = tab.url || null;
            if (currentUrl){
                getData("urls")
                .then((urls) => {
                    //If there are urls that aren't expired, compare the current URL to the list. If there's a match, activate the extension
                    if (typeof urls === "object"){
                        urls.forEach((url) => {
                            console.log(url);
                            if(url && url.includes(currentUrl)){
                                console.log("match");
                                chrome.storage.sync.set({matchedUrl: {data: currentUrl}});
                                chrome.pageAction.show(tabId);
                            }
                        });
                    }
                });
            }
        }
        
    });
    
});