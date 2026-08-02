## 1. Rediseñar los ítems del menú de herramientas

- [x] 1.1 En `src/components/ToolsMenu.tsx`, dejar de reutilizar el estilo de botón compacto `btn-secondary` para los ítems y presentarlos como filas de menú de ancho completo con contenido alineado a la izquierda (icono en ranura inicial + etiqueta), padding cómodo y altura consistente.
- [x] 1.2 Si hace falta, añadir una clase de fila de menú en `src/index.css` con estados de hover, activo y foco derivados de las variables de tema (modo claro/oscuro y color de tema), asegurando contraste legible.

## 2. Verificación

- [x] 2.1 Abrir el menú en un viewport < 1024px y confirmar que icono y texto quedan alineados a la izquierda, no centrados.
- [x] 2.2 Confirmar filas de ancho completo con altura/padding consistentes y estados hover/foco visibles.
- [x] 2.3 Verificar en modo claro y oscuro y con varios temas que el contraste del texto se mantiene legible y que seleccionar un ítem sigue abriendo su panel correspondiente.
