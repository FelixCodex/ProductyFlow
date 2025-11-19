


// VARIABLE INSTANSIATION ----------------------------------------------------------------

import { Stack } from "./functions/nw/classes.js";
import { createProjectButtons } from "./functions/nw/creator.js";
import { bodyKeyPressEvent, setLinkType, setMod, surfaceMouseDownEvent, surfaceMouseMoveEvent, surfaceMouseUpEvent, toolClickEvent, unselectTextArea } from "./functions/nw/events.js";
import { changeButtonSpan, checkLang, cleanActual, deselectAllLinkType, deselectAllNodeType, hideToolBtns, langChange, logout, moonset, setActualTool, setLoginToLogout, sunset, themeChange, toggleSettings, toggleSpeedButtons } from "./functions/nw/nwUtils.js";
import { createNewProject, loadProjectsFromUsers } from "./functions/nw/requests.js";
import { checkIfUserDataIsLoaded, getUser } from "./functions/utils.js";

const colorBtns = document.querySelectorAll(".color-button");
const moveBtns = document.querySelectorAll(".move-speed-button");
const toolBtns = document.querySelectorAll(".tool-button");
const linkBtns = document.querySelectorAll(".link-type");
const nodeBtns = document.querySelectorAll(".node-type");

const saveBtn = document.querySelector(".save-button");
const newFileBtn = document.querySelector(".newfile");
const searchBtn = document.querySelector(".search");
const refreshBtn = document.querySelector(".refresh");

const profileBtn = document.querySelector(".profile-button");
const settingsBackground = document.querySelector(".profile-background");
const settingsBox = document.querySelector(".profile-box");

const aside = document.getElementById("main-article");
const projectsBox = document.getElementById("main-section");
const projectSection = document.getElementById("main-section");
const sectionColor = document.getElementById("section-color");
const body = document.querySelector("body");
const speedSwitchBtn = document.querySelector(".move-speed-button-switch");
const colorSwitchBtn = document.querySelector(".color-button-switch");
const colorSpace = document.querySelector(".space-section-color");
const asideSwitchBtn = document.querySelector(".switch-aside");
const errorLog = document.querySelector(".error-log-message");
const noProjectSelectedPanel = document.querySelector(".noProjectSelected");

const surface = document.getElementById("surface");
const svg = document.getElementById("lines-surface", 'svg');

const themeBtn = document.querySelector(".theme-btn")
const langBtn = document.querySelector(".lang-btn")
const linkAuth = document.getElementById("linkAuth")

let Historial = new Stack();
let HistorialReverse = new Stack();



let nodeType = "square", LangNodeName = "Untitled Node", LangProjectName = "Untitled Project";

window.scrollTo({
	left: (surface.offsetWidth / 2) - (screen.width / 2),
	top: (surface.offsetHeight / 2) - (screen.height / 2) + 50
})


let actualTool = 1;

let user;

setActualTool(1);


let variableConfig = {
	containers: {
		linkBtns,
		nodeBtns,
		moveBtns,
		toolBtns,
		errorLog,
		saveBtn,
		surface,
		nodeType,
		svg,
		LangNodeName
	}
}



export function getVariableConfig() {
	return variableConfig;
}



export function getLangNodeName() {
	return LangNodeName;
}

export function setLangNodeName(name) {
	LangNodeName = name;
}

export function getSaveBtn() {
	return saveBtn;
}


export function getErrorLog() {
	return errorLog;
}

export function getSurface() {
	return surface;
}

export function getProjectsBox() {
	return document.getElementById("main-section");;
}


export function getLangProjectName() {
	return LangProjectName;
}
export function setLangProjectName(name) {
	LangProjectName = name;
}


export function getSvg() {
	return svg;
}


export function getNodeType() {
	return nodeType;
}
export function setNodeType(type) {
	nodeType = type;
}

//  D D D D D D   D       D     DD        D   D D D D D D             D
//  D             D       D     D D       D        D                  D
//  D              D     D      D  D      D        D                  D
//  D              D     D      D   D     D        D                  D
//  D D D D         D   D       D    D    D        D                  D
//  D               D   D       D     D   D        D                  D
//  D                D D        D      D  D        D                  D
//  D                D D        D       D D        D                  D
//  D D D D D D       D         D        DD        D                  D D D D D D


