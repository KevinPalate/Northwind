// ==========================================================
//  CONFIGURACIÓN API
// ==========================================================
const API_BASE = 'https://localhost:7068'; // Ajusta tu URL
const IVA = 0.15; // 15%

// ==========================================================
//  ELEMENTOS DEL DOM
// ==========================================================
const modalClientes = document.getElementById('modalClientes');
const modalProductos = document.getElementById('modalProductos');

const btnBuscarCliente = document.getElementById('btnBuscarCliente');
const btnAgregarProducto = document.getElementById('btnAgregarProducto');

const cerrarModalClientes = document.getElementById('cerrarModalClientes');
const cerrarModalProductos = document.getElementById('cerrarModalProductos');

// Abrir modales
btnBuscarCliente.onclick = () => abrirModalClientes();
btnAgregarProducto.onclick = () => abrirModalProductos();

// Cerrar modales
cerrarModalClientes.onclick = () => modalClientes.style.display = 'none';
cerrarModalProductos.onclick = () => modalProductos.style.display = 'none';

// Cerrar al dar click afuera
window.onclick = (event) => {
    if (event.target === modalClientes) modalClientes.style.display = 'none';
    if (event.target === modalProductos) modalProductos.style.display = 'none';
};

// ==========================================================
//  VARIABLES GLOBALES
// ==========================================================
let productoSeleccionado = null;

// Stock temporal que NO toca la BD
let stockVirtual = {};

// Guardamos los productos cargados
let productosGlobales = [];

// ==========================================================
//  CLIENTES
// ==========================================================
async function abrirModalClientes() {
    modalClientes.style.display = 'block';
    document.getElementById("buscarCliente").value = "";

    const response = await fetch(`${API_BASE}/GetCustomers?page=1&pageSize=200`);
    const clientes = await response.json();

    renderizarClientes(clientes);
}

async function buscarClientes() {
    const filtro = document.getElementById("buscarCliente").value.trim();

    const response = await fetch(`${API_BASE}/GetCustomers?Search=${encodeURIComponent(filtro)}&page=1&pageSize=200`);
    const clientes = await response.json();

    renderizarClientes(clientes);
}

async function verTodosClientes() {
    document.getElementById("buscarCliente").value = "";

    const response = await fetch(`${API_BASE}/GetCustomers?page=1&pageSize=200`);
    const clientes = await response.json();

    renderizarClientes(clientes);
}

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

// ==========================================================
//  PRODUCTOS
// ==========================================================
async function abrirModalProductos() {
    modalProductos.style.display = 'block';
    document.getElementById("buscarProducto").value = "";

    const response = await fetch(`${API_BASE}/GetProducts?page=1&pageSize=200`);
    const productos = await response.json();

    productosGlobales = productos;

    // Inicializar stock virtual
    productos.forEach(p => {
        if (stockVirtual[p.productId] === undefined) {
            stockVirtual[p.productId] = p.stock;
        }
    });

    renderizarProductos(productos);
}

async function buscarProductos() {
    const filtro = document.getElementById("buscarProducto").value.trim();

    const response = await fetch(`${API_BASE}/GetProducts?Search=${encodeURIComponent(filtro)}&page=1&pageSize=200`);
    const productos = await response.json();

    productosGlobales = productos;

    productos.forEach(p => {
        if (stockVirtual[p.productId] === undefined) {
            stockVirtual[p.productId] = p.stock;
        }
    });

    renderizarProductos(productos);
}

async function verTodosProductos() {
    document.getElementById("buscarProducto").value = "";

    const response = await fetch(`${API_BASE}/GetProducts?page=1&pageSize=200`);
    const productos = await response.json();

    productosGlobales = productos;

    renderizarProductos(productos);
}

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

// ==========================================================
//  PANEL AUXILIAR PARA AGREGAR AL DETALLE
// ==========================================================
function seleccionarProducto(productId, nombre, precioBase) {
    modalProductos.style.display = 'none';

    document.getElementById("panelProducto").style.display = "block";

    document.getElementById("auxProductId").value = productId;
    document.getElementById("auxProductName").value = nombre;

    const precioConIVA = (precioBase * (1 + IVA)).toFixed(2);
    document.getElementById("auxUnitPrice").value = precioConIVA;

    document.getElementById("auxStock").value = stockVirtual[productId];
}

document.getElementById("btnConfirmarAgregar").addEventListener("click", agregarProductoDetalle);

