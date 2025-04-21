

import { sendRequest, obtenerCookie, saveImgInLocal } from "../utils.js";
import { cleanSurface, setActualProject, createNoProjectsFoundElement, showErrors, loading, validateCrationGroupValues, loadProject, removeNoProjectFoundElement, listNameLang, buildErrorLog, getActualProject, getActualGroup, disableCalendar, setCurrentProject } from "./pmUtils.js"
import { createAdminOptions, createAGroupButton, createListElement, createMemberOptions, createOneProjectButton, groupButtonClickEvent } from "./creator.js"
import { connect, disconnect } from "./socket.js";
import { toggleElement } from "./dialogs.js";










export async function createNewProject(lang, config) {
    const { containers: { projectsBox, errorLog } } = config;
    let currentGroup = getActualGroup();

    let bodyContent = {};
    bodyContent.groupId = currentGroup;
    bodyContent.lang = lang;
    bodyContent = JSON.stringify(bodyContent)

    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/pm/createGroupList")

    if (!peticion.ok) {
        showErrors(peticion.status, errorLog)
        return null;
    }


    let content = await peticion.json()

    removeNoProjectFoundElement(projectsBox);
    let btn = createOneProjectButton(listNameLang(), content.projects, config);
    setActualProject(btn);
    loadListOnAction(btn.dataset.id, config);

}





export async function deleteProject(boxToDelete, config) {
    let currentGroup = getActualGroup();
    let currentProject = getActualProject();

    const { containers: { projectsBox, surfaceList, errorLog } } = config;

    let idToDelete = boxToDelete.dataset.id;

    let pregunta = confirm("¿Esta seguro/a de que quiere eliminar ese projecto?")
    if (pregunta) {
        if (currentProject == idToDelete) {
            setCurrentProject(null)
            cleanSurface(surfaceList);
        }

        let bodyContent = {};
        bodyContent.groupListId = idToDelete;
        bodyContent.groupId = currentGroup;
        bodyContent = JSON.stringify(bodyContent)

        let peticion = await sendRequest('POST', 'application/json', bodyContent,
            "http://localhost:8080/api/pm/deleteGroupList");


        if (!peticion.ok) {
            showErrors(peticion.status, errorLog)
            return null;
        }

        projectsBox.removeChild(boxToDelete);

        peticion.json().then(data => console.log(data))


        if (projectsBox.children.length != 0 && currentProject == null) {
            openFirstProject();
        }
    }
}





export async function update(id, config) {
    const { containers: { errorLog, listName } } = config;

    let listDoc = JSON.parse("[]");
    let projectName = "";

    const tasksText = document.querySelectorAll(".list-element-text-main");

    projectName = listName.textContent;


    tasksText.forEach((t) => {
        let check = "f", fav = "f";
        if (t.previousElementSibling.classList.contains("fa-check-square-o")) check = "t";
        if (t.parentNode.parentNode.classList.contains("favorite")) fav = "t";
        listDoc[listDoc.length] = JSON.parse(`
		   {"check": "${check}", 
			"txt":"${t.textContent}",
            "fav":"${fav}"}`);
    })



    let bodyContent = {};
    bodyContent.groupListId = id;
    bodyContent.listProject = JSON.stringify(listDoc);
    bodyContent.listProjectName = projectName;
    bodyContent = JSON.stringify(bodyContent)


    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/pm/updateGroupList")


    if (!peticion.ok) {
        showErrors(peticion.status, errorLog)
        return null;
    }

    buildErrorLog("green", "Datos guardados exitosamente", errorLog);
}








export async function updateCalendar(e, date, errorLog) {                     //Updates the project in the DB
    let currentGroup = getActualGroup();
    let listDoc = JSON.parse("[]");

    const tsks = e.children;


    Array.from(tsks).forEach(t => {
        let check = "f", fav = "f";
        if (t.firstChild.firstChild.classList.contains("fa-check-square-o")) check = "t";
        if (t.classList.contains("favorite")) fav = "t";
        listDoc[listDoc.length] = JSON.parse(`
		   {"check": "${check}", 
			"txt":"${t.firstChild.firstChild.nextElementSibling.textContent}",
            "fav":"${fav}"}`);
    })



    let bodyContent = {};
    bodyContent.listProject = JSON.stringify(listDoc);
    bodyContent.date = date;
    bodyContent.groupId = currentGroup;
    bodyContent = JSON.stringify(bodyContent)


    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/pm/updateGroupCalendarDate")


    if (!peticion.ok) {
        showErrors(peticion.status, errorLog)
        return null;
    }


    buildErrorLog("green", "Datos guardados exitosamente", errorLog);
    return true;
}


