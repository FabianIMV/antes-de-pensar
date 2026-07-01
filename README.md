# antes de pensar

Un ejercicio breve, en español, de **primera impresión**: registrás lo primero
que asoma —una palabra, una temperatura, un movimiento— *antes* de ver un
blanco oculto, y después evaluás con honestidad qué resonó de verdad.

Se inspira en los protocolos de "primera impresión" de la visión remota y el
*thin-slicing* (juicio rápido, previo al análisis), y en la idea de Bardon de
un lenguaje-imagen que habla directo al subconsciente. **No afirma poderes
psíquicos ni predice nada.** Es entrenamiento de atención: aprender a
distinguir el destello genuino del relleno que la mente agrega después.

Sitio 100% estático, sin backend, sin login, sin analítica. Todo corre en el
navegador; el historial se guarda solo en `localStorage` del dispositivo.

## Cómo funciona una ronda

1. **Preparación** — pantalla oscura, un punto de luz, respirar y aquietar.
2. **Blanco oculto** — el sitio elige al azar (con `crypto.getRandomValues`,
   no `Math.random`) un blanco del pool, pero no lo muestra todavía.
3. **Captura** — 45 segundos para anotar una palabra, tres cualidades
   sensoriales (temperatura, luz, movimiento) y, opcionalmente, un trazo
   libre en un lienzo pequeño. El tiempo corto fuerza lo pre-analítico.
4. **Revelación** — se muestra el blanco, su nombre y sus cualidades, junto a
   un recordatorio rotativo contra el sesgo de confirmación.
5. **Auto-evaluación** — marcás, honestamente, qué elementos de tu impresión
   resonaron de verdad con lo que ya habías anotado (no con lo que te
   gustaría que coincidiera).
6. **Historial** — la tasa de resonancia de cada ronda y una nota opcional
   quedan guardadas en tu navegador. Podés ver la evolución o borrar todo.

## Publicar en GitHub Pages

1. Subí este repositorio a GitHub (o hacé fork/clone del que ya tenés).
2. En GitHub: **Settings → Pages**.
3. En "Build and deployment" elegí **Deploy from a branch**.
4. Elegí la branch (por ejemplo `main`) y la carpeta **/ (root)**.
5. Guardá. GitHub publicará el sitio en unos minutos en
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`.

Las etiquetas `og:url`, `og:image` y `twitter:image` en `index.html` están
apuntando a `https://fabianimv.github.io/antes-de-pensar/`. Si publicás el
sitio bajo otro usuario o nombre de repositorio, actualizá esas tres líneas
en el `<head>` con la URL real, así las vistas previas en redes sociales
muestran la imagen correcta.

No hay build step: es HTML/CSS/JS servidos tal cual. Si querés probarlo en
local antes de publicar, alcanza con levantar un servidor estático desde la
raíz del repo, por ejemplo:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

(Abrir `index.html` directamente con `file://` también funciona, salvo que tu
navegador bloquee `fetch`/módulos locales por CORS; un servidor estático evita
ese problema.)

## Cómo agregar o editar blancos del pool

El pool vive en dos lugares:

- **Imágenes**: `assets/img/targets/*.svg` (podés usar PNG o JPG también).
  Se recomienda arte simple y evocador —paisajes, objetos, texturas,
  arquetipos o símbolos— porque el objetivo es una impresión de cualidades
  (frío/cálido, quieto/en movimiento), no reconocer una foto realista.
- **Metadatos**: `js/targets.js`, un array `TARGETS` con un objeto por
  blanco.

Para agregar un blanco nuevo:

1. Poné el archivo de imagen en `assets/img/targets/`.
2. Agregá un objeto al array `TARGETS` en `js/targets.js`:

```js
{
  id: 'nombre-unico',              // string único, sin espacios
  categoria: 'paisaje',            // 'paisaje' | 'objeto' | 'textura' | 'simbolo'
  nombre: 'Nombre visible',        // se muestra en la revelación
  src: 'assets/img/targets/nombre-unico.svg',
  temp: 'frio',                    // 'frio' | 'calido'
  luz: 'claro',                    // 'oscuro' | 'claro'
  movimiento: 'quieto',            // 'quieto' | 'movimiento'
  cualidades: ['vertical', 'abierto', 'natural', 'antiguo'], // 3-5 palabras
}
```

Los tres ejes (`temp`, `luz`, `movimiento`) son los mismos que se le piden al
usuario en la captura, así que la app puede comparar lo anotado contra el
blanco real. `cualidades` son palabras descriptivas libres que aparecen en la
revelación y en la lista de auto-evaluación.

No hay mínimo ni máximo de blancos: con que `TARGETS` tenga al menos uno, el
sitio funciona. Cuantos más variados (categoría, ejes, cualidades), más rico
el entrenamiento.

## Honestidad, no puntaje

El sitio no calcula "aciertos paranormales": la auto-evaluación es manual y
a conciencia. Los recordatorios rotativos en la revelación y en la
evaluación existen para eso — cuentan solo lo que ya estaba anotado antes de
ver el blanco, textual, sin forzar coincidencias vagas.

## Privacidad

No hay backend, cuentas ni analítica. El historial de rondas (tasa de
resonancia, nombre del blanco, nota opcional) se guarda únicamente en el
`localStorage` de tu navegador y se puede borrar en cualquier momento desde
la vista de Historial.

## Stack

- HTML/CSS/JS puro, sin build step.
- [GSAP](https://gsap.com/) para las transiciones deliberadas entre
  pantallas y [Lenis](https://lenis.darkroom.engineering/) para scroll suave
  (ambos vía CDN; se omiten automáticamente si el usuario tiene activado
  `prefers-reduced-motion`).
- Tipografías Fraunces / Cormorant Garamond (serif, títulos y voz interior)
  + Inter (sans, interfaz).
- Paleta oscura (`#0a0c18`) consistente con el resto de la serie.

## Otras piezas de la serie

- [mente-clara](https://fabianimv.github.io/mente-clara/)
- [señal o ruido](https://fabianimv.github.io/senal-o-ruido/)