// EVENT LISTENERS -----------------------------------------------------------------------
















// BUTTONS LISTENERS ------------------

body.addEventListener("click", (e) => {
	const areas = document.querySelectorAll(".nodoTextArea");
	unselectTextArea(areas);
})

nodeBtns.forEach((b) => {
	b.addEventListener("click", (e) => {
		nodeType = e.currentTarget.dataset.type;
		deselectAllNodeType(nodeBtns);
		e.currentTarget.classList.add("actual-tool");
		hideToolBtns(linkBtns, nodeBtns);
		changeButtonSpan(e.currentTarget.dataset.type, e.currentTarget.parentNode.parentNode.firstElementChild);
	})
})


moveBtns.forEach((b) => {
	b.addEventListener("click", (e) => {
		setMod(e.currentTarget.dataset.id);
		cleanActual(moveBtns);
		e.currentTarget.classList.add("actual-tool")
		toggleSpeedButtons(moveBtns);
	})
})

speedSwitchBtn.addEventListener("click", () => {
	toggleSpeedButtons(moveBtns);
})

toolBtns.forEach((b) => {
	b.addEventListener("click", (e) => {
		toolClickEvent(e, actualTool);
	})
})

linkBtns.forEach((b) => {
	b.addEventListener("click", (e) => {
		setLinkType(e.currentTarget.dataset.type);
		deselectAllLinkType(linkBtns);
		e.currentTarget.classList.add("actual-tool");
		hideToolBtns(linkBtns, nodeBtns);
	})
})


asideSwitchBtn.addEventListener("click", () => {
	aside.classList.toggle("move-l")
})

newFileBtn.addEventListener("click", () => {
	createNewProject();
})

errorLog.addEventListener("click", (e) => {
	e.stopPropagation();
	e.currentTarget.classList.remove("move-log");
})

profileBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	toggleSettings(settingsBackground, settingsBox);
})

settingsBackground.addEventListener("click", (e) => {
	e.stopPropagation();
	toggleSettings(settingsBackground, settingsBox);
})

settingsBox.addEventListener("click", (e) => {
	e.stopPropagation();
})

// SURFACE LISTENERS ------------------

surface.addEventListener("mousedown", (e) => {
	surfaceMouseDownEvent(e);
})

surface.addEventListener("mousemove", (e) => {
	surfaceMouseMoveEvent(e);
})

surface.addEventListener("mouseup", (e) => {
	surfaceMouseUpEvent(e);
})

surface.addEventListener("contextmenu", (e) => {
	e.preventDefault();
})

svg.addEventListener("mousedown", (e) => {
	surfaceMouseDownEvent(e);
})

svg.addEventListener("mousemove", (e) => {
	surfaceMouseMoveEvent(e);
})

svg.addEventListener("mouseup", (e) => {
	surfaceMouseUpEvent(e);
})

svg.addEventListener("contextmenu", (e) => {
	e.preventDefault();
})

window.addEventListener("keypress", (e) => {
	bodyKeyPressEvent(e);
})

window.addEventListener("load", async (e) => {
	createProjectButtons(await loadProjectsFromUsers());



	if (checkIfUserDataIsLoaded(user)) {
		user = getUser();
		setLoginToLogout(linkAuth);
	}



	checkLang();
	themeChange(true, themeBtn);
})




themeBtn.addEventListener("click", (e) => {
	if (e.currentTarget.children.length > 1) {
		return;
	}

	if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
		moonset(e.currentTarget, false);
		themeChange(false, themeBtn);
	} else if (localStorage.getItem("theme") == "d") {
		sunset(e.currentTarget, false);
		themeChange(false, themeBtn);
	}
})

langBtn.addEventListener("click", () => {
	langChange();
})

linkAuth.addEventListener("click", (e) => {
	e.preventDefault();
	if (e.currentTarget.dataset.id == "login") {
		location.href = "http://localhost:8080/auth?from=network";
	} else {
		logout(linkAuth);
	}
});