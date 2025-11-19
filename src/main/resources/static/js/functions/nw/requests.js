import { getLangNodeName, getLangProjectName, getProjectsBox, getSurface, getVariableConfig } from "../../network.js";
import { createNode, createOneProjectButton } from "./creator.js";
import { generateLink } from "./events.js";
import { buildErrorLog, cleanNodeSurface, cleanSurface, getCurrentNetworkProject, loading, obtenerCookie, openFirstProject, removeInfoLabel, setActualProject, setCurrentNetworkProject, setIsSaveToTrue, showErrors } from "./nwUtils.js";
import { sendRequest } from "../utils.js"

export async function createNewProject() {
    const { containers: { saveBtn } } = getVariableConfig();

    let peticion = await sendRequest("POST", 'application/json', "{}", "http://localhost:8080/api/nw/create");

    if (!peticion.ok) {
        showErrors(peticion.status)
        return;
    }

    let data = await peticion.json();

    removeInfoLabel(getProjectsBox(), "noProject")

    let btn;
    btn = createOneProjectButton(getLangProjectName(), data.projects)

    getProjectsBox().appendChild(btn);

    if (saveBtn.classList.contains("unsave")) {
        update(getCurrentNetworkProject())
    }

    loadProjectOnAction(btn.dataset.id);
    setActualProject(btn);
    setIsSaveToTrue();


}


export async function deleteProject(e) {

    let idToDelete = e.currentTarget.parentNode.parentNode.dataset.id;

    let boxToDelete = e.currentTarget.parentNode.parentNode;

    let pregunta = confirm("¿Esta seguro/a de que quiere eliminar ese projecto?")
    if (pregunta) {
        let data = {};
        data.nodeId = idToDelete;
        data = JSON.stringify(data);


        let peticion = await sendRequest("POST", 'application/json', data,
            "http://localhost:8080/api/nw/delete");



        if (!peticion.ok) {
            showErrors(peticion.status)
            return;
        }


        if (getCurrentNetworkProject() == idToDelete) {
            setCurrentNetworkProject(null);
            cleanSurface(getSurface());
        }

        idToDelete = null;
        getProjectsBox().removeChild(boxToDelete);


        if (getProjectsBox().children.length != 0 && getCurrentNetworkProject() == "null") {
            openFirstProject();
        } else if (getProjectsBox().children.length == 0) {
            getProjectsBox().appendChild(noProjectsFound());
        }



    }
}





export async function update(id) {                     //Updates the project in the DB

    let nodeDoc = JSON.parse("[]");
    let linkDoc = JSON.parse("[]");
    let projectName = "";

    const nodos = document.querySelectorAll(".nodo");
    const lines = document.querySelectorAll(".line");
    const projects = document.querySelectorAll(".project-box");

    projects.forEach((p) => {
        if (p.dataset.id == id) {
            projectName = p.textContent;
        }
    })

    nodos.forEach((n) => {
        let type = "sq";
        let check = "f";
        if (n.classList.contains("check")) check = "t";
        if (n.classList.contains("circle")) type = "cir";
        nodeDoc[nodeDoc.length] = JSON.parse(`
		   {"i": "${n.dataset.id}", 
			"x":"${n.getAttribute("x")}", 
			"y":"${n.getAttribute("y")}", 
			"c":"${check}",
			"tx":"${n.firstChild.value}",
			"tp":"${type}"}`);
    })

    lines.forEach((l) => {
        linkDoc[linkDoc.length] = JSON.parse(`
			{"i1": "${l.getAttribute("id1")}", 
			 "i2": "${l.getAttribute("id2")}", 
			 "arw":"${(l.classList.contains("arrow"))}"}`);
    })



    let datos = {};
    datos.nodeId = id;
    datos.nodeProject = JSON.stringify(nodeDoc);
    datos.nodeProjectName = projectName;
    datos.linkProject = JSON.stringify(linkDoc);
    datos = JSON.stringify(datos);

    let peticion = await sendRequest("POST", 'application/json', datos,
        "http://localhost:8080/api/nw/update");

    console.log(peticion)

    if (!peticion.ok) {
        showErrors(peticion.status)
        return;
    }

    buildErrorLog("green", "Datos guardados exitosamente");


}


export async function loadProjectOnAction(id) {  //When you click in a project button or onload
    const { containers: { surface, svg } } = getVariableConfig();

    let bodyContent = {};
    bodyContent.nodeId = parseInt(id);
    bodyContent = JSON.stringify(bodyContent);

    let peticion = await sendRequest("POST", 'application/json', bodyContent,
        "http://localhost:8080/api/nw/getData");


    if (!peticion.ok) {
        showErrors(peticion.status)
        return;
    }

    let project = await peticion.json();

    loadProject(project, surface, svg);
    document.querySelectorAll(".project-box").forEach((p) => {
        if (p.dataset.id == id) {
            setActualProject(p);
        }
    })

}
export function loadProject(Project, surface, svg) {
    cleanNodeSurface(surface, svg);
    let nodeDoc = JSON.parse(Project.nodeProject);
    let linkDoc = JSON.parse(Project.linkProject);
    if (nodeDoc) {
        nodeDoc.forEach((d) => {
            if (d.tp == "circle") {
                d.y = 70;
            }
            const node = createNode(d.x, d.y, d.tp, d.tx);
            node.dataset.id = d.i;
            node.firstChild.textContent = d.tx;
            if (d.c == "t") node.classList.add("check");
            surface.appendChild(node);
        })
        if (linkDoc) {
            const nodos = document.querySelectorAll(".nodo");
            linkDoc.forEach((l) => {
                generateLink(l.i1, l.i2, l.arw, nodos, svg);
            })
        }
    }
}


export async function loadProjectsFromUsers() {   //Gets all the projects ids
    let bodyContent = {}
    bodyContent.tiempo = "" + obtenerCookie("keep");
    bodyContent = JSON.stringify(bodyContent)

    loading(getProjectsBox())


    try {
        let peticion = await sendRequest("POST", 'application/json', bodyContent,
            "http://localhost:8080/api/nw/getAllProjects");


        if (!peticion.ok) {
            showErrors(peticion.status)
            return;
        }

        let projects = await peticion.json();

        return projects;
    } catch (e) {
        console.log(e)
        return null;
    }

}