import { getNodeType, getSvg, getVariableConfig } from "../../network.js";
import { cleanActualTool, cleanSelectedToLink, getActualTool, getCurrentNetworkProject, hideToolBtns, setActualTool, setIsSaveToFalse, setIsSaveToTrue } from "./nwUtils.js";
import { getHistorial, getHistorialReverse, goBack, pushToHistorial, setHistorialReverseToDefault, updateHistorial } from "./historyUtils.js";
import { createNode } from "./creator.js";
import { update } from "./requests.js";


let moving, x1, y1, d = 0, mod = 1, buttonPressed,
    movingNode, nodeToMove, mouseOffsetX,
    mouseOffsetY, moved, isASelected = false,
    nodeToLink = null, linkType = "", selected = [];







export function setLinkType(type) {
    linkType = type;
}

export function setMod(value) {
    mod = value;
}


export function setNodeToLink(node) {
    nodeToLink = node;
}

export function getNodeToMove() {
    return nodeToMove;
}

export function cleanSelected() {
    selected.forEach((s) => {
        s.classList.remove("selected");
    })
    selected = [];
}


export function move(x1, y1, x2, y2) {
    if (y1 < y2) {
        window.scrollTo({
            top: window.scrollY - ((y2 - y1) * mod)
        })
    } else {
        window.scrollTo({
            top: window.scrollY + ((y1 - y2) * mod)
        })
    }
    if (x1 < x2) {
        window.scrollTo({
            left: window.scrollX - ((x2 - x1) * mod)
        })
    } else {
        window.scrollTo({
            left: window.scrollX + ((x1 - x2) * mod)
        })
    }
}

export function moveNode(x, y) {
    nodeToMove.setAttribute("style", "top:" + (y) + "px;left:" + (x) + "px");
    nodeToMove.setAttribute("x", x);
    nodeToMove.setAttribute("y", y);
    setIsSaveToFalse();
}

export function moveMultiNode(x1, y1, x2, y2) {
    x1 = parseInt(x1),
        y1 = parseInt(y1),
        x2 = parseInt(x2),
        y2 = parseInt(y2);
    nodeToMove.setAttribute("style", "top:" + (y1 + y2) + "px;left:" + (x1 + x2) + "px");
    nodeToMove.setAttribute("x", x1 + x2);
    nodeToMove.setAttribute("y", y1 + y2);
    setIsSaveToFalse();
}

export function nodeMouseDownEvent(e) {
    movingNode = true;
    nodeToMove = e.currentTarget;
    mouseOffsetX = e.offsetX;
    mouseOffsetY = e.offsetY;
    if (selected.length != 0) {
        selected.forEach((s) => {
            let x1 = e.pageX - mouseOffsetX, y1 = e.pageY - mouseOffsetY, x2 = s.getAttribute("x"), y2 = s.getAttribute("y"), difx, dify;
            difx = (x2 - x1);
            dify = (y2 - y1);
            s.setAttribute("difx", difx);
            s.setAttribute("dify", dify);
        })
    }
}

export function nodeMouseMoveEvent(e) {
    e.stopPropagation();
    if (movingNode && buttonPressed == 0) {
        selected.forEach((s) => {
            if (s == nodeToMove) {
                isASelected = true;
            }
        })
        if (!selected.length == 0 && isASelected) {
            if (!moved) {

                let selectedHistorial = [];
                for (let i = 0; i < selected.length; i++) {
                    selectedHistorial[i] = selected[i].dataset.id + "/" + selected[i].getAttribute("x") + "/" + selected[i].getAttribute("y");
                }
                pushToHistorial("moveMulti", null, null, null, selectedHistorial, null);
                setHistorialReverseToDefault();
            }
            moved = true;
            selected.forEach((s) => {
                nodeToMove = s;
                moveMultiNode(e.pageX - mouseOffsetX, e.pageY - mouseOffsetY, s.getAttribute("difx"), s.getAttribute("dify"));
                updateLinkPositions(nodeToMove);
            })
        } else {
            if (!moved) {
                let pos = nodeToMove.getAttribute("x") + "/" + nodeToMove.getAttribute("y");
                pushToHistorial("moveSingle", nodeToMove, nodeToMove.dataset.id, pos, null, null);
                setHistorialReverseToDefault();
            }
            moved = true;
            moveNode(e.pageX - mouseOffsetX, e.pageY - mouseOffsetY);
            updateLinkPositions(nodeToMove);
        }
    }
}

