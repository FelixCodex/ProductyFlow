
import { sendRequest, saveImgInLocal } from '../utils.js';
import { deleteEvent, leaveEvent, updateGroup } from "./events.js"
import { getGroupButton } from "./events.js"
import {
    loading, buildErrorLog, showErrors,
    createNoProjectsFoundElement,
    createLabelElement
} from "./pmUtils.js"
import { createNewGroup, joinGroup } from './requests.js';





export function getGroupImgFromLocal(id) {
    let img = localStorage.getItem(id);
    if (!img) {
        img = localStorage.getItem("default");
    }
    return img;
}





export function permissionSelector(permis) {
    let permision = "";
    switch (permis) {
        case "1": permision = "Check"
            break;
        case "2": permision = "Modify"
            break;
        case "3": permision = "Lists"
            break;
        case "4": permision = "Admin"
            break;
        default: "Undefined"
    }
    return permision;
}


export function toggleElement(elem) {
    elem.classList.toggle("hide")
}


export function showMembers(peticion, box) {
    box.innerHTML = "";
    let num = 0;
    if (peticion.error == null) {
        let ids = peticion.membersId.split("/");
        let names = peticion.membersName.split("/");
        let permisses = peticion.membersPermis.split("/");

        for (let i = 0; i < ids.length; i++) {
            let permis = permissionSelector(permisses[i])
            box.appendChild(createMember(names[i], permis))
            num++;
        }
    }
    return num;
}


export function showModifiableMembers(peticion, box, gid, errorLog) {
    box.innerHTML = "";
    if (peticion.error == null) {
        let ids = peticion.membersId.split("/");
        let names = peticion.membersName.split("/");
        let permisses = peticion.membersPermis.split("/");

        for (let i = 1; i < ids.length; i++) {
            console.log(permisses[i])
            box.appendChild(createModifiableMember(names[i], ids[i], permisses[i], gid, errorLog))
        }
    }
}



export function createJoinDialog(div, dialogB, user, config) {
    const joinBtns = document.createElement("DIV")
    const back = document.createElement("BUTTON");
    const join = document.createElement("BUTTON");
    back.classList.add("join-button");
    back.dataset.id = "back";
    back.textContent = "Back";
    join.classList.add("join-button", "join-btn");
    join.dataset.id = "join";
    join.textContent = "Join group";
    joinBtns.classList.add("join-button-box")

    const nameLabel = document.createElement("LABEL");
    const nameInput = document.createElement("INPUT");
    nameLabel.classList.add("create-label")
    nameLabel.textContent = "Group Name";

    nameInput.type = "text";
    nameInput.name = "Group name";
    nameInput.id = "group-name-input";
    nameInput.classList.add("create-input");



    joinBtns.appendChild(back)
    joinBtns.appendChild(join)

    back.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    join.addEventListener("click", () => {
        if (user != null) {
            joinGroup(nameInput.value, config);
        }
    })


    div.innerHTML = `
                <div class="dialog-top">
                    <p for="" class="dialog-top-p">Join group</p>
                </div>
                <div class="join-p-box">
                    <p class="join-p">Unete a un grupo y descubre las oportunidades que ofrece trabajar en equipo.</p>
                    <p class="join-p">Puedes unirte a un grupo introduciendo el codigo de grupo abajo o si lo prefieres ir al a direccion productivity.com/groups/*codigo del grupo*</p>
                </div>`;




    div.appendChild(nameLabel);
    div.appendChild(nameInput);

    div.appendChild(joinBtns);
}


