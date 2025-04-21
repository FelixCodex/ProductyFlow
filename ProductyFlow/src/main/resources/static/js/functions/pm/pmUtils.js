
import { createCalendarList, createListElement } from "./creator.js"
import { loadListOnAction } from "./requests.js";
import { convertDateToString, eliminarCookie, getLang, getUser, removeUser } from "../utils.js";










export function appearInput(e) {
    let input = e.children[2], text = e.children[1];
    input.classList.remove("hide");
    input.value = text.textContent;
    text.textContent = "";
    if (input.value.length > 112) {
        input.style.height = (input.scrollHeight) + "px";
    }
    e.parentNode.classList.add("list-element-open")
    input.focus();
}

export function setValue(e) {
    let input = e, text = e.previousElementSibling;
    text.textContent = input.value;
    input.value = "";
    input.classList.add("hide");
    e.parentNode.parentNode.classList.remove("list-element-open")
}

export function checkTheBox(e) {
    e.nextElementSibling.classList.toggle("check");
    e.classList.toggle("fa-check-square-o");
    e.classList.toggle("fa-square-o");
}

export function OnInput(e) {
    let limit, height;

    if (e.currentTarget.classList.contains("calendar-texta")) {
        limit = 48;
        height = 17;
    } else {
        limit = 128;
        height = 23;
    }
    this.style.height = 'auto';
    if (this.value.length < limit) {
        this.style.height = (height) + "px";
        return;
    }
    this.style.height = (this.scrollHeight) + "px";
}


export function setIsSaveToFalse(e) {
    e.classList.add("unsave")
}

export function setIsSaveToTrue(e) {
    e.classList.remove("unsave")
}

export function buildErrorLog(color, text, errorLog) {
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
        errorLog.classList.remove("move-log");
    }, 10000)
}

export function showErrors(error, errorLog) {
    if (error == "TypeError: Failed to fetch") {
        buildErrorLog("red", "Por favor conectese a internet para cargar sus projectos", errorLog)
    } else if (error == "usernameNotFoundFromToken") {
        buildErrorLog("red", "Inicie sesion, por favor", errorLog)
        removeUser();
    } else if (error == "repositoryCouldNotSave") {
        buildErrorLog("red", "No se pudo guardar el projecto", errorLog)
    } else if (error == "Internal Server Error") {
        buildErrorLog("red", "Ha ocurrido un error", errorLog)
    } else if (error == "JWT") {
        buildErrorLog("red", "Inicie Sesión para cargar sus listas", errorLog)
        removeUser();
    } else if (error == "groupMustHaveName") {
        buildErrorLog("red", "Pongale un nombre al grupo", errorLog)
    } else if (error == "userAlreadyBelongToTheGroup") {
        buildErrorLog("red", "El usuario ya pertenece al grupo", errorLog)
    } else if (error == "errorFindingUser") {
        buildErrorLog("red", "El usuario no existe", errorLog)
    } else if (error == 401) {
        buildErrorLog("red", "Inicie sesion, por favor", errorLog)
        removeUser();
    } else if (error == 403) {
        buildErrorLog("red", "No tienes permitido hacer eso", errorLog)
    } else if (error == "userEmpty") {
        buildErrorLog("red", "Inicie sesion, por favor", errorLog)
    } else if (error == Number(error)) {
    } else {
        buildErrorLog("red", "Ha ocurrido un error", errorLog)
    }
}

export function loading(e) {
    const span = document.createElement("SPAN")
    span.classList.add("loading", "fa", "fa-spinner")
    e.appendChild(span);
}


export function cleanActualElement(iteratorClass, removeClass) {
    const elements = document.querySelectorAll(iteratorClass);

    elements.forEach((e) => {
        e.classList.remove(removeClass)
    })
}


export function setActualProject(e) {
    cleanActualElement(".list-box", "actual-list");
    e.classList.add("actual-list")
    setCurrentProject(e.dataset.id);
}

export function setActualGroup(e) {
    cleanActualElement(".group-button", "actual-group");
    e.classList.add("actual-group");
    setCurrentGroup(e.dataset.id);
}


export function getActualProject() {
    return localStorage.getItem("currentProject");
}

export function getActualGroup() {
    return localStorage.getItem("currentGroup");
}

export function setCurrentGroup(id) {
    localStorage.setItem("currentGroup", id);
}

export function setCurrentProject(id) {
    localStorage.setItem("currentProject", id);
}


export function openFirstProject(projectsBox, config) {
    loadListOnAction(projectsBox.firstChild.dataset.id, config)
    cleanActualElement(".list-box", "actual-list");
    setActualProject(projectsBox.firstChild);
}


export function cleanSurface(surface) {
    surface.innerHTML = "";
}

export function showModifiButtons(element) {
    element.lastElementChild.classList.add("show")
    element.lastElementChild.classList.remove("hide")
}

export function hideModifiButtons(element) {
    element.lastElementChild.classList.remove("show")
    element.lastElementChild.classList.add("hide")
}

export function setListName(e, saveList) {
    document.querySelector(".actual-list").children[0].textContent = e.value;
    document.getElementById("list-name").textContent = e.value;
    e.textContent = "";
    e.classList.add("hide")
    setIsSaveToFalse(saveList);
}

