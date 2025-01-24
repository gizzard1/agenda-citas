# Agenda de Citas Drag & Drop

Este proyecto es un prototipo de agenda de citas para desarrollos web, que permite la gestión de eventos en un calendario utilizando funcionalidades de **drag and drop** y **ajuste de duración de eventos**. Está diseñado para asignar citas por horarios y empleados, siendo ideal para aplicaciones en salones de belleza, clínicas, gimnasios o cualquier negocio que maneje un flujo constante de citas.

## Características

- **Arrastrar y soltar eventos**: Cambia el horario o empleado de una cita fácilmente.
- **Ajuste de duración**: Modifica la duración de los eventos directamente desde el calendario.
- **Interfaz intuitiva**: Visualización clara de las citas asignadas por horario y empleado.
- **Extensibilidad**: Diseñado para que puedas integrarlo y personalizarlo en tus desarrollos web.

## Tecnologías Utilizadas

- **Frontend**: HTML, CSS, JavaScript, Livewire
- **Backend**: Laravel, PHP.

## Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/gizzard1/agenda-citas.git
cd agenda-citas
```

## Uso

1. **Carga eventos**: Usando livewire puedes usar la sentencia @foreach() para llamar a un arreglo que contenga las citas. Como puedes ver estos se cargan antes de renderizar el calendario.
2. **Asigna datos a los eventos**: data-id sería el atributo que contenga el ID o folio de la cita, data-start para asignarle el horario en que comienza, la duración puedes calcularla o también extraerla de la DB y por último data-employee corresponde a la persona que hará el servicio.
3. **Imprime la información del evento**: Livewire nos permite mostrar datos desde el back, para esto utiliza los dobles corchetes en el área donde se muestra el horario, ej. {{ $cita->start . ' ' . $cita->end }}.
4. **Itera el calendario**: Utilizo un bucle foreach para renderizar por horas dependiendo la necesidad del negocio. Posterior, asignamos datos a las celdas como en el paso 2.
5. **Crea los llamados a la función**: para esto en las celdas puedes utilizar wire:click para llamar a funciones de tu back que involucren la creación de citas. Lo mismo sucede en los eventos, pero en este caso sería una función para editar. Hay comentarios en el archivo js que involucran emisiones de eventos para manejar las funciones drag N drop y estiramiento de tiempo, ya están los datos necesarios para mandar al back y hacer la edición correspondiente.

## Personalización

- **Apariencia**: Personaliza los estilos en el archivo `calendar-styles.css`.
- **Eventos y lógica**: Modifica el comportamiento de los eventos en `calendar.js`.

## Aplicaciones Prácticas

- **Salones de belleza**: Asignación de citas por estilista y horario.
- **Clínicas médicas**: Gestión de consultas por doctor y hora.
- **Gimnasios**: Reserva de clases por entrenador y franja horaria.

## Contribuciones
Las contribuciones son bienvenidas. Por favor, crea un **pull request** o abre un **issue** para sugerir mejoras o reportar errores.

## Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
