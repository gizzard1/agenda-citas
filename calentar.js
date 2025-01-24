document.addEventListener('DOMContentLoaded', () => {
    detectOverlaps()
    initializeDraggFunction();
    positionEvents();
    initializeResizer();
  });
  
  
  function positionEvents() {
    const eventos = document.querySelectorAll('.evento');

    eventos.forEach(evento => {
      const start = evento.dataset.start; 
      const duration = evento.dataset.duration; 
      const employee = evento.dataset.employee;

      // Buscar la celda de inicio basada en data-hour y data-employee
      const matchingCell = document.querySelector(
        `.cell[data-hour="${start}"][data-employee="${employee}"]`
      );

      if (matchingCell) {
        // Posicionar el evento dentro de la celda
        matchingCell.appendChild(evento);

        // Ajustar altura y top relativo a la celda
        const height = duration;
        if(duration<27){
          evento.style.display = 'flex';
        }else{
          evento.style.display = 'inline-block';
        }
        evento.style.height = `${height}px`;
        evento.style.position = 'absolute'; // Importante para permitir posicionamiento relativo
        evento.style.width = '100%'; // Para que ocupe todo el ancho de la celda
      } else {
        console.warn(`No se encontró celda para el evento: ${start} - ${employee}`);
      }
    });
  }
  let isResizing = false;
  let isDragging = false;
  function initializeResizer() {
    const eventos = document.querySelectorAll('.evento');
  
    eventos.forEach(evento => {
      const resizer = evento.querySelector('.cambia-tamanio');
  
      let initialY = 0; // Posición inicial del mouse
      let initialHeight = 0; // Altura inicial del evento
      let isResizing = false; // Marcar si estamos redimensionando en este evento
  
      resizer.addEventListener('mousedown', initDrag, false);
  
      function initDrag(e) {
        e.preventDefault();
        isResizing = true; // Marcar como redimensionando
        evento.setAttribute('draggable', false);
        initialY = e.clientY;
        document.body.style.userSelect = 'none';
        initialHeight = parseInt(document.defaultView.getComputedStyle(evento).height, 10);
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
      }
  
      function doDrag(e) {
        if (!isResizing) return;
  
        // Calcula el cambio en la posición del mouse
        const deltaY = e.clientY - initialY;
  
        // Calcula el número de bloques de 15px (15 minutos) según el delta
        const blockHeight = 16; // Cada bloque equivale a 16 minutos
        const newHeight = initialHeight + Math.round(deltaY / blockHeight) * blockHeight;
  
        // Asegura un tamaño mínimo y máximo
        if (newHeight >= blockHeight) { // Por ejemplo, 15 minutos mínimo
          evento.style.height = `${newHeight}px`;
  
          // Actualiza dinámicamente la duración en base al nuevo tamaño
          const duration = Math.round(newHeight / blockHeight) * 16; // Duración en minutos
          evento.setAttribute('data-duration', duration);
  
          // Opcional: Actualiza el texto con el nuevo rango horario
          const start = evento.getAttribute('data-start');
          const end = calculateEndTime(start, duration); // Función auxiliar para calcular el fin
          evento.querySelector('.horario-evento').textContent = `${start} - ${end}`;
          positionEvents();
        }
      }
  
      function stopDrag() {
        if (isResizing) {
          isResizing = false;
          evento.setAttribute('draggable', true); // Reactiva el atributo draggable
          document.body.style.userSelect = ''; 
  
          // Aquí puedes implementar una función Livewire para actualizar en el servidor si es necesario
          // >>>>>>>>>>>>>>>>>>>IMPLEMENTAR FUNCION LIVEWIRE AQUÍ<<<<<<<<<<<<<<<<<<<<<<<<<<<
        }
  
        // Elimina los listeners para evitar que el redimensionamiento de un evento afecte a otros
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
      }
    });
  }
  
  
