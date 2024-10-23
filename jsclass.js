let classes = [
    { id: 1, name: 'Matematica', period: 'Period 5', color: '#4CAF50', teacher: 'Prof. Smith' },
    { id: 2, name: 'Geografia', period: 'Period 2', color: '#FF9800', teacher: 'Prof. Johnson' },
    { id: 3, name: 'Ciencia', period: 'Period 6', color: '#2196F3', teacher: 'Prof. Williams' },
    { id: 4, name: 'Computacion', period: 'Period 4', color: '#E91E63', teacher: 'Prof. Brown' },
    { id: 5, name: 'Tarea', period: 'Period 1', color: '#3F51B5', teacher: 'Prof. Davis' },
    { id: 6, name: 'Caligrafia', period: 'Period 3', color: '#9C27B0', teacher: 'Prof. Miller' },
    { id: 7, name: 'Club de arte', period: 'Despues de las clases', color: '#607D8B', teacher: 'Prof. Wilson' },
];

function createClassCard(classItem) {
    const card = document.createElement('div');
    card.className = 'col mb-4';
    card.innerHTML = `
        <div class="card h-100 class-card" data-bs-toggle="modal" data-bs-target="#modal${classItem.id}">
            <div class="delete-class" onclick="confirmDeleteClass(event, ${classItem.id})">
                <i class="bi bi-x"></i>
            </div>
            <div class="class-header" style="background-color: ${classItem.color};">
                <div class="card-img-overlay d-flex flex-column justify-content-end class-title">
                    <h5 class="card-title text-white mb-0">${classItem.name}</h5>
                    <p class="card-text text-white">${classItem.period}</p>
                </div>
            </div>
            <div class="card-body">
                <p class="card-text">Profesor: ${classItem.teacher}</p>
            </div>
        </div>
    `;
    return card;
}

