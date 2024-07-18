// Необходимо создать веб-страницу с динамическими элементами с расписанием занятий.

// На странице должна быть таблица с расписанием занятий, на основе JSON-данных.
// Каждая строка таблицы должна содержать информацию о занятии, а именно:
// - название занятия
// - время проведения занятия
// - максимальное количество участников
// - текущее количество участников
// - кнопка "записаться"
// - кнопка "отменить запись"

// Если максимальное количество участников достигнуто, либо пользователь уже записан на занятие, сделайте кнопку "записаться" неактивной.
// Кнопка "отменить запись" активна в случае, если пользователь записан на занятие, иначе она должна быть неактивна.

// Пользователь может записаться на один курс только один раз.

// При нажатии на кнопку "записаться" увеличьте количество записанных участников.
// Если пользователь нажимает "отменить запись", уменьшите количество записанных участников.
// Обновляйте состояние кнопок и количество участников в реальном времени.

// Если количество участников уже максимально, то пользователь не может записаться, даже если он не записывался ранее.

// Сохраняйте данные в LocalStorage, чтобы они сохранялись и отображались при перезагрузке страницы.

// Начальные данные (JSON):

// [
//   {
//     id: 1,
//     name: "Йога",
//     time: "10:00 - 11:00",
//     maxParticipants: 15,
//     currentParticipants: 8,
//   },
//   {
//     id: 2,
//     name: "Пилатес",
//     time: "11:30 - 12:30",
//     maxParticipants: 10,
//     currentParticipants: 5,
//   },
//   {
//     id: 3,
//     name: "Кроссфит",
//     time: "13:00 - 14:00",
//     maxParticipants: 20,
//     currentParticipants: 15,
//   },
//   {
//     id: 4,
//     name: "Танцы",
//     time: "14:30 - 15:30",
//     maxParticipants: 12,
//     currentParticipants: 10,
//   },
//   {
//     id: 5,
//     name: "Бокс",
//     time: "16:00 - 17:00",
//     maxParticipants: 8,
//     currentParticipants: 6,
//   },
// ];

// Начальные данные в формате JSON
const initialData = [
  {
    id: 1,
    name: "Йога",
    time: "10:00 - 11:00",
    maxParticipants: 15,
    currentParticipants: 8,
  },
  {
    id: 2,
    name: "Пилатес",
    time: "11:30 - 12:30",
    maxParticipants: 10,
    currentParticipants: 5,
  },
  {
    id: 3,
    name: "Кроссфит",
    time: "13:00 - 14:00",
    maxParticipants: 20,
    currentParticipants: 15,
  },
  {
    id: 4,
    name: "Танцы",
    time: "14:30 - 15:30",
    maxParticipants: 12,
    currentParticipants: 10,
  },
  {
    id: 5,
    name: "Бокс",
    time: "16:00 - 17:00",
    maxParticipants: 8,
    currentParticipants: 6,
  },
];

// Загрузка данных из LocalStorage при загрузке страницы
function loadSchedule() {
  // Если данных нет в LocalStorage, использовать начальные данные
  return JSON.parse(localStorage.getItem("schedule")) || initialData;
}

// Сохранение данных в LocalStorage
function saveSchedule(data) {
  localStorage.setItem("schedule", JSON.stringify(data));
}

// Загрузка данных о записях пользователя из LocalStorage
function loadUserEnrollments() {
  return JSON.parse(localStorage.getItem("userEnrollments")) || [];
}

// Сохранение данных о записях пользователя в LocalStorage
function saveUserEnrollments(data) {
  localStorage.setItem("userEnrollments", JSON.stringify(data));
}

// Функция для рендеринга таблицы
function renderSchedule() {
  const schedule = loadSchedule();
  const userEnrollments = loadUserEnrollments();
  const tableBody = document.querySelector("#scheduleTable tbody");
  tableBody.innerHTML = ""; // Очистка таблицы перед заполнением

  // Перебор каждого занятия и создание строки таблицы
  schedule.forEach((session) => {
    const isEnrolled = userEnrollments.includes(session.id);
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${session.name}</td>
            <td>${session.time}</td>
            <td>${session.maxParticipants}</td>
            <td>${session.currentParticipants}</td>
            <td><button ${
              session.currentParticipants >= session.maxParticipants ||
              isEnrolled
                ? "disabled"
                : ""
            } class="enrollBtn" data-id="${session.id}">Записаться</button></td>
            <td><button ${
              !isEnrolled ? "disabled" : ""
            } class="unenrollBtn" data-id="${
      session.id
    }">Отменить запись</button></td>
        `;
    tableBody.appendChild(row);
  });

  // Привязка событий к кнопкам
  document.querySelectorAll(".enrollBtn").forEach((button) => {
    button.addEventListener("click", handleEnroll);
  });
  document.querySelectorAll(".unenrollBtn").forEach((button) => {
    button.addEventListener("click", handleUnenroll);
  });
}

// Обработчик события "Записаться"
function handleEnroll(event) {
  const sessionId = parseInt(event.target.getAttribute("data-id"));
  const schedule = loadSchedule();
  const session = schedule.find((s) => s.id === sessionId);
  const userEnrollments = loadUserEnrollments();

  // Проверка на максимальное количество участников
  if (
    session.currentParticipants < session.maxParticipants &&
    !userEnrollments.includes(sessionId)
  ) {
    session.currentParticipants++;
    userEnrollments.push(sessionId);
    saveSchedule(schedule);
    saveUserEnrollments(userEnrollments);
    renderSchedule();
  }
}

// Обработчик события "Отменить запись"
function handleUnenroll(event) {
  const sessionId = parseInt(event.target.getAttribute("data-id"));
  const schedule = loadSchedule();
  const session = schedule.find((s) => s.id === sessionId);
  const userEnrollments = loadUserEnrollments();

  // Проверка на наличие записи пользователя
  if (userEnrollments.includes(sessionId)) {
    session.currentParticipants--;
    const index = userEnrollments.indexOf(sessionId);
    userEnrollments.splice(index, 1);
    saveSchedule(schedule);
    saveUserEnrollments(userEnrollments);
    renderSchedule();
  }
}

// Инициализация таблицы при загрузке страницы
document.addEventListener("DOMContentLoaded", renderSchedule);