// Función auxiliar para calcular el horario de fin
function calculateEndTime(start, duration) {
    const [hours, minutes] = start.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;

    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    // Retorna el horario en formato "HH:MM"
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

function initializeDraggFunction() {
    eventData = null;
    let elementosArrastrables = document.querySelectorAll('.draggable');
    let contenedorCasilla = document.querySelectorAll('.cell');

    elementosArrastrables.forEach(function(elemento) {
        // Eliminar cualquier evento previo para evitar duplicados
        elemento.removeEventListener('dragstart', comenzarArrastreHandler);
        elemento.addEventListener('dragstart', comenzarArrastreHandler);
    });

    contenedorCasilla.forEach(function(elemento) {
        // Eliminar cualquier evento previo para evitar duplicados
        elemento.removeEventListener('dragover', permitirSoltar);
        elemento.removeEventListener('drop', soltarElementoHandler);

        elemento.addEventListener('dragover', permitirSoltar);
        elemento.addEventListener('drop', soltarElementoHandler);
    });
    
    // Listener global para el evento 'dragover' en todo el documento
    document.addEventListener('dragover', function(event) {
        event.preventDefault(); // Necesario para permitir que el drop funcione en cualquier lugar
    });
    
    // Listener global para 'drop' en cualquier parte del documento
    document.addEventListener('drop', function(event) {
        // Prevenir el comportamiento por defecto
        event.preventDefault();
        event.stopPropagation();

        // Si el target no es una casilla ni un hijo de una casilla, manejar el drop fuera de una casilla
        if (!event.target.classList.contains('cell')) {

            // Livewire.emit('cancelarCaptura')

            // Aquí puedes agregar cualquier lógica adicional para manejar el drop fuera de una casilla
        }
    });
}

function comenzarArrastreHandler(event) {
    if (isResizing) {
        event.preventDefault(); // Evita que el evento dragstart continúe si estás redimensionando
        return;
    }
    isDragging = true;
    eventData = comenzarArrastre(event);
}


function soltarElementoHandler(event) {
    let targetCell = event.target.closest('.cell');
    if (!targetCell) return; // Asegúrate de que sea una celda válida

    soltarElemento(event, eventData);
    isDragging = false;
}

function comenzarArrastre(event) {
    eventData = {
        startTime: event.target.getAttribute('data-start'),
        duration: event.target.getAttribute('data-duration'),
        employee: event.target.getAttribute('data-employee'),
    };
    return eventData;
}

function soltarElemento(event,eventData) {
    let hour = event.target.getAttribute("data-hour");
    let employee = event.target.getAttribute("data-employee");

    
    let targetCell = event.target.closest('.cell');
    if (targetCell) {
        targetCell.classList.remove('drag-over');
    }
    
    console.log('setCitaDragged', hour,employee,eventData);

    // Livewire.emit('setCitaDragged', casillaData,eventData);
}

function permitirSoltar(event) {
    event.preventDefault();
    
    let targetCell = event.target.closest('.cell');
    if (targetCell) {
        targetCell.classList.add('drag-over');
    }
    // Listener para restaurar el estado original al salir del área
    event.target.addEventListener('dragleave', function handleDragLeave() {
        let targetCell = event.target.closest('.cell');
        if (targetCell) {
            targetCell.classList.remove('drag-over');
        }
    });
}
function detectOverlaps() {
  const appointments = document.querySelectorAll('.evento');

  // Limpiar clases de todos los eventos
  appointments.forEach(app => app.classList.remove('overlap', 'left'));

  for (let i = 0; i < appointments.length; i++) {
      const app1 = appointments[i];
      const horario1 = app1.querySelector('.horario-evento').textContent.trim();
      const horarioFinal1 = horario1.split(' - ')[1];
      const [start1, end1] = parseTime(app1.dataset.start, horarioFinal1);

      for (let j = i + 1; j < appointments.length; j++) {
          const app2 = appointments[j];

          if (app1 === app2) continue; // Ignorar si es el mismo elemento

          const horario2 = app2.querySelector('.horario-evento').textContent.trim();
          const horarioFinal2 = horario2.split(' - ')[1];
          const [start2, end2] = parseTime(app2.dataset.start, horarioFinal2);

          // Detectar si las citas se solapan
          const sameEmployee = app1.dataset.employee === app2.dataset.employee;
          const timeOverlap = start1 < end2 && start2 < end1;
          console.log(start1,end2,start2,end1,sameEmployee)

          if (timeOverlap && sameEmployee) {
              app1.classList.add('overlap', 'left');
              app2.classList.add('overlap');
          }
      }
  }
}
function parseTime(start, end) {
  const toMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
  };

  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);

  // Validar que el tiempo de fin no sea menor que el tiempo de inicio
  if (endMinutes < startMinutes) {
      console.error(`Error: El tiempo de fin (${end}) no puede ser menor que el de inicio (${start}).`);
  }

  return [startMinutes, endMinutes];
}