export function editProjectName(e, saveList) {
    let box = e;
    let input = box.children[1];
    let p = box.children[0];
    input.value = p.textContent;
    p.textContent = "";
    input.classList.remove("hide");
    input.focus()

    input.addEventListener("keypress", (e) => {
        if (e.code == "Enter") {
            setListName(e.currentTarget, saveList)
        }
    })
    input.addEventListener("blur", (e) => {
        setListName(e.currentTarget, saveList)
    })

}

export function disableCalendar(config) {
    const { containers: { calendarSurface, forward, backward }, calendar: { dateBackward, date, dateForward } } = config;
    cleanSurface(calendarSurface)
    addDisableModeToTheDateBtns(forward, backward)
    loadCalendar(null, dateBackward, config, true);
    loadCalendar(null, date, config, true);
    loadCalendar(null, dateForward, config, true);
}

export function startBounceAnimation(e) {
    e.classList.add("bounce");
    setTimeout(() => {
        e.classList.remove("bounce");
    }, 400);
}

export function copyText(e) {
    localStorage.setItem("clipboard", e.parentNode.parentNode.children[1].textContent);
}


export function createNoProjectsFoundElement(text) {
    let noProjects = document.createElement("LABEL");
    noProjects.setAttribute("style", "margin-top: 18px")
    noProjects.dataset.id = "nop";
    noProjects.id = "nop";
    noProjects.textContent = text;
    return noProjects;
}

export function createLabelElement(text) {
    let noProjects = document.createElement("LABEL");
    noProjects.setAttribute("style", "margin-top: 18px")
    noProjects.textContent = text;
    return noProjects;
}

export function removeNoProjectFoundElement(box) {
    const nop = document.getElementById("nop")
    if (nop) {
        box.removeChild(nop)
    }
}

export function updateDate(calendarSurface, { dateBackward, dateForward, date }) {
    localStorage.setItem("actualPosition", 0);
    localStorage.setItem("daysToBackward", 0);
    localStorage.setItem("daysToForward", 0);
    dateBackward.setDate(date.getDate() - 1)
    dateForward = null;
    dateForward = new Date();
    dateForward.setDate(date.getDate() + 1)
    calendarSurface.scrollLeft = 0;
}

export function loadCalendars(id, config) {
    const { calendar: { dateBackward, date, dateForward } } = config;
    loadCalendar(id, dateBackward, config, false);
    loadCalendar(id, date, config, false);
    loadCalendar(id, dateForward, config, false);
}

export function loadCalendar(id, date, config, bool) {
    const { containers: { calendarSurface } } = config;
    calendarSurface.appendChild(createCalendarList(convertDateToString(date), date.getMonth(), getLang(), id, bool, config));
}




export function removeDisableModeToTheDateBtns(forward, backward) {
    forward.classList.remove("disabled")
    backward.classList.remove("disabled")
}

export function addDisableModeToTheDateBtns(forward, backward) {
    forward.classList.add("disabled")
    backward.classList.add("disabled")
}

export function dialogBackgroundToggle() {
    dialogB.classList.toggle("hide")
}



export function showGroupName(e, condition) {
    let l = e.nextElementSibling;
    if (condition) {
        e.classList.add("group-img-hover");
        l = e.nextElementSibling;
    }
    let value = (l.firstElementChild.scrollWidth + 62) + "px";
    l.style.width = value;
}

export function hideGroupName(e) {
    e.nextElementSibling.nextElementSibling.style.width = "";
    e.nextElementSibling.classList.remove("group-img-hover")
}

export function setLoginToLogout(linkAuth) {
    linkAuth.dataset.id = "logout";
    linkAuth.firstElementChild.classList.remove("fa-sign-in-alt");
    linkAuth.firstElementChild.classList.add("fa-sign-out-alt");
    linkAuth.nextElementSibling.classList.toggle("hide");
    linkAuth.nextElementSibling.nextElementSibling.classList.toggle("hide");
}

export function setLogoutToLogin(linkAuth) {
    linkAuth.dataset.id = "login";
    linkAuth.firstElementChild.classList.add("fa-sign-in-alt");
    linkAuth.firstElementChild.classList.remove("fa-sign-out-alt");
    linkAuth.nextElementSibling.classList.toggle("hide");
    linkAuth.nextElementSibling.nextElementSibling.classList.toggle("hide");
}

export function logout(linkAuth) {
    setLogoutToLogin(linkAuth);
    eliminarCookie("keep");
    eliminarCookie("ssid");
    removeUser();
    location.href = "http://localhost:8080/auth?from=projectmanager";
}

export function validateCrationGroupValues(name) {
    if (name == "") {
        return "groupMustHaveName";
    }
    return null;
}

export function listNameLang() {
    if (localStorage.getItem("lang") == "es") {
        return "Lista de grupo sin nombre";
    }
    return "Untitled Group List";
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
            localStorage.setItem("theme", theme)
        } else {
            theme = "l";
            localStorage.setItem("theme", theme)
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

export function loadProject(surface, Project, main, listName, saveList) {       		   //This is needed in the above one  
    cleanSurface(surface);

    let listDoc = JSON.parse(Project.listProject);
    if (listDoc) {
        listDoc.forEach((l) => {
            const element = createListElement(l.txt, l.check, l.fav, main, surface, saveList);
            surface.appendChild(element);
        })
    }
    if (surface.id == "elements-list") {
        listName.textContent = Project.listProjectName;
    }
}






