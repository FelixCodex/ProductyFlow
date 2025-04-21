
import { createCalendarList } from "./creator.js"
import {
    createGroupInfoDialog, createInviteDialog, createChangeGroupInfoDialog,
    createPermissionsDialog,
    toggleElement
} from "./dialogs.js"
import { getActualGroup } from "./pmUtils.js";
import { deleteGroup, leaveGroup } from "./requests.js";
import { convertDateToString, getLang } from "../utils.js";

let calendarWidth = 480;


export function calendarForwardMove(id, config) {
    const { containers: { calendarSurface } } = config;
    let { calendar: { dateForward } } = config;
    let actualPosition = Number(localStorage.getItem("actualPosition"));
    let daysToForward = Number(localStorage.getItem("daysToForward"));

    console.log("Moving Forward")

    if (!(calendarSurface.scrollLeft % calendarWidth == 0)) {
        console.log("Length not accurate")
        return;
    }
    if (actualPosition == daysToForward) {
        console.log("Position accepted")
        dateForward.setDate(dateForward.getDate() + 1);
        calendarSurface.appendChild(createCalendarList(convertDateToString(dateForward), dateForward.getMonth(), getLang(), id, false, config));
        localStorage.setItem("daysToForward", daysToForward + 1);
    }

    console.log("Movement Stoped")
    calendarSurface.scrollLeft = calendarSurface.scrollLeft + (calendarWidth);
    localStorage.setItem("actualPosition", actualPosition + 1);
}

export function calendarBackwardMove(id, config) {
    const { containers: { calendarSurface } } = config;
    let { calendar: { dateBackward } } = config;
    let actualPosition = Number(localStorage.getItem("actualPosition"));
    let daysToBackward = Number(localStorage.getItem("daysToBackward"));

    if (!(calendarSurface.scrollLeft % calendarWidth == 0)) {
        return;
    }
    if (actualPosition == daysToBackward) {
        dateBackward.setDate(dateBackward.getDate() - 1);
        calendarSurface.insertBefore(createCalendarList(convertDateToString(dateBackward), dateBackward.getMonth(), getLang(), id, false, config), calendarSurface.firstChild);
        calendarSurface.classList.add("noscroll");
        calendarSurface.scrollLeft = calendarSurface.scrollLeft + (calendarWidth);
        calendarSurface.classList.remove("noscroll");
        localStorage.setItem("daysToBackward", daysToBackward - 1);
    }

    calendarSurface.scrollLeft = calendarSurface.scrollLeft - (calendarWidth);
    localStorage.setItem("actualPosition", actualPosition - 1);
}



export function getGroupName(gid) {
    const groups = document.querySelectorAll(".group-button")
    let name = null;
    groups.forEach((g) => {
        if (g.dataset.id == gid) {
            name = g.parentNode.lastElementChild.firstElementChild.textContent;
        }
    })
    return name;
}

export function getGroupButton(gid) {
    let group;
    const groups = document.querySelectorAll(".group-button")
    groups.forEach((g) => {
        if (g.dataset.id == gid) {
            group = g;
        }
    })
    return group;
}

export function updateGroup(gid, img, gname) {
    const groups = document.querySelectorAll(".group-button")
    groups.forEach((g) => {
        if (g.dataset.id == gid) {
            g.nextElementSibling.src = img;
            g.parentNode.lastElementChild.firstElementChild.textContent = gname;
        }
    })

}

export function groupInfoEvent(config) {
    const { containers: { dialog, dialogB } } = config;
    let currentGroup = getActualGroup();
    let name = getGroupName(currentGroup)
    let box = document.getElementById("groupInfo");
    let adm = box.dataset.adm;
    createGroupInfoDialog(adm, dialog, dialogB, name, currentGroup, config);
    toggleElement(dialogB)
}

export function inviteEvent({ containers: { dialog, dialogB, errorLog } }) {
    let currentGroup = getActualGroup();
    createInviteDialog(dialog, dialogB, currentGroup, errorLog);
    toggleElement(dialogB)
}

export function changeGroupInfoEvent({ containers: { errorLog, dialog, dialogB } }) {
    let currentGroup = getActualGroup();
    let name = getGroupName(currentGroup)
    createChangeGroupInfoDialog(dialog, dialogB, name, currentGroup, errorLog);
    toggleElement(dialogB)
}

export function permissEvent({ containers: { errorLog, dialog, dialogB } }) {
    let currentGroup = getActualGroup();
    createPermissionsDialog(dialog, dialogB, currentGroup, errorLog);
    toggleElement(dialogB)
}

export function leaveEvent(config) {
    let currentGroup = getActualGroup();
    let box = getGroupButton(currentGroup);
    leaveGroup(box.parentNode, config)
}

export function deleteEvent(config) {
    let currentGroup = getActualGroup();
    let box = getGroupButton(currentGroup);
    deleteGroup(box.parentNode, config);
}