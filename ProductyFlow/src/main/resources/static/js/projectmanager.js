import { createJoinDialog, createCreateDialog, toggleElement } from './functions/pm/dialogs.js';
import { createGroupButtons, loadGroupFromUsers, update, loadProjectsFromGroup, createNewProject } from "./functions/pm/requests.js"

import { createCalendarList, createListElement, createProjectButtons } from "./functions/pm/creator.js"
import { checkIfUserDataIsLoaded, convertDateToString, getLang, getUser } from "./functions/utils.js"

import { themeChange, setIsSaveToTrue, showErrors, moonset, sunset, showGroupName, editProjectName, setLoginToLogout, logout, getActualProject, getActualGroup, setCurrentGroup, setCurrentProject } from "./functions/pm/pmUtils.js"
import { calendarForwardMove, calendarBackwardMove } from "./functions/pm/events.js"






// VARIABLE INSTANSIATION ----------------------------------------------------------------

const body = document.querySelector("body")

const groupBox = document.querySelector(".group-boxes")
const groupBtn = document.querySelectorAll(".group-button")

const checkboxs = document.querySelectorAll(".list-element-checkbox");
const listbox = document.querySelectorAll(".list-element-box");
const listInput = document.querySelectorAll(".list-element-texta");

const staticLinks = document.querySelectorAll(".static-link");
const linkAuth = document.getElementById("link-auth");
const langBtn = document.getElementById("lang-btn");
const themeBtn = document.getElementById("theme-btn");
const links = document.querySelectorAll(".option-btn");

const dialog = document.querySelector(".dialog")
const dialogB = document.querySelector(".dialog-background")
const menu = document.querySelector(".popupMenu")

const projectsBox = document.querySelector(".lists-aside-section");
const surfaceList = document.getElementById("elements-list");
const calendarSurface = document.getElementById("calendar-lists");
const listName = document.getElementById("list-name");
const plus = document.getElementById("plus");
const saveList = document.getElementById("save");
const edit = document.getElementById("edit");
const paste = document.getElementById("paste");
const listsPlus = document.getElementById("lists-plus");
const search = document.getElementById("search");
const refresh = document.getElementById("refresh");
const options = document.getElementById("lists-options");
const forward = document.getElementById("forward");
const backward = document.getElementById("backward");

const joinGroupBtn = document.getElementById("joinGroup")
const createGroupBtn = document.getElementById("createGroup")



const aside = document.querySelector(".aside");

const errorLog = document.querySelector(".error-log-message");



let isSave = true,
	temp, userPermiss = null;


let user

let today = new Date();
let date = new Date();
let dateForward = new Date();
let dateBackward = new Date();
dateBackward.setDate(date.getDate() - 1)
dateForward.setDate(date.getDate() + 1)



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

const variableConfig = {
	containers: {
		projectsBox,
		groupBox,
		surfaceList,
		calendarSurface,
		listName,
		errorLog,
		menu,
		dialog,
		dialogB,
		saveList,
		forward,
		backward
	},
	calendar: {
		dateBackward,
		dateForward,
		date
	},
	userPermiss
};

window.addEventListener("load", async () => {
	createGroupButtons(await loadGroupFromUsers(errorLog), variableConfig)
	setCurrentGroup(null)
	setCurrentProject(null)

	if (checkIfUserDataIsLoaded(user)) {
		user = getUser();
		setLoginToLogout(linkAuth);
	}

	calendarSurface.appendChild(createCalendarList(convertDateToString(dateBackward), dateBackward.getMonth(), getLang(), null, true, variableConfig));
	calendarSurface.appendChild(createCalendarList(convertDateToString(date), date.getMonth(), getLang(), null, true, variableConfig));
	calendarSurface.appendChild(createCalendarList(convertDateToString(dateForward), dateForward.getMonth(), getLang(), null, true, variableConfig));
	themeChange(true, themeBtn);
})


errorLog.addEventListener("click", (e) => {
	e.currentTarget.classList.remove("move-log")
})

saveList.addEventListener("click", (e) => {
	let currentProject = getActualProject();
	if (currentProject != "null") {
		let id = document.querySelector(".actual-list").dataset.id;
		update(id, variableConfig);
		setIsSaveToTrue(e.currentTarget);
	}
})

plus.addEventListener("click", (e) => {
	let currentProject = getActualProject();
	if (currentProject != "null") {
		const element = createListElement("", "f", true, surfaceList, saveList);
		surfaceList.appendChild(element);
		e.currentTarget.nextElementSibling.nextElementSibling.classList.add("unsave")
	}
})

