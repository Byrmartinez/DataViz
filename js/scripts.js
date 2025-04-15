// Esperar a que el DOM se cargue completamente
document.addEventListener('DOMContentLoaded', function () {
    // Configuración del año actual en el footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Inicializar el modo de tema basado en preferencias del usuario
    initializeTheme();

    // Configurar el botón de cambio de tema
    setupThemeToggle();

    // Configurar navegación suave
    setupSmoothScrolling();

    // Inicializar gráficos
    initializeCharts();

    // Configurar interactividad de las tarjetas de estadísticas
    setupStatCardsInteractivity();
});

// Función para inicializar el tema
function initializeTheme() {
    // Comprobar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        // Aplicar tema guardado
        document.body.setAttribute('data-bs-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Comprobar preferencia del sistema
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (prefersDarkScheme) {
            document.body.setAttribute('data-bs-theme', 'dark');
            updateThemeIcon('dark');
            localStorage.setItem('theme', 'dark');
        }
    }
}

// Función para configurar el botón de cambio de tema
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');

    themeToggle.addEventListener('click', function () {
        const currentTheme = document.body.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Cambiar el tema
        document.body.setAttribute('data-bs-theme', newTheme);

        // Actualizar icono
        updateThemeIcon(newTheme);

        // Guardar preferencia
        localStorage.setItem('theme', newTheme);

        // Actualizar gráficos para el nuevo tema
        updateChartsTheme(newTheme);
    });
}

// Función para actualizar el icono del botón de tema
function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');

    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Función para configurar navegación suave
function setupSmoothScrolling() {
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId.startsWith('#')) {
                e.preventDefault();

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Calcular la posición para el desplazamiento (offset para el navbar sticky)
                    const navbarHeight = document.querySelector('#mainNav').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Actualizar URL sin recargar la página
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
}

// Datos para los diferentes tópicos
const chartData = {
    users: {
        sales: {
            label: 'Nuevos usuarios por mes (2024)',
            data: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1200, 1100, 980, 950]
        },
        distribution: {
            labels: ['Desktop', 'Mobile', 'Tablet'],
            data: [55, 35, 10]
        },
        regions: {
            data: [40, 32, 28, 15, 10, 6]
        },
        topItems: [
            { name: 'Plan Premium', value: 85 },
            { name: 'Registro básico', value: 70 },
            { name: 'Usuarios activos', value: 65 },
            { name: 'Usuarios con trial', value: 50 }
        ]
    },
    revenue: {
        sales: {
            label: 'Ingresos mensuales ($K)',
            data: [1250, 1400, 1350, 1500, 1800, 2100, 2250, 2400, 2300, 2150, 2450, 2500]
        },
        distribution: {
            labels: ['Suscripciones', 'Ventas únicas', 'Servicios'],
            data: [65, 25, 10]
        },
        regions: {
            data: [52, 38, 30, 14, 8, 5]
        },
        topItems: [
            { name: 'Suscripción anual', value: 90 },
            { name: 'Suscripción mensual', value: 65 },
            { name: 'Servicios premium', value: 55 },
            { name: 'Complementos', value: 40 }
        ]
    },
    sales: {
        sales: {
            label: 'Unidades vendidas (2024)',
            data: [1500, 1700, 1600, 1800, 2200, 2500, 2600, 2800, 2700, 2400, 2900, 3100]
        },
        distribution: {
            labels: ['Producto A', 'Producto B', 'Producto C'],
            data: [45, 35, 20]
        },
        regions: {
            data: [48, 32, 25, 15, 10, 7]
        },
        topItems: [
            { name: 'Producto Premium', value: 82 },
            { name: 'Paquete básico', value: 68 },
            { name: 'Oferta especial', value: 60 },
            { name: 'Producto estacional', value: 45 }
        ]
    },
    countries: {
        sales: {
            label: 'Países activos por mes (2024)',
            data: [65, 70, 75, 82, 85, 90, 95, 98, 102, 104, 105, 106]
        },
        distribution: {
            labels: ['América', 'Europa', 'Asia-Pacífico'],
            data: [40, 35, 25]
        },
        regions: {
            data: [38, 35, 32, 20, 15, 12]
        },
        topItems: [
            { name: 'Estados Unidos', value: 95 },
            { name: 'Alemania', value: 75 },
            { name: 'China', value: 70 },
            { name: 'Brasil', value: 60 }
        ]
    }
};

