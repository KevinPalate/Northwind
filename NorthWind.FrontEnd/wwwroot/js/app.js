// URL base de tu API Minimal
const API_BASE = 'https://localhost:7068'; // cambia según tu configuración

// Modales
const modalClientes = document.getElementById('modalClientes');
const modalProductos = document.getElementById('modalProductos');

// Botones abrir
const btnBuscarCliente = document.getElementById('btnBuscarCliente');
const btnAgregarProducto = document.getElementById('btnAgregarProducto');

// Botones cerrar
const cerrarModalClientes = document.getElementById('cerrarModalClientes');
const cerrarModalProductos = document.getElementById('cerrarModalProductos');

// Abrir modales
btnBuscarCliente.onclick = () => abrirModalClientes();
btnAgregarProducto.onclick = () => abrirModalProductos();

// Cerrar modales
cerrarModalClientes.onclick = () => modalClientes.style.display = 'none';
cerrarModalProductos.onclick = () => modalProductos.style.display = 'none';

// Cerrar modal al hacer click fuera del contenido
window.onclick = (event) => {
    if (event.target === modalClientes) modalClientes.style.display = 'none';
    if (event.target === modalProductos) modalProductos.style.display = 'none';
}

// Variables globales
let productoSeleccionado = null;

// ============================
// CLIENTES
// ============================

// Abre el modal y carga TODOS los clientes
async function abrirModalClientes() {
    modalClientes.style.display = 'block';

    document.getElementById("buscarCliente").value = ""; // limpiar búsqueda

    const response = await fetch(`${API_BASE}/GetCustomers?page=1&pageSize=200`);
    const clientes = await response.json();

    renderizarClientes(clientes);
}

// Buscar clientes por texto
async function buscarClientes() {
    const filtro = document.getElementById("buscarCliente").value.trim();

    const response = await fetch(`${API_BASE}/GetCustomers?Search=${encodeURIComponent(filtro)}&page=1&pageSize=200`);
    const clientes = await response.json();

    renderizarClientes(clientes);
}

// Ver TODOS los clientes (botón extra)
async function verTodosClientes() {
    document.getElementById("buscarCliente").value = ""; // limpiar input

    const response = await fetch(`${API_BASE}/GetCustomers?page=1&pageSize=200`);
    const clientes = await response.json();

    renderizarClientes(clientes);
}