export async function loadCalendarList(date, surface, listName, saveList, errorLog) {  //When you click in a project button or onload
    let currentGroup = getActualGroup();
    let bodyContent = {};
    bodyContent.date = date;
    bodyContent.groupId = currentGroup;
    bodyContent = JSON.stringify(bodyContent)


    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/pm/getGroupCalendarDate")

    if (peticion.status == 404) {
        surface.appendChild(createListElement("", "f", "f", false, surface, saveList))
    }

    if (!peticion.ok) {
        showErrors(peticion.status, errorLog)
        return null;
    }

    let project = await peticion.json();

    loadProject(surface, project, false, listName, saveList);



    if (surface.children.length == 0) {
        surface.appendChild(createListElement("", "f", "f", false, surface, saveList))
    }

}









export async function loadListOnAction(id, config) {  //When you click in a project button or onload
    const { containers: { surfaceList, errorLog, listName, saveList } } = config;

    disconnect();
    let bodyContent = {};
    bodyContent.groupListId = parseInt(id);
    bodyContent = JSON.stringify(bodyContent)

    connect(id);



    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/pm/getGroupListData")


    if (!peticion.ok) {
        showErrors(peticion.status, errorLog)
        return null;
    }

    let project = await peticion.json();



    loadProject(surfaceList, project, true, listName, saveList);
    document.querySelectorAll(".list-box").forEach((p) => {
        if (p.dataset.id == id) {
            setActualProject(p);
        }
    })

}






























export async function joinGroup(joinlink, config) {
    const { containers: { dialogB, errorLog } } = config;
    let bodyContent = {};
    bodyContent.joinlink = joinlink;
    bodyContent = JSON.stringify(bodyContent)


    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/pm/joinGroup")

    if (!peticion.ok) {
        showErrors(peticion.status, errorLog)
        return null;
    }

    let data = await peticion.json();

    let btn = await createAGroupButton(data.groupName, data.groupId, config);
    console.log(btn)
    groupButtonClickEvent(btn, config)
    toggleElement(dialogB)

}




export async function leaveGroup(boxToDelete, config) {  //When you click in a project button or onload
    const { containers: { groupBox, projectsBox, surfaceList, errorLog, listName, dialogB } } = config;
    let currentGroup = getActualGroup();


    let confirmText = "Are you sure you want to get out of that project?";
    if (localStorage.getItem("lang") == "es") {
        confirmText = "¿Esta seguro/a de que quiere salir de ese projecto?";
    }

    let pregunta = confirm(confirmText)
    if (pregunta) {



        let bodyContent = {};
        bodyContent.groupId = currentGroup;
        bodyContent = JSON.stringify(bodyContent)


        let peticion = await sendRequest('POST', 'application/json', bodyContent,
            "http://localhost:8080/api/pm/leaveGroup")

        if (!peticion.ok) {
            showErrors(peticion.status, errorLog)
            return null;
        }

        cleanSurface(surfaceList);
        cleanSurface(projectsBox);
        disableCalendar(config)

        listName.textContent = "";
        groupBox.removeChild(boxToDelete);
        dialogB.classList.add("hide")
    }

}




export async function createNewGroup(nombre, lang, file, groupBox, config) {
    const { containers: { errorLog, dialogB } } = config;
    let error = validateCrationGroupValues(nombre);
    if (error != null) {
        showErrors(error, errorLog);
        return;
    }
    let bodyContent = {};
    bodyContent.groupName = nombre;
    bodyContent.lang = lang;
    bodyContent = JSON.stringify(bodyContent)
    console.log(file)
    if (!file) {
        let peticion = await sendRequest('POST', 'application/json', bodyContent,
            "http://localhost:8080/api/pm/createGroup")

        if (!peticion.ok) {
            showErrors(peticion.status, errorLog)
            return null;
        }

        let content = await peticion.json();

        let btn = createAGroupButton(content.groupName, content.groupId, { containers: { groupBox, errorLog } }, true)
        btn.then(btn => {
            groupButtonClickEvent(btn, config)
            toggleElement(dialogB);
        })

    } else {
        const form = new FormData();
        form.append("file", file);
        form.append("content", bodyContent);

        let peticion = await sendRequest('POST', null, form,
            "http://localhost:8080/api/pm/createGroupImg")

        if (!peticion.ok) {
            showErrors(peticion.status, errorLog)
            return null;
        }

        let content = await peticion.json();

        let btn = createAGroupButton(content.groupName, content.groupId, { containers: { groupBox, errorLog } })
        btn.then(btn => {
            groupButtonClickEvent(btn, config)
            toggleElement(dialogB);
        })
    }
}