refresh.addEventListener("click", async () => {
	let currentGroup = getActualGroup();
	if (currentGroup != "null") {
		createProjectButtons(await loadProjectsFromGroup(currentGroup, variableConfig), variableConfig)
	}
})

listsPlus.addEventListener("click", () => {
	let currentGroup = getActualGroup();
	if (currentGroup == "null") return;
	if (linkAuth.dataset.id == "logout") {
		createNewProject(getLang(), variableConfig)
	} else {
		showErrors("JWT", errorLog)
	}
})

edit.addEventListener("click", (e) => {
	let currentProject = getActualProject();
	if (currentProject != "null") {
		editProjectName(e.currentTarget.parentNode.parentNode, saveList);
	}
})

forward.addEventListener("click", (e) => {
	let currentGroup = getActualGroup();
	if (currentGroup != "null" && !e.currentTarget.classList.contains("disabled")) {
		calendarForwardMove(currentGroup, variableConfig);
	}
})


backward.addEventListener("click", (e) => {
	let currentGroup = getActualGroup();
	if (currentGroup != "null" && !e.currentTarget.classList.contains("disabled")) {
		calendarBackwardMove(currentGroup, variableConfig);
	}
})


staticLinks.forEach((s) => {
	s.addEventListener("click", (e) => {
		location.href = "http://localhost:8080/" + e.currentTarget.dataset.id;
	})
})

linkAuth.addEventListener("click", (e) => {
	if (e.currentTarget.dataset.id == "logout") {
		logout(linkAuth);
	}
	location.href = "http://localhost:8080/auth?from=projectmanager";
});


links.forEach((l) => {
	l.addEventListener("mouseenter", (e) => {
		let l = e.currentTarget.nextElementSibling, value = (l.firstElementChild.scrollWidth + 60) + "px";
		l.style.width = value;
	})
	l.addEventListener("mouseleave", (e) => {
		e.currentTarget.nextElementSibling.style.width = "";
	})
})


linkAuth.addEventListener("mouseenter", (e) => {
	let l = e.currentTarget.nextElementSibling, l2 = e.currentTarget.nextElementSibling.nextElementSibling, value;
	if (l.classList.contains("hide")) {
		value = (l2.firstElementChild.scrollWidth + 60) + "px";
		l2.style.width = value;
	} else {
		value = (l.firstElementChild.scrollWidth + 60) + "px";
		l.style.width = value;
	}
})
linkAuth.addEventListener("mouseleave", (e) => {
	e.currentTarget.nextElementSibling.style.width = "";
	e.currentTarget.nextElementSibling.nextElementSibling.style.width = "";
})





themeBtn.addEventListener("click", (e) => {
	let current = e.currentTarget;
	if (e.currentTarget.children.length > 1) {
		return;
	}

	if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
		moonset(current);
		themeChange(false, current);
	} else if (localStorage.getItem("theme") == "d") {
		sunset(current);
		themeChange(false, current);
	}
})


paste.addEventListener("click", () => {
	let currentProject = getActualProject();
	if (currentProject != "null") {
		const element = createListElement(localStorage.getItem("clipboard"), "f", true, surfaceList, saveList);
		surfaceList.appendChild(element);
		saveList.classList.add("unsave")
	}
})




groupBtn.forEach((button) => {
	button.addEventListener("mouseenter", (e) => { showGroupName(e.currentTarget, false); })
	button.addEventListener("mouseleave", (e) => { e.currentTarget.nextElementSibling.style.width = "" })
})




joinGroupBtn.addEventListener("click", () => {
	if (user != null) {
		createJoinDialog(dialog, dialogB, user, variableConfig);
		toggleElement(dialogB)
	} else {
		showErrors("userEmpty", errorLog)
	}
})

createGroupBtn.addEventListener("click", () => {
	if (user != null) {
		createCreateDialog(dialog, dialogB, user, groupBox, variableConfig);
		toggleElement(dialogB)
	} else {
		showErrors("userEmpty", errorLog)
	}
})








menu.addEventListener("click", (e) => {
	e.stopPropagation();
})

body.addEventListener("click", () => {
	menu.classList.add("hide")
})

options.addEventListener("click", (e) => {
	e.stopPropagation();
	let currentGroup = getActualGroup();
	if (currentGroup != "null") {
		menu.classList.toggle("hide")
	}

})


dialogB.addEventListener("click", (e) => {
	e.currentTarget.classList.toggle("hide")
})

dialog.addEventListener("click", (e) => {
	e.stopPropagation()
})

