// Función para inicializar los gráficos
function initializeCharts() {
    // Obtener el tema actual
    const currentTheme = document.body.getAttribute('data-bs-theme');

    // Configurar los colores basados en el tema
    const textColor = currentTheme === 'dark' ? '#e0e0e0' : '#5a5c69';
    const gridColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    // Configuración global para todos los gráficos
    Chart.defaults.color = textColor;
    Chart.defaults.borderColor = gridColor;

    // Gráfico de ventas mensuales (Línea)
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Ventas 2024',
                data: [12, 19, 15, 12, 18, 21, 22, 24, 23, 19, 24, 26],
                backgroundColor: 'rgba(78, 115, 223, 0.2)',
                borderColor: '#4e73df',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });

    // Gráfico de distribución de usuarios (Dona)
    const usersCtx = document.getElementById('usersChart').getContext('2d');
    const usersChart = new Chart(usersCtx, {
        type: 'doughnut',
        data: {
            labels: ['Desktop', 'Mobile', 'Tablet'],
            datasets: [{
                data: [55, 35, 10],
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                hoverBorderColor: 'rgba(234, 236, 244, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });

    // Gráfico de rendimiento regional (Barra)
    const regionsCtx = document.getElementById('regionsChart').getContext('2d');
    const regionsChart = new Chart(regionsCtx, {
        type: 'bar',
        data: {
            labels: ['América del Norte', 'Europa', 'Asia', 'Sudamérica', 'África', 'Oceanía'],
            datasets: [{
                label: 'Ventas por Región',
                data: [45, 30, 25, 18, 12, 8],
                backgroundColor: [
                    'rgba(78, 115, 223, 0.8)',
                    'rgba(28, 200, 138, 0.8)',
                    'rgba(246, 194, 62, 0.8)',
                    'rgba(54, 185, 204, 0.8)',
                    'rgba(231, 74, 59, 0.8)',
                    'rgba(133, 135, 150, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });

    // Guardar referencias a los gráficos para poder actualizarlos
    window.dashboardCharts = {
        sales: salesChart,
        users: usersChart,
        regions: regionsChart
    };

    // También actualiza las barras de progreso con los datos iniciales (ventas)
    updateProgressBars(chartData.sales.topItems);
}

// Función para actualizar los gráficos cuando cambia el tema
function updateChartsTheme(theme) {
    // Configurar los colores basados en el tema
    const textColor = theme === 'dark' ? '#e0e0e0' : '#5a5c69';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    // Actualizar configuración global
    Chart.defaults.color = textColor;
    Chart.defaults.borderColor = gridColor;

    // Actualizar cada gráfico
    if (window.dashboardCharts) {
        for (const [key, chart] of Object.entries(window.dashboardCharts)) {
            // Actualizar colores de la cuadrícula
            if (chart.options.scales) {
                if (chart.options.scales.y) {
                    chart.options.scales.y.grid.color = gridColor;
                }
                if (chart.options.scales.x) {
                    chart.options.scales.x.grid.color = gridColor;
                }
            }

            // Actualizar el gráfico
            chart.update();
        }
    }
}

// Función para configurar la interactividad de las tarjetas de estadísticas
function setupStatCardsInteractivity() {
    // Obtener todas las tarjetas de estadísticas
    const statCards = document.querySelectorAll('#overview .card');

    // Añadir clase para cambiar el cursor
    statCards.forEach(card => {
        card.classList.add('clickable-card');
    });

    // Asignar IDs a las tarjetas si no los tienen
    const cardIds = ['users', 'revenue', 'sales', 'countries'];
    statCards.forEach((card, index) => {
        if (index < cardIds.length) {
            card.setAttribute('data-card-id', cardIds[index]);
        }
    });

    // Añadir evento de clic a cada tarjeta
    statCards.forEach(card => {
        card.addEventListener('click', function () {
            // Eliminar clase activa de todas las tarjetas
            statCards.forEach(c => c.classList.remove('active-card'));

            // Añadir clase activa a la tarjeta clicada
            this.classList.add('active-card');

            // Obtener el ID de la tarjeta
            const cardId = this.getAttribute('data-card-id');

            // Actualizar todos los gráficos con los datos correspondientes
            updateAllCharts(cardId);

            // Desplazarse suavemente a la sección de analítica
            const analyticsSection = document.getElementById('analytics');
            const navbarHeight = document.querySelector('#mainNav').offsetHeight;
            const targetPosition = analyticsSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Activar la primera tarjeta por defecto
    if (statCards.length > 0) {
        statCards[0].classList.add('active-card');
    }
}

// Función para actualizar todos los gráficos basados en el ID de la tarjeta
function updateAllCharts(cardId) {
    if (!chartData[cardId]) return;

    const data = chartData[cardId];

    // Actualizar gráfico de línea
    if (window.dashboardCharts.sales) {
        window.dashboardCharts.sales.data.datasets[0].label = data.sales.label;
        window.dashboardCharts.sales.data.datasets[0].data = data.sales.data;
        window.dashboardCharts.sales.update();
    }

    // Actualizar gráfico de dona
    if (window.dashboardCharts.users) {
        window.dashboardCharts.users.data.labels = data.distribution.labels;
        window.dashboardCharts.users.data.datasets[0].data = data.distribution.data;
        window.dashboardCharts.users.update();
    }

    // Actualizar gráfico de barras
    if (window.dashboardCharts.regions) {
        window.dashboardCharts.regions.data.datasets[0].data = data.regions.data;
        window.dashboardCharts.regions.update();
    }

    // Actualizar barras de progreso
    updateProgressBars(data.topItems);

    // Actualizar títulos de las secciones
    updateSectionTitles(cardId);
}

// Función para actualizar las barras de progreso
function updateProgressBars(items) {
    const progressContainer = document.querySelector('#trends .progress-container');
    if (!progressContainer) return;

    // Vaciar el contenedor
    progressContainer.innerHTML = '';

    // Añadir nuevas barras de progreso
    items.forEach(item => {
        const progressHTML = `
            <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: ${item.value}%;" 
                     aria-valuenow="${item.value}" aria-valuemin="0" aria-valuemax="100">
                    ${item.name} - ${item.value}%
                </div>
            </div>
        `;
        progressContainer.innerHTML += progressHTML;
    });
}

// Función para actualizar los títulos de las secciones
function updateSectionTitles(cardId) {
    const titles = {
        users: {
            chart1: 'Crecimiento de Usuarios',
            chart2: 'Distribución de Plataformas',
            chart3: 'Rendimiento Regional',
            trends: 'Métricas de Usuarios'
        },
        revenue: {
            chart1: 'Ingresos Mensuales',
            chart2: 'Fuentes de Ingreso',
            chart3: 'Distribución por Región',
            trends: 'Fuentes de Ingreso Principales'
        },
        sales: {
            chart1: 'Ventas Mensuales',
            chart2: 'Distribución de Productos',
            chart3: 'Ventas por Región',
            trends: 'Productos Más Vendidos'
        },
        countries: {
            chart1: 'Expansión Global',
            chart2: 'Distribución Continental',
            chart3: 'Actividad por Región',
            trends: 'Países Más Activos'
        }
    };

    if (!titles[cardId]) return;

    // Actualizar títulos
    document.querySelector('#salesChart').closest('.card').querySelector('.card-header').textContent = titles[cardId].chart1;
    document.querySelector('#usersChart').closest('.card').querySelector('.card-header').textContent = titles[cardId].chart2;
    document.querySelector('#regionsChart').closest('.card').querySelector('.card-header').textContent = titles[cardId].chart3;
    document.querySelector('#trends .card-header').textContent = titles[cardId].trends;
}