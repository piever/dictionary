const ui = {
    view: function () {
        const textBox = m(
            "input",
            {
                type: "text",
                onchange: ev => ui.getWord(ev.target.value),
                class: "px-2 py-1 placeholder-gray-400 rounded border border-gray-400 outline-none focus:outline-none focus:ring w-full",
                placeholder: "Enter a word here"
            }
        );
        const error = ui.result.error ? [m("p.mt-2", ui.result.error)] : []
        const phonetics = m("div.mt-2", (ui.result.phonetics || []).map(function (entry) {
            const id = uuidv4();
            const audio = entry.audio ? [
                m("audio", {id: id, src: entry.audio}),
                m(
                    "a.cursor-pointer",
                    {onclick: () => document.getElementById(id).play()},
                    "🔊 "
                ),
                m("span.ml-2")
            ] : [m("span.ml-2")];
            return [m("span", entry.text + " "), audio];
        }));
        const meanings = ( ui.result.meanings || []).map(function (value) {
            const partOfSpeech = m("p.font-bold.mt-2", value.partOfSpeech);
            const definitions = value.definitions.map(function (def) {
                var example = def.example ? [
                    m("span.text-blue-600", " Example: "),
                    m("span.text-blue-600.italic", def.example)
                ] : [];
                return m("li", m("span", def.definition), example);
            });
            return m("div", [partOfSpeech, m("ol.list-decimal.list-inside", definitions)]);
        });
        const origin = ui.result.origin ? [m("p.font-bold.mt-2", "origin"), ui.result.origin] : [];
        return m("div.my-4.mx-8.max-w-4xl", [textBox, error, phonetics, meanings, origin]);
    },
    result: {},
    getWord: function (word) {
        return m.request({
            method: "GET",
            url: "https://api.dictionaryapi.dev/api/v2/entries/en/" + word,
        })
        .then(function(result) {
            ui.result = result[0];
            console.log(ui.result)
        }).catch(function(e) {
            ui.result = {error: "word not found"};
        })
    }
}

document.body.classList.add("bg-gray-100");

m.mount(document.body, ui);
