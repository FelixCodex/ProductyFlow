import { getErrorLog, getProjectsBox, getSaveBtn, setLangNodeName, setLangProjectName } from "../../network.js";
import { setNodeToLink } from "./events.js";
import { loadProjectOnAction } from "./requests.js";



export function newFechaUTC(dias) {
    let fecha = new Date();
    fecha.setTime(fecha.getTime() + dias * 1000 * 60 * 60 * 24);
    return fecha.toUTCString();
}

export function crearCookie(name, dias) {
    exp = newFechaUTC(dias);
    document.cookie = `${name};expires=${exp}`;
}

export function obtenerCookie(cookieName) {
    let cookies = document.cookie;
    cookies = cookies.split(";");
    for (let i = 0; cookies.length > i; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName)) {
            return cookie.split("=")[1];
        } else {
            "No se ha encontrado una cookie con ese nombre"
        }
    }

}

export function eliminarCookie(cookieName) {
    document.cookie = `${cookieName}=0;max-age=0`
}

export function getLang() {
    let lang = localStorage.getItem("lang");
    if (lang != "es" && lang != "en") {
        return "en";
    }
    return lang;
}

export function replace(string, textToR, textR) {
    let stringMod;
    if (string != null) {
        stringMod = string[0];
        for (let i = 0; i < string.length; i++) {
            if (string[i] == textToR) {
                stringMod += textR;
            } else {
                stringMod += string[i];
            }
        }
        return stringMod;
    }

}


export function setActualTool(value) {
    localStorage.setItem("actualTool", value)
}

export function getActualTool() {
    return localStorage.getItem("actualTool")
}


export function toggleSpeedButtons(moveBtns) {
    moveBtns.forEach((b) => {
        b.classList.toggle("translateSpeedx" + b.dataset.id)
    })
}

export function cleanActual(moveBtns) {
    moveBtns.forEach((b) => {
        b.classList.remove("actual-tool")
    })
}

export function cleanActualTool(toolBtns) {
    toolBtns.forEach((b) => {
        b.classList.remove("actual-tool")
    })
}



export function cleanSelectedToLink() {
    const selectedToLink = document.querySelectorAll(".selectedToLink");
    selectedToLink.forEach((s) => {
        s.classList.remove("selectedToLink");
    })
    setNodeToLink(null);
}

export function changeButtonSpan(form, e) {
    if (form == "square") {
        e.classList.add("fa-square-o");
        e.classList.remove("fa-circle-o");
    } else {
        e.classList.remove("fa-square-o");
        e.classList.add("fa-circle-o");
    }
}

export function hideToolBtns(linkBtns, nodeBtns) {
    linkBtns.forEach((b) => {
        b.classList.remove("translateLink" + b.dataset.id);
    })
    nodeBtns.forEach((b) => {
        b.classList.remove("translateLink" + b.dataset.id);
    })
}

export function deselectAllLinkType(linkBtns) {
    linkBtns.forEach((b) => {
        b.classList.remove("actual-tool");
    })
}

export function deselectAllNodeType(nodeBtns) {
    nodeBtns.forEach((b) => {
        b.classList.remove("actual-tool");
    })
}

export function showModifiButtons(element) {
    element.lastElementChild.classList.remove("hideMod")
}

export function hideModifiButtons(element) {
    element.lastElementChild.classList.add("hideMod")
}

export function setIsSaveToFalse() {
    let saveBtn = getSaveBtn();
    if (!saveBtn.classList.contains("unsave")) {
        saveBtn.classList.add("unsave")
    }
}

export function setIsSaveToTrue() {
    let saveBtn = getSaveBtn();
    if (saveBtn.classList.contains("unsave")) {
        saveBtn.classList.remove("unsave")
    }
}

export function setProjectName(e) {
    document.querySelector(".actual-project").children[0].textContent = e.value;
    e.textContent = "";
    e.classList.add("hideInput")
    setIsSaveToFalse();
}

