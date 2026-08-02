## MODIFIED Requirements

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