export function nodeMouseUpEvent(e) {
    if (movingNode && moved) {
        moved = false;
    } else if (!moved && getActualTool() == 1 && e.button == 0 && e.shiftKey) {
        cleanSelected();
    } else if (!moved && getActualTool() == 1) {
        if (document.querySelectorAll(".selected") && selected.length == 0) {
            cleanSelected();
        }
        if (!e.currentTarget.classList.contains("selected")) {
            let encontrado = false;
            selected.forEach((s) => {
                if (s.dataset.id == e.currentTarget.dataset.id) {
                    encontrado = true;
                }
            })
            if (!encontrado) {
                selected.push(e.currentTarget);
            }
        } else {
            let selectedNew = [];
            selected.forEach((s) => {
                if (s.dataset.id != e.currentTarget.dataset.id) {
                    selectedNew.push(s);
                }
            })
            selected = selectedNew;
        }
        e.currentTarget.classList.toggle("selected");

    } else if (!moved && getActualTool() == 2) {
        let links = [];
        const lines = document.querySelectorAll(".line");
        lines.forEach((l) => {
            if (l.getAttribute("id1") == e.currentTarget.dataset.id || l.getAttribute("id2") == e.currentTarget.dataset.id) {
                links.push(l);
            }
        })
        deleteLinks(links);
        let pos = e.currentTarget.getAttribute("x") + "/" + e.currentTarget.getAttribute("y");
        pushToHistorial("delete", e.currentTarget, e.currentTarget.dataset.id, pos, null, links)
        surface.removeChild(e.currentTarget);
        setHistorialReverseToDefault();

    } else if (!moved && getActualTool() == 3) {

        e.currentTarget.classList.toggle("check");
        pushToHistorial("check", e.currentTarget, e.currentTarget.dataset.id, null, null, null);

    } else if (!moved && getActualTool() == 4) {

        if (nodeToLink == null) {
            cleanSelected();
            nodeToLink = e.currentTarget;
            e.currentTarget.classList.add("selectedToLink");
        } else if (nodeToLink != e.currentTarget) {
            let encontrado = false;
            const lines = document.querySelectorAll(".line");

            encontrado = [...lines].some(l => {
                if (l.getAttribute("id1") == nodeToLink.dataset.id && l.getAttribute("id2") == e.currentTarget.dataset.id) {
                    cleanSelectedToLink();
                    return true;
                }
                return false;
            })

            if (!encontrado) {
                let svg = getSvg();
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                createLink(line, calcPositions
                    (nodeToLink, e.currentTarget),
                    "black", 5, nodeToLink.dataset.id, e.currentTarget.dataset.id, linkType);
                line.addEventListener("click", (e) => {
                    svg.removeChild(e.currentTarget)
                })
                svg.appendChild(line);
                cleanSelectedToLink();
                pushToHistorial("link", line, null, null, null, null);
                const { containers: { linkBtns, nodeBtns } } = getVariableConfig();
                hideToolBtns(linkBtns, nodeBtns);
            }


        } else {
            cleanSelectedToLink();
        }

    }
    isASelected = false;

    setIsSaveToFalse();
}

export function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

export function nodeDoubleClickEvent(e) {
    if (getActualTool() == 1) {
        let texta = e.currentTarget.children[0];
        texta.classList.remove("hide")
        texta.removeAttribute("readonly");
        texta.focus();
    }

}

export function unselectTextArea(areas) {
    areas.forEach((a) => {
        a.classList.add("hide")
        a.setAttribute("readonly", "readonly")
    })
}



