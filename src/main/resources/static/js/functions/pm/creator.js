import { toggleElement } from './dialogs.js';
import {
	changeGroupInfoEvent,
	deleteEvent,
	groupInfoEvent,
	inviteEvent,
	leaveEvent,
	permissEvent,
} from './events.js';
import {
	appearInput,
	checkTheBox,
	cleanSurface,
	createNoProjectsFoundElement,
	editProjectName,
	getActualGroup,
	getActualProject,
	hideGroupName,
	hideModifiButtons,
	loadCalendars,
	OnInput,
	openFirstProject,
	removeDisableModeToTheDateBtns,
	removeNoProjectFoundElement,
	setActualGroup,
	setActualProject,
	setIsSaveToFalse,
	setIsSaveToTrue,
	setValue,
	showGroupName,
	showModifiButtons,
	startBounceAnimation,
	updateDate,
} from './pmUtils.js';
import {
	deleteProject,
	getGroupImg,
	loadCalendarList,
	loadListOnAction,
	loadProjectsFromGroup,
	update,
	updateCalendar,
} from './requests.js';
import {
	convertStringDateToStringEs,
	convertStringDateToStringEn,
	monthsEn,
	monthsEs,
	copyTextToClipboard,
} from '../utils.js';

export function dropEvent(e) {
	let parent = e.currentTarget.parentNode;
	let pos = JSON.parse(e.dataTransfer.getData('element'));
	parent.insertBefore(parent.children[pos], e.currentTarget);
	setIsSaveToFalse(
		parent.previousElementSibling.lastElementChild.lastElementChild
	);
}

export async function groupButtonClickEvent(e, config) {
	const {
		containers: {
			projectsBox,
			surfaceList,
			calendarSurface,
			listName,
			errorLog,
			saveList,
			forward,
			backward,
		},
		calendar,
		userPermiss,
	} = config;

	setActualGroup(e);
	cleanSurface(surfaceList);
	listName.textContent = '';
	cleanSurface(calendarSurface);
	updateDate(calendarSurface, calendar);
	removeDisableModeToTheDateBtns(forward, backward);
	loadCalendars(e.dataset.id, config);
	removeNoProjectFoundElement(projectsBox);
	let proj = await loadProjectsFromGroup(e.dataset.id, config);
	createProjectButtons(proj, config);
}

export function setInputEventListener(l, txHeight, saveBtn) {
	if (l.value == '') {
		l.setAttribute('style', 'height:' + txHeight + 'px;overflow-y:hidden;');
	} else {
		l.setAttribute(
			'style',
			'height:' + l.scrollHeight + 'px;overflow-y:hidden;'
		);
	}

	l.addEventListener('input', OnInput, false);
	l.addEventListener('click', e => {
		e.stopPropagation();
	});
	l.addEventListener('dblclick', e => {
		e.stopPropagation();
	});
	l.addEventListener('blur', e => {
		setValue(e.currentTarget);
		setIsSaveToFalse(saveBtn);
	});
	l.addEventListener('keypress', e => {
		if (e.code == 'Enter') {
			e.currentTarget.blur();
		}
	});
}

export function setLiEventListener(l, saveBtn) {
	l.addEventListener('dblclick', e => {
		appearInput(e.currentTarget.firstElementChild);
		setIsSaveToFalse(saveBtn);
	});
	l.addEventListener('click', e => {
		checkTheBox(e.currentTarget.firstElementChild.firstElementChild);
		setIsSaveToFalse(saveBtn);
	});
	l.addEventListener('mouseenter', e => {
		Array.from(
			e.currentTarget.lastElementChild.lastElementChild.children
		).forEach(e => e.classList.remove('disappear'));
	});
	l.addEventListener('mouseleave', e => {
		Array.from(
			e.currentTarget.lastElementChild.lastElementChild.children
		).forEach(e => e.classList.add('disappear'));
	});
}

export function createMemberOptions(menu, config) {
	cleanSurface(menu);
	menu.appendChild(
		createPopoupMenuOption('Group Info', groupInfoEvent, config)
	);
	menu.appendChild(
		createPopoupMenuOption('Invite people', inviteEvent, config)
	);
	menu.appendChild(createPopoupMenuOption('Leave group', leaveEvent, config));
}

