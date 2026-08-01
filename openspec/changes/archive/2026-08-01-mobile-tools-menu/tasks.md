## 1. i18n

- [x] 1.1 Añadir etiquetas traducibles en `src/i18n/translations.ts` (en/es): `tools` ("Herramientas"/"Tools") y `menu` ("Menú"/"Menu"); reutilizar las etiquetas existentes de Guía/Historial/Configuración para los ítems

## 2. Menú de herramientas (drawer)

- [x] 2.1 Crear `src/components/ToolsMenu.tsx` que use `Drawer` con título "Herramientas" y reciba callbacks `onOpenGuide`, `onOpenHistory`, `onOpenSettings` y `onClose`
- [x] 2.2 Renderizar tres filas accionables (Guía, Historial, Configuración) con su icono y label; al activar una, cerrar el menú y disparar el callback correspondiente
- [x] 2.3 Asegurar accesibilidad heredada del `Drawer` (scrim, cierre por scrim/botón/Escape) y `aria-label`/`title` en los ítems

## 3. Encabezado responsivo

- [x] 3.1 En `Header.tsx`, extraer la definición de herramientas (icono, label, handler) a una estructura compartida para evitar duplicación entre barra completa y menú
- [x] 3.2 Añadir estado `menuOpen` y renderizar `ToolsMenu` cuando esté abierto, cableando los callbacks para cerrar el menú y abrir el panel destino sin apilar dos drawers
- [x] 3.3 Barra completa (escritorio): envolver los cinco botones en un contenedor `hidden lg:flex`
- [x] 3.4 Barra compacta (< lg): contenedor `flex lg:hidden` con Idioma, Modo claro/oscuro y el botón de menú (icono de menú con `aria-label`/`title` traducible)

## 4. Logo no invasivo en móvil

- [x] 4.1 Aplicar `min-w-0` al contenedor del logo y mantener `justify-between` para que el logo no empuje los controles
- [x] 4.2 Ocultar/truncar el tagline del logo en anchos reducidos conservando el título principal, sin provocar desbordamiento horizontal

## 5. Verificación

- [x] 5.1 Verificar en escritorio (≥ 1024px) que se muestran los cinco controles y NO el botón de menú
- [x] 5.2 Verificar en tablet/móvil (< 1024px) que solo se ven Idioma, Modo y el botón de menú, y que el menú abre Guía/Historial/Configuración correctamente
- [x] 5.3 Verificar que seleccionar un ítem cierra el menú y abre el panel sin dejar dos scrims apilados; y que scrim/Escape/botón cierran el menú
- [x] 5.4 Verificar en móvil estrecho que el logo no se solapa con los controles ni causa scroll horizontal, con el tagline oculto/truncado
- [x] 5.5 Ejecutar lint, typecheck/build y la suite de tests para asegurar que no hay regresiones
