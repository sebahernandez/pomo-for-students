## Purpose

La racha semanal registra los días consecutivos en que el usuario completa al menos un pomodoro de Enfoque, motivando la constancia mediante un contador de racha actual, un récord histórico y una vista de la semana actual.

## ADDED Requirements

### Requirement: Registro de día activo

Cuando una sesión de Enfoque se completa, el sistema SHALL marcar el día calendario local correspondiente como activo. Los descansos NO SHALL contar como actividad. Completar múltiples pomodoros en un mismo día NO SHALL incrementar la racha más de una vez.

#### Scenario: Primer pomodoro del día

- **WHEN** el usuario completa un pomodoro de Enfoque en un día que aún no estaba marcado como activo
- **THEN** el día se marca como activo y la racha actual se actualiza según la continuidad con el día anterior

#### Scenario: Pomodoro adicional el mismo día

- **WHEN** el usuario completa un segundo pomodoro de Enfoque el mismo día ya marcado como activo
- **THEN** la racha actual no cambia y el día permanece marcado como activo

#### Scenario: Descanso completado

- **WHEN** una sesión de Descanso finaliza
- **THEN** no se marca ningún día como activo ni se altera la racha

### Requirement: Cálculo de racha consecutiva

El sistema SHALL calcular la racha actual como el número de días calendario consecutivos con actividad que terminan en el día activo más reciente. Cuando un día activo es contiguo al día activo anterior, la racha SHALL incrementarse; cuando existe uno o más días sin actividad entre ambos, la racha SHALL reiniciarse a 1.

#### Scenario: Día consecutivo

- **WHEN** el usuario tiene actividad un día y vuelve a tener actividad al día siguiente
- **THEN** la racha actual aumenta en 1

#### Scenario: Interrupción de la racha

- **WHEN** el usuario tiene actividad, deja pasar uno o más días sin actividad y luego vuelve a completar un pomodoro
- **THEN** la racha actual se reinicia a 1

### Requirement: Racha récord

El sistema SHALL conservar la racha más larga alcanzada. Cuando la racha actual supera el récord previo, el récord SHALL actualizarse; cuando la racha actual se reinicia, el récord SHALL conservarse sin cambios.

#### Scenario: Nuevo récord

- **WHEN** la racha actual supera la racha récord previa
- **THEN** la racha récord se actualiza al nuevo valor

#### Scenario: Récord preservado tras interrupción

- **WHEN** la racha actual se reinicia por falta de actividad
- **THEN** la racha récord conserva el valor máximo alcanzado anteriormente

### Requirement: Reevaluación al cargar la aplicación

Al iniciar la aplicación, el sistema SHALL reevaluar la racha actual contra la fecha vigente. Si el día activo más reciente no es ni el día actual ni el día inmediatamente anterior, la racha actual visible SHALL pasar a 0 sin alterar la racha récord.

#### Scenario: Racha vigente al abrir

- **WHEN** el usuario abre la app y su último día activo es hoy o ayer
- **THEN** la racha actual se conserva

#### Scenario: Racha caducada al abrir

- **WHEN** el usuario abre la app tras dos o más días sin actividad
- **THEN** la racha actual se muestra como 0 y la racha récord permanece intacta

### Requirement: Vista de la semana actual

El sistema SHALL mostrar los siete días de la semana en curso, de lunes a domingo, indicando para cada uno si tuvo actividad y cuál corresponde al día de hoy.

#### Scenario: Días de la semana marcados

- **WHEN** el usuario visualiza la vista semanal
- **THEN** cada día con al menos un pomodoro completado esa semana aparece marcado como completado, el día actual se distingue de los demás y los días sin actividad aparecen sin marcar

### Requirement: Persistencia de la racha

El sistema SHALL persistir el estado de la racha en el almacenamiento local del navegador, de forma independiente al historial de sesiones, y SHALL tolerar un almacenamiento no disponible o datos corruptos sin interrumpir la aplicación.

#### Scenario: Persistencia entre sesiones

- **WHEN** el usuario cierra y vuelve a abrir la aplicación
- **THEN** la racha actual, la racha récord y los días activos recientes se restauran desde el almacenamiento local

#### Scenario: Almacenamiento no disponible o corrupto

- **WHEN** el almacenamiento local no está disponible o contiene datos inválidos
- **THEN** la aplicación continúa funcionando partiendo de un estado de racha vacío, sin lanzar errores

### Requirement: Presentación de la tarjeta de racha

El sistema SHALL presentar una tarjeta de racha dentro del panel de Historial de Sesiones que muestre la racha actual con un indicador visual de racha, y la vista de los días de la semana. Los textos SHALL respetar el idioma seleccionado (español o inglés).

#### Scenario: Ver la racha en el historial

- **WHEN** el usuario abre el panel de Historial de Sesiones
- **THEN** ve la tarjeta de racha con el contador de racha actual y la fila de días de la semana, en el idioma activo
