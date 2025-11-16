// ====================================================================
//  CONFIGURACIÓN GENERAL
// ====================================================================
console.log("📦 Facturación inicializada...");

const API_BASE = "https://localhost:7068";
const IVA = 0.15; // 15%

// ====================================================================
//  CONTROLADOR GENERAL DEL FRONTEND
// ====================================================================
const FacturacionApp = {
    mostrarSeccion(id) {
        console.log("📌 Cambiando a sección:", id);

        // Oculta todas las secciones
        document.querySelectorAll(".seccion").forEach(sec => sec.style.display = "none");

        // Muestra la que corresponde
        const target = document.getElementById(id);
        if (target) target.style.display = "block";
    },

    nuevaOrden() {
        console.log("🧾 Nueva orden");
        limpiarFactura();
        this.mostrarSeccion("facturacion");
    }
};

// ===============================
// EVENTOS DEL NAVBAR
// ===============================
document.getElementById("navDashboard")?.addEventListener("click", (e) => {
    e.preventDefault();
    FacturacionApp.mostrarSeccion("dashboard");
});

document.getElementById("navFacturacion")?.addEventListener("click", (e) => {
    e.preventDefault();
    FacturacionApp.mostrarSeccion("facturacion");
});

document.getElementById("navVerFacturas")?.addEventListener("click", (e) => {
    e.preventDefault();
    FacturacionApp.mostrarSeccion("facturas");
});

// Botón “Nueva Orden”
document.getElementById("btnNuevaOrden")?.addEventListener("click", (e) => {
    e.preventDefault();
    FacturacionApp.nuevaOrden();
});

// ====================================================================
//  ELEMENTOS DEL DOM
// ====================================================================
const DOM = {
    modClientes: document.getElementById("modalClientes"),
    modProductos: document.getElementById("modalProductos"),

    btnBuscarCliente: document.getElementById("btnBuscarCliente"),
    btnAgregarProducto: document.getElementById("btnAgregarProducto"),

    cerrarModalClientes: document.getElementById("cerrarModalClientes"),
    cerrarModalProductos: document.getElementById("cerrarModalProductos"),

    tablaClientesBody: document.querySelector("#tablaClientes tbody"),
    tablaProductosBody: document.querySelector("#tablaProductos tbody"),
    tablaProductosModal: document.querySelector("#tablaProductosModal tbody"),

    totalFactura: document.getElementById("totalFactura"),

    panelProducto: document.getElementById("panelProducto"),

    // Campos auxiliares
    auxId: document.getElementById("auxProductId"),
    auxName: document.getElementById("auxProductName"),
    auxPrice: document.getElementById("auxUnitPrice"),
    auxStock: document.getElementById("auxStock"),
    auxQuantity: document.getElementById("auxQuantity"),
};

// ====================================================================
//  VARIABLES GLOBALES
// ====================================================================
let stockVirtual = {};        // Stock temporal en memoria
let productosGlobales = [];   // Productos cargados en modal

// ====================================================================
//  INICIALIZACIÓN
// ====================================================================
function inicializarFacturacion() {
    console.log("⚙ Inicializando eventos...");

    // Abrir modales
    DOM.btnBuscarCliente.onclick = abrirModalClientes;
    DOM.btnAgregarProducto.onclick = abrirModalProductos;

    // Cerrar modales
    DOM.cerrarModalClientes.onclick = () => (DOM.modClientes.style.display = "none");
    DOM.cerrarModalProductos.onclick = () => (DOM.modProductos.style.display = "none");

    // Cerrar click afuera
    window.onclick = (e) => {
        if (e.target === DOM.modClientes) DOM.modClientes.style.display = "none";
        if (e.target === DOM.modProductos) DOM.modProductos.style.display = "none";
    };

    // ================= MODAL CLIENTES =================
    document.getElementById("btnBuscarClienteModal").onclick = buscarClientes;
    document.getElementById("btnVerTodosClientes").onclick = abrirModalClientes;

    // ================= MODAL PRODUCTOS =================
    document.getElementById("btnBuscarProductoModal").onclick = buscarProductos;
    document.getElementById("btnVerTodosProductos").onclick = abrirModalProductos;

    // Confirmar agregado
    document.getElementById("btnConfirmarAgregar")
        .addEventListener("click", agregarProductoDetalle);

    // Botón Guardar Orden
    document.getElementById("btnGuardar").onclick = guardarOrden;

    console.log("✅ Sistema de facturación listo.");
}

