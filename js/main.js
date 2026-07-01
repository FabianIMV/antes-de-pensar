/* antes de pensar — lógica de la app (100% cliente, sin backend) */
(() => {
  'use strict';

  const STORAGE_KEY = 'antes-de-pensar:historial';
  const TIEMPO_CAPTURA = 45; // segundos

  const RECORDATORIOS_HONESTIDAD = [
    'Cuidado con el sesgo: es fácil ver coincidencias donde no las hay. Cuenta solo lo que anotaste ANTES, textual.',
    'Si tu nota decía "agua" y el blanco es un río, cuenta el acierto. Si decía "tristeza" y el blanco es una llama, no fuerces la conexión.',
    'El objetivo no es acumular aciertos. Es afinar tu discernimiento entre impresión genuina y ruido mental.',
    'Sé más duro contigo que generoso: la honestidad es el entrenamiento, no el resultado.',
    'No reescribas tu nota después de ver el blanco. Lo que ya anotaste, anotado queda.',
    'Una coincidencia vaga no es una coincidencia. Si dudas, no la cuentes.',
  ];

  const reducirMovimiento = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (sel) => document.querySelector(sel);

  /* ---------------- utilidades de azar (crypto) ---------------- */

  function indiceAleatorio(n) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % n;
  }

  function elegirTarget(evitarId) {
    if (TARGETS.length === 1) return TARGETS[0];
    let candidato;
    do {
      candidato = TARGETS[indiceAleatorio(TARGETS.length)];
    } while (candidato.id === evitarId);
    return candidato;
  }

  function elegirRecordatorio(evitarTexto) {
    if (RECORDATORIOS_HONESTIDAD.length === 1) return RECORDATORIOS_HONESTIDAD[0];
    let candidato;
    do {
      candidato = RECORDATORIOS_HONESTIDAD[indiceAleatorio(RECORDATORIOS_HONESTIDAD.length)];
    } while (candidato === evitarTexto);
    return candidato;
  }

  /* ---------------- estado de la ronda en curso ---------------- */

  const estado = {
    targetActual: null,
    ultimoTargetId: null,
    ultimoRecordatorio: null,
    captura: { palabra: '', temp: '', luz: '', movimiento: '', huboTrazo: false },
    evaluacion: { total: 0, marcados: 0 },
    temporizadorId: null,
  };

  /* ---------------- máquina de estados de pantallas ---------------- */

  function mostrarPantalla(id) {
    document.querySelectorAll('[data-pantalla]').forEach((el) => {
      const activa = el.id === id;
      el.dataset.activa = activa ? 'true' : 'false';
      el.classList.remove('pantalla-entrando');
    });
    const objetivo = document.getElementById(id);
    if (objetivo) {
      // forzar reflow para reiniciar la animación de entrada
      void objetivo.offsetWidth;
      objetivo.classList.add('pantalla-entrando');
      objetivo.scrollIntoView({ block: 'start', behavior: 'auto' });
      const foco = objetivo.querySelector('h1, h2');
      if (foco) {
        foco.setAttribute('tabindex', '-1');
        foco.focus({ preventScroll: true });
      }
    }
  }

  /* ---------------- preparación ---------------- */

  function iniciarPreparacion() {
    resetCaptura();
    mostrarPantalla('pantalla-preparacion');
    if (typeof gsap !== 'undefined' && !reducirMovimiento()) {
      gsap.fromTo(
        '#pantalla-preparacion .texto-preparacion',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.9, ease: 'power1.out' }
      );
    } else {
      document.querySelectorAll('#pantalla-preparacion .texto-preparacion').forEach((el) => {
        el.style.opacity = '1';
      });
    }
  }

  /* ---------------- captura ---------------- */

  let ctxCanvas = null;
  let dibujando = false;

  function resetCaptura() {
    estado.targetActual = elegirTarget(estado.ultimoTargetId);
    estado.captura = { palabra: '', temp: '', luz: '', movimiento: '', huboTrazo: false };

    $('#input-palabra').value = '';
    document.querySelectorAll('#pantalla-captura input[type="radio"]').forEach((r) => {
      r.checked = false;
    });
    limpiarCanvas();
  }

  function limpiarCanvas() {
    const canvas = $('#canvas-trazo');
    if (!ctxCanvas) ctxCanvas = canvas.getContext('2d');
    ctxCanvas.clearRect(0, 0, canvas.width, canvas.height);
    estado.captura.huboTrazo = false;
  }

  function posicionCanvas(evento, canvas) {
    const rect = canvas.getBoundingClientRect();
    const escalaX = canvas.width / rect.width;
    const escalaY = canvas.height / rect.height;
    return {
      x: (evento.clientX - rect.left) * escalaX,
      y: (evento.clientY - rect.top) * escalaY,
    };
  }

  function iniciarCanvas() {
    const canvas = $('#canvas-trazo');
    ctxCanvas = canvas.getContext('2d');
    ctxCanvas.strokeStyle = '#c9a6d9';
    ctxCanvas.lineWidth = 3;
    ctxCanvas.lineCap = 'round';
    ctxCanvas.lineJoin = 'round';

    canvas.addEventListener('pointerdown', (e) => {
      dibujando = true;
      estado.captura.huboTrazo = true;
      const p = posicionCanvas(e, canvas);
      ctxCanvas.beginPath();
      ctxCanvas.moveTo(p.x, p.y);
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!dibujando) return;
      const p = posicionCanvas(e, canvas);
      ctxCanvas.lineTo(p.x, p.y);
      ctxCanvas.stroke();
    });

    ['pointerup', 'pointercancel', 'pointerleave'].forEach((tipo) => {
      canvas.addEventListener(tipo, () => {
        dibujando = false;
      });
    });

    $('#btn-borrar-trazo').addEventListener('click', limpiarCanvas);
  }

  let segundosRestantes = TIEMPO_CAPTURA;

  function iniciarCaptura() {
    mostrarPantalla('pantalla-captura');
    segundosRestantes = TIEMPO_CAPTURA;
    actualizarTemporizador();
    detenerTemporizador();
    estado.temporizadorId = window.setInterval(() => {
      segundosRestantes -= 1;
      actualizarTemporizador();
      if (segundosRestantes <= 0) {
        detenerTemporizador();
        registrarImpresion();
      }
    }, 1000);
  }

  function detenerTemporizador() {
    if (estado.temporizadorId) {
      window.clearInterval(estado.temporizadorId);
      estado.temporizadorId = null;
    }
  }

  function actualizarTemporizador() {
    const pct = Math.max(0, (segundosRestantes / TIEMPO_CAPTURA) * 100);
    $('#captura-barra').style.width = `${pct}%`;
    $('#captura-tiempo').textContent = `${Math.max(0, segundosRestantes)}s`;
  }

  function valorRadioSeleccionado(grupo) {
    const el = document.querySelector(`input[name="${grupo}"]:checked`);
    return el ? el.value : '';
  }

  function registrarImpresion() {
    detenerTemporizador();
    estado.captura.palabra = $('#input-palabra').value.trim();
    estado.captura.temp = valorRadioSeleccionado('temp');
    estado.captura.luz = valorRadioSeleccionado('luz');
    estado.captura.movimiento = valorRadioSeleccionado('movimiento');
    estado.ultimoTargetId = estado.targetActual.id;
    mostrarRevelacion();
  }

  /* ---------------- revelación ---------------- */

  const ETIQUETA = {
    frio: 'Frío', calido: 'Cálido',
    oscuro: 'Oscuro', claro: 'Claro',
    quieto: 'Quieto', movimiento: 'En movimiento',
  };

  const NOMBRE_CATEGORIA = {
    paisaje: 'Paisaje', objeto: 'Objeto', textura: 'Textura', simbolo: 'Símbolo',
  };

  function celdaRecap(dt, valor) {
    const dtEl = document.createElement('dt');
    dtEl.textContent = dt;
    const ddEl = document.createElement('dd');
    if (valor) {
      ddEl.textContent = valor;
    } else {
      ddEl.textContent = 'sin dato';
      ddEl.classList.add('sin-dato');
    }
    return [dtEl, ddEl];
  }

  function mostrarRevelacion() {
    const t = estado.targetActual;

    $('#revelacion-imagen').src = t.src;
    $('#revelacion-imagen').alt = `Blanco revelado: ${t.nombre}`;
    $('#revelacion-nombre').textContent = t.nombre;
    $('#revelacion-categoria').textContent = NOMBRE_CATEGORIA[t.categoria] || t.categoria;

    const listaCualidades = $('#revelacion-cualidades');
    listaCualidades.innerHTML = '';
    t.cualidades.forEach((c) => {
      const li = document.createElement('li');
      li.textContent = c;
      listaCualidades.appendChild(li);
    });

    const recap = $('#revelacion-recap');
    recap.innerHTML = '';
    const filas = [
      ['Palabra', estado.captura.palabra],
      ['Temperatura', ETIQUETA[estado.captura.temp] || ''],
      ['Luz', ETIQUETA[estado.captura.luz] || ''],
      ['Movimiento', ETIQUETA[estado.captura.movimiento] || ''],
      ['Trazo', estado.captura.huboTrazo ? 'sí, hiciste un trazo' : ''],
    ];
    filas.forEach(([dt, valor]) => {
      const [dtEl, ddEl] = celdaRecap(dt, valor);
      recap.appendChild(dtEl);
      recap.appendChild(ddEl);
    });

    estado.ultimoRecordatorio = elegirRecordatorio(estado.ultimoRecordatorio);
    $('#revelacion-honestidad').textContent = estado.ultimoRecordatorio;

    mostrarPantalla('pantalla-revelacion');
  }

  /* ---------------- evaluación ---------------- */

  function construirListaEvaluacion() {
    const t = estado.targetActual;
    const lista = $('#evaluacion-lista');
    lista.innerHTML = '';
    let n = 0;

    function agregarItem(etiqueta, texto) {
      n += 1;
      const li = document.createElement('li');
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = `eval-item-${n}`;
      const span = document.createElement('span');
      span.className = 'item-texto';
      const strong = document.createElement('span');
      strong.className = 'item-etiqueta';
      strong.textContent = etiqueta;
      span.appendChild(strong);
      span.appendChild(document.createTextNode(texto));
      label.appendChild(input);
      label.appendChild(span);
      li.appendChild(label);
      lista.appendChild(li);
    }

    if (estado.captura.palabra) {
      agregarItem('Tu palabra', `"${estado.captura.palabra}" — ¿resuena de verdad con "${t.nombre}"?`);
    }
    if (estado.captura.temp) {
      agregarItem('Temperatura', `Anotaste "${ETIQUETA[estado.captura.temp]}". El blanco es "${ETIQUETA[t.temp]}".`);
    }
    if (estado.captura.luz) {
      agregarItem('Luz', `Anotaste "${ETIQUETA[estado.captura.luz]}". El blanco es "${ETIQUETA[t.luz]}".`);
    }
    if (estado.captura.movimiento) {
      agregarItem('Movimiento', `Anotaste "${ETIQUETA[estado.captura.movimiento]}". El blanco es "${ETIQUETA[t.movimiento]}".`);
    }
    t.cualidades.forEach((c) => {
      agregarItem('Cualidad', `¿Tu impresión tenía algo de "${c}"?`);
    });

    estado.evaluacion.total = n;
  }

  function irAEvaluacion() {
    construirListaEvaluacion();
    estado.ultimoRecordatorio = elegirRecordatorio(estado.ultimoRecordatorio);
    $('#evaluacion-honestidad').textContent = estado.ultimoRecordatorio;
    $('#input-nota').value = '';
    mostrarPantalla('pantalla-evaluacion');
  }

  function guardarRonda() {
    const marcados = document.querySelectorAll('#evaluacion-lista input[type="checkbox"]:checked').length;
    const total = estado.evaluacion.total || 1;
    const tasa = Math.round((marcados / total) * 100);

    const entrada = {
      timestamp: Date.now(),
      targetId: estado.targetActual.id,
      targetNombre: estado.targetActual.nombre,
      targetCategoria: estado.targetActual.categoria,
      palabra: estado.captura.palabra,
      marcados,
      total,
      tasa,
      nota: $('#input-nota').value.trim(),
    };

    guardarEnHistorial(entrada);

    $('#cierre-resumen').textContent =
      `${marcados} de ${total} elementos resonaron de verdad — ${tasa}%.`;

    mostrarPantalla('pantalla-cierre');
  }

  /* ---------------- historial (localStorage) ---------------- */

  function leerHistorial() {
    try {
      const crudo = window.localStorage.getItem(STORAGE_KEY);
      return crudo ? JSON.parse(crudo) : [];
    } catch (e) {
      return [];
    }
  }

  function guardarEnHistorial(entrada) {
    const historial = leerHistorial();
    historial.push(entrada);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
    } catch (e) {
      /* localStorage no disponible: la ronda actual sigue funcionando sin persistir */
    }
  }

  const formateadorFecha = new Intl.DateTimeFormat('es', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  function renderHistorial() {
    const historial = leerHistorial().slice().reverse();
    const lista = $('#historial-lista');
    const vacio = $('#historial-vacio');
    const resumen = $('#historial-resumen');
    lista.innerHTML = '';

    if (historial.length === 0) {
      vacio.hidden = false;
      resumen.hidden = true;
      return;
    }

    vacio.hidden = true;
    resumen.hidden = false;

    const promedio = Math.round(
      historial.reduce((acc, r) => acc + r.tasa, 0) / historial.length
    );
    resumen.innerHTML = `<strong>${promedio}%</strong>resonancia promedio en ${historial.length} ronda${historial.length === 1 ? '' : 's'}`;

    historial.forEach((ronda) => {
      const li = document.createElement('li');
      li.className = 'historial-item';

      const encabezado = document.createElement('div');
      encabezado.className = 'historial-item-encabezado';
      const fecha = document.createElement('span');
      fecha.textContent = formateadorFecha.format(new Date(ronda.timestamp));
      const nombre = document.createElement('span');
      nombre.textContent = ronda.targetNombre;
      encabezado.appendChild(fecha);
      encabezado.appendChild(nombre);

      const barra = document.createElement('div');
      barra.className = 'historial-item-barra';
      const relleno = document.createElement('span');
      relleno.style.width = `${ronda.tasa}%`;
      barra.appendChild(relleno);

      const detalle = document.createElement('p');
      detalle.className = 'historial-item-nota';
      detalle.textContent = `${ronda.marcados}/${ronda.total} resonaron (${ronda.tasa}%)`;

      li.appendChild(encabezado);
      li.appendChild(barra);
      li.appendChild(detalle);

      if (ronda.nota) {
        const nota = document.createElement('p');
        nota.className = 'historial-item-nota';
        nota.textContent = `“${ronda.nota}”`;
        li.appendChild(nota);
      }

      lista.appendChild(li);
    });
  }

  function irAHistorial() {
    renderHistorial();
    mostrarPantalla('pantalla-historial');
  }

  function borrarHistorial() {
    const confirmado = window.confirm(
      '¿Borrar todo tu historial guardado en este navegador? Esta acción no se puede deshacer.'
    );
    if (!confirmado) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* nada que hacer si localStorage no está disponible */
    }
    renderHistorial();
  }

  /* ---------------- Lenis (scroll suave), respeta reduced-motion ---------------- */

  function iniciarLenis() {
    if (reducirMovimiento() || typeof Lenis === 'undefined') return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ---------------- eventos ---------------- */

  function inicializar() {
    iniciarCanvas();
    iniciarLenis();

    $('#btn-comenzar').addEventListener('click', iniciarPreparacion);
    $('#btn-listo').addEventListener('click', iniciarCaptura);
    $('#btn-registrar').addEventListener('click', registrarImpresion);
    $('#btn-continuar-evaluacion').addEventListener('click', irAEvaluacion);
    $('#btn-guardar-ronda').addEventListener('click', guardarRonda);
    $('#btn-otra-ronda').addEventListener('click', iniciarPreparacion);
    $('#btn-cierre-historial').addEventListener('click', irAHistorial);
    $('#btn-nueva-ronda-historial').addEventListener('click', iniciarPreparacion);
    $('#btn-borrar-historial').addEventListener('click', borrarHistorial);
    $('#nav-historial').addEventListener('click', irAHistorial);

    const historialPrevio = leerHistorial();
    if (historialPrevio.length > 0) {
      const meta = $('#inicio-meta');
      meta.hidden = false;
      const promedio = Math.round(
        historialPrevio.reduce((acc, r) => acc + r.tasa, 0) / historialPrevio.length
      );
      meta.textContent = `Ya registraste ${historialPrevio.length} ronda${historialPrevio.length === 1 ? '' : 's'} — ${promedio}% de resonancia promedio.`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
  } else {
    inicializar();
  }
})();