// Renderiza los clientes en la tabla
function renderizarClientes(clientes) {
    const tbody = document.querySelector("#tablaClientes tbody");
    tbody.innerHTML = "";

    clientes.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.customerId}</td>
                <td>${c.firstName} ${c.lastName}</td>
                <td>${c.address}</td>
                <td>${c.email}</td>
                <td>${c.phoneNumber}</td>
                <td>
                    <button class="btn-select"
                        onclick="seleccionarCliente('${c.customerId}', '${c.firstName} ${c.lastName}', '${c.email}')">
                        Seleccionar
                    </button>
                </td>
            </tr>
        `;
    });
}

function seleccionarCliente(customerId, nombreCompleto, email) {
    document.getElementById("clienteId").value = customerId;
    document.getElementById("clienteNombre").value = nombreCompleto;
    document.getElementById("clienteEmail").value = email;

    modalClientes.style.display = 'none';
}

// ============================
// PRODUCTOS
// ============================

// STOCK VIRTUAL (no toca la BD real)
let stockVirtual = {};

// Abre el modal y carga TODOS los productos
async function abrirModalProductos() {
    modalProductos.style.display = 'block';

    document.getElementById("buscarProducto").value = ""; // limpiar búsqueda

    const response = await fetch(`${API_BASE}/GetProducts?page=1&pageSize=200`);
    const productos = await response.json();

    // Inicializa stock virtual si no existe
    productos.forEach(p => {
        if (!stockVirtual[p.productId]) {
            stockVirtual[p.productId] = p.stock;
        }
    });

    renderizarProductos(productos);
}

// Buscar productos
async function buscarProductos() {
    const filtro = document.getElementById("buscarProducto").value.trim();

    const response = await fetch(`${API_BASE}/GetProducts?Search=${encodeURIComponent(filtro)}&page=1&pageSize=200`);
    const productos = await response.json();

    // También aseguramos stock virtual
    productos.forEach(p => {
        if (!stockVirtual[p.productId]) {
            stockVirtual[p.productId] = p.stock;
        }
    });

    renderizarProductos(productos);
}

// Ver todos los productos
async function verTodosProductos() {
    document.getElementById("buscarProducto").value = "";

    const response = await fetch(`${API_BASE}/GetProducts?page=1&pageSize=200`);
    const productos = await response.json();

    renderizarProductos(productos);
}

// Renderiza la tabla del modal con STOCK VIRTUAL
function renderizarProductos(productos) {
    const tbody = document.querySelector("#tablaProductosModal tbody");
    tbody.innerHTML = "";

    productos.forEach(p => {
        const stock = stockVirtual[p.productId];

        tbody.innerHTML += `
            <tr id="prod-${p.productId}">
                <td>${p.productId}</td>
                <td>${p.name}</td>
                <td>${p.unitPrice.toFixed(2)}</td>
                <td class="stock-col">${stock}</td>
                <td>
                    <button class="btn-select"
                        onclick="seleccionarProducto('${p.productId}', '${p.name}', '${p.unitPrice}')">
                        Seleccionar
                    </button>
                </td>
            </tr>
        `;
    });
}

// Al seleccionar un producto del modal
function seleccionarProducto(productId, nombre, precio) {
    modalProductos.style.display = 'none';

    document.getElementById("panelProducto").style.display = "block";

    document.getElementById("auxProductId").value = productId;
    document.getElementById("auxProductName").value = nombre;
    document.getElementById("auxUnitPrice").value = precio;

    // STOCK DESDE EL VIRTUAL
    document.getElementById("auxStock").value = stockVirtual[productId];
}

document.getElementById("btnConfirmarAgregar").addEventListener("click", agregarProductoDetalle);

// ============================
// AGREGAR AL DETALLE
// ============================

function agregarProductoDetalle() {
    const id = document.getElementById("auxProductId").value;
    const nombre = document.getElementById("auxProductName").value;
    const precio = parseFloat(document.getElementById("auxUnitPrice").value);
    const cantidad = parseInt(document.getElementById("auxQuantity").value);
    const stock = stockVirtual[id]; // stock real virtual

    if (cantidad <= 0) {
        alert("La cantidad debe ser mayor a 0");
        return;
    }

    if (cantidad > stock) {
        alert("Cantidad supera el stock disponible");
        return;
    }

    const tbody = document.querySelector("#tablaProductos tbody");

    // Buscar si ya está en la tabla
    let existente = [...tbody.querySelectorAll("tr")]
        .find(row => row.dataset.id == id);

    if (existente) {
        const cantidadActual = parseInt(existente.querySelector(".td-cantidad").innerText);
        const nuevaCantidad = cantidadActual + cantidad;

        if (nuevaCantidad > stock) {
            alert("No hay suficiente stock para agregar más unidades.");
            return;
        }

        existente.querySelector(".td-cantidad").innerText = nuevaCantidad;
        existente.querySelector(".td-subtotal").innerText = (nuevaCantidad * precio).toFixed(2);
    } else {
        const subtotal = (cantidad * precio).toFixed(2);

        tbody.innerHTML += `
            <tr data-id="${id}">
                <td>${nombre}</td>
                <td>${precio.toFixed(2)}</td>
                <td class="td-cantidad">${cantidad}</td>
                <td class="td-subtotal">${subtotal}</td>
                <td><button onclick="eliminarProducto(this)">🧺🛒Eliminar</button></td>
            </tr>
        `;
    }

    // 🔥 DESCONTAR STOCK VIRTUAL
    stockVirtual[id] = stock - cantidad;

    // 🔥 ACTUALIZAR STOCK EN MODAL (si está abierto)
    const filaModal = document.querySelector(`#prod-${id} .stock-col`);
    if (filaModal) {
        filaModal.innerText = stockVirtual[id];
    }

    // Actualizar campo auxiliar
    document.getElementById("auxStock").value = stockVirtual[id];

    calcularTotalFactura();

    // ocultar panel
    document.getElementById("panelProducto").style.display = "none";
}

// ============================
// ELIMINAR DEL DETALLE
// ============================

function eliminarProducto(btn) {
    const row = btn.parentElement.parentElement;
    const id = row.dataset.id;
    const cantidad = parseInt(row.querySelector(".td-cantidad").innerText);

    // DEVOLVER STOCK VIRTUAL
    stockVirtual[id] += cantidad;

    // actualizar modal
    const filaModal = document.querySelector(`#prod-${id} .stock-col`);
    if (filaModal) {
        filaModal.innerText = stockVirtual[id];
    }

    row.remove();
    calcularTotalFactura();
}

// ============================
// CALCULAR TOTAL
// ============================

function calcularTotalFactura() {
    let total = 0;

    document.querySelectorAll("#tablaProductos tbody tr").forEach(row => {
        const subtotal = parseFloat(row.querySelector(".td-subtotal").innerText);
        total += subtotal;
    });

    document.getElementById("totalFactura").innerText = total.toFixed(2);
}