export function generateLink(id1, id2, isArrow, nodes, svg) {
    let first, second, arrow = "";
    if (isArrow == "true") arrow = "arrow";

    nodes.forEach((n) => {
        if (n.dataset.id == id1) {
            first = n;
        }
    })
    nodes.forEach((n) => {
        if (n.dataset.id == id2) {
            second = n;
        }
    })


    if (first != null && second != null) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        createLink(line, calcPositions(first, second), "black", 5, first.dataset.id,
            second.dataset.id, arrow);
        svg.appendChild(line)
    }
}

export function createLink(line, dots, color, width, id1, id2, isArrow) {
    setAttributes(line, {
        'class': `line ${isArrow}`,
        'id1': id1,
        'id2': id2,
        'x1': dots[0],
        'y1': dots[1],
        'x2': dots[2],
        'y2': dots[3],
        'stroke': color,
        'stroke-width': width
    });
}

export function updateLinkAttribute(line, dots, part) {
    if (part == "start") {
        setAttributes(line, {
            'x1': dots[0],
            'y1': dots[1],
        });
    } else {
        setAttributes(line, {
            'x2': dots[0],
            'y2': dots[1],
        });
    }
}

export function updateAllLinks() {
    const nodos = document.querySelectorAll(".nodo");
    nodos.forEach((n) => {
        updateLinkPositions(n);
    })
}

export function updateLinkPositions(obj) {
    const lines = document.querySelectorAll(".line");
    lines.forEach((l) => {
        if (l.getAttribute("id1") == obj.dataset.id) {
            updateLinkAttribute(l, calcPos(obj), "start");
        }
    })
    lines.forEach((l) => {
        if (l.getAttribute("id2") == obj.dataset.id) {
            updateLinkAttribute(l, calcPos(obj), "end");
        }
    })
}

export function calcPositions(obj1, obj2) {
    let difx = 70, dify = 55;
    if (obj1.classList.contains("circle")) {
        dify = 70;
    }
    let dot1x = parseInt(obj1.getAttribute("x")) + difx;
    let dot1y = parseInt(obj1.getAttribute("y")) + dify;

    difx = 70; dify = 55;

    if (obj2.classList.contains("circle")) {
        dify = 70;
    }
    let dot2x = parseInt(obj2.getAttribute("x")) + difx;
    let dot2y = parseInt(obj2.getAttribute("y")) + dify;

    return [dot1x, dot1y, dot2x, dot2y];
}

export function calcPos(obj1) {
    let difx = 70, dify = 55;
    if (obj1.classList.contains("circle")) {
        dify = 70;
    }
    let dotx = parseInt(obj1.getAttribute("x")) + difx;
    let doty = parseInt(obj1.getAttribute("y")) + dify;

    return [dotx, doty];
}


export function createLinks(links) {
    if (links == null) return;

    const lines = document.querySelectorAll(".line");
    let encontrado = false;

    if (lines.length == 0) {
        links.forEach((link) => {
            svg.appendChild(link);
        })
    } else {
        links.forEach((link) => {
            lines.forEach((line) => {
                if (link.getAttribute("id1") == line.getAttribute("id1") && link.getAttribute("id2") == line.getAttribute("id2")) {
                    encontrado = true;
                }
            })

            if (!encontrado) {
                getSvg().appendChild(link);
            }
            encontrado = false;
        })
    }

}

export function deleteLinks(links) {
    const lines = document.querySelectorAll(".line");

    if (lines.length == 0 || links == null) {
        return;
    }

    lines.forEach((line) => {
        links.forEach((link) => {
            if (link.getAttribute("id1") == line.getAttribute("id1") && link.getAttribute("id2") == line.getAttribute("id2")) {
                getSvg().removeChild(link);
            }
        })
    })
}







//     D D D D     D         D   D D D D      D D D D D D              D D D D D D 
//   D         D   D         D   D       D    D                        D
//  D              D         D   D        D   D                        D
//   D             D         D   D       D    D D D D                  D
//     D D D D     D         D   D D D D      D                        D D D D
//             D   D         D   D      D     D                        D
//              D  D         D   D       D    D                        D
//   D         D    D       D    D        D   D                        D
//     D D D D        D D D      D        D   D                        D