export function editProjectName(e) {


    let box = e.parentNode.parentNode;
    let input = box.children[1];
    let p = box.children[0];
    input.value = p.textContent;
    p.textContent = "";
    input.classList.remove("hideInput");
    input.focus()

    input.addEventListener("keypress", (e) => {
        if (e.code == "Enter") {
            setProjectName(e.currentTarget)
        }
    })
    input.addEventListener("blur", (e) => {
        setProjectName(e.currentTarget)
    })

}

export function cleanSurface(surface) {
    surface.innerHTML = "";
}

export function cleanNodeSurface(surface, svg) {
    cleanSurface(surface);
    cleanSvgSurface(svg);
}


export function cleanSvgSurface(svg) {
    svg.innerHTML = `<defs>
						<marker id="arrow" markerWidth="10" markerHeight="10" refX="32" refY="3" 
						orient="auto" markerUnits="strokeWidth">
						<path d="M0,0 L2,3 0,6 9,3" fill="#000" />
						</marker>
					</defs>`;

}


export function cleanActualElement(iteratorClass, removeClass) {
    const elements = document.querySelectorAll(iteratorClass);

    elements.forEach((e) => {
        e.classList.remove(removeClass)
    })
}


export function setActualProject(e) {
    cleanActualElement(".project-box", "actual-project");
    e.classList.add("actual-project")
    setCurrentNetworkProject(e.dataset.id)
}



export function getCurrentNetworkProject() {
    return localStorage.getItem("currentNetworkProject")
}

export function setCurrentNetworkProject(id) {
    localStorage.setItem("currentNetworkProject", id)
}


export function openFirstProject() {
    loadProjectOnAction(getProjectsBox().firstChild.dataset.id)
    cleanActualElement(".project-box", "actual-project");
    setActualProject(getProjectsBox().firstChild);
}

export function openSelectedProjectOrFirstProject() {
    if (!getCurrentNetworkProject()) {
        openFirstProject(getProjectsBox());
        return;
    }
    let projectos = document.querySelectorAll(".project-box"), found = false;
    projectos.forEach((p) => {
        if (p.dataset.id == getCurrentNetworkProject()) {
            loadProjectOnAction(p.dataset.id);
            cleanActualElement(".project-box", "actual-project");
            setActualProject(p);
            found = true;
        }
    })
    if (!found) {
        openFirstProject(getProjectsBox());
    }

}

export function setErrorLogToDefault() {
    let errorLog = getErrorLog();
    errorLog.classList.remove("move-log");
}

export function buildErrorLog(color, text) {
    let errorLog = getErrorLog();
    if (color == "red") {
        errorLog.classList.add("red");
        errorLog.classList.remove("green");
    } else {
        errorLog.classList.remove("red");
        errorLog.classList.add("green");
    }
    errorLog.classList.add("move-log");
    errorLog.textContent = text;
    setTimeout(() => {
        setErrorLogToDefault();
    }, 12000)
}

export function showErrors(error) {
    if (error == "TypeError: Failed to fetch") {
        buildErrorLog("red", "Por favor conectese a internet para cargar sus projectos")
    } else if (error == "usernameNotFoundFromToken") {
        buildErrorLog("red", "Inicie sesion, por favor")
    } else if (error == "repositoryCouldNotSave") {
        buildErrorLog("red", "No se pudo guardar el projecto")
    } else if (error == "Internal Server Error") {
        buildErrorLog("red", "Ha ocurrido un error")
    } else if (error == "JWT") {
        buildErrorLog("red", "Inicie Sesión para cargar sus listas")
        removeUserData();
    } else if (error == 401) {
        buildErrorLog("red", "Inicie sesión para cargar sus listas")
        removeUserData();
    } else if (error == 403) {
        buildErrorLog("red", "No tienes permisos para hacer eso")
    } else if (error == "") {

    } else if (error == "") {

    }
}


export function getUserData() {
    return localStorage.getItem("userData")
}

export function setUserData(id) {
    return localStorage.setItem("userData", id)
}

export function removeUserData() {
    localStorage.removeItem("userData")
}


export function noProjectsFound() {
    let noProjects = document.createElement("LABEL");
    noProjects.classList.add("noProject")
    noProjects.setAttribute("style", "margin-top: 8px")
    noProjects.textContent = "No tienes ningun projecto";
    return noProjects;
}