document.addEventListener("DOMContentLoaded", inicializarFacturacion);

// ====================================================================
//  MODAL CLIENTES
// ====================================================================
async function abrirModalClientes() {
    console.log("📂 Abriendo modal clientes...");
    DOM.modClientes.style.display = "block";

    const resp = await fetch(`${API_BASE}/GetCustomers?page=1&pageSize=200`);
    const clientes = await resp.json();

    renderClientes(clientes);
}

async function buscarClientes() {
    const texto = document.getElementById("buscarCliente").value.trim();
    const resp = await fetch(`${API_BASE}/GetCustomers?Search=${texto}&page=1&pageSize=200`);
    renderClientes(await resp.json());
}

function renderClientes(clientes) {
    DOM.tablaClientesBody.innerHTML = "";

    clientes.forEach(c => {
        DOM.tablaClientesBody.innerHTML += `
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

function seleccionarCliente(id, nombre, email) {
    console.log("👤 Cliente seleccionado:", nombre);

    document.getElementById("clienteId").value = id;
    document.getElementById("clienteNombre").value = nombre;
    document.getElementById("clienteEmail").value = email;

    DOM.modClientes.style.display = "none";
}

// ====================================================================
//  MODAL PRODUCTOS
// ====================================================================
async function abrirModalProductos() {
    console.log("📦 Abriendo modal productos...");
    DOM.modProductos.style.display = "block";

    const resp = await fetch(`${API_BASE}/GetProducts?page=1&pageSize=200`);
    productosGlobales = await resp.json();

    inicializarStockVirtual(productosGlobales);

    renderProductos(productosGlobales);
}
async function buscarProductos() {
    const texto = document.getElementById("buscarProducto").value.trim();
    const resp = await fetch(`${API_BASE}/GetProducts?Search=${texto}&page=1&pageSize=200`);
    renderProductos(await resp.json());
}

function inicializarStockVirtual(productos) {
    productos.forEach(p => {
        if (stockVirtual[p.productId] === undefined) {
            stockVirtual[p.productId] = p.stock;
        }
    });
}

function renderProductos(lista) {
    DOM.tablaProductosModal.innerHTML = "";

    lista.forEach(p => {
        if (stockVirtual[p.productId] > 0) { // Solo mostrar si hay stock
            DOM.tablaProductosModal.innerHTML += `
            <tr id="prod-${p.productId}">
                <td>${p.productId}</td>
                <td>${p.name}</td>
                <td>${p.unitPrice.toFixed(2)}</td>
                <td class="stock-col">${stockVirtual[p.productId]}</td>
                <td>
                    <button class="btn-select"
                        onclick="seleccionarProducto('${p.productId}', '${p.name}', '${p.unitPrice}')">
                        Seleccionar
                    </button>
                </td>
            </tr>
        `;
        }
    });
}

function seleccionarProducto(id, nombre, precioBase) {
    console.log("🛒 Producto seleccionado:", nombre);
    DOM.modProductos.style.display = "none";

    DOM.panelProducto.style.display = "block";

    DOM.auxId.value = id;
    DOM.auxName.value = nombre;
    DOM.auxPrice.value = (precioBase * (1 + IVA)).toFixed(2);
    DOM.auxStock.value = stockVirtual[id];
}

// ====================================================================
//  AGREGAR PRODUCTO AL DETALLE
// ====================================================================
function agregarProductoDetalle() {
    const id = DOM.auxId.value;
    const nombre = DOM.auxName.value;
    const precio = parseFloat(DOM.auxPrice.value);
    const cantidad = parseInt(DOM.auxQuantity.value, 10);
    const stockDisponible = stockVirtual[id];

    if (!id) return alert("Seleccione un producto.");
    if (cantidad <= 0) return alert("Cantidad inválida.");
    if (cantidad > stockDisponible) return alert("No hay stock suficiente.");

    const trExistente = [...DOM.tablaProductosBody.querySelectorAll("tr")]
        .find(r => r.dataset.id == id);

    if (trExistente) {
        const cantActual = parseInt(trExistente.querySelector(".td-cantidad").innerText, 10);
        const nueva = cantActual + cantidad;

        trExistente.querySelector(".td-cantidad").innerText = nueva;
        trExistente.querySelector(".td-subtotal").innerText = (nueva * precio).toFixed(2);
    } else {
        const subtotal = (cantidad * precio).toFixed(2);

        DOM.tablaProductosBody.innerHTML += `
            <tr data-id="${id}">
                <td>${nombre}</td>
                <td>${precio.toFixed(2)}</td>
                <td class="td-cantidad">${cantidad}</td>
                <td class="td-subtotal">${subtotal}</td>
                <td><button onclick="eliminarProducto(this)">⛔ Eliminar</button></td>
            </tr>
        `;
    }

    // Actualizar stock virtual
    stockVirtual[id] -= cantidad;

    const fila = document.querySelector(`#prod-${id} .stock-col`);
    if (fila) fila.innerText = stockVirtual[id];

    DOM.auxStock.value = stockVirtual[id];

    calcularTotalFactura();

    DOM.panelProducto.style.display = "none";
}

// ====================================================================
//  ELIMINAR PRODUCTO DEL DETALLE
// ====================================================================
function eliminarProducto(btn) {
    const tr = btn.closest("tr");
    const id = tr.dataset.id;
    const cantidad = parseInt(tr.querySelector(".td-cantidad").innerText, 10);

    stockVirtual[id] += cantidad;

    const fila = document.querySelector(`#prod-${id} .stock-col`);
    if (fila) fila.innerText = stockVirtual[id];

    tr.remove();
    calcularTotalFactura();
}

// ====================================================================
//  CALCULAR TOTAL
// ====================================================================
function calcularTotalFactura() {
    let total = 0;

    DOM.tablaProductosBody.querySelectorAll("tr").forEach(r => {
        total += parseFloat(r.querySelector(".td-subtotal").innerText);
    });

    DOM.totalFactura.innerText = total.toFixed(2);
}

// ====================================================================
//  GUARDAR ORDEN
// ====================================================================
async function guardarOrden() {
    console.log("💾 Guardando orden...");

    const customerId = document.getElementById("clienteId").value;

    if (!customerId) return alert("Seleccione un cliente.");

    const rows = DOM.tablaProductosBody.querySelectorAll("tr");
    if (rows.length === 0) return alert("Debe agregar productos.");

    const detalles = [...rows].map(r => ({
        productId: parseInt(r.dataset.id),
        unitPrice: parseFloat(r.children[1].innerText),
        quantity: parseInt(r.children[2].innerText),
    }));

    const data = {
        customerId,
        shipAddress: document.getElementById("shipAddress").value,
        shipCity: document.getElementById("shipCity").value,
        shipCountry: document.getElementById("shipCountry").value,
        shipPostalCode: document.getElementById("shipPostalCode").value,
        orderDetails: detalles
    };

    console.log("📨 Enviando JSON:", data);

    const resp = await fetch(`${API_BASE}/CreateOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    //console.log(res);
    
    if (!resp.ok) return alert("Error al crear la orden.");

    const id = await resp.json();

    alert("Orden creada correctamente. ID: " + id);

    limpiarFactura();
}

// ====================================================================
//  LIMPIAR FACTURA COMPLETA
// ====================================================================
function limpiarFactura() {
    console.log("🧹 Limpiando factura...");

    // Cliente
    document.getElementById("clienteId").value = "";
    document.getElementById("clienteNombre").value = "";
    document.getElementById("clienteEmail").value = "";

    // Dirección
    document.getElementById("shipAddress").value =
        document.getElementById("shipCity").value =
        document.getElementById("shipCountry").value =
        document.getElementById("shipPostalCode").value = "";

    // Productos
    DOM.tablaProductosBody.innerHTML = "";

    // Totales
    DOM.totalFactura.innerText = "0.00";

    // Panel auxiliar
    DOM.panelProducto.style.display = "none";

    // Regenerar stock virtual
    stockVirtual = {};

    console.log("✔ Factura reseteada.");
}

