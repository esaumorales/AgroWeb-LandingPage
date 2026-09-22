# Landing - Agro Exportaciones F&V

Sitio web estático creado únicamente con HTML, CSS y JavaScript. Sin procesos de compilación ni frameworks pesados.

---

## Despliegue

Para probar la página en local, simplemente abre `index.html` en tu navegador web. 
Para llevarla a producción, sube el contenido de esta carpeta a cualquier servicio de hosting estático (como Vercel, Netlify, Amazon S3 o Nginx).

## Estructura del código

La base de código está dividida para que sea fácil de mantener:

- `index.html`: Contenido principal y textos.
- `css/tokens.css`: Aquí viven las variables de diseño (colores principales, tipografía, espacios).
- `css/base.css`, `components.css`, `sections.css`: Estilos organizados desde lo general hasta los componentes específicos.
- `js/main.js`: Lógica del menú móvil, el calendario interactivo y el formulario.
- `img/` y `fonts/`: Imágenes optimizadas y la tipografía local (Plus Jakarta Sans).

## Guía de cambios rápidos

- **Ajustar paleta de colores:** Edita las variables en `css/tokens.css`.
- **Modificar textos y contenido:** Todos los textos están expuestos en `index.html`.
- **Actualizar temporadas de cosecha:** Edita el objeto `SEASONS` al inicio de `js/main.js`. Este cambio se reflejará automáticamente en el calendario y en las tarjetas de productos.

## Lista de revisión para producción

Antes de publicar el sitio definitivo, asegúrate de revisar estos puntos:

1. Reemplazar los datos de contacto de prueba (`contacto@example.com`, `+51 900 000 000`) en el footer, la sección de contacto y en el atributo del formulario.
2. Confirmar con el cliente que las certificaciones mostradas en la sección de Calidad son las correctas.
3. Validar los datos de la sección "¿Sabías que?" y los meses de cosecha configurados.
4. El formulario actual delega el envío a la aplicación de correo del usuario. Si el cliente requiere envíos directos desde la web, será necesario integrar un servicio de correo o un backend.

## Fotografías

Las imágenes de alta calidad están ubicadas en `img/fotografia/`. Si necesitas consultar el inventario o los prompts originales de generación, revisa el archivo `docs/fotografia.md`.

---
*Nota de desarrollo: Los estilos siguen la convención BEM. Las variables y funciones están escritas en inglés, pero el contenido visible y los comentarios se mantuvieron en español.*
