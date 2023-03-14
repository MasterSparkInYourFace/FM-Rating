class Page {
    constructor(rootNode) {
        this.rootNode = rootNode;
        this.elements = [];
    }

    get last() {
        return this.elements[this.elements.length - 1];
    }

    render() {
        this.elements.forEach((e) => {
            this.rootNode.appendChild(e);
        });
    }

    destroy() {
        this.elements.forEach((e) => {
            this.rootNode.removeChild(e);
        });
        this.elements = [];
    }

    newElement(e, attr) {
        const b = document.createElement(e);
        Object.keys(attr).forEach(k => {
            switch (true) {
                case (k === "c_text"):
                    b.appendChild(document.createTextNode(attr[k]));
                    break;
                case k.startsWith("event_"):
                    if (typeof(attr[k]) !== "function") {
                        console.error("you must pass a callable object as the event handler. ignoring event");
                        break;
                    }
                    b.addEventListener(k.split("_")[1], attr[k]);
                    break;
                default:
                    b.setAttribute(k, attr[k]);
            }
        });
        this.elements.push(b);
    }
}

class PageButtons extends Page {
    constructor(rootNode, n) {
        super(rootNode);
        this.lastSelected = null;
        for (var i = 1; i < n + 1; i++) {
            this.newElement("button", {
                class: "circle-button",
                c_text: String(i),
                event_click: e => {
                    if (this.lastSelected !== null)
                        this.lastSelected.classList.remove("selected");
                    e.target.classList.add("selected");
                    this.lastSelected = e.target;
                }
            });
        }
        this.render();
    }

    destroy() {
        super.destroy();
        this.lastSelected = null;
    }
}

function renderThanks(buttons) {
    const score = Number(buttons.lastSelected.innerText),
        cont = document.getElementById("container");
    buttons.destroy();
    cont.style["text-align"] = "center";
    const ty = new Page(cont);
    ty.newElement("img", {
        src: "./images/illustration-thank-you.svg",
        id: "thanks"
    });
    ty.newElement("div", { id: "score-display" });
    const sd = new Page(ty.last);
    sd.newElement("span", {
        id: "score-inner",
        c_text: `You selected ${score} out of 5`
    })
    sd.render();
    ty.newElement("header", {
        class: "card-heading",
        c_text: (score < 5) ? "Uh-huh." : "Thank you!"
    });
    ty.newElement("p", {
        class: "card-text",
        c_text: (score < 5)
            ? "I happen to think that rating's way too low! You'd\
                vote 5/5 if you knew what's good for you :)"
            : "Thanks~! I know, I'm the strongest witch, best\
                comedian and best programmer."
    });
    ty.render();
}

function renderMain() {
    const p = new Page(document.getElementById("container"));
    p.newElement("div", { class: "star-circle" });
    p.newElement("header", {
        class: "card-heading",
        c_text: "How am I doing?"
    });
    p.newElement("p", {
        class: "card-text",
        c_text: "Please let me know how I'm doing with these jokes.\
            All feedback is appreciated to help me improve my comedy!\
            The original text in these is always so boring, right?"
    });
    p.newElement("div", { id: "button-container" });
    const s = new PageButtons(p.last, 5);
    // aggressive button
    p.newElement("button", {
        id: "submit-button",
        c_text: "S U B M I T",
        event_click: e => {
            if (s.lastSelected === null)
                return;
            p.destroy();
            renderThanks(s);
        }
    });
    p.render();
}

window.onload = renderMain;