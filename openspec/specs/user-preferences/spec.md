# user-preferences Specification

## Purpose
Las preferencias del usuario permiten adaptar la aplicación a su gusto y contexto — duraciones, apariencia e idioma — y recordar esas elecciones entre visitas para ofrecer una experiencia consistente.
## Requirements
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

### Requirement: Modo oscuro y claro

El sistema SHALL permitir alternar entre modo oscuro y claro. El modo por defecto SHALL ser oscuro.

#### Scenario: Alternar apariencia

- **WHEN** el usuario alterna el modo de apariencia
- **THEN** la interfaz cambia entre oscuro y claro de inmediato

### Requirement: Selección de tema de color

El sistema SHALL ofrecer varios temas de color seleccionables (Neutral, Ocean, Forest, Sunset, Rose, Midnight). El tema por defecto SHALL ser Neutral, y cada tema SHALL tener variantes para modo claro y oscuro.

#### Scenario: Cambiar de tema

- **WHEN** el usuario selecciona un tema de color
- **THEN** los colores de acento, degradados y superficies de la interfaz se actualizan según ese tema

### Requirement: Idioma de la interfaz

El sistema SHALL permitir cambiar el idioma entre Español (`es`) e Inglés (`en`). El idioma por defecto SHALL ser Español.

#### Scenario: Cambiar idioma

- **WHEN** el usuario selecciona otro idioma
- **THEN** los textos de la interfaz se muestran en ese idioma

### Requirement: Persistencia de preferencias

El sistema SHALL persistir localmente en el navegador las duraciones, el modo de apariencia, el tema y el idioma, de modo que se restauren automáticamente en la siguiente visita.

#### Scenario: Restaurar preferencias tras recargar

- **WHEN** el usuario recarga la aplicación después de cambiar sus preferencias
- **THEN** las duraciones, la apariencia, el tema y el idioma se restauran a los últimos valores elegidos

### Requirement: Footer tematizado

El footer SHALL aplicar los colores del tema seleccionado —superficie/fondo, borde, texto y acentos— de forma coherente con el resto de la interfaz, y SHALL respetar el modo claro/oscuro activo. El contenido y la estructura del footer no cambian; solo su presentación visual sigue al tema.

#### Scenario: El footer sigue al tema seleccionado

- **WHEN** el usuario selecciona un tema de color
- **THEN** los colores del footer (fondo, borde, texto y acentos) se actualizan según ese tema, en línea con los demás paneles

#### Scenario: El footer respeta el modo claro/oscuro

- **WHEN** el usuario alterna entre modo claro y oscuro con un tema activo
- **THEN** el footer usa la variante de color correspondiente del tema, manteniendo un contraste legible del texto

### Requirement: Tarjetas Kanban tematizadas

Las tarjetas del tablero Kanban SHALL aplicar los colores del tema seleccionado —superficie/fondo, borde, texto y acentos— de forma coherente con el resto de la interfaz, y SHALL respetar el modo claro/oscuro activo. El texto de cada tarjeta SHALL mantener un contraste legible (mínimo WCAG AA, 4.5:1 para texto normal) contra su fondo en los seis temas y en ambos modos. El contenido, las acciones y el arrastrar-y-soltar de las tarjetas no cambian; solo su presentación visual sigue al tema.

#### Scenario: Las tarjetas siguen al tema seleccionado

- **WHEN** el usuario selecciona un tema de color
- **THEN** los colores de las tarjetas (fondo, borde, texto y acentos) se actualizan según ese tema, en línea con los demás paneles

#### Scenario: Contraste legible del texto de tarjeta

- **WHEN** una tarjeta se muestra en cualquiera de los seis temas y en modo claro u oscuro
- **THEN** el texto de la tarjeta mantiene un contraste de al menos 4.5:1 respecto a su fondo

#### Scenario: La tarjeta activa se distingue manteniendo contraste

- **WHEN** una tarjeta está seleccionada como activa
- **THEN** se resalta con acentos del tema y su texto conserva un contraste legible respecto a su fondo resaltado

