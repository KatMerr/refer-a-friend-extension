$(document).ready(() => {
    getData("matchedUrl")
    .then((url) => {
        const trimmedUrl = url.match(/www\.\w+\.\w+/);
        $(".site-url").text(trimmedUrl);
    })
    .catch(console.log);

    getData("products")
    .then((products) => {
        const $products = $(".products");
        products.forEach((product) => {
            $products.append(`<div onclick='getReferal(${product._id})'>${product.name}</div>`);
        })
    })

    function getReferals(productID){
        //This isn't working, the query isn't correct for findign the correct reference ID's
        const referalsURL = `https://api.mlab.com/api/1/databases//refer-a-friend/collections/UserReferals?q={"product": "${productID}"}&apiKey=98MJHnF6NxhVILhvraQo-3IBJWjDKsFr`;
    }

    /*$(".get-referal").click(() => {
        getData("products")
        .then((products) => {
            getData("matchedUrl")
            .then((url) => {
                const filteredProducts = products.filter((product) => {
                    return product.url === url;
                });
                return filteredProducts;
            })
            .then(console.log);
        })
        .catch(console.log);
    });*/
});