export function createAdminOptions(menu, config) {
	cleanSurface(menu);
	menu.appendChild(
		createPopoupMenuOption('Group Info', groupInfoEvent, config, true)
	);
	menu.appendChild(
		createPopoupMenuOption('Invite people', inviteEvent, config)
	);
	menu.appendChild(
		createPopoupMenuOption('Change group info', changeGroupInfoEvent, config)
	);
	menu.appendChild(
		createPopoupMenuOption('Permission Settings', permissEvent, config)
	);
	menu.appendChild(createPopoupMenuOption('Delete group', deleteEvent, config));
}

export async function createAGroupButton(nombre, id, config, bool) {
	const {
		containers: { groupBox, errorLog },
	} = config;

	const div = document.createElement('DIV');
	const button = document.createElement('BUTTON');
	const divp = document.createElement('DIV');
	const p = document.createElement('P');
	const img = document.createElement('IMG');
	p.classList.add('group-label-p');
	divp.classList.add('group-label', 'theme');
	div.classList.add('group-box');
	button.classList.add('group-button', 'theme');
	img.classList.add('group-img');
	divp.appendChild(p);
	div.appendChild(button);
	div.appendChild(img);
	div.appendChild(divp);
	button.dataset.id = id;
	p.textContent = nombre;
	if (localStorage.getItem('theme') == 'd') {
		divp.classList.add('group-label-dark');
		button.classList.add('group-button-dark');
	}
	button.addEventListener('mouseenter', e => {
		showGroupName(e.currentTarget.nextElementSibling, true);
	});
	button.addEventListener('mouseleave', e => {
		hideGroupName(e.currentTarget);
	});
	button.addEventListener('click', e => {
		let currentGroup = getActualGroup();
		if (currentGroup != e.currentTarget.dataset.id) {
			groupButtonClickEvent(e.currentTarget, config);
		}
	});
	if (bool) {
		groupBox.insertBefore(div, groupBox.firstElementChild);
	} else {
		groupBox.appendChild(div);
	}
	getGroupImg(id, button, errorLog);
	return button;
}

export function createCalendarList(
	date,
	month,
	lang,
	groupId,
	condition,
	config
) {
	const {
		containers: { listName, errorLog, saveList },
	} = config;
	const list = document.createElement('DIV');
	const box = document.createElement('DIV');
	const ul = document.createElement('UL');
	const h = document.createElement('H2');
	const p = document.createElement('P');
	const div = document.createElement('DIV');
	const plus = document.createElement('SPAN');
	const save = document.createElement('SPAN');

	plus.classList.add(
		'calendar-action-btn',
		'fa',
		'fa-plus',
		'calendar-plus',
		'theme'
	);
	save.classList.add(
		'calendar-action-btn',
		'fa',
		'fa-save',
		'save-calendar',
		'theme'
	);
	plus.setAttribute('style', 'display:flex;');
	save.setAttribute('style', 'display:flex;');

	div.classList.add('action-btns-box', 'theme');

	p.classList.add('calendar-date');
	h.classList.add('calendar-month');

	box.classList.add('top-calendar', 'theme');
	ul.classList.add('elements-list', 'calendar-element-list');

	list.classList.add('calendar-list', 'theme');

	if (localStorage.getItem('theme') == 'd') {
		box.classList.add('top-calendar-dark');
		div.classList.add('action-btns-box-dark');
		list.classList.add('calendar-list-dark');
		plus.classList.add('calendar-action-btn-dark');
		save.classList.add('calendar-action-btn-dark');
	}

	div.appendChild(plus);
	div.appendChild(save);

	box.appendChild(h);
	box.appendChild(p);
	box.appendChild(div);

	list.appendChild(box);
	list.appendChild(ul);

	p.textContent = convertStringDateToStringEn(date);
	h.textContent = monthsEn[month][0];

	list.dataset.id = date;

	plus.addEventListener('click', e => {
		let currentProject = getActualProject();
		if (currentProject) {
			ul.appendChild(createListElement('', 'f', 'f', false, ul, saveList));
			e.currentTarget.nextElementSibling.classList.add('unsave');
		}
	});

	save.addEventListener('click', async e => {
		e.preventDefault(); // Prevenir comportamiento por defecto
		let currentProject = getActualProject();
		if (currentProject) {
			const listElement = e.target.closest('.calendar-list').lastElementChild;
			let res = await updateCalendar(listElement, date, errorLog);
			if (res) {
				setIsSaveToTrue(e.target);
			}
		} else {
			showErrors('usernameNotFoundFromToken', errorLog);
		}
	});

	if (condition) {
		list.classList.add('unable');

		const plate = document.createElement('DIV');
		plate.classList.add('plate');
		list.appendChild(plate);
		return list;
	}

	loadCalendarList(date, ul, groupId, listName, saveList, errorLog);

	return list;
}

