document.addEventListener('DOMContentLoaded', function () {
    const calendar = document.getElementById('calendar');
    const eventTitle = document.getElementById('eventTitle');
    const eventDate = document.getElementById('eventDate');
    const addEventBtn = document.getElementById('addEventBtn');
    const eventList = document.getElementById('eventList');
    const chatSidebar = document.getElementById('chatSidebar');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const mainContent = document.getElementById('mainContent');

    let currentDate = new Date();
    let events = [];

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        let html = `<table class="table table-bordered">
            <thead>
                <tr>
                    <th colspan="7" class="text-center">
                        <button class="btn btn-link" onclick="prevMonth()">&lt;</button>
                        ${firstDay.toLocaleString('default', { month: 'long' })} ${year}
                        <button class="btn btn-link" onclick="nextMonth()">&gt;</button>
                    </th>
                </tr>
                <tr>
                    <th>Dom</th><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th>
                </tr>
            </thead>
            <tbody>`;

        let date = new Date(firstDay);
        date.setDate(date.getDate() - date.getDay());

        for (let i = 0; i < 6; i++) {
            html += '<tr>';
            for (let j = 0; j < 7; j++) {
                const className = date.getMonth() === month ? '' : 'text-muted';
                const isToday = date.toDateString() === new Date().toDateString() ? 'bg-primary text-white' : '';
                html += `<td class="${className} ${isToday}" style="cursor: pointer;" onclick="selectDate(${date.getTime()})">
                    ${date.getDate()}
                </td>`;
                date.setDate(date.getDate() + 1);
            }
            html += '</tr>';
            if (date > lastDay) break;
        }

        html += '</tbody></table>';
        calendar.innerHTML = html;
    }

    function selectDate(timestamp) {
        const selectedDate = new Date(timestamp);
        eventDate.value = selectedDate.toISOString().split('T')[0];
    }

    function prevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    }

    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    }

    function addEvent() {
        const title = eventTitle.value.trim();
        const date = eventDate.value;
        if (title && date) {
            events.push({ title, date });
            eventTitle.value = '';
            eventDate.value = '';
            renderEvents();
        }
    }

    function renderEvents() {
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        eventList.innerHTML = events.map(event =>
            `<li class="list-group-item">${event.title} - ${new Date(event.date).toLocaleDateString()}</li>`
        ).join('');
    }

    addEventBtn.addEventListener('click', addEvent);

    renderCalendar();
    renderEvents();

    // Chat sidebar functionality
    closeChatBtn.addEventListener('click', function () {
        chatSidebar.classList.remove('open');
        mainContent.style.marginRight = '0';
    });

    // Hacer las funciones globales para que puedan ser llamadas desde los botones del calendario
    window.prevMonth = prevMonth;
    window.nextMonth = nextMonth;
    window.selectDate = selectDate;

    // Ejemplo de cómo abrir el chat (puedes agregar un botón para esto)
    // document.getElementById('openChatBtn').addEventListener('click', function() {
    //     chatSidebar.classList.add('open');
    //     mainContent.style.marginRight = '300px';
    // });
});