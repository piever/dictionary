// model
const model = {
    results: [],
    selectedResult: 0,
    error: "",
    loadResults: function (query) {
        return m.request({
            method: "GET",
            url: "https://api.dictionaryapi.dev/api/v2/entries/en/" + query,
        }).then(function(results) {
            model.results = results;
            model.selectedResult = 0;
            model.error = "";
        }).catch(function(e) {
            model.error = "Word not found.";
            model.results = [];
        })
    }
}

// view
function many(tag, component) {
    return {
        view: function (vnode) {
            const entries = vnode.attrs.entries || [];
            return m(tag, entries.map(entry => m(component, entry)));
        }
    };
}

const textBox = {
    view: function (vnode) {
        return m(
            "input",
            {
                type: "text",
                value: vnode.attrs.value,
                onchange: vnode.attrs.onchange,
                class: "px-2 py-1 placeholder-gray-400 rounded border border-gray-400 w-full",
                placeholder: "Enter a word here",
                autocapitalize: "none"
            }
        );
    }
};

const error = {
    view: function (vnode) {
        const text = vnode.attrs.text;
        return text ? [m("p.mt-8.mx-2", text)] : [];
    }
};

const transcription = {
    view: function (vnode) {
        const text = vnode.attrs.text;
        return text ? [m("span", text + " ")] : [];
    }
};

const player = {
    view: function (vnode) {
        const src = vnode.attrs.src;
        const margin = m("span.ml-2");
        if (src) {
            const audio = m("audio", {src});
            const play = m("a.cursor-pointer", {onclick: () => audio.dom.play()}, "🔊 ");
            return [audio, play, margin];
        } else {
            return [margin];
        }
    }
};

const phonetic = {
    view: function (vnode) {
        return [
            m(transcription, {text: vnode.attrs.text}),
            m(player, {src: vnode.attrs.audio})
        ];
    }
};

const phonetics = many("div.mt-2", phonetic);

const definition = {
    view: function (vnode) {
        const example = vnode.attrs.example ? [
            m("br"),
            m("span.italic.text-gray-700", vnode.attrs.example)
        ] : [];
        return m("li.mt-3", m("span", vnode.attrs.definition), example);
    }
};

const definitions = many("ol.list-decimal", definition);

const partOfSpeech = {
    view: function (vnode) {
        const text = vnode.attrs.text;
        return m("p.font-bold.mt-6", text);
    }
};

const meaning = {
    view: function (vnode) {
        return m("div", [
            m(partOfSpeech, {text: vnode.attrs.partOfSpeech}),
            m(definitions, {entries: vnode.attrs.definitions})
        ]);
    }
};

const meanings = many("div", meaning);

const origin = {
    view: function (vnode) {
        const text = vnode.attrs.text;
        return text ? [m("p.font-bold.mt-6", "origin"), m("p.mt-3", text)] : [];
    }
};

const backgroundColor = "bg-gray-100"

const tabs = {
    view: function (vnode) {
        const results = vnode.attrs.results;
        const headers = results.map(function (result, i) {
            const bg = i == model.selectedResult ? "bg-white.shadow" : backgroundColor;
            return m(
                "li.rounded." + bg,
                {onclick: ev => {model.selectedResult = i;}},
                m(
                    "a.font-bold.inline-block.cursor-pointer.p-2.rounded",
                    result.word || "",
                    m("sup", i + 1)
                )
            );
        });
        const navBar = m("ul.flex.flex-wrap.mt-2", headers);
        const contents = results.map(function (result, i) {
            return m("div.mx-2", {hidden: model.selectedResult != i}, [
                m(phonetics, {entries: result.phonetics}),
                m(meanings, {entries: result.meanings}),
                m(origin, {text: result.origin})
            ]);
        });
        return m("div", navBar, contents);
    }
};

const ui = {
    view: function () {
        const components = [
            m(textBox, {onchange: ev => {
                model.loadResults(ev.target.value);
                ev.target.blur();
            }}),
            m(tabs, {results: model.results}),
            m(error, {text: model.error})
        ];
        return m("div.w-screen", m("div.max-w-xl.m-auto", m("div.my-8.mx-10", components)));
    },
};

document.body.classList.add(backgroundColor);
m.mount(document.body, ui);
