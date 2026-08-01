## ADDED Requirements

### Requirement: Footer tematizado

El footer SHALL aplicar los colores del tema seleccionado —superficie/fondo, borde, texto y acentos— de forma coherente con el resto de la interfaz, y SHALL respetar el modo claro/oscuro activo. El contenido y la estructura del footer no cambian; solo su presentación visual sigue al tema.

#### Scenario: El footer sigue al tema seleccionado

- **WHEN** el usuario selecciona un tema de color
- **THEN** los colores del footer (fondo, borde, texto y acentos) se actualizan según ese tema, en línea con los demás paneles

#### Scenario: El footer respeta el modo claro/oscuro

- **WHEN** el usuario alterna entre modo claro y oscuro con un tema activo
- **THEN** el footer usa la variante de color correspondiente del tema, manteniendo un contraste legible del texto