export function createCreateDialog(div, dialogB, user, groupBox, config) {
    const Btns = document.createElement("DIV")
    const back = document.createElement("BUTTON");
    const next = document.createElement("BUTTON");
    back.classList.add("create-button");
    back.dataset.id = "back";
    back.textContent = "Back";
    next.classList.add("create-button", "create-btn");
    next.dataset.id = "create";
    next.textContent = "Create group";
    Btns.classList.add("create-button-box")


    Btns.appendChild(back)
    Btns.appendChild(next)


    const uploadBox = document.createElement("DIV");
    uploadBox.classList.add("uploadImage-box");

    const uploadImageBox = document.createElement("DIV");
    const uploadSpan = document.createElement("SPAN");
    const uploadInput = document.createElement("INPUT");
    const uploadLabel = document.createElement("LABEL");
    uploadSpan.classList.add("uploadImage-icon", "fa", "fa-cloud-upload")
    uploadImageBox.classList.add("uploadImage", "uploadImage-Box")

    uploadInput.classList.add("uploadInput");
    uploadInput.type = "file";
    uploadInput.id = "file";
    uploadInput.accept = ".jpg, .jpeg, .png";

    uploadLabel.classList.add("uploadLabel");
    uploadLabel.for = "file";
    uploadLabel.textContent = "Upload Image";

    uploadImageBox.appendChild(uploadSpan)
    uploadBox.appendChild(uploadImageBox)
    uploadBox.appendChild(uploadInput)
    uploadBox.appendChild(uploadLabel)



    const nameLabel = document.createElement("LABEL");
    const nameInput = document.createElement("INPUT");

    nameLabel.classList.add("create-label")
    nameLabel.textContent = "Group Name";

    nameInput.type = "text";
    nameInput.name = "Group name";
    nameInput.id = "group-name-input";
    nameInput.classList.add("create-input");


    back.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    uploadImageBox.addEventListener("click", () => {
        uploadInput.click();
    })

    uploadLabel.addEventListener("click", () => {
        uploadInput.click();
    })

    uploadInput.addEventListener("change", (e) => {
        let image = e.currentTarget.files[0];
        uploadBox.removeChild(uploadImageBox)
        const img = document.createElement("IMG")
        img.src = URL.createObjectURL(e.currentTarget.files[0])
        img.classList.add("uploadImage")
        img.addEventListener("click", () => { uploadInput.click(); })
        uploadBox.insertBefore(img, e.currentTarget)
        uploadLabel.textContent = image.name;
    })

    next.addEventListener("click", () => {
        if (user != null) {
            createNewGroup(nameInput.value, "es", uploadInput.files[0], groupBox, config);
        }
    })

    div.innerHTML = `
                <div class="dialog-top">
                    <p class="dialog-top-p">Create group</p>
                </div>
                <div class="create-p-box">
                    <p class="create-p">Crea un grupo y comparte las oportunidades que ofrece trabajar en equipo.La imagen debe de ser menor a 5MB.</p>
                </div>`;

    div.appendChild(uploadBox);


    div.appendChild(nameLabel);
    div.appendChild(nameInput);

    div.appendChild(Btns);
}



function createMember(memberName, memberPermission) {
    const div = document.createElement("DIV");
    const name = document.createElement("P");
    const permission = document.createElement("P");

    div.classList.add("groupMember")
    name.classList.add("groupMember-name")
    permission.classList.add("groupMember-permission")

    div.appendChild(name)
    div.appendChild(permission)

    name.textContent = memberName;
    permission.textContent = memberPermission;

    return div;
}





export function createModifiableMember(memberName, id, memberPermission, gid, errorLog) {
    const div = document.createElement("DIV");
    const name = document.createElement("P");
    const actions = document.createElement("DIV");
    const select = document.createElement("SELECT");
    const kickBtn = document.createElement("BUTTON");

    select.classList.add("permissSelector")
    kickBtn.classList.add("kick-btn", "red")
    actions.classList.add("member-actions")

    actions.appendChild(select)
    actions.appendChild(kickBtn)


    kickBtn.textContent = "Kick"

    select.innerHTML = `
    <option value="1">Check</option>
    <option value="2">Modify</option>
    <option value="3">Lists</option>`;

    select.value = memberPermission;

    div.classList.add("groupMember")
    name.classList.add("groupMember-name")

    div.dataset.id = id;
    div.appendChild(name)
    div.appendChild(actions)

    select.addEventListener("change", async (e) => {
        let sel = e.currentTarget;
        sel.setAttribute("disabled", "false")

        let body = {};
        body.groupId = gid;
        body.memberId = id;
        body.permis = sel.value;
        console.log(sel.value)
        body = JSON.stringify(body)
        let peti = await sendRequest("POST", "application/json", body,
            "http://localhost:8080/api/pm/updateMemberPermiss"
        )
        if (!peti.ok) {
            showErrors(peti.status, errorLog)
            return null;
        }
        sel.removeAttribute("disabled");

    })

    kickBtn.addEventListener("click", async (e) => {
        let member = e.currentTarget.parentNode.parentNode;
        let box = member.parentNode;

        let body = {};
        body.groupId = gid;
        body.memberId = id;
        body = JSON.stringify(body)
        let peti = await sendRequest("POST", "application/json", body,
            "http://localhost:8080/api/pm/kickMember"
        )
        if (!peti.ok) {
            showErrors(peti.status, errorLog)
            return null;
        }

        box.removeChild(member);

        if (box.children.length == 0) {
            box.appendChild(createLabelElement("No members found"))
        }
    })

    name.textContent = memberName;

    return div;
}


