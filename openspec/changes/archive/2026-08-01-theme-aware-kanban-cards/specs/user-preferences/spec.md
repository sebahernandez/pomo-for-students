## ADDED Requirements

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
