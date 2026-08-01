## MODIFIED Requirements

### Requirement: Configuración de duraciones

El sistema SHALL permitir ajustar las duraciones en minutos de Enfoque, Descanso Corto y Descanso Largo. Durante la edición, cada campo numérico SHALL comportarse como un campo de texto que acepta un valor vacío o parcial sin corromper la configuración guardada. Al guardar, el sistema SHALL transformar y validar cada valor ingresado: parsearlo a un entero y recortarlo (clamp) al rango permitido del campo; si el valor es vacío o inválido, SHALL conservar el valor previamente guardado en lugar de persistir `0` o un valor no numérico. Solo se persisten duraciones válidas dentro de rango.

Al guardar nuevas duraciones, el temporizador SHALL recargar el tiempo del modo actual y quedar inactivo, y los campos SHALL reflejar los valores normalizados que quedaron persistidos. Guardar nuevas duraciones NO SHALL cerrar el panel de Configuración; el panel permanece abierto para que el usuario confirme el cambio o siga ajustando.

#### Scenario: Guardar nuevas duraciones

- **WHEN** el usuario ingresa duraciones válidas y guarda en la configuración
- **THEN** las duraciones se aplican a los modos correspondientes
- **AND** el temporizador se recarga con la duración del modo actual en estado inactivo
- **AND** los campos muestran los valores normalizados guardados
- **AND** el panel de configuración permanece abierto

#### Scenario: Editar un campo dejándolo vacío o parcial

- **WHEN** el usuario borra el contenido de un campo numérico o escribe un valor parcial
- **THEN** el campo permite quedar vacío o parcial mientras se edita
- **AND** no se corrompe la configuración guardada mientras el usuario no guarda

#### Scenario: Guardar con un valor vacío o inválido

- **WHEN** el usuario deja un campo vacío o con un valor no numérico y pulsa Guardar
- **THEN** ese campo conserva el valor previamente guardado (o el valor por defecto)
- **AND** no se persiste `0` ni un valor no numérico para ese campo

#### Scenario: Guardar con un valor fuera de rango

- **WHEN** el usuario ingresa un número por debajo del mínimo o por encima del máximo permitido y pulsa Guardar
- **THEN** el valor se recorta al límite del rango correspondiente antes de persistirse
- **AND** el campo muestra el valor recortado que quedó guardado
