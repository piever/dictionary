var result = {}; 

function getWord(word) {
    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word).then(function (response) {
        return response.json();
    }).then(function (data) {
        result = data;
        document.getElementById("result").innerText = JSON.stringify(result[0])
    }).catch(function () {
        console.log("Could not find word!");
    });
}