export async function createGroupInfoDialog(adm, div, dialogB, groupName, groupId, config) {
    const { containers: { errorLog } } = config;
    const groupInfoBox = document.createElement("DIV");
    const groupInfoImg = document.createElement("IMG");
    const groupInfoName = document.createElement("P");
    const groupInfoMembersAmount = document.createElement("P");

    const groupButtonsBoxFrist = document.createElement("DIV");
    const groupButtonInvite = document.createElement("BUTTON");
    const groupButtonSearch = document.createElement("BUTTON");

    const groupMemberLabel = document.createElement("LABEL");

    const groupMembersBox = document.createElement("DIV");

    const groupButtonsBoxSecond = document.createElement("DIV");
    const groupButtonBack = document.createElement("BUTTON");
    const groupButtonRed = document.createElement("BUTTON");

    const groupJoinLink = document.createElement("div")

    groupJoinLink.classList.add("dialog-input-f")

    groupInfoBox.classList.add("groupInfo-box")
    groupInfoImg.classList.add("dialog-img")
    groupInfoName.classList.add("groupName")
    groupInfoMembersAmount.classList.add("groupMembersAmount")

    groupButtonsBoxFrist.classList.add("groupButtons-box")
    groupButtonInvite.classList.add("groupButton")
    groupButtonSearch.classList.add("groupButton")

    groupMemberLabel.classList.add("groupMember-label")

    groupMembersBox.classList.add("groupMembers-box")

    groupButtonsBoxSecond.classList.add("groupButtons-box")
    groupButtonBack.classList.add("groupButton")
    groupButtonRed.classList.add("groupButton", "red")

    groupInfoBox.appendChild(groupInfoImg)
    groupInfoBox.appendChild(groupInfoName)
    groupInfoBox.appendChild(groupInfoMembersAmount)

    groupButtonsBoxFrist.appendChild(groupButtonInvite)
    groupButtonsBoxFrist.appendChild(groupButtonSearch)

    groupButtonsBoxSecond.appendChild(groupButtonBack)
    groupButtonsBoxSecond.appendChild(groupButtonRed)

    groupInfoName.textContent = groupName;


    groupButtonInvite.textContent = "Invite people";
    groupButtonSearch.textContent = "Search";
    groupButtonBack.textContent = "Back";

    if (adm == "true") {
        groupButtonRed.textContent = "Delete group";
    } else {
        groupButtonRed.textContent = "Leave group";
    }

    groupMemberLabel.textContent = "Members";

    loading(groupMembersBox)

    let body = {};
    body.groupId = groupId;
    body = JSON.stringify(body)
    let peti = await sendRequest("POST", "application/json", body,
        "http://localhost:8080/api/pm/getMembers")

    let res = await peti.json();
    let num = showMembers(res, groupMembersBox)
    let joinlink = res.groupJoinlink;
    groupInfoMembersAmount.textContent = num + " Members";


    groupButtonBack.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    groupButtonInvite.addEventListener("click", () => {
        createInviteDialog(div, dialogB, groupId, errorLog)
    })
    groupButtonRed.addEventListener("click", (e) => {
        if (e.currentTarget.textContent == "Leave group") {
            leaveEvent(config)
        } else {
            deleteEvent(config)
        }
    })



    div.innerHTML = `
                <div class="dialog-top">
                    <p class="dialog-top-p">Group Info</p>
                </div>`;

    groupJoinLink.innerHTML = `<p class="dialog-p-f">
                                    Joinlink: 
                                    <span class="dialog-unselectable-span">${joinlink}
                                    </span>
                                </p>
                                <span class="fa fa-copy" style="margin-left:5px">
                                </span>`

    groupJoinLink.addEventListener("click", (e) => {
        navigator.clipboard.writeText(joinlink);
        let span = e.currentTarget.lastElementChild;

        span.classList.add("bounce");
        setTimeout(() => {
            span.classList.remove("bounce");
        }, 400);
    })


    div.appendChild(groupInfoBox)
    div.appendChild(groupButtonsBoxFrist)
    div.appendChild(groupMemberLabel)
    div.appendChild(groupMembersBox)
    div.appendChild(groupJoinLink)
    div.appendChild(groupButtonsBoxSecond)



    let img = getGroupImgFromLocal(groupId).split(", ");
    groupInfoImg.src = img[1];

}