export function createInfoLabel(text, classToAdd) {
    let infoLabel = document.createElement("LABEL");
    infoLabel.classList.add(classToAdd);
    infoLabel.setAttribute("style", "margin-top: 8px")
    infoLabel.textContent = text;
    return infoLabel;
}

export function removeInfoLabel(box, classToRemove) {
    if (box.querySelector(`.${classToRemove}`)) {
        box.removeChild(box.querySelector(`.${classToRemove}`))
    }
}


export function loading(e) {
    const span = document.createElement("SPAN")
    span.classList.add("loading")
    e.appendChild(span);
}



export function toggleSettings(settingsBackground, settingsBox) {
    settingsBackground.classList.toggle("hideDisplay")
    settingsBackground.classList.toggle("appearS")
    settingsBox.classList.toggle("appearSB")
}



export function langChange() {
    let lang;
    if (getLang() == "en") {
        lang = "es";
        setLangNodeName("Nodo sin título");
        setLangProjectName("Projecto sin título");
        localStorage.setItem("lang", "es")
    } else {
        lang = "en";
        setLangNodeName("Untitled node");
        setLangProjectName("Untitled Project");
        localStorage.setItem("lang", "en")
    }


    const langElements = document.querySelectorAll(".lang");

    langElements.forEach((e) => {
        if (e.dataset == "logout") {
            e.textContent = e.getAttribute(lang + "l");
        } else {
            e.textContent = e.getAttribute(lang);
        }
    })
}



export function checkLang() {
    if (localStorage.getItem("lang") == "es") {
        const langElements = document.querySelectorAll(".lang");

        langElements.forEach((e) => {
            if (e.dataset == "logout") {
                e.textContent = e.getAttribute("esl");
            } else {
                e.textContent = e.getAttribute("es");
            }

        })

        setLangNodeName("Nodo sin título");
        setLangProjectName("Projecto sin título");
    }
}


export function sunset(e) {
    let first = e.firstElementChild;
    const current = e;
    const moon = document.createElement("SPAN");
    moon.classList.add("fas", "fa-moon", "option-icon", "arise")
    first.classList.remove("arise");
    first.classList.add("sunset");
    e.insertBefore(moon, first);
    setTimeout(() => {
        current.removeChild(first)
    }, 800);
}

export function moonset(e) {
    let first = e.firstElementChild;
    const current = e;
    const sun = document.createElement("SPAN");
    sun.classList.add("fas", "fa-sun", "option-icon", "arise")
    first.classList.remove("arise");
    first.classList.add("sunset");
    e.insertBefore(sun, first);
    setTimeout(() => {
        current.removeChild(first)
    }, 800);
}




export function themeChange(fromWindow, themeBtn) {
    let theme;

    if (fromWindow) {
        if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
            theme = "l";
        } else {
            theme = "d";
            moonset(themeBtn, fromWindow);
        }
    } else {
        if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
            theme = "d";
            localStorage.setItem("theme", "d")
        } else {
            theme = "l";
            localStorage.setItem("theme", "l")
        }
    }

    const elementsToChange = document.querySelectorAll(".theme");

    if (theme == "d") {
        elementsToChange.forEach((e) => {
            const [classToChange] = e.classList;
            e.classList.add(classToChange + "-dark")
        })
    } else if (theme == "l") {
        elementsToChange.forEach((e) => {
            const [classToChange] = e.classList;
            e.classList.remove(classToChange + "-dark")
        })
    }
}


export function setLoginToLogout(linkAuth) {
    linkAuth.dataset.id = "logout";
    if (getLang() == "es") {
        linkAuth.textContent = linkAuth.getAttribute("esl");
    } else if (getLang() == "en" || getLang() == null) {
        linkAuth.textContent = linkAuth.getAttribute("enl");
    }
}

export function setLogoutToLogin(linkAuth) {
    linkAuth.dataset.id = "login";
}



export function logout(linkAuth) {
    setLogoutToLogin(linkAuth);
    eliminarCookie("keep");
    eliminarCookie("ssid");
    location.href = "http://localhost:8080/auth?from=network";
}










export function setElementInLocalStorage(key, value) {
    localStorage.setItem(key, value)
}