// SURFACE export functionS ------------------

export function surfaceMouseDownEvent(e) {
    x1 = e.clientX
    y1 = e.clientY
    moving = true;
    buttonPressed = e.button;
    if (buttonPressed == 2) {
        e.currentTarget.style = "cursor: grabbing;"
    }
}

export function surfaceMouseMoveEvent(e) {
    if (moving && buttonPressed == 2) {
        move(x1, y1, e.clientX, e.clientY)
        x1 = e.clientX;
        y1 = e.clientY;
    } else if (movingNode && buttonPressed == 0) {
        selected.forEach((s) => {
            if (s == nodeToMove) {
                isASelected = true;
            }
        })
        if (selected.length != 0 && isASelected) {
            moved = true;
            selected.forEach((s) => {
                nodeToMove = s;
                moveMultiNode(e.pageX - mouseOffsetX, e.pageY - mouseOffsetY, s.getAttribute("difx"), s.getAttribute("dify"));
            })
        } else {
            moved = true;
            moveNode(e.pageX - mouseOffsetX, e.pageY - mouseOffsetY);
        }
    }
}

export function surfaceMouseUpEvent(e) {
    const { containers: { linkBtns, nodeBtns, surface, LangNodeName } } = getVariableConfig();
    moving = false;
    if (buttonPressed == 0 && !movingNode && getActualTool() == 1 && getCurrentNetworkProject() != null) {
        let difx = 70, dify = 55;
        if (getNodeType() == "circle") {
            dify = 70;
        }
        const div = createNode(e.offsetX - difx, e.offsetY - dify, getNodeType(), LangNodeName);
        surface.appendChild(div);
        let pos = div.getAttribute("x") + "/" + div.getAttribute("y");
        pushToHistorial("create", div, div.dataset.id, pos, null, null);
        setHistorialReverseToDefault();
        hideToolBtns(linkBtns, nodeBtns);
        setIsSaveToFalse();
    }
    movingNode = false;
    moved = false;

    if (buttonPressed == 2) {
        e.currentTarget.style = ""
    }
}

export function bodyKeyPressEvent(e) {
    if (e.code == "KeyZ" && e.ctrlKey && e.shiftKey && getHistorialReverse().length != 0) {
        let historialReverse = getHistorialReverse();
        updateHistorial(historialReverse.last, "Historial");
        goBack(historialReverse.last, "HistorialReverse");
        setIsSaveToFalse();
    }
    else if (e.code == "KeyZ" && e.ctrlKey && !e.shiftKey && getHistorial().length != 0) {
        let historial = getHistorial();
        updateHistorial(historial.last, "HistorialReverse")
        goBack(historial.last, "Historial");
        setIsSaveToFalse();
    }
}





export function toolClickEvent(e, actualTool) {
    const { containers: { linkBtns, nodeBtns, toolBtns } } = getVariableConfig();
    if (e.currentTarget.dataset.id != actualTool) {
        hideToolBtns(linkBtns, nodeBtns);
    }
    if (e.currentTarget.dataset.id == 1) {
        cleanSelectedToLink();
        cleanActualTool(toolBtns);
        setActualTool(e.currentTarget.dataset.id);
        e.currentTarget.classList.add("actual-tool")
        nodeBtns.forEach((b) => {
            b.classList.toggle("translateLink" + b.dataset.id);
        })
    } else if (e.currentTarget.dataset.id == 4) {
        linkBtns.forEach((b) => {
            b.classList.toggle("translateLink" + b.dataset.id);
        })
        cleanActualTool(toolBtns);
        setActualTool(e.currentTarget.dataset.id);
        e.currentTarget.classList.add("actual-tool");

    } else if (e.currentTarget.dataset.id != 5 && e.currentTarget.dataset.id != 10) {
        cleanSelectedToLink();
        cleanActualTool(toolBtns);
        setActualTool(e.currentTarget.dataset.id);
        e.currentTarget.classList.add("actual-tool")
    }

    else if (e.currentTarget.dataset.id == 5) {
        update(getCurrentNetworkProject());
        setIsSaveToTrue();
    }
}