export function createInviteDialog(div, dialogB, groupId, errorLog) {
    const btns = document.createElement("DIV");
    const back = document.createElement("BUTTON");
    const input = document.createElement("INPUT");
    const invite = document.createElement("BUTTON");

    btns.classList.add("dialog-button-box-f")
    back.classList.add("dialog-button-f")
    invite.classList.add("dialog-button-f", "blue")
    input.classList.add("dialog-input")

    input.name = "Invite Input"
    input.id = "inviteInput"

    back.textContent = "Back"
    invite.textContent = "Invite"

    back.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    btns.appendChild(back)
    btns.appendChild(invite)

    invite.addEventListener("click", async () => {

        if (input.value == "") {
            input.classList.add("wrong-input", "b-red");
            setTimeout(() => {
                input.classList.remove("wrong-input");
            }, 200)
            return;
        }

        let body = {};
        body.groupId = groupId;
        body.userName = input.value;
        body = JSON.stringify(body)

        let peti = await sendRequest("POST", "application/json", body,
            "http://localhost:8080/api/pm/inviteUser"
        )

        if (peti.status == 406) {
            buildErrorLog("red", "El usuario ya pertenece al grupo", errorLog)
        }

        if (!peti.ok) {
            showErrors(peti.status, errorLog)
            return null;
        }

        buildErrorLog("green", "User added successfully", errorLog)
        input.value = "";
    })

    input.addEventListener("input", () => {
        input.classList.remove("b-red")
    })

    div.innerHTML = `
                <div class="dialog-top">
                    <p class="dialog-top-p">Invite Someone</p>
                </div>
                <div class="dialog-p-box">
                    <p class="dialog-p">Invite people to your group and enjoy working together.</p>
                    <p class="dialog-p">You can invite someone by passing the user's name or, if you prefer, their User ID.</p>
                </div>
                <label for="inviteInput" class="dialog-label">User Name</label>`;

    div.appendChild(input)
    div.appendChild(btns)
}