export async function getGroupImg(id, button, errorLog) {
    let data = localStorage.getItem(id);
    let imgStored;
    if (data) {
        imgStored = data.split(", ")[0];
    } else {
        imgStored = null;
    }

    let defaultImg = localStorage.getItem("default");
    if (defaultImg) {
        defaultImg = "default";
    }


    const form = new FormData();
    form.append("id", id);
    form.append("imgname", imgStored);
    form.append("defaultImg", defaultImg);

    let peticion = await sendRequest('POST', null, form,
        "http://localhost:8080/api/pm/getGroupImg")

    if (!peticion.ok) {
        showErrors(peticion.status, errorLog)
        return null;
    }


    let info = await peticion.formData();

    if (info.get("log") == "imageIsTheSame") {
        let imgurl = localStorage.getItem(id).split(", ")
        button.nextElementSibling.src = imgurl[1];
        return;
    }

    if (info.get("log") == "groupImgIsDefault") {
        let imgurl = localStorage.getItem("default").split(", ")
        button.nextElementSibling.src = imgurl[1];
        return;
    }

    if (info.get("log") == "defaultGroupImgReturned") {
        const file = info.get("file");
        if (file) {
            saveImgInLocal(file.name, file, button.nextElementSibling, "default");
        }
    }

    const file = info.get("file");
    if (file) {
        saveImgInLocal(file.name, file, button.nextElementSibling, id);
    }


}











export async function deleteGroup(boxToDelete, config) {
    const { containers: { groupBox, projectsBox, surfaceList, errorLog, dialogB } } = config;
    let currentGroup = getActualGroup();

    let pregunta = confirm("¿Esta seguro/a de que quiere eliminar ese grupo?")
    if (!pregunta) return;
    let pregunta2 = confirm("¿Esta completamente seguro/a de que quiere eliminar ese grupo?")
    if (pregunta2) {


        let bodyContent = {};
        bodyContent.groupId = currentGroup;
        bodyContent = JSON.stringify(bodyContent)

        let peticion = await sendRequest('POST', 'application/json', bodyContent,
            "http://localhost:8080/api/pm/deleteGroup")

        if (!peticion.ok) {
            showErrors(peticion.status, errorLog)
            return null;
        }

        cleanSurface(surfaceList);
        cleanSurface(projectsBox);
        disableCalendar(config)

        buildErrorLog("green", "Group deleted successfully", errorLog)
        groupBox.removeChild(boxToDelete);
        dialogB.classList.add("hide")
    }
}





export async function loadProjectsFromGroup(id, config) {   //Gets all the projects ids

    const { containers: { menu, projectsBox, errorLog } } = config;


    let bodyContent = {}
    bodyContent.groupId = id;
    bodyContent = JSON.stringify(bodyContent)

    loading(projectsBox)

    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/pm/getAllGroupLists")


    if (!peticion.ok) {
        showErrors(peticion.status, errorLog)
        return null;
    }

    let lists = await peticion.json();

    if (lists.admin == "true") {
        createAdminOptions(menu, config)
    } else {
        createMemberOptions(menu, config)
    }

    return lists;
}


export function createGroupButtons(Lists, config) {
    const { containers: { surfaceList } } = config;
    cleanSurface(surfaceList)
    if (Lists == null) {
        return;
    }
    if (Lists.groups) {
        let nombres = Lists.groupNames.split("/");
        let ids = Lists.groups.split("/");

        for (let i = 0; i < ids.length; i++) {
            createAGroupButton(nombres[i], ids[i], config);
        }
    }

}



export async function loadGroupFromUsers(errorLog) {   //Gets all the projects ids
    let bodyContent = {}
    bodyContent.tiempo = "" + obtenerCookie("keep");
    bodyContent = JSON.stringify(bodyContent)

    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/pm/getAllGroups")


    if (!peticion.ok) {
        showErrors(peticion.status, errorLog)
        return null;
    }

    let data = await peticion.json();

    return data;
}