function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getObjKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

  
export { waitForElm, randint , numberWithCommas, getObjKey} 