export function createPopoupMenuOption(text, func, config, adm) {
	const div = document.createElement('DIV');
	const p = document.createElement('P');
	div.classList.add('popupMenu-option');
	p.classList.add('popupMenu-p');
	p.textContent = text;
	div.appendChild(p);
	div.id = 'groupInfo';
	div.addEventListener('click', e => {
		func(config);
		toggleElement(e.currentTarget.parentNode);
	});
	if (adm == true) {
		div.dataset.adm = 'true';
	}
	return div;
}

export function createOneProjectButton(nombre, id, config) {
	const {
		containers: { saveList, projectsBox },
	} = config;

	const button = document.createElement('DIV');
	const p = document.createElement('P');
	const input = document.createElement('INPUT');
	input.classList.add('list-input', 'hide', 'theme');
	if (localStorage.getItem('theme') == 'd') {
		input.classList.add('list-input-dark');
	}
	input.setAttribute('maxlength', '50');
	button.classList.add('list-box');
	button.appendChild(p);
	button.appendChild(input);
	p.classList.add('list-name');
	p.textContent = nombre;
	button.dataset.id = id;
	button.appendChild(createModifiBtns(config));
	button.addEventListener('mouseenter', e => {
		showModifiButtons(e.currentTarget);
	});
	button.addEventListener('mouseleave', e => {
		hideModifiButtons(e.currentTarget);
	});
	button.addEventListener('click', e => {
		let currentProject = getActualProject();
		if (e.currentTarget.dataset.id == currentProject) {
			return;
		}
		if (saveList.classList.contains('unsave')) {
			update(currentProject, config);
		}
		loadListOnAction(e.currentTarget.dataset.id, config);
		setActualProject(e.currentTarget);
		setIsSaveToTrue(saveList);
	});
	projectsBox.appendChild(button);
	return button;
}

export function createModifiBtns(config) {
	const {
		containers: { saveList },
	} = config;
	const div = document.createElement('DIV');
	div.classList.add('modifi-btn-box', 'hide', 'theme');

	const spanDel = document.createElement('SPAN');
	spanDel.addEventListener('click', e => {
		e.stopPropagation();
		deleteProject(e.currentTarget.parentNode.parentNode, config);
	});
	const spanEdit = document.createElement('SPAN');
	spanEdit.addEventListener('click', e => {
		editProjectName(e.currentTarget.parentNode.parentNode, saveList);
	});

	spanDel.classList.add('list-modifi-btn', 'del', 'fa', 'fa-trash');
	spanEdit.classList.add('list-modifi-btn', 'edit', 'fa', 'fa-edit');

	if (localStorage.getItem('theme') == 'd') {
		div.classList.add('modifi-btn-box-dark');
	}

	div.appendChild(spanEdit);
	div.appendChild(spanDel);

	return div;
}

export function createListElement(text, check, fav, main, surface, saveList) {
	let saveBtn = saveList;
	let txHeight = 23;
	const li = document.createElement('LI');
	const box = document.createElement('DIV');
	const span = document.createElement('SPAN');
	const p = document.createElement('P');
	const texta = document.createElement('TEXTAREA');
	const div = document.createElement('DIV');
	const edit = document.createElement('SPAN');
	const del = document.createElement('SPAN');
	const copy = document.createElement('SPAN');
	const star = document.createElement('SPAN');

	li.classList.add('list-element', 'theme');
	li.setAttribute('draggable', 'true');

	star.classList.add(
		'fa',
		'fa-star',
		'list-element-star',
		'disappear',
		'list-element-edit-option'
	);
	edit.classList.add(
		'fa',
		'fa-edit',
		'list-element-edit',
		'disappear',
		'list-element-edit-option'
	);
	del.classList.add(
		'fa',
		'fa-trash',
		'list-element-del',
		'disappear',
		'list-element-edit-option'
	);
	copy.classList.add(
		'fa',
		'fa-copy',
		'list-element-copy',
		'disappear',
		'list-element-edit-option'
	);

	div.classList.add('modifi-box');
	texta.classList.add('list-element-texta', 'hide');
	p.classList.add('list-element-text');
	if (main) {
		p.classList.add('list-element-text-main');
		span.classList.add('list-element-checkbox-main');
		li.classList.add('list-element-main');
	} else {
		texta.classList.add('calendar-texta');
		txHeight = 17;
		saveBtn = surface.previousElementSibling.lastElementChild.lastElementChild;
	}
	span.classList.add('fa', 'fa-square-o', 'list-element-checkbox');

	box.classList.add('list-element-box');

	if (localStorage.getItem('theme') == 'd') {
		li.classList.add('list-element-dark');
	}

	div.appendChild(copy);
	div.appendChild(edit);
	div.appendChild(del);
	div.appendChild(star);

	box.appendChild(span);
	box.appendChild(p);
	box.appendChild(texta);
	box.appendChild(div);

	li.appendChild(box);

	p.textContent = text;

	edit.addEventListener('click', e => {
		e.stopPropagation();
		appearInput(e.currentTarget.parentNode.parentNode);
	});
	del.addEventListener('click', e => {
		e.stopPropagation();
		if (li.classList.contains('favorite')) {
			let ask = confirm('Estas seguro/a que quieres eliminar esta tarea?');
			if (ask) {
				setIsSaveToFalse(saveBtn);
				surface.removeChild(e.currentTarget.parentNode.parentNode.parentNode);
			}
			return;
		}
		setIsSaveToFalse(saveBtn);
		surface.removeChild(e.currentTarget.parentNode.parentNode.parentNode);
	});
	star.addEventListener('click', e => {
		e.stopPropagation();
		setIsSaveToFalse(saveBtn);
		li.classList.toggle('favorite');
	});

	if (check == 't') {
		checkTheBox(box.firstElementChild);
	}

	if (fav == 't') {
		li.classList.add('favorite');
	}

	span.addEventListener('click', e => {
		e.stopPropagation();
		checkTheBox(e.currentTarget);
		setIsSaveToFalse(saveBtn);
	});

	copy.addEventListener('click', e => {
		e.stopPropagation();
		let text = e.currentTarget.parentNode.parentNode.children[1].textContent;
		if (text) {
			copyTextToClipboard(text);
			startBounceAnimation(e.currentTarget);
		}
	});

	setLiEventListener(li, saveBtn);
	setInputEventListener(texta, txHeight, saveBtn);

	li.addEventListener('dragstart', e => {
		let pos = Array.from(e.currentTarget.parentNode.children).findIndex(
			item => item === e.currentTarget
		);
		e.dataTransfer.setData('element', pos);
	});
	li.addEventListener('dragover', e => {
		e.preventDefault();
	});
	li.addEventListener('drop', e => {
		dropEvent(e);
	});

	return li;
}

export function createProjectButtons(Lists, config) {
	const {
		containers: { projectsBox },
	} = config;
	cleanSurface(projectsBox);
	if (Lists && Lists.projects) {
		let nombres = Lists.listProjectName.split('/');
		let ids = Lists.projects.split('/');

		for (let i = 0; i < ids.length; i++) {
			createOneProjectButton(nombres[i], ids[i], config);
		}

		openFirstProject(projectsBox, config);
	} else {
		projectsBox.appendChild(
			createNoProjectsFoundElement('No hay ninguna lista')
		);
	}
}