// ============================
// AGREGAR PRODUCTO AL DETALLE (corregido)
// ============================
function agregarProductoDetalle() {
    const id = document.getElementById("auxProductId").value;
    const nombre = document.getElementById("auxProductName").value;
    const precio = parseFloat(document.getElementById("auxUnitPrice").value);
    const cantidad = parseInt(document.getElementById("auxQuantity").value, 10);

    // Asegurar que stockVirtual tiene valor (por si acaso)
    if (stockVirtual[id] === undefined) stockVirtual[id] = 0;
    const stockDisponible = stockVirtual[id];

    if (!id) return alert("No hay producto seleccionado.");
    if (!Number.isInteger(cantidad) || cantidad <= 0) return alert("La cantidad debe ser mayor a 0.");
    if (cantidad > stockDisponible) return alert("Cantidad supera el stock disponible");

    const tbody = document.querySelector("#tablaProductos tbody");

    // Buscar si ya está en la tabla
    let existente = [...tbody.querySelectorAll("tr")]
        .find(row => row.dataset.id == id);

    if (existente) {
        // Cantidad que ya hay en la tabla
        const cantidadActual = parseInt(existente.querySelector(".td-cantidad").innerText, 10);
        // Queremos añadir "cantidad" más — verificar contra stockDisponible
        if (cantidad > stockDisponible) {
            return alert("No hay suficiente stock para añadir esa cantidad.");
        }

        const nuevaCantidad = cantidadActual + cantidad;
        existente.querySelector(".td-cantidad").innerText = nuevaCantidad;
        existente.querySelector(".td-subtotal").innerText = (nuevaCantidad * precio).toFixed(2);

    } else {
        // Crear nueva fila
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

    // 🔥 Descontar DEL STOCK VIRTUAL la cantidad añadida (siempre)
    stockVirtual[id] = stockDisponible - cantidad;
    if (stockVirtual[id] < 0) stockVirtual[id] = 0; // seguridad

    // 🔥 Actualizar stock en modal (si existe fila)
    const filaModal = document.querySelector(`#prod-${id} .stock-col`);
    if (filaModal) filaModal.innerText = stockVirtual[id];

    // Actualizar campo auxiliar
    document.getElementById("auxStock").value = stockVirtual[id];

    calcularTotalFactura();

    // ocultar panel auxiliar
    document.getElementById("panelProducto").style.display = "none";
}

// ==========================================================
//  ELIMINAR DEL DETALLE
// ==========================================================
// ============================
// ELIMINAR DEL DETALLE (mejorada)
// ============================
function eliminarProducto(btn) {
    const row = btn.closest("tr");
    if (!row) return;

    const id = row.dataset.id;
    const cantidad = parseInt(row.querySelector(".td-cantidad").innerText, 10) || 0;

    // Devolver STOCK VIRTUAL (siempre)
    if (stockVirtual[id] === undefined) stockVirtual[id] = 0;
    stockVirtual[id] += cantidad;

    // actualizar stock en modal si visible
    const filaModal = document.querySelector(`#prod-${id} .stock-col`);
    if (filaModal) {
        filaModal.innerText = stockVirtual[id];
    }

    row.remove();
    calcularTotalFactura();
}

// ==========================================================
//  CALCULAR TOTAL FACTURA
// ==========================================================
function calcularTotalFactura() {
    let total = 0;

    document.querySelectorAll("#tablaProductos tbody tr").forEach(row => {
        total += parseFloat(row.querySelector(".td-subtotal").innerText);
    });

    document.getElementById("totalFactura").innerText = total.toFixed(2);
}










async function guardarOrden() {

    const customerId = document.getElementById("clienteId").value;
    const shipAddress = document.getElementById("shipAddress").value;
    const shipCity = document.getElementById("shipCity").value;
    const shipCountry = document.getElementById("shipCountry").value;
    const shipPostalCode = document.getElementById("shipPostalCode").value;

    if (!customerId) {
        alert("Debe seleccionar un cliente.");
        return;
    }

    // RECORRER LA TABLA
    const rows = document.querySelectorAll("#tablaProductos tbody tr");

    if (rows.length === 0) {
        alert("Debe agregar al menos un producto.");
        return;
    }

    let detalles = [];

    rows.forEach(row => {
        const id = parseInt(row.dataset.id, 10);
        const precio = parseFloat(row.children[1].innerText);   // precio unitario (con IVA si tú lo calculaste)
        const cantidad = parseInt(row.children[2].innerText, 10);

        detalles.push({
            productId: id,
            unitPrice: precio,
            quantity: cantidad
        });
    });

    const data = {
        customerId,
        shipAddress,
        shipCity,
        shipCountry,
        shipPostalCode,
        orderDetails: detalles
    };

    console.log("JSON enviado:", data); // útil para debug

    const resp = await fetch(`${API_BASE}/CreateOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!resp.ok) {
        alert("Error al crear la orden");
        return;
    }

    const result = await resp.json();
    console.log(result);

    alert("Orden creada correctamente. ID: " + result);

    // limpiar después de crear 👍
    limpiarFactura();
}

function limpiarFactura() {

    // Limpiar cliente
    document.getElementById("clienteId").value = "";
    document.getElementById("clienteNombre").value = "";
    document.getElementById("clienteEmail").value = "";

    // Limpiar dirección de envío
    document.getElementById("shipAddress").value =
        document.getElementById("shipCity").value =
        document.getElementById("shipCountry").value =
        document.getElementById("shipPostalCode").value = "";

    // Limpiar detalle de productos
    document.querySelector("#tablaProductos tbody").innerHTML = "";

    // Total a cero
    document.getElementById("totalFactura").innerText = "0.00";

    // Reiniciar panel de producto
    document.getElementById("panelProducto").style.display = "none";

    // Opcional: Reiniciar el stock virtual
    stockVirtual = {};

    console.log("Factura limpiada ✔️");
}
