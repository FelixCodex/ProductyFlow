import { getProjectsBox, getSaveBtn } from "../../network.js";
import { cleanSelected, nodeDoubleClickEvent, nodeMouseDownEvent, nodeMouseMoveEvent, nodeMouseUpEvent, unselectTextArea } from "./events.js";
import { pushToHistorial } from "./historyUtils.js";
import { cleanSurface, editProjectName, getCurrentNetworkProject, hideModifiButtons, noProjectsFound, openSelectedProjectOrFirstProject, setActualProject, setIsSaveToTrue, showModifiButtons } from "./nwUtils.js";
import { deleteProject, loadProjectOnAction, update } from "./requests.js";



export function createOneProjectButton(nombre, id) {
    const button = document.createElement("DIV");
    const p = document.createElement("P");
    const input = document.createElement("INPUT");
    input.classList.add("project-input", "hideInput");
    input.setAttribute("maxlength", "50");
    button.appendChild(p);
    button.appendChild(input);
    p.classList.add("project-name");
    p.textContent = nombre;
    button.classList.add("project-box");
    button.dataset.id = id;
    button.appendChild(createModifiBtns());
    button.addEventListener("mouseenter", (e) => { showModifiButtons(e.currentTarget); })
    button.addEventListener("mouseleave", (e) => { hideModifiButtons(e.currentTarget); })
    button.addEventListener("click", (e) => {
        if (getSaveBtn().classList.contains("unsave") && e.currentTarget.dataset.id != getCurrentNetworkProject()) {
            update(getCurrentNetworkProject())
        }
        if (e.currentTarget.dataset.id != null) {
            loadProjectOnAction(e.currentTarget.dataset.id);
            setActualProject(e.currentTarget);
            setIsSaveToTrue();
        }
    })
    return button;
}




export function createModifiBtns() {
    const div = document.createElement("DIV");
    div.classList.add("modifi-btn-box", "hideMod");

    const spanDel = document.createElement("SPAN");
    spanDel.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteProject(e)
    });
    const spanEdit = document.createElement("SPAN");
    spanEdit.addEventListener("click", (e) => {
        if (e.currentTarget.parentNode.parentNode.dataset.id == getCurrentNetworkProject()) {
            e.stopPropagation();
        }
        editProjectName(e.currentTarget);
    })

    spanDel.classList.add("modifi-btn", "del", "fa", "fa-trash")
    spanEdit.classList.add("modifi-btn", "edit", "fa", "fa-edit")

    div.appendChild(spanEdit);
    div.appendChild(spanDel);

    return div;
}


export async function createProjectButtons(data) {       //This needs the next one
    cleanSurface(getProjectsBox())
    if (!data) {
        return null;
    }


    if (data.projects != "") {
        let nombres = data.nodeProjectName.split("/");
        let ids = data.projects.split("/");

        ids.map((id, i) => {
            getProjectsBox().appendChild(createOneProjectButton(nombres[i], id));
        })


        openSelectedProjectOrFirstProject();
    } else {
        getProjectsBox().appendChild(noProjectsFound())
    }

}




export function createNode(x, y, tp, tx) {
    let type = "square";
    if (tp == "cir" || tp == "circle") type = "circle";
    const div = document.createElement("DIV");
    const area = document.createElement("TEXTAREA");
    area.classList.add("nodoTextArea", "hide", type + "-text")
    area.setAttribute("readonly", "readonly")
    area.value = tx;
    div.classList.add("nodo", type, "theme");
    if (localStorage.getItem("theme") == "d") div.classList.add("nodo-dark");
    div.setAttribute("style", "top:" + (y) + "px;left:" + (x) + "px");
    div.setAttribute("x", x);
    div.setAttribute("y", y);
    div.appendChild(area);
    div.dataset.id = Math.floor(Math.random() * 10000);


    area.addEventListener("keypress", (e) => {
        if (e.code == "Enter") {
            const areas = document.querySelectorAll(".nodoTextArea");
            unselectTextArea(areas);
        }
    })
    div.addEventListener("dblclick", (e) => {
        pushToHistorial("rename", getNodeToMove().children[0].value, getNodeToMove().dataset.id, null, null, null);
        nodeDoubleClickEvent(e);
        cleanSelected();
    })
    div.addEventListener("mousedown", (e) => {
        nodeMouseDownEvent(e);
    });

    div.addEventListener("mousemove", (e) => {
        nodeMouseMoveEvent(e);
    });

    div.addEventListener("mouseup", (e) => {
        nodeMouseUpEvent(e);
    });
    return div;
}