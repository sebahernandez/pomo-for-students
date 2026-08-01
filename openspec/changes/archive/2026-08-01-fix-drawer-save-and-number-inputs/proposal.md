## Why

El panel de Configuración (drawer) enlaza sus campos numéricos directamente a números con `Number(e.target.value)`. Cuando el usuario borra un campo o escribe un valor parcial, el valor se convierte en `0` o `NaN`, quedando fuera del rango permitido y produciendo duraciones inválidas al guardar (por ejemplo, un temporizador de 0 minutos). Como consecuencia, el botón "Guardar" puede persistir valores incorrectos y la experiencia de edición es frágil.

## What Changes

- Los campos numéricos del drawer de Configuración (Enfoque, Descanso Corto, Descanso Largo) SHALL mantenerse como **texto (string)** en el estado local mientras se editan, permitiendo campos vacíos o parciales sin corromper el valor.
- Al pulsar "Guardar", los valores de texto SHALL **transformarse y validarse**: se parsean a entero, se recortan (clamp) al rango permitido de cada campo, y si un valor es inválido/vacío se conserva el valor previo (o el valor por defecto) en lugar de guardar `0`/`NaN`.
- El botón "Guardar" SHALL persistir las duraciones ya validadas (aplicándolas al temporizador), manteniendo el comportamiento actual de **no cerrar** el panel al aplicar.
- Tras validar, los campos de texto SHALL reflejar los valores normalizados guardados, de modo que el usuario vea exactamente lo que quedó persistido.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `user-preferences`: se refina el requisito "Configuración de duraciones" para especificar que los campos numéricos se editan como texto y que al guardar se validan y normalizan (parseo, clamp al rango, y descarte de valores inválidos conservando el valor previo), garantizando que "Guardar" solo persista duraciones válidas.

## Impact

- `src/components/SettingsPanel.tsx`: estado del formulario pasa de `Settings` (números) a strings por campo; nueva lógica de validación/normalización en el submit.
- `src/context/AppContext.tsx`: sin cambios de firma; `updateSettings` sigue recibiendo un `Settings` ya validado (numérico).
- `src/test/Drawer.test.tsx`: se añaden casos para validación de entrada (vacío, fuera de rango) y confirmación de guardado.
- Sin cambios en almacenamiento persistente ni en la API pública del store.
