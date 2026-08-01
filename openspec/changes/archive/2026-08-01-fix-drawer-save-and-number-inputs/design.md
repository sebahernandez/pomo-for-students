## Context

Ver `proposal.md` — Why. `SettingsPanel.tsx` mantiene `form: Settings` (números) y en cada `onChange` hace `Number(e.target.value)`, lo que convierte campos vacíos/parciales en `0`/`NaN`. El store (`AppContext.updateSettings`) espera un `Settings` numérico y ya persiste + recarga el temporizador. Los rangos por campo hoy viven como atributos HTML `min`/`max` en el JSX: Enfoque `1–60`, Descanso Corto `1–30`, Descanso Largo `1–60`.

## Goals / Non-Goals

**Goals:**
- Editar los campos numéricos como texto sin corromper la configuración guardada.
- Validar y normalizar (parseo + clamp) al guardar, descartando valores inválidos.
- Mantener intacta la API del store y el comportamiento de "no cerrar al aplicar".

**Non-Goals:**
- Cambiar el tipo `Settings` o la firma de `updateSettings`.
- Rediseñar otros campos numéricos ya basados en string (`TimerCard`, `Card` de foco).
- Validación en vivo por tecla (mensajes de error inline); la validación ocurre al guardar.

## Decisions

- **Estado del formulario como strings.** Cambiar `useState<Settings>` por un estado de strings por campo (p. ej. `{ work: string; shortBreak: string; longBreak: string }`), inicializado desde `settings` con `String(...)`. `onChange` guarda `e.target.value` sin transformar. Alternativa descartada: mantener números y solo cambiar el submit — no resuelve el campo vacío/parcial durante la edición (el input seguiría mostrando `0`).
- **Input de texto con teclado numérico, no `type="number"`.** Usar `type="text"` con `inputMode="numeric"` en lugar de `type="number"`. Motivo (descubierto durante la implementación): con `type="number"` + atributos `min`/`max`, un valor fuera de rango queda `rangeOverflow`-inválido y la validación nativa del formulario **bloquea el submit**, por lo que la lógica de clamp al guardar nunca se ejecuta justamente en el caso que debe manejar; además `type="number"` sanea entradas inválidas a `''`. Con `type="text"` el navegador no valida ni sanea, y nuestro código posee por completo el parseo/clamp/validación — que es exactamente lo que pide el requisito ("ingresados como string y luego transformados/validados"). Los límites de rango dejan de vivir como atributos HTML y pasan a ser solo datos de la tabla de campos usados por el clamp.
- **Rangos como fuente única.** Definir una tabla local de campos `{ key, min, max }` usada por el clamp en submit (y para comunicar el rango en la UI si se desea), evitando divergencias entre presentación y lógica.
- **Helper de normalización.** Una función pura `normalize(value: string, min, max, fallback): number` que: `parseInt` en base 10; si `NaN` → `fallback` (valor previo guardado); si válido → `Math.min(max, Math.max(min, n))`. En el submit se construye el `Settings` numérico aplicando `normalize` por campo con `settings[key]` como fallback, se llama `updateSettings(normalized)` y se re-sincroniza el estado de strings con los valores normalizados (para que los campos reflejen lo persistido).
- **Reutilización del render.** Renderizar los tres campos mapeando la tabla de campos en lugar de tres bloques JSX duplicados, reduciendo la superficie de error.

## Risks / Trade-offs

- [El usuario no ve por qué su valor "saltó" al recortarse] → Aceptable: los atributos `min`/`max` ya comunican el rango; re-sincronizar el input al valor guardado hace visible el resultado inmediatamente.
- [Regla de fallback al valor previo podría sorprender si el usuario esperaba el default] → El valor previo guardado es el comportamiento menos destructivo; los defaults solo aplican cuando no hay valor previo (primera carga usa los defaults del store).

## Migration Plan

Cambio puramente de UI en un componente; sin migración de datos ni de almacenamiento. Rollback = revertir el commit.
