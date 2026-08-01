## ADDED Requirements

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
