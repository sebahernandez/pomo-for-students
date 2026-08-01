## Purpose

El consentimiento de cookies informa al usuario sobre el uso de cookies y registra su decisión, para cumplir con expectativas de privacidad y evitar volver a preguntar en cada visita.

## ADDED Requirements

### Requirement: Mostrar banner hasta obtener decisión

El sistema SHALL mostrar un banner de consentimiento de cookies mientras el usuario no haya registrado una decisión previa. El banner SHALL respetar el idioma seleccionado.

#### Scenario: Primera visita sin decisión

- **WHEN** el usuario visita la aplicación sin una decisión de cookies registrada
- **THEN** se muestra el banner de consentimiento

#### Scenario: Visita con decisión previa

- **WHEN** el usuario ya aceptó o rechazó las cookies en una visita anterior
- **THEN** el banner no se muestra

### Requirement: Registrar la decisión del usuario

El sistema SHALL permitir aceptar o rechazar las cookies, y SHALL persistir esa decisión de modo que se recuerde en futuras visitas.

#### Scenario: Aceptar cookies

- **WHEN** el usuario acepta las cookies
- **THEN** el banner se oculta
- **AND** la decisión de aceptación queda registrada para futuras visitas

#### Scenario: Rechazar cookies

- **WHEN** el usuario rechaza las cookies
- **THEN** el banner se oculta
- **AND** la decisión de rechazo queda registrada para futuras visitas
