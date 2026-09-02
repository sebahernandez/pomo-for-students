# weekly-streak Specification

## Purpose
La racha semanal registra los días consecutivos en que el usuario completa al menos un pomodoro de Enfoque, motivando la constancia mediante un contador de racha actual, un récord histórico y una vista de la semana actual.

## Requirements

### Requirement: Registro de día activo

El sistema SHALL definir una meta diaria fija de 5 pomodoros de Enfoque. Cuando una sesión de Enfoque se completa, el sistema SHALL incrementar el conteo de sesiones del día calendario local correspondiente. Un día SHALL considerarse activo para la racha únicamente cuando su conteo alcanza la meta diaria (5). Los descansos NO SHALL contar como sesiones. Alcanzar la meta SHALL actualizar la racha como máximo una vez por día; las sesiones adicionales tras alcanzar la meta NO SHALL alterar la racha.

#### Scenario: Primer pomodoro del día

- **WHEN** el usuario completa el primer pomodoro de Enfoque de un día
- **THEN** el conteo de sesiones del día se incrementa pero, al estar por debajo de la meta, el día no se marca como activo y la racha no cambia

#### Scenario: Pomodoro adicional el mismo día

- **WHEN** el usuario completa otro pomodoro de Enfoque el mismo día sin haber alcanzado aún la meta
- **THEN** el conteo del día se incrementa y la racha permanece sin cambios

#### Scenario: Se alcanza la meta diaria

- **WHEN** el usuario completa el quinto pomodoro de Enfoque de un día
- **THEN** el día se marca como activo y la racha actual se actualiza según la continuidad con el día activo anterior

#### Scenario: Sesiones adicionales tras la meta

- **WHEN** el usuario completa un sexto o posterior pomodoro de Enfoque el mismo día ya cumplido
- **THEN** la racha actual no cambia y el día permanece marcado como activo

#### Scenario: Descanso completado

- **WHEN** una sesión de Descanso finaliza
- **THEN** no se incrementa el conteo de ningún día ni se altera la racha

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

El sistema SHALL mostrar los siete días de la semana en curso, de lunes a domingo, indicando para cada uno si alcanzó la meta diaria y cuál corresponde al día de hoy.

#### Scenario: Días de la semana marcados

- **WHEN** el usuario visualiza la vista semanal
- **THEN** cada día que alcanzó la meta de 5 sesiones esa semana aparece marcado como cumplido, el día actual se distingue de los demás y los días que no alcanzaron la meta aparecen sin marcar

### Requirement: Persistencia de la racha

El sistema SHALL persistir el estado de la racha en el almacenamiento local del navegador, de forma independiente al historial de sesiones, y SHALL tolerar un almacenamiento no disponible o datos corruptos sin interrumpir la aplicación.

#### Scenario: Persistencia entre sesiones

- **WHEN** el usuario cierra y vuelve a abrir la aplicación
- **THEN** la racha actual, la racha récord y los días activos recientes se restauran desde el almacenamiento local

#### Scenario: Almacenamiento no disponible o corrupto

- **WHEN** el almacenamiento local no está disponible o contiene datos inválidos
- **THEN** la aplicación continúa funcionando partiendo de un estado de racha vacío, sin lanzar errores

### Requirement: Presentación de la tarjeta de racha

El sistema SHALL presentar una tarjeta de racha dentro del panel de Historial de Sesiones que muestre la racha actual con un indicador visual de racha, la vista de los días de la semana y el progreso del día en curso hacia la meta diaria. Los textos SHALL respetar el idioma seleccionado (español o inglés).

#### Scenario: Ver la racha en el historial

- **WHEN** el usuario abre el panel de Historial de Sesiones
- **THEN** ve la tarjeta de racha con el contador de racha actual, la fila de días de la semana y el progreso del día hacia la meta (por ejemplo, sesiones completadas hoy sobre la meta), en el idioma activo

#### Scenario: Progreso del día en curso

- **WHEN** el usuario ha completado algunas sesiones hoy pero aún no alcanza la meta
- **THEN** la tarjeta indica cuántas sesiones lleva respecto a la meta diaria
