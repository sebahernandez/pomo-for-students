## MODIFIED Requirements

### Requirement: Registro de día activo

El sistema SHALL definir una meta diaria fija de 5 actividades de progreso. Cuentan como actividad de progreso tanto completar una sesión de Enfoque (pomodoro) como marcar una tarea como Hecho. Cuando ocurre una actividad de progreso, el sistema SHALL incrementar el conteo del día calendario local correspondiente. Un día SHALL considerarse activo para la racha únicamente cuando su conteo alcanza la meta diaria (5). Los descansos NO SHALL contar como actividad. Marcar una tarea como Hecho SHALL contar solo en la transición entrante a Hecho (re-marcar o re-arrastrar una tarea ya Hecha NO SHALL contar de nuevo). Alcanzar la meta SHALL actualizar la racha como máximo una vez por día; las actividades adicionales tras alcanzar la meta NO SHALL alterar la racha.

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

#### Scenario: Tarea marcada como Hecho

- **WHEN** el usuario mueve una tarea a Hecho desde otro estado
- **THEN** el conteo del día se incrementa igual que al completar un pomodoro

#### Scenario: Tarea ya Hecha re-marcada

- **WHEN** el usuario vuelve a marcar o arrastrar una tarea que ya estaba en Hecho
- **THEN** el conteo del día no se incrementa
