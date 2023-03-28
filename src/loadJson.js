const loadJson = (url, data) => {
    // TODO loadJson(url, data).then(result=>{console.log(result)})
    return new Promise(function (resolve, reject) {
        const http = new XMLHttpRequest();
        const formData = new FormData();
        if (data != null) {
            http.open("POST", url);
            data =  [...data];
            data.forEach((post) => {
                if (post[0] && post[1]) {
                    formData.append(post[0], post[1]);
                }
            })
        } else {
            http.open("GET", url);
        }
        http.send(formData);
        http.onprogress = (e) => {
        }
        http.onload = () => {
            resolve(JSON.parse(http.responseText));
        }
        http.onerror = (e) => {
            reject(url, data, "\nLoad Error\n",e);
        }
    });
}
const loadLink = (url, data) => {
    // TODO loadJson(url, data).then(result=>{console.log(result)})
    return new Promise(function (resolve, reject) {
        const http = new XMLHttpRequest();
        const formData = new FormData();
        if (data != null) {
            http.open("POST", url);
            data = [...data];
            data.forEach((post) => {
                if (post[0] && post[1]) {
                    formData.append(post[0], post[1]);
                }
            })
        } else {
            http.open("GET", url);
        }
        http.send(formData);
        http.onprogress = (e) => {
            console.log(e);
        }
        http.onload = () => {
            resolve(http.responseText);
        }
    });
}
export default loadJson;
export {
    loadLink
}
