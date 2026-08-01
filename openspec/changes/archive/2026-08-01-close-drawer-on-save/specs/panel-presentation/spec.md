## REMOVED Requirements

### Requirement: Aplicar cambios no cierra el drawer

**Reason**: Se revierte la decisión de diseño previa (commit `542b997`). Dejar el drawer abierto al guardar la configuración se percibe como que "Guardar no funciona", ya que no hay confirmación visible. El único panel con acción de aplicar/guardar es Configuración, y ahora Guardar cierra el drawer.

**Migration**: El cierre del drawer al guardar la configuración queda especificado en `user-preferences` → "Configuración de duraciones". El drawer sigue cerrándose por las afordancias explícitas ya especificadas en "Cierre del drawer" (scrim, botón de cerrar, tecla Escape) y por el botón Cancelar del pie del panel.
