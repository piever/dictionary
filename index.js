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
                onchange: vnode.attrs.onchange,
                class: "px-2 py-1 placeholder-gray-400 rounded border border-gray-400 w-full",
                placeholder: "Enter a word here"
            }
        );
    }
};

const error = {
    view: function (vnode) {
        const text = vnode.attrs.text;
        return text ? [m("p.mt-8", text)] : [];
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
        return [m("span", vnode.attrs.text + " "), m(player, {src: vnode.attrs.audio})];
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

const ui = {
    view: function () {
        const onchange = ev => {ui.loadResult(ev.target.value); ev.target.blur();};
        const components = [
            m(textBox, {onchange}),
            m(phonetics, {entries: ui.result.phonetics}),
            m(meanings, {entries: ui.result.meanings}),
            m(origin, {text: ui.result.origin}),
            m(error, {text: ui.result.error})
        ];
        return m("div.max-w-xl.m-auto", m("div.my-8.mx-12", components));
    },

    result: {},

    loadResult: function (word) {
        return m.request({
            method: "GET",
            url: "https://api.dictionaryapi.dev/api/v2/entries/en/" + word,
        }).then(function(result) {
            ui.result = result[0];
        }).catch(function(e) {
            ui.result = {error: "Word not found."};
        })
    }
};

document.body.classList.add("bg-gray-100");
m.mount(document.body, ui);