export async function createChangeGroupInfoDialog(div, dialogB, groupName, groupId, errorLog) {
    const changeImgBox = document.createElement("DIV");
    const changeImg = document.createElement("IMG");
    const changeInput = document.createElement("INPUT");
    const changeImgLabel = document.createElement("LABEL");

    const changeNameLabel = document.createElement("LABEL");
    const changeName = document.createElement("INPUT");

    const changeButtonBox = document.createElement("DIV");
    const changeButtonBack = document.createElement("BUTTON");
    const changeButtonSave = document.createElement("BUTTON");

    changeImgBox.classList.add("uploadChangeImage-box")
    changeImg.classList.add("dialog-img")
    changeInput.classList.add("uploadInput")
    changeImgLabel.classList.add("uploadLabel")

    changeNameLabel.classList.add("dialog-label")
    changeName.classList.add("dialog-input")

    changeButtonBox.classList.add("dialog-button-box-s")
    changeButtonBack.classList.add("dialog-button-s")
    changeButtonSave.classList.add("dialog-button-s", "green")

    changeButtonBack.textContent = "Back"
    changeButtonSave.textContent = "Save"

    changeImgBox.appendChild(changeImg)
    changeImgBox.appendChild(changeInput)
    changeImgBox.appendChild(changeImgLabel)

    changeButtonBox.appendChild(changeButtonBack)
    changeButtonBox.appendChild(changeButtonSave)

    changeInput.type = "file";
    changeInput.accept = ".jpg, .jpeg, .png";
    changeName.value = groupName;

    changeImgLabel.textContent = "Upload new image";
    changeNameLabel.textContent = "New group name";


    changeButtonBack.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    changeButtonSave.addEventListener("click", async () => {

        let file = null;
        if (changeInput.files[0] != undefined) {
            file = changeInput.files[0];
        }

        let body = {};
        body.groupId = groupId;
        body.groupName = changeName.value;
        body = JSON.stringify(body)

        let peti, res;

        if (file) {

            const form = new FormData();
            form.append("file", file)
            form.append("content", body)

            peti = await sendRequest("POST", null, form,
                "http://localhost:8080/api/pm/updateGroupImg"
            )

            if (!peti.ok) {
                showErrors(peti.status, errorLog)
                return null;
            }

            res = await peti.json();

            let groupImage = getGroupButton(groupId).nextElementSibling;
            saveImgInLocal(res.img, changeInput.files[0], groupImage, groupId);

            let imgToSet = URL.createObjectURL(changeInput.files[0])
            updateGroup(groupId, imgToSet, changeName.value)

            toggleElement(dialogB)

        } else {
            peti = await sendRequest("POST", "application/json", body,
                "http://localhost:8080/api/pm/updateGroup"
            )

            if (!peti.ok) {
                showErrors(peti.status, errorLog)
                return null;
            }

            res = await peti.json();

            let group = getGroupButton(groupId).parentNode.lastElementChild.firstElementChild;
            group.textContent = changeName.value;
            toggleElement(dialogB)

        }
        if (res) {
            buildErrorLog("green", "Group Info changed successfully", errorLog)
        }
    })

    changeImg.addEventListener("click", () => {
        changeInput.click()
    })

    changeInput.addEventListener("change", (e) => {
        let image = e.currentTarget.files[0];
        changeImg.src = URL.createObjectURL(e.currentTarget.files[0])
        changeImgLabel.textContent = image.name;
    })

    div.innerHTML = `
                <div class="dialog-top">
                    <p class="dialog-top-p">Change Group Info</p>
                </div>`;


    div.appendChild(changeImgBox)
    div.appendChild(changeNameLabel)
    div.appendChild(changeName)
    div.appendChild(changeButtonBox)


    let img = getGroupImgFromLocal(groupId).split(", ");
    changeImg.src = img[1];
}




export async function createPermissionsDialog(div, dialogB, groupId, errorLog) {

    const permissMembersBox = document.createElement("DIV");

    const permissButtonBox = document.createElement("DIV");
    const permissButtonBack = document.createElement("BUTTON");
    permissMembersBox.classList.add("permissMembers-box")


    permissButtonBox.classList.add("dialog-button-box-s")
    permissButtonBack.classList.add("dialog-button-s")

    permissButtonBox.appendChild(permissButtonBack)


    permissButtonBack.textContent = "Back"


    loading(permissMembersBox)

    let body = {};
    body.groupId = groupId;
    body = JSON.stringify(body)
    let peti = await sendRequest("POST", "application/json", body,
        "http://localhost:8080/api/pm/getMembers"
    )

    if (!peti.ok) {
        showErrors(peti.status, errorLog)
        return null;
    }

    let res = await peti.json();

    showModifiableMembers(res, permissMembersBox, groupId, errorLog)

    if (permissMembersBox.children.length == 0) {
        permissMembersBox.appendChild(createLabelElement("No members found"))
    }

    permissButtonBack.addEventListener("click", () => {
        toggleElement(dialogB)
    })

    div.innerHTML = `
                <div class="dialog-top">
                    <p class="dialog-top-p">Permissions Settings</p>
                </div>`;

    div.appendChild(permissMembersBox)
    div.appendChild(permissButtonBox)

}




export default {
    createJoinDialog, createCreateDialog
    , createGroupInfoDialog, createInviteDialog, createChangeGroupInfoDialog,
    createPermissionsDialog
};