# user-preferences Specification

## Purpose
Las preferencias del usuario permiten adaptar la aplicación a su gusto y contexto — duraciones, apariencia e idioma — y recordar esas elecciones entre visitas para ofrecer una experiencia consistente.
## Requirements
### Requirement: Configuración de duraciones

El sistema SHALL permitir ajustar las duraciones en minutos de Enfoque, Descanso Corto y Descanso Largo. Durante la edición, cada campo numérico SHALL comportarse como un campo de texto que acepta un valor vacío o parcial sin corromper la configuración guardada. Al guardar, el sistema SHALL transformar y validar cada valor ingresado: parsearlo a un entero y recortarlo (clamp) al rango permitido del campo; si el valor es vacío o inválido, SHALL conservar el valor previamente guardado en lugar de persistir `0` o un valor no numérico. Solo se persisten duraciones válidas dentro de rango.

Al guardar nuevas duraciones, el temporizador SHALL recargar el tiempo del modo actual y quedar inactivo. Tras aplicar y normalizar los valores, el panel de Configuración SHALL cerrarse, dando una confirmación clara de que la acción se completó.

#### Scenario: Guardar nuevas duraciones

- **WHEN** el usuario ingresa duraciones válidas y guarda en la configuración
- **THEN** las duraciones se aplican a los modos correspondientes
- **AND** el temporizador se recarga con la duración del modo actual en estado inactivo
- **AND** el panel de configuración se cierra

#### Scenario: Editar un campo dejándolo vacío o parcial

- **WHEN** el usuario borra el contenido de un campo numérico o escribe un valor parcial
- **THEN** el campo permite quedar vacío o parcial mientras se edita
- **AND** no se corrompe la configuración guardada mientras el usuario no guarda

#### Scenario: Guardar con un valor vacío o inválido

- **WHEN** el usuario deja un campo vacío o con un valor no numérico y pulsa Guardar
- **THEN** ese campo conserva el valor previamente guardado (o el valor por defecto)
- **AND** no se persiste `0` ni un valor no numérico para ese campo
- **AND** el panel de configuración se cierra con la configuración válida aplicada

#### Scenario: Guardar con un valor fuera de rango

- **WHEN** el usuario ingresa un número por debajo del mínimo o por encima del máximo permitido y pulsa Guardar
- **THEN** el valor se recorta al límite del rango correspondiente antes de persistirse
- **AND** el panel de configuración se cierra con el valor recortado ya guardado

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

El conmutador de idioma SHALL mostrar como etiqueta el código del idioma **de destino** —el idioma al que cambiará al pulsarlo—, no el idioma activo. Es decir, con la interfaz en inglés la etiqueta SHALL ser "ES", y con la interfaz en español la etiqueta SHALL ser "EN". La etiqueta se muestra en mayúsculas.

#### Scenario: Cambiar idioma

- **WHEN** el usuario selecciona otro idioma
- **THEN** los textos de la interfaz se muestran en ese idioma

#### Scenario: Etiqueta del conmutador con la app en inglés

- **WHEN** el idioma activo es Inglés (`en`)
- **THEN** el botón de cambio de idioma muestra la etiqueta "ES"

#### Scenario: Etiqueta del conmutador con la app en español

- **WHEN** el idioma activo es Español (`es`)
- **THEN** el botón de cambio de idioma muestra la etiqueta "EN"

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

### Requirement: Texto secundario y atenuado tematizado

El texto secundario y atenuado de la interfaz (etiquetas, subtítulos, metadatos, textos de ayuda y estados vacíos) SHALL seguir el tema de color seleccionado en lugar de usar un gris fijo, y SHALL respetar el modo claro/oscuro activo usando la variante de color correspondiente del tema. El tinte aplicado SHALL derivar del color del tema de forma sutil, de modo que el texto se lea como atenuado y no compita con el texto primario ni con los acentos. En todos los casos, el texto secundario/atenuado SHALL mantener un contraste legible (mínimo WCAG AA, 4.5:1 para texto normal) contra su fondo en los seis temas (Neutral, Ocean, Forest, Sunset, Rose, Midnight) y en ambos modos. El contenido y la estructura de los componentes no cambian; solo el color del texto sigue al tema.

#### Scenario: El texto secundario sigue al tema seleccionado

- **WHEN** el usuario selecciona un tema de color
- **THEN** los textos secundarios y atenuados de la interfaz adoptan el tinte de ese tema, en línea con los demás elementos tematizados

#### Scenario: El texto secundario respeta el modo claro/oscuro

- **WHEN** el usuario alterna entre modo claro y oscuro con un tema activo
- **THEN** el texto secundario y atenuado usa la variante de color correspondiente del tema, manteniendo un contraste legible

#### Scenario: Contraste legible del texto atenuado

- **WHEN** un texto secundario o atenuado se muestra en cualquiera de los seis temas y en modo claro u oscuro
- **THEN** mantiene un contraste de al menos 4.5:1 respecto a su fondo

### Requirement: Texto de controles de formulario tematizado

El texto de los controles de formulario —texto ingresado y placeholder de los campos de entrada, y la etiqueta de los botones secundarios— SHALL seguir el tema de color seleccionado y respetar el modo claro/oscuro, en lugar de usar grises fijos. El placeholder SHALL ser claramente legible en ambos modos, evitando específicamente el gris oscuro casi invisible sobre fondos oscuros. El texto ingresado SHALL mantener un contraste fuerte (mínimo 4.5:1) y el placeholder un contraste adecuado, en los seis temas y en ambos modos. El comportamiento y la estructura de los campos y botones no cambian; solo su color de texto sigue al tema.

#### Scenario: El texto de entrada y su placeholder siguen al tema

- **WHEN** el usuario ve un campo de entrada con un tema activo
- **THEN** el texto ingresado y el placeholder adoptan el tinte del tema y usan la variante clara/oscura correspondiente

#### Scenario: Placeholder legible en modo oscuro

- **WHEN** un campo de entrada se muestra en modo oscuro en cualquiera de los seis temas
- **THEN** el placeholder es claramente legible (no un gris oscuro casi invisible) con contraste adecuado respecto al fondo del campo

#### Scenario: La etiqueta del botón secundario sigue al tema

- **WHEN** se muestra un botón secundario con un tema activo, en modo claro u oscuro
- **THEN** su etiqueta usa el color de texto tematizado con contraste legible (mínimo 4.5:1) en reposo y al pasar el cursor