function createModal(classItem) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = `modal${classItem.id}`;
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', `modalLabel${classItem.id}`);
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header modal-header-custom" style="background-color: ${classItem.color};">
                    <h5 class="modal-title modal-title-custom" id="modalLabel${classItem.id}">${classItem.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="filter: invert(100%);"></button>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-tabs" id="myTab${classItem.id}" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="tablon-tab-${classItem.id}" data-bs-toggle="tab" data-bs-target="#tablon-${classItem.id}" type="button" role="tab" aria-controls="tablon-${classItem.id}" aria-selected="true">Tablón</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="trabajos-tab-${classItem.id}" data-bs-toggle="tab" data-bs-target="#trabajos-${classItem.id}" type="button" role="tab" aria-controls="trabajos-${classItem.id}" aria-selected="false">Trabajos</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="personas-tab-${classItem.id}" data-bs-toggle="tab" data-bs-target="#personas-${classItem.id}" type="button" role="tab" aria-controls="personas-${classItem.id}" aria-selected="false">Personas</button>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent${classItem.id}">
                        <div class="tab-pane fade show active" id="tablon-${classItem.id}" role="tabpanel" aria-labelledby="tablon-tab-${classItem.id}">
                            <div class="mt-3">
                                <div class="chat-messages1" id="chatMessages-${classItem.id}">
                                    <!-- Los mensajes del chat se mostrarán aquí -->
                                </div>
                                <form id="chatForm-${classItem.id}" class="chat-form">
                                    <div class="input-group">
                                        <input type="text" class="form-control" placeholder="Escribe un mensaje..." aria-label="Mensaje" id="messageInput-${classItem.id}">
                                        <label for="fileInput-${classItem.id}" class="btn btn-outline-secondary file-upload-btn">
                                            <i class="bi bi-paperclip"></i>
                                        </label>
                                        <input type="file" id="fileInput-${classItem.id}" style="display: none;" onchange="handleFileUpload(${classItem.id}, event)">
                                        <button class="btn btn-primary" type="submit">Enviar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="trabajos-${classItem.id}" role="tabpanel" aria-labelledby="trabajos-tab-${classItem.id}">
                            <div class="mt-3">
                                <div class="trabajos-section">
                                    <h6>Próximo</h6>
                                    <p>No hay trabajos próximos</p>
                                </div>
                                <div class="trabajos-section">
                                    <h6>Para este mes</h6>
                                    <p>No hay trabajos para este mes</p>
                                </div>
                                <div class="trabajos-section">
                                    <h6>Lejano</h6>
                                    <p>No hay trabajos lejanos</p>
                                </div>
                                <div class="trabajos-section">
                                    <h6>Entregados</h6>
                                    <p>No hay trabajos entregados</p>
                                </div>
                                <div class="trabajos-section">
                                    <h6>No entregados</h6>
                                    <p>No hay trabajos no entregados</p>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="personas-${classItem.id}" role="tabpanel" aria-labelledby="personas-tab-${classItem.id}">
                            <div class="mt-3">
                                <div class="personas-section">
                                    <h6>Profesores</h6>
                                    <p>${classItem.teacher}</p>
                                </div>
                                <div class="personas-section mt-4">
                                    <h6>Alumnos</h6>
                                    <p>Lista de alumnos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
            </div>
        </div>
    `;
    return modal;
}

function renderClasses() {
    const container = document.getElementById('classContainer');
    const modalContainer = document.getElementById('modalContainer');
    container.innerHTML = '';
    modalContainer.innerHTML = '';
    classes.forEach(classItem => {
        container.appendChild(createClassCard(classItem));
        modalContainer.appendChild(createModal(classItem));
    });
}

function addMessage(chatId, message, isSent, isFile = false) {
    const chatMessages = document.getElementById(`chatMessages-${chatId}`);
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${isSent ? 'sent' : 'received'}`;
    
    if (isFile) {
        messageElement.innerHTML = `
            <img src="/placeholder.svg?height=32&width=32" alt="Avatar" class="avatar">
            <div class="message-content file-message">
                <i class="bi bi-file-earmark"></i>
                ${message}
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <img src="/placeholder.svg?height=32&width=32" alt="Avatar" class="avatar">
            <div class="message-content">${message}</div>
        `;
    }
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleFileUpload(classId, event) {
    const file = event.target.files[0];
    if (file) {
        addMessage(classId, file.name, true, true);
        // Aquí puedes agregar la lógica para subir el archivo a un servidor
        console.log(`Archivo "${file.name}" seleccionado para la clase ${classId}`);
    }
}

function confirmDeleteClass(event, classId) {
    event.stopPropagation();
    if (confirm('¿Estás seguro de que quieres eliminar esta clase?')) {
        deleteClass(classId);
    }
}

function deleteClass(classId) {
    classes = classes.filter(c => c.id !== classId);
    renderClasses();
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.addEventListener('DOMContentLoaded', () => {
    renderClasses();

    const addClassBtn = document.getElementById('addClassBtn');
    const addClassModal = new bootstrap.Modal(document.getElementById('addClassModal'));
    const saveNewClassBtn = document.getElementById('saveNewClass');

    addClassBtn.addEventListener('click', () => {
        addClassModal.show();
    });

    saveNewClassBtn.addEventListener('click', () => {
        const className = document.getElementById('className').value;
        const classPeriod = document.getElementById('classPeriod').value;
        const classTeacher = document.getElementById('classTeacher').value;

        if (className && classPeriod && classTeacher) {
            const newClass = {
                id: classes.length + 1,
                name: className,
                period: classPeriod,
                color: getRandomColor(),
                teacher: classTeacher
            };
            classes.push(newClass);
            renderClasses();
            addClassModal.hide();
            document.getElementById('addClassForm').reset();
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });

    classes.forEach(classItem => {
        const chatForm = document.getElementById(`chatForm-${classItem.id}`);
        const messageInput = document.getElementById(`messageInput-${classItem.id}`);

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = messageInput.value.trim();
            if (message) {
                addMessage(classItem.id, message, true);
                messageInput.value = '';

                // Simular una respuesta después de 1 segundo
                setTimeout(() => {
                    addMessage(classItem.id, `Respuesta automática para: ${message}`, false);
                }, 1000);
            }
        });
    });
});