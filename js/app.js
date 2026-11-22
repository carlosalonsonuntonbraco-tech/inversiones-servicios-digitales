
document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       1. MENÚ RESPONSIVE
    ========================================== */

    const menuButton = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuButton && navLinks) {

        function closeMenu() {

            navLinks.classList.remove("open");
            menuButton.classList.remove("active");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Abrir menú");

        }

        menuButton.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("open");

            menuButton.classList.toggle("active", isOpen);

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Cerrar menú" : "Abrir menú"
            );

        });

        // Cerrar menú al seleccionar una opción

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", closeMenu);

        });

        // Cerrar menú al presionar Escape

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

    }


    /* ==========================================
       2. BUSCADOR Y FILTRO DE PROYECTOS
    ========================================== */

    const searchInput = document.getElementById("searchProject");
    const statusFilter = document.getElementById("filterStatus");
    const projectsTable = document.getElementById("projectsTable");
    const projectCount = document.getElementById("projectCount");

    if (searchInput && statusFilter && projectsTable) {

        // Obtener las filas del cuerpo de la tabla

        const rows = Array.from(
            projectsTable.querySelectorAll("tbody tr")
        );

        function filterProjects() {

            const search = searchInput.value
                .trim()
                .toLowerCase();

            const status = statusFilter.value
                .trim()
                .toLowerCase();

            let visibleCount = 0;

            rows.forEach(row => {

                const rowText = row.textContent.toLowerCase();

                const matchesSearch = rowText.includes(search);

                const matchesStatus = !status ||
                    rowText.includes(status);

                const visible = matchesSearch && matchesStatus;

                row.style.display = visible ? "" : "none";

                if (visible) {
                    visibleCount++;
                }

            });

            // Actualizar contador de resultados

            if (projectCount) {

                projectCount.textContent =
                    `Mostrando ${visibleCount} de ${rows.length} proyectos.`;

            }

        }

        searchInput.addEventListener("input", filterProjects);

        statusFilter.addEventListener("change", filterProjects);

        // Mostrar el total inicial

        filterProjects();

    }


    /* ==========================================
       3. VALIDACIÓN DEL FORMULARIO DE CONTACTO
    ========================================== */

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    if (contactForm && formMessage) {

        const tipoDocumento =
            document.getElementById("tipoDocumento");

        const numeroDocumento =
            document.getElementById("numeroDocumento");

        contactForm.addEventListener("submit", function (event) {

            // Evitar el envío real del formulario

            event.preventDefault();

            // Validar campos obligatorios del HTML

            if (!contactForm.checkValidity()) {

                contactForm.reportValidity();

                return;

            }

            // Validar DNI y RUC si existen esos campos

            if (tipoDocumento && numeroDocumento) {

                const documentType = tipoDocumento.value;

                const documentNumber = numeroDocumento.value.trim();

                if (
                    documentType === "RUC" &&
                    !/^\d{11}$/.test(documentNumber)
                ) {

                    formMessage.style.color = "#DC2626";

                    formMessage.textContent =
                        "El RUC debe contener exactamente 11 dígitos.";

                    numeroDocumento.focus();

                    return;

                }

                if (
                    documentType === "DNI" &&
                    !/^\d{8}$/.test(documentNumber)
                ) {

                    formMessage.style.color = "#DC2626";

                    formMessage.textContent =
                        "El DNI debe contener exactamente 8 dígitos.";

                    numeroDocumento.focus();

                    return;

                }

            }

            // Mostrar confirmación visual

            formMessage.style.color = "#16A34A";

            formMessage.textContent =
                "¡Solicitud validada correctamente! Gracias por contactar con Inversiones y Servicios Digitales S.A.C. Esta demostración no almacena información en AWS RDS.";

            // No se conecta ni se insertan datos en SQL Server.

        });

    }


    /* ==========================================
       4. SISTEMA DE SOPORTE
    ========================================== */

    const supportForm = document.getElementById("supportForm");
    const supportMessage = document.getElementById("supportMessage");

    const ticketsTable = document.getElementById("ticketsTable");
    const searchTicket = document.getElementById("searchTicket");
    const searchTicketButton = document.getElementById("searchTicketButton");
    const ticketSearchMessage = document.getElementById("ticketSearchMessage");

    const totalTickets = document.getElementById("totalTickets");
    const pendingTickets = document.getElementById("pendingTickets");
    const resolvedTickets = document.getElementById("resolvedTickets");
    const ticketCount = document.getElementById("ticketCount");

    if (supportForm && ticketsTable) {

        // Los registros son temporales y solo existen
        // mientras la página permanezca abierta.

        let tickets = [
            {
                code: "TCK-2026-001",
                subject: "Error en página web",
                category: "Desarrollo Web",
                date: "18/11/2026",
                priority: "Alta",
                status: "Pendiente"
            },
            {
                code: "TCK-2026-002",
                subject: "Consulta sobre sistema",
                category: "Desarrollo de Software",
                date: "17/11/2026",
                priority: "Media",
                status: "En proceso"
            },
            {
                code: "TCK-2026-003",
                subject: "Actualización de contenido",
                category: "Mantenimiento Web",
                date: "15/11/2026",
                priority: "Baja",
                status: "Resuelto"
            }
        ];

        // Generar código automático

        function generateTicketCode() {

            const nextNumber = tickets.length + 1;

            return "TCK-2026-" +
                String(nextNumber).padStart(3, "0");

        }

        // Crear etiqueta de estado

        function getStatusClass(status) {

            if (status === "Pendiente") {
                return "status-pending";
            }

            if (status === "En proceso") {
                return "status-process";
            }

            return "status-finished";

        }

        // Renderizar tabla

        function renderTickets(list = tickets) {

            ticketsTable.innerHTML = "";

            list.forEach(ticket => {

                const row = document.createElement("tr");

                const values = [
                    ticket.code,
                    ticket.subject,
                    ticket.category,
                    ticket.date,
                    ticket.priority
                ];

                values.forEach(value => {

                    const cell = document.createElement("td");

                    cell.textContent = value;

                    row.appendChild(cell);

                });

                const statusCell = document.createElement("td");

                const statusBadge = document.createElement("span");

                statusBadge.className =
                    "status " + getStatusClass(ticket.status);

                statusBadge.textContent = ticket.status;

                statusCell.appendChild(statusBadge);

                row.appendChild(statusCell);

                ticketsTable.appendChild(row);

            });

            if (ticketCount) {

                ticketCount.textContent =
                    `Mostrando ${list.length} de ${tickets.length} tickets.`;

            }

            updateTicketStats();

        }

        // Actualizar estadísticas

        function updateTicketStats() {

            const pending = tickets.filter(
                ticket => ticket.status === "Pendiente"
            ).length;

            const resolved = tickets.filter(
                ticket => ticket.status === "Resuelto"
            ).length;

            if (totalTickets) {
                totalTickets.textContent = tickets.length;
            }

            if (pendingTickets) {
                pendingTickets.textContent = pending;
            }

            if (resolvedTickets) {
                resolvedTickets.textContent = resolved;
            }

        }

        // Fecha actual

        function getCurrentDate() {

            return new Date().toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

        }

        // Registrar incidencia

        supportForm.addEventListener("submit", function(event) {

            event.preventDefault();

            if (!supportForm.checkValidity()) {

                supportForm.reportValidity();

                return;

            }

            const subject =
                document.getElementById("supportSubject").value.trim();

            const category =
                document.getElementById("supportCategory").value;

            const priority =
                document.getElementById("supportPriority").value;

            const description =
                document.getElementById("supportDescription").value.trim();

            if (!subject || !category || !priority || !description) {

                supportMessage.style.color = "#DC2626";

                supportMessage.textContent =
                    "Completa todos los campos obligatorios.";

                return;

            }

            const newTicket = {

                code: generateTicketCode(),

                subject: subject,

                category: category,

                date: getCurrentDate(),

                priority: priority,

                status: "Pendiente"

            };

            tickets.push(newTicket);

            renderTickets();

            supportMessage.style.color = "#16A34A";

            supportMessage.textContent =
                "¡Incidencia registrada correctamente! Tu código es: " +
                newTicket.code +
                ". Guarda este código para consultar tu solicitud.";

            supportForm.reset();

        });

        // Consultar ticket por código

        function searchTicketByCode() {

            const code = searchTicket.value
                .trim()
                .toUpperCase();

            if (!code) {

                ticketSearchMessage.style.color = "#DC2626";

                ticketSearchMessage.textContent =
                    "Ingresa un código de ticket para realizar la búsqueda.";

                renderTickets();

                return;

            }

            const result = tickets.filter(ticket =>
                ticket.code.toUpperCase() === code
            );

            if (result.length > 0) {

                ticketSearchMessage.style.color = "#16A34A";

                ticketSearchMessage.textContent =
                    "Ticket encontrado correctamente.";

                renderTickets(result);

            } else {

                ticketSearchMessage.style.color = "#DC2626";

                ticketSearchMessage.textContent =
                    "No se encontró ningún ticket con ese código.";

                renderTickets([]);

            }

        }

        if (searchTicketButton) {

            searchTicketButton.addEventListener(
                "click",
                searchTicketByCode
            );

        }

        if (searchTicket) {

            searchTicket.addEventListener("keydown", function(event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    searchTicketByCode();

                }

            });

        }

        // Mostrar registros iniciales

        renderTickets();

    }

    /* ==========================================
       5. INICIO DE SESIÓN, REGISTRO Y ROLES
    ========================================== */

    const SESSION_KEY = "isd_session";
    const USERS_KEY = "isd_local_users";

    const isInSubfolder =
        window.location.pathname.includes("/admin/") ||
        window.location.pathname.includes("/cliente/");
    const rootPrefix = isInSubfolder ? "../" : "";

    const defaultUsers = [
        {
            username: "admin",
            email: "admin@isd.pe",
            password: "Admin123*",
            role: "admin",
            name: "Administrador ISD"
        },
        {
            username: "cliente",
            email: "cliente@empresa.com",
            password: "Cliente123*",
            role: "cliente",
            name: "Cliente Demo SAC"
        }
    ];

    function getLocalUsers() {
        try {
            const saved = JSON.parse(localStorage.getItem(USERS_KEY));
            return Array.isArray(saved) && saved.length > 0 ? saved : defaultUsers;
        } catch (e) {
            return defaultUsers;
        }
    }

    function saveLocalUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getSession() {
        try {
            return JSON.parse(
                localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
            );
        } catch (e) {
            return null;
        }
    }

    function saveSession(sessionData, remember) {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        const raw = JSON.stringify(sessionData);
        if (remember) {
            localStorage.setItem(SESSION_KEY, raw);
        } else {
            sessionStorage.setItem(SESSION_KEY, raw);
        }
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
    }

    // --- REGISTRO DE USUARIO (registro.html) ---
    const registerForm = document.getElementById("registerForm");
    const registerMessage = document.getElementById("registerMessage");
    const togglePassword = document.getElementById("togglePassword");
    const regPassword = document.getElementById("password");

    if (togglePassword && regPassword) {
        togglePassword.addEventListener("click", function () {
            const isPassword = regPassword.type === "password";
            regPassword.type = isPassword ? "text" : "password";
            togglePassword.setAttribute(
                "aria-label",
                isPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            );
        });
    }

    if (registerForm && registerMessage) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const firstName = document.getElementById("firstName").value.trim();
            const lastName = document.getElementById("lastName").value.trim();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const passwordValue = regPassword.value;
            const termsAccepted = document.getElementById("terms").checked;

            if (!firstName || !lastName || !email || !passwordValue) {
                registerMessage.style.color = "#DC2626";
                registerMessage.textContent = "Por favor, completa todos los campos obligatorios.";
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                registerMessage.style.color = "#DC2626";
                registerMessage.textContent = "Introduce un correo electrónico válido.";
                document.getElementById("email").focus();
                return;
            }

            if (passwordValue.length < 8) {
                registerMessage.style.color = "#DC2626";
                registerMessage.textContent = "La contraseña debe tener al menos 8 caracteres.";
                regPassword.focus();
                return;
            }

            if (!termsAccepted) {
                registerMessage.style.color = "#DC2626";
                registerMessage.textContent = "Debes aceptar los términos y condiciones.";
                return;
            }

            const users = getLocalUsers();
            if (users.some(u => u.email.toLowerCase() === email)) {
                registerMessage.style.color = "#DC2626";
                registerMessage.textContent = "Ese correo ya está registrado.";
                return;
            }

            users.push({
                username: email,
                email: email,
                password: passwordValue,
                role: "cliente",
                name: `${firstName} ${lastName}`
            });

            saveLocalUsers(users);

            registerMessage.style.color = "#16A34A";
            registerMessage.textContent =
                `¡Cuenta creada, ${firstName}! Ya puedes iniciar sesión con tu correo y contraseña.`;

            registerForm.reset();
        });
    }

    // --- INICIO DE SESIÓN (login.html) ---
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("message");
    const forgotPassword = document.getElementById("forgotPassword");

    if (loginForm && loginMessage) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const identifier = document.getElementById("username").value.trim().toLowerCase();
            const passwordInput = document.getElementById("password").value;
            const rememberChecked = document.getElementById("remember")?.checked ?? false;

            if (!identifier || !passwordInput) {
                loginMessage.style.color = "#DC2626";
                loginMessage.textContent = "Por favor, completa todos los campos.";
                return;
            }

            const users = getLocalUsers();
            const matchedUser = users.find(u =>
                (u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier) &&
                u.password === passwordInput
            );

            if (!matchedUser) {
                loginMessage.style.color = "#DC2626";
                loginMessage.textContent = "Usuario o contraseña incorrectos.";
                return;
            }

            saveSession(
                {
                    user: matchedUser.email,
                    name: matchedUser.name,
                    role: matchedUser.role
                },
                rememberChecked
            );

            loginMessage.style.color = "#16A34A";
            loginMessage.textContent = `Bienvenido, ${matchedUser.name}. Redirigiendo...`;

            const destination = matchedUser.role === "admin"
                ? "admin/dashboard.html"
                : "cliente/dashboard.html";

            setTimeout(function () {
                window.location.href = destination;
            }, 500);
        });

        if (forgotPassword) {
            forgotPassword.addEventListener("click", function (event) {
                event.preventDefault();
                loginMessage.style.color = "#6D28D9";
                loginMessage.textContent =
                    "Para restablecer tu contraseña, comunícate con el administrador del sistema.";
            });
        }
    }

    // --- PROTECCIÓN DE PANELES Y CIERRE DE SESIÓN ---
    const currentPath = window.location.pathname;
    const activeSession = getSession();

    if (currentPath.includes("/admin/")) {
        if (!activeSession) {
            window.location.href = `${rootPrefix}login.html`;
        } else if (activeSession.role !== "admin") {
            window.location.href = `${rootPrefix}cliente/dashboard.html`;
        }
    }

    if (currentPath.includes("/cliente/")) {
        if (!activeSession) {
            window.location.href = `${rootPrefix}login.html`;
        }
    }

    document.querySelectorAll('a[href$="login.html"]').forEach(link => {
        if (link.textContent.toLowerCase().includes("cerrar sesión")) {
            link.addEventListener("click", function () {
                clearSession();
            });
        }
    });

    /* ==========================================
       6. GUARDAR CAMBIOS EN PANEL ADMIN
    ========================================== */

    const saveProjectsBtn = document.getElementById("saveProjectsBtn");
    const saveTicketsBtn = document.getElementById("saveTicketsBtn");
    const adminFeedback = document.getElementById("adminFeedback");

    function getAdminStatusClass(status) {
        if (status === "Pendiente") return "status-pending";
        if (status === "En proceso") return "status-process";
        if (status === "En revisión") return "status-review";
        return "status-finished";
    }

    function updateAdminTicketStats() {
        const ticketRows = document.querySelectorAll("#adminTicketsTable tr");
        const pendingEl = document.getElementById("adminPendingTickets");
        const resolvedEl = document.getElementById("adminResolvedTickets");

        if (!ticketRows.length) return;

        let pendingCount = 0;
        let resolvedCount = 0;

        ticketRows.forEach(row => {
            const select = row.querySelector(".admin-ticket-status");
            const currentStatus = select ? select.value : "";
            if (currentStatus === "Pendiente") pendingCount++;
            if (currentStatus === "Resuelto") resolvedCount++;
        });

        if (pendingEl) pendingEl.textContent = pendingCount;
        if (resolvedEl) resolvedEl.textContent = resolvedCount;
    }

    if (saveProjectsBtn) {
        saveProjectsBtn.addEventListener("click", function () {
            const rows = document.querySelectorAll("#adminProjectsTable tr");
            let updatedCount = 0;

            rows.forEach(row => {
                const select = row.querySelector(".admin-project-status");
                const badge = row.querySelector("td:nth-child(5) .status");
                if (select && badge) {
                    const newStatus = select.value;
                    badge.textContent = newStatus;
                    badge.className = "status " + getAdminStatusClass(newStatus);
                    updatedCount++;
                }
            });

            if (adminFeedback) {
                adminFeedback.style.color = "#16A34A";
                adminFeedback.textContent =
                    `¡Cambios guardados! Se actualizaron ${updatedCount} proyectos en el panel.`;
            }
        });
    }

    if (saveTicketsBtn) {
        saveTicketsBtn.addEventListener("click", function () {
            const rows = document.querySelectorAll("#adminTicketsTable tr");
            let updatedCount = 0;

            rows.forEach(row => {
                const select = row.querySelector(".admin-ticket-status");
                const badge = row.querySelector("td:nth-child(5) .status");
                if (select && badge) {
                    const newStatus = select.value;
                    badge.textContent = newStatus;
                    badge.className = "status " + getAdminStatusClass(newStatus);
                    updatedCount++;
                }
            });

            updateAdminTicketStats();

            if (adminFeedback) {
                adminFeedback.style.color = "#16A34A";
                adminFeedback.textContent =
                    `¡Cambios guardados! Se actualizaron ${updatedCount} tickets y los contadores del panel.`;
            }
        });
    }
    // --- ADAPTAR BARRA DE NAVEGACIÓN SEGÚN ROL (MENÚ DESPLEGABLE) ---
    const roleNavLinks = document.querySelector(".nav-links");
    if (activeSession && roleNavLinks) {
        const isAdmin = activeSession.role === "admin";
        const dashboardHref = isAdmin
            ? `${rootPrefix}admin/dashboard.html`
            : `${rootPrefix}cliente/dashboard.html`;

        const dashboardLabel = isAdmin
            ? "Panel Admin"
            : "Mi Panel";

        const displayAccountName = activeSession.name || activeSession.user || "Cuenta ISD";

        if (isAdmin) {
            roleNavLinks.innerHTML = `
                <li><a href="${rootPrefix}admin/dashboard.html">Panel Admin</a></li>
                <li><a href="${rootPrefix}proyectos.html">Proyectos</a></li>
                <li class="nav-actions-item">
                    <div class="nav-actions"></div>
                </li>
            `;
        }

        const navActions = roleNavLinks.querySelector(".nav-actions");
        if (navActions) {
            navActions.innerHTML = `
                <div class="isd-account-wrapper" id="isdAccountMenu">
                    <div class="isd-nav-icon-group">
                        <a href="${rootPrefix}soporte.html"
                           class="isd-nav-icon-btn"
                           title="Notificaciones y soporte"
                           aria-label="Notificaciones y soporte">
                            <i class="far fa-bell" aria-hidden="true"></i>
                        </a>
                        <button type="button"
                                class="isd-account-trigger--icon"
                                id="isdAccountTrigger"
                                title="${displayAccountName}"
                                aria-label="Menú de cuenta de ${displayAccountName}"
                                aria-expanded="false"
                                aria-haspopup="true">
                            <i class="far fa-user" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="isd-account-dropdown" role="menu">
                        <div class="isd-account-header">${displayAccountName}</div>
                        <a href="${rootPrefix}perfil.html" class="isd-account-item" role="menuitem">
                            <span>Mi perfil</span>
                            <span aria-hidden="true">›</span>
                        </a>
                        <a href="${dashboardHref}" class="isd-account-item" role="menuitem">
                            <span>${dashboardLabel}</span>
                            <span aria-hidden="true">›</span>
                        </a>
                        <a href="${rootPrefix}login.html" id="logoutNavBtn" class="isd-account-item isd-account-logout" role="menuitem">
                            <span>Cerrar sesión</span>
                        </a>
                    </div>
                </div>
            `;

            const accountWrapper = document.getElementById("isdAccountMenu");
            const accountTrigger = document.getElementById("isdAccountTrigger");

            if (accountWrapper && accountTrigger) {
                accountTrigger.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const isOpen = accountWrapper.classList.toggle("open");
                    accountTrigger.setAttribute("aria-expanded", String(isOpen));
                });

                document.addEventListener("click", function (event) {
                    if (!accountWrapper.contains(event.target)) {
                        accountWrapper.classList.remove("open");
                        accountTrigger.setAttribute("aria-expanded", "false");
                    }
                });
            }

            const logoutNavBtn = document.getElementById("logoutNavBtn");
            if (logoutNavBtn) {
                logoutNavBtn.addEventListener("click", function () {
                    clearSession();
                });
            }
        }
    }
    /* ==========================================
       7. MI PERFIL (ADAPTADO DE APP_2.JS)
    ========================================== */

    const toastEl = document.getElementById("toast");
    function showToast(message) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.add("show");
        setTimeout(() => {
            toastEl.classList.remove("show");
        }, 2800);
    }

    const darkModeCheckbox = document.getElementById("darkMode");
    const DARK_MODE_KEY = "isd_dark_mode";

    const savedDarkMode = localStorage.getItem(DARK_MODE_KEY) === "true";
    if (savedDarkMode) {
        document.body.classList.add("isd-dark");
    }
    if (darkModeCheckbox) {
        darkModeCheckbox.checked = savedDarkMode;
        darkModeCheckbox.addEventListener("change", function () {
            document.body.classList.toggle("isd-dark", this.checked);
            localStorage.setItem(DARK_MODE_KEY, String(this.checked));
            showToast(this.checked ? "Modo oscuro activado." : "Modo oscuro desactivado.");
        });
    }

    document.querySelectorAll(".isd-show-password").forEach(button => {
        button.addEventListener("click", function () {
            const box = this.closest(".isd-input-box");
            const input = box ? box.querySelector("input") : null;
            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = "password";
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });

    const celularProfileInput = document.getElementById("profileCelular");
    if (celularProfileInput) {
        celularProfileInput.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "").slice(0, 9);
        });
    }

    const personalForm = document.getElementById("personalForm");
    const passwordForm = document.getElementById("passwordForm");
    const deactivateBtn = document.getElementById("deactivate");

    if (personalForm || passwordForm || deactivateBtn) {
        const users = getLocalUsers();
        let currentUser = null;

        if (activeSession) {
            currentUser = users.find(
                u =>
                    u.email.toLowerCase() === String(activeSession.user || "").toLowerCase() ||
                    u.username.toLowerCase() === String(activeSession.user || "").toLowerCase()
            );
        }

        if (!currentUser) {
            currentUser = users.find(u => u.role === "cliente") || users[0];
        }

        function paintProfile(userObj) {
            if (!userObj) return;
            const isAdmin = userObj.role === "admin";
            const roleText = isAdmin ? "Administrador" : "Cliente";

            const fullName = userObj.name || "Usuario ISD";
            const parts = fullName.trim().split(/\s+/);
            const defaultFirst = userObj.firstName || parts[0] || "";
            const defaultLast = userObj.lastName || parts.slice(1).join(" ") || "";

            const headerName = document.getElementById("isdProfileHeaderName");
            const headerEmail = document.getElementById("isdProfileHeaderEmail");
            const headerPhone = document.getElementById("isdProfileHeaderPhone");
            const headerAddress = document.getElementById("isdProfileHeaderAddress");
            const roleBadge = document.getElementById("isdProfileRoleBadge");

            if (headerName) headerName.textContent = fullName;
            if (headerEmail) headerEmail.textContent = userObj.email || "";
            if (headerPhone) headerPhone.textContent = userObj.phone || "Sin teléfono registrado";
            if (headerAddress) headerAddress.textContent = userObj.address || "Sin dirección registrada";

            if (roleBadge) {
                roleBadge.textContent = roleText;
                roleBadge.classList.toggle("is-admin", isAdmin);
            }

            const nombresInput = document.getElementById("profileNombres");
            const apellidosInput = document.getElementById("profileApellidos");
            const correoInput = document.getElementById("profileCorreo");
            const celularInput = document.getElementById("profileCelular");
            const rolInput = document.getElementById("profileRole");
            const direccionInput = document.getElementById("profileDireccion");

            if (nombresInput) nombresInput.value = defaultFirst;
            if (apellidosInput) apellidosInput.value = defaultLast;
            if (correoInput) correoInput.value = userObj.email || "";
            if (celularInput) celularInput.value = userObj.phone || "";
            if (rolInput) rolInput.value = roleText;
            if (direccionInput) direccionInput.value = userObj.address || "";
        }

        paintProfile(currentUser);

        if (personalForm && currentUser) {
            personalForm.addEventListener("submit", function (e) {
                e.preventDefault();

                const nombres = this.elements.nombres.value.trim();
                const apellidos = this.elements.apellidos.value.trim();
                const correo = this.elements.correo.value.trim().toLowerCase();
                const celular = this.elements.celular.value.trim();
                const direccion = this.elements.direccion.value.trim();

                if (!nombres || !correo) {
                    showToast("Completa nombres y correo electrónico.");
                    return;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                    showToast("Ingresa un correo electrónico válido.");
                    return;
                }

                const updatedUsers = getLocalUsers().map(u => {
                    if (u.email.toLowerCase() === currentUser.email.toLowerCase()) {
                        return {
                            ...u,
                            firstName: nombres,
                            lastName: apellidos,
                            name: `${nombres} ${apellidos}`.trim(),
                            email: correo,
                            username: u.role === "admin" ? u.username : correo,
                            phone: celular,
                            address: direccion
                        };
                    }
                    return u;
                });

                saveLocalUsers(updatedUsers);
                currentUser = updatedUsers.find(
                    u => u.email.toLowerCase() === correo
                ) || currentUser;

                if (activeSession) {
                    saveSession(
                        {
                            user: currentUser.email,
                            name: currentUser.name,
                            role: currentUser.role
                        },
                        Boolean(localStorage.getItem(SESSION_KEY))
                    );
                }

                paintProfile(currentUser);
                showToast("Datos personales actualizados en local.");
            });
        }

        if (passwordForm && currentUser) {
            passwordForm.addEventListener("submit", function (e) {
                e.preventDefault();

                const actual = this.elements.actual.value;
                const nueva = this.elements.nueva.value;
                const confirmar = this.elements.confirmar.value;

                if (!actual || !nueva || !confirmar) {
                    showToast("Completa todos los campos de contraseña.");
                    return;
                }

                if (actual !== currentUser.password) {
                    showToast("La contraseña actual no es correcta.");
                    return;
                }

                if (nueva.length < 8) {
                    showToast("La contraseña debe tener mínimo 8 caracteres.");
                    return;
                }

                if (nueva !== confirmar) {
                    showToast("Las contraseñas no coinciden.");
                    return;
                }

                const updatedUsers = getLocalUsers().map(u => {
                    if (u.email.toLowerCase() === currentUser.email.toLowerCase()) {
                        return { ...u, password: nueva };
                    }
                    return u;
                });

                saveLocalUsers(updatedUsers);
                currentUser.password = nueva;
                this.reset();
                showToast("Contraseña actualizada en modo local.");
            });
        }

        if (deactivateBtn && currentUser) {
            deactivateBtn.addEventListener("click", function () {
                const confirmation = confirm(
                    "¿Deseas desactivar esta cuenta? Se cerrará tu sesión y no podrás iniciar sesión con ella."
                );

                if (!confirmation) return;

                const updatedUsers = getLocalUsers().map(u => {
                    if (u.email.toLowerCase() === currentUser.email.toLowerCase()) {
                        return { ...u, active: false };
                    }
                    return u;
                });

                saveLocalUsers(updatedUsers);
                clearSession();
                showToast("Cuenta desactivada. Redirigiendo al inicio de sesión...");

                setTimeout(() => {
                    window.location.href = `${rootPrefix}login.html`;
                }, 1200);
            });
        }
    }
});