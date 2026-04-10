// Interacciones principales del sitio del semillero.
document.addEventListener("DOMContentLoaded", () => {
	const nav = document.querySelector(".navegacion");
	const menuToggle = document.getElementById("menuToggle");
	const menuPrincipal = document.getElementById("menuPrincipal");
	const enlacesMenu = menuPrincipal ? menuPrincipal.querySelectorAll("a") : [];
	const formulario = document.getElementById("formularioContacto");
	const mensajeFormulario = document.getElementById("mensajeFormulario");
	const decoracionLateral = document.querySelector(".decoracion-lateral");
	const botonVolverInicio = document.getElementById("botonVolverInicio");
	const bannerPrincipal = document.querySelector(".hero");

	// Control de menú hamburguesa en móvil/tablet.
	if (menuToggle && nav) {
		menuToggle.addEventListener("click", () => {
			const abierto = nav.classList.toggle("menu-activo");
			menuToggle.setAttribute("aria-expanded", String(abierto));
		});

		document.addEventListener("click", (event) => {
			if (!nav.contains(event.target)) {
				nav.classList.remove("menu-activo");
				menuToggle.setAttribute("aria-expanded", "false");
			}
		});

		enlacesMenu.forEach((enlace) => {
			enlace.addEventListener("click", () => {
				nav.classList.remove("menu-activo");
				menuToggle.setAttribute("aria-expanded", "false");
			});
		});
	}

	// Validación básica de formulario con feedback visible.
	if (formulario && mensajeFormulario) {
		formulario.addEventListener("submit", (event) => {
			event.preventDefault();

			const nombreInput = document.getElementById("nombre");
			const correoInput = document.getElementById("correo");
			const mensajeInput = document.getElementById("mensaje");

			const nombre = nombreInput.value.trim();
			const correo = correoInput.value.trim();
			const mensaje = mensajeInput.value.trim();

			if (!nombre || nombre.length < 3) {
				mostrarMensajeFormulario("Ingresa un nombre válido (mínimo 3 caracteres).", "error");
				nombreInput.focus();
				return;
			}

			const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
			if (!correoValido.test(correo)) {
				mostrarMensajeFormulario("Ingresa un correo institucional válido.", "error");
				correoInput.focus();
				return;
			}

			if (!mensaje || mensaje.length < 10) {
				mostrarMensajeFormulario("El mensaje debe tener al menos 10 caracteres.", "error");
				mensajeInput.focus();
				return;
			}

			mostrarMensajeFormulario("Mensaje enviado correctamente. Te contactaremos pronto.", "exito");
			formulario.reset();
		});
	}

	function mostrarMensajeFormulario(texto, tipo) {
		mensajeFormulario.textContent = texto;
		mensajeFormulario.classList.remove("error", "exito");
		mensajeFormulario.classList.add(tipo);
	}

	// Inicialización de librería de animaciones al hacer scroll.
	if (window.AOS) {
		window.AOS.init({
			duration: 700,
			once: true,
			offset: 70,
			easing: "ease-out-cubic"
		});
	}

	// Configuración de Lightbox para la galería.
	if (window.lightbox) {
		window.lightbox.option({
			resizeDuration: 180,
			wrapAround: true,
			fadeDuration: 220,
			imageFadeDuration: 220,
			alwaysShowNavOnTouchDevices: true,
			disableScrolling: true
		});

		const TIEMPO_CIERRE_LIGHTBOX_MS = 12000;
		let cierreLightboxProgramado = null;

		const limpiarCierreProgramado = () => {
			if (cierreLightboxProgramado) {
				window.clearTimeout(cierreLightboxProgramado);
				cierreLightboxProgramado = null;
			}
		};

		const cerrarLightboxActivo = () => {
			const botonCerrar = document.querySelector("#lightbox .lb-close");
			if (botonCerrar) {
				botonCerrar.click();
			}
		};

		const programarCierreAutomatico = () => {
			limpiarCierreProgramado();
			cierreLightboxProgramado = window.setTimeout(() => {
				cerrarLightboxActivo();
			}, TIEMPO_CIERRE_LIGHTBOX_MS);
		};

		const overlayLightbox = document.getElementById("lightboxOverlay");
		const contenedorLightbox = document.getElementById("lightbox");

		if (overlayLightbox && contenedorLightbox) {
			let botonCerrarPersonalizado = contenedorLightbox.querySelector(".lb-boton-cerrar-personalizado");

			if (!botonCerrarPersonalizado) {
				botonCerrarPersonalizado = document.createElement("button");
				botonCerrarPersonalizado.type = "button";
				botonCerrarPersonalizado.className = "lb-boton-cerrar-personalizado";
				botonCerrarPersonalizado.setAttribute("aria-label", "Cerrar galería y volver al sitio");
				botonCerrarPersonalizado.textContent = "Cerrar";
				contenedorLightbox.appendChild(botonCerrarPersonalizado);
			}

			botonCerrarPersonalizado.addEventListener("click", () => {
				cerrarLightboxActivo();
			});

			overlayLightbox.addEventListener("click", () => {
				cerrarLightboxActivo();
			});

			contenedorLightbox.addEventListener("click", (event) => {
				const clickEnControl = event.target.closest(".lb-outerContainer, .lb-dataContainer, .lb-prev, .lb-next, .lb-close");
				if (!clickEnControl) {
					cerrarLightboxActivo();
				}

				if (event.target.closest(".lb-prev, .lb-next")) {
					programarCierreAutomatico();
				}
			});

			const observadorLightbox = new MutationObserver(() => {
				if (overlayLightbox.classList.contains("lb-visible")) {
					botonCerrarPersonalizado.classList.add("activo");
					programarCierreAutomatico();
				} else {
					botonCerrarPersonalizado.classList.remove("activo");
					limpiarCierreProgramado();
				}
			});

			observadorLightbox.observe(overlayLightbox, {
				attributes: true,
				attributeFilter: ["class"]
			});
		}
	}

	// Visor nativo de galería con botón de cierre siempre visible.
	const enlacesGaleria = document.querySelectorAll(".rejilla-galeria .imagen-galeria-media");
	if (enlacesGaleria.length > 0) {
		const visorOverlay = document.createElement("div");
		visorOverlay.className = "visor-galeria";
		visorOverlay.setAttribute("aria-hidden", "true");

		visorOverlay.innerHTML =
			'<div class="visor-galeria-contenido" role="dialog" aria-modal="true" aria-label="Imagen ampliada de galería">' +
			'<button type="button" class="visor-galeria-cerrar" aria-label="Cerrar imagen ampliada">Cerrar</button>' +
			'<img class="visor-galeria-imagen" src="" alt="" />' +
			"</div>";

		document.body.appendChild(visorOverlay);

		const visorImagen = visorOverlay.querySelector(".visor-galeria-imagen");
		const visorCerrar = visorOverlay.querySelector(".visor-galeria-cerrar");

		const cerrarVisorGaleria = () => {
			visorOverlay.classList.remove("activo");
			visorOverlay.setAttribute("aria-hidden", "true");
			document.body.classList.remove("visor-galeria-abierto");
		};

		enlacesGaleria.forEach((enlace) => {
			enlace.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();

				const imagen = enlace.querySelector("img");
				visorImagen.src = enlace.getAttribute("href") || "";
				visorImagen.alt = imagen ? imagen.alt : "Imagen ampliada";

				visorOverlay.classList.add("activo");
				visorOverlay.setAttribute("aria-hidden", "false");
				document.body.classList.add("visor-galeria-abierto");
			});
		});

		visorCerrar.addEventListener("click", cerrarVisorGaleria);

		visorOverlay.addEventListener("click", (event) => {
			if (event.target === visorOverlay) {
				cerrarVisorGaleria();
			}
		});

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && visorOverlay.classList.contains("activo")) {
				cerrarVisorGaleria();
			}
		});
	}

	// Títulos siempre visibles sobre cada imagen activa.
	const imagenesConTitulo = document.querySelectorAll("img[title]");
	imagenesConTitulo.forEach((imagen) => {
		const titulo = (imagen.getAttribute("title") || "").trim();
		if (!titulo) {
			return;
		}

		const contenedorObjetivos = imagen.closest(".objetivos-media");
		if (contenedorObjetivos) {
			const pie = contenedorObjetivos.querySelector("figcaption");
			if (pie) {
				pie.textContent = titulo;
				pie.classList.add("etiqueta-imagen", "etiqueta-imagen--figcaption");
				return;
			}
		}

		const contenedor =
			imagen.closest(".hero-media, .resena-media, .tarjeta-info-media, .integrante, .rejilla-galeria a") ||
			imagen.parentElement;

		if (!contenedor) {
			return;
		}

		contenedor.classList.add("imagen-etiquetada");

		if (contenedor.querySelector(".etiqueta-imagen")) {
			return;
		}

		const etiqueta = document.createElement("span");
		etiqueta.className = "etiqueta-imagen";
		if (contenedor.classList.contains("integrante")) {
			etiqueta.classList.add("etiqueta-imagen--compacta");
		}
		etiqueta.textContent = titulo;
		contenedor.appendChild(etiqueta);
	});

	// Movimiento reactivo de constelaciones al desplazarse por la página.
	if (decoracionLateral) {
		const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		const actualizarProgresoConstelaciones = (progresoGlobal) => {
			const progresoIzquierdo = progresoGlobal;
			const progresoDerecho = progresoGlobal;

			decoracionLateral.style.setProperty("--const-progress-left", progresoIzquierdo.toFixed(4));
			decoracionLateral.style.setProperty("--const-progress-right", progresoDerecho.toFixed(4));
		};

		if (!reducirMovimiento) {
			let enProceso = false;

			const actualizarDecoracion = () => {
				const desplazamiento = window.scrollY || window.pageYOffset || 0;
				const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
				const progreso = alturaTotal > 0 ? Math.min(Math.max(desplazamiento / alturaTotal, 0), 1) : 0;
				const inclinacion = progreso * 2 - 1;

				decoracionLateral.style.setProperty("--scroll-y", desplazamiento.toFixed(2));
				decoracionLateral.style.setProperty("--scroll-progress", progreso.toFixed(4));
				decoracionLateral.style.setProperty("--scroll-tilt", inclinacion.toFixed(4));
				actualizarProgresoConstelaciones(progreso);
				enProceso = false;
			};

			const alDesplazar = () => {
				if (!enProceso) {
					enProceso = true;
					window.requestAnimationFrame(actualizarDecoracion);
				}
			};

			actualizarDecoracion();
			window.addEventListener("scroll", alDesplazar, { passive: true });
			window.addEventListener("resize", alDesplazar);
		} else {
			const desplazamiento = window.scrollY || window.pageYOffset || 0;
			const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
			const progreso = alturaTotal > 0 ? Math.min(Math.max(desplazamiento / alturaTotal, 0), 1) : 0;
			actualizarProgresoConstelaciones(progreso);
		}
	}

	// Botón de retorno al inicio visible después del banner principal.
	if (botonVolverInicio) {
		const calcularUmbral = () => {
			if (!bannerPrincipal) {
				return 420;
			}
			return bannerPrincipal.offsetTop + bannerPrincipal.offsetHeight - 120;
		};

		let umbralVisible = calcularUmbral();

		const actualizarBotonInicio = () => {
			const mostrar = window.scrollY > umbralVisible;
			botonVolverInicio.classList.toggle("visible", mostrar);
		};

		botonVolverInicio.addEventListener("click", () => {
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		});

		window.addEventListener("scroll", actualizarBotonInicio, { passive: true });
		window.addEventListener("resize", () => {
			umbralVisible = calcularUmbral();
			actualizarBotonInicio();
		});

		actualizarBotonInicio();
	}
});