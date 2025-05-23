

// CREATING THE DATA STRUCTURES	AND UTILS ------------------------------------------------


function newFechaUTC(dias) {
	let fecha = new Date();
	fecha.setTime(fecha.getTime() + dias * 1000 * 60 * 60 * 24);
	return fecha.toUTCString();
}

function crearCookie(name, dias) {
	exp = newFechaUTC(dias);
	document.cookie = `${name};expires=${exp}`;
}

function obtenerCookie(cookieName) {
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

function eliminarCookie(cookieName) {
	document.cookie = `${cookieName}=0;max-age=0`
}

function getLang() {
	let lang = localStorage.getItem("lang");
	if (lang != "es" && lang != "en") {
		return "en";
	}
	return lang;
}

function replace(string, textToR, textR) {
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







// VARIABLE INSTANSIATION ----------------------------------------------------------------

const navRightBtns = document.querySelectorAll(".nav-right-button");
const navLeftBtns = document.querySelectorAll(".nav-left-button");
const section = document.querySelectorAll(".section");
const socialMedia = document.querySelectorAll(".social-media-li");
const header = document.querySelector("header");
const themeBtn = document.getElementById("theme");
const langBtn = document.getElementById("lang");
const linkAuth = document.querySelector(".linkAuth");
const articleBtns = document.querySelectorAll(".article-info-button");
const contactMeMessage = document.querySelector(".contact-me-mensaje");

let dentro = true;














// FUNCTIONS INSTANSIATION  --------------------------------------------------------------


//  D D D D     D D D D D D    DD        D       D D D D              D D D D D D 
//	D       D        D         D D       D     D         D            D
//	D       D        D         D  D      D    D                       D
//	D      D         D         D   D     D     D                      D 
//	D D D D          D         D    D    D       D D D D              D D D D
//	D      D         D         D     D   D               D            D
//	D       D        D         D      D  D                D           D
//	D       D        D         D       D D     D         D            D
//	D D D D          D         D        DD       D D D D              D


// BUTTONS FUNCTIONS ------------------


function themeChange(fromWindow) {
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


function sunset(e) {
	let first = e.firstElementChild;
	const current = e;
	const moon = document.createElement("SPAN");
	moon.classList.add("fas", "fa-moon", "day-time-cicle", "arise")
	first.classList.remove("arise");
	first.classList.add("sunset");
	e.insertBefore(moon, first);
	setTimeout(() => {
		current.removeChild(first)
	}, 800);
}

function moonset(e) {
	let first = e.firstElementChild;
	const current = e;
	const sun = document.createElement("SPAN");
	sun.classList.add("fas", "fa-sun", "day-time-cicle", "arise")
	first.classList.remove("arise");
	first.classList.add("sunset");
	e.insertBefore(sun, first);
	setTimeout(() => {
		current.removeChild(first)
	}, 800);
}



function langChange(a) {
	let lang;
	if (getLang() == "en") {
		lang = "es";
		localStorage.setItem("lang", "es")
	} else {
		lang = "en";
		localStorage.setItem("lang", "en")
	}


	const langElements = document.querySelectorAll(".lang");

	langElements.forEach((e) => {
		e.textContent = e.getAttribute(lang);
	})
	a.lastElementChild.textContent = a.getAttribute(lang);
	let value = (a.lastElementChild.scrollWidth + 70) + "px";
	a.style.width = value;
}

function checkLang() {
	if (localStorage.getItem("lang") == "es") {
		const langElements = document.querySelectorAll(".lang");

		langElements.forEach((e) => {
			e.textContent = e.getAttribute("es");
		})
	}
}


function setLoginToLogout() {
	linkAuth.dataset.id = "logout";
	linkAuth.classList.remove("fa-sign-in-alt");
	linkAuth.classList.add("fa-sign-out-alt");
}

function setLogoutToLogin() {
	linkAuth.dataset.id = "login";
	linkAuth.classList.add("fa-sign-in-alt");
	linkAuth.classList.remove("fa-sign-out-alt");
}



function logout() {
	setLogoutToLogin();
	eliminarCookie("ssid");
	eliminarCookie("keep");
	location.reload();
}


function setArticleBtnToStart() {
	let lang = "en";
	if (localStorage.getItem("lang") == "es") {
		lang = "es";
	}
	const btn = document.getElementById("start-btn");
	btn.textContent = btn.getAttribute(lang + "l")
	btn.dataset.id = "start";
}















async function authenticate() {
	const datos = {};
	datos.tiempo = "" + obtenerCookie("keep");


	const peticion = await fetch("http://localhost:8080/auth/authenticate", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(datos)
	});

	if (peticion.status == 200) {
		setLoginToLogout();
		setArticleBtnToStart();
	}


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

window.addEventListener("scroll", (e) => {
	if (document.documentElement.scrollTop == 0) {
		header.classList.remove("scroll-header");
		header.classList.remove("scroll-header-dark");
	} else {
		if (localStorage.getItem("theme") == "l") {
			header.classList.add("scroll-header");
			header.classList.remove("scroll-header-dark");
		} else {
			header.classList.add("scroll-header-dark");
		}

	}
})

window.addEventListener("load", () => {
	checkLang();
	themeChange(true);
	authenticate()
})


navRightBtns.forEach((n) => {
	n.addEventListener("mouseenter", (e) => {
		let extra = "", lang = "en";
		if (getLang() == "es") {
			lang = "es";
		}
		if (n.dataset.id == "logout") {
			extra = "l";
		}
		n.textContent = n.getAttribute(lang + extra);
		let value = (n.scrollWidth) + "px";
		n.style.width = value;
	})
	n.addEventListener("mouseleave", () => {
		n.textContent = "";
		n.style.width = "";
	})
	n.addEventListener("click", (e) => {
		if (n.dataset.id == "login") {
			location.href = "http://localhost:8080/auth";
		} else if (n.dataset.id == "logout") {
			logout();
		} else {
			location.href = "http://localhost:8080/" + e.currentTarget.dataset.id;
		}
	})
})

navLeftBtns.forEach((n) => {
	n.addEventListener("mouseenter", (e) => {
		if (getLang() == "es") {
			n.lastElementChild.textContent = n.getAttribute("es");
		} else {
			n.lastElementChild.textContent = n.getAttribute("en");
		}
		let value = (n.lastElementChild.scrollWidth + 70) + "px";
		n.style.width = value;
	})
	n.addEventListener("mouseleave", () => {
		n.lastElementChild.textContent = "";
		n.style.width = "";
	})
})




section.forEach((a) => {
	a.addEventListener("mousemove", (e) => {

		if (dentro && !(e.currentTarget.lastElementChild.lastElementChild.offsetParent === null)) {
			let elem = e.currentTarget.lastElementChild.lastElementChild;
			let difx = (elem.x + (elem.clientWidth / 2)) - e.x, dify = ((elem.y + (elem.clientHeight / 2))) - e.y;
			elem.style = "transform: rotateX(" + (dify / 60) + "deg) rotateY(" + (difx / 60 * -1) + "deg);";
		}
	})
	a.addEventListener("mouseleave", (e) => {
		e.currentTarget.lastElementChild.lastElementChild.style = "";
	})
	a.lastElementChild.lastElementChild.addEventListener("mouseenter", (e) => {
		dentro = false;
		e.currentTarget.style = "";
	})
	a.lastElementChild.lastElementChild.addEventListener("mouseleave", (e) => {
		dentro = true;
	})
})



themeBtn.addEventListener("click", (e) => {
	if (e.currentTarget.children.length > 2) {
		return;
	}

	if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
		moonset(e.currentTarget, false);
		themeChange(false);
	} else if (localStorage.getItem("theme") == "d") {
		sunset(e.currentTarget, false);
		themeChange(false);
	}
})

langBtn.addEventListener("click", (e) => {
	langChange(e.currentTarget);
})



articleBtns.forEach((b) => {
	b.addEventListener("click", (e) => {
		let b = e.currentTarget.dataset.id;

		if (b == "signup") {
			location.href = "http://localhost:8080/auth?signup=true";
		} else if (b == "start") {
			location.href = "http://localhost:8080/taskmanager";
		} else if (b == "tm") {
			location.href = "http://localhost:8080/taskmanager";
		} else if (b == "nw") {
			location.href = "http://localhost:8080/network";
		}
	})


})

contactMeMessage.addEventListener("dblclick", (e) => {
	e.currentTarget.style = "";
})

socialMedia.forEach((s) => {
	if (s.id == "mine") {
		return
	}
	s.addEventListener("mouseenter", (e) => {
		e.currentTarget.lastElementChild.style = "width:" + (e.currentTarget.firstElementChild.scrollWidth + 42) + "px";
	})
	s.addEventListener("mouseleave", (e) => {
		e.currentTarget.lastElementChild.style = "";
	})
})