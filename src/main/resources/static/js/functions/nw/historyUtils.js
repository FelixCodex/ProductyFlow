import { getSvg } from "../../network.js";
import { Stack } from "./classes.js";
import { createLinks, deleteLinks, updateAllLinks, updateLinkPositions } from "./events.js";


let Historial = new Stack();
let HistorialReverse = new Stack();






export function updateHistorial(last, which) {
    if (last.type == "moveSingle") {

        updateHistorialMoveSingle(last, which);

    } else if (last.type == "moveMulti") {

        updateHistorialMoveMulti(last, which);

    } else if (last.type == "create") {

        updateHistorialCreate(last, which);

    } else if (last.type == "delete") {

        updateHistorialDelete(last, which);

    } else if (last.type == "rename") {

        (which == "Historial") ? Historial.push(last.type, nodeToMove.children[0].value, last.id, last.pos, last.selected, last.links) : HistorialReverse.push(last.type, nodeToMove.children[0].value, last.id, last.pos, last.selected, last.links);

    } else {

        (which == "Historial") ? Historial.push(last.type, last.node, last.id, last.pos, last.selected, last.links) : HistorialReverse.push(last.type, last.node, last.id, last.pos, last.selected, last.links);

    }
}

export function goBack(last, which) {
    if ((last.type == "create" && which == "Historial") || (last.type == "delete" && which == "HistorialReverse")) {
        const nodos = document.querySelectorAll(".nodo");
        nodos.forEach((n) => {
            if (last.id == n.dataset.id) {
                surface.removeChild(n);
            }
        })
        deleteLinks(last.links);
        updateAllLinks();
    }
    else if ((last.type == "delete" && which == "Historial") || (last.type == "create" && which == "HistorialReverse")) {
        let split = last.pos.split("/");
        last.node.setAttribute("style", "top:" + (split[1]) + "px;left:" + (split[0]) + "px");
        last.node.setAttribute("x", split[0]);
        last.node.setAttribute("y", split[1]);
        surface.appendChild(last.node);
        createLinks(last.links);
        updateAllLinks();
    }
    else if (last.type == "moveSingle") {
        let split = last.pos.split("/");
        last.node.setAttribute("style", "top:" + (split[1]) + "px;left:" + (split[0]) + "px");
        last.node.setAttribute("x", split[0]);
        last.node.setAttribute("y", split[1]);
        updateLinkPositions(last.node);
    }
    else if (last.type == "moveMulti") {
        last.selected.forEach((s) => {
            let split = s.split("/");
            const nodos = document.querySelectorAll(".nodo");
            nodos.forEach((n) => {
                if (split[0] == n.dataset.id) {
                    n.setAttribute("style", "top:" + (split[2]) + "px;left:" + (split[1]) + "px");
                    n.setAttribute("x", split[1]);
                    n.setAttribute("y", split[2]);
                    updateLinkPositions(n);
                }
            })
        })
    }
    else if (last.type == "rename") {
        const nodos = document.querySelectorAll(".nodo");
        nodos.forEach((n) => {
            if (n.dataset.id == last.id) {
                n.children[0].value = last.node;
            }
        })
    }
    else if (last.type == "check") {
        last.node.classList.toggle("check");
    }
    else if (last.type == "link") {
        (which == "Historial") ? getSvg().removeChild(last.node) : getSvg().appendChild(last.node);

    }
    (which == "Historial") ? Historial.pop() : HistorialReverse.pop();
}

export function updateHistorialMoveSingle(last, which) {
    const nodos = document.querySelectorAll(".nodo");
    nodos.forEach((n) => {
        if (n.dataset.id == last.id) {
            let pos = n.getAttribute("x") + "/" + n.getAttribute("y");
            (which == "Historial") ? Historial.push(last.type, n, last.id, pos, last.selected, last.links) : HistorialReverse.push(last.type, n, last.id, pos, last.selected, last.links);
        }
    })
}

export function updateHistorialMoveMulti(last, which) {
    let selectedNew = [];
    for (let i in last.selected) {
        let split = last.selected[i].split("/")
        const nodos = document.querySelectorAll(".nodo");
        nodos.forEach((n) => {
            if (n.dataset.id == split[0]) {
                selectedNew[i] = split[0] + "/" + n.getAttribute("x") + "/" + n.getAttribute("y");
            }
        })
    }
    (which == "Historial") ? Historial.push("moveMulti", null, null, null, selectedNew, last.links) : HistorialReverse.push("moveMulti", null, null, null, selectedNew, last.links);

    //HistorialReverse.push("moveMulti", null, null, null,  last.selected);
}

export function updateHistorialDelete(last, which) {
    if (which == "Historial") {
        const nodos = document.querySelectorAll(".nodo");
        nodos.forEach((n) => {
            if (n.dataset.id == last.id) {
                let pos = n.getAttribute("x") + "/" + n.getAttribute("y");
                Historial.push(last.type, n, last.id, pos, last.selected, last.links);
            }
        })
    } else {
        HistorialReverse.push(last.type, last.node, last.id, last.pos, last.selected, last.links);
    }
}

export function updateHistorialCreate(last, which) {
    let pos = last.node.getAttribute("x") + "/" + last.node.getAttribute("y");
    (which == "Historial") ? Historial.push(last.type, last.node, last.id, pos, last.selected, last.links) : HistorialReverse.push(last.type, last.node, last.id, pos, last.selected, last.links);
}


export function pushToHistorial(type, node, id, pos, selected, links) {
    Historial.push(type, node, id, pos, selected, links);
}


export function getHistorial() {
    return Historial;
}

export function getHistorialReverse() {
    return HistorialReverse;
}


export function setHistorialReverseToDefault() {
    HistorialReverse.first = null;
    HistorialReverse.last = null;
    HistorialReverse.length = 0;
}
