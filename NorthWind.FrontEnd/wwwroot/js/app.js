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

        //Limpiar campo busqueda
        DOMFacturas.inputBuscar.value = "";

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
    cargarNextOrderId();
    cargarFechaHoraFactura();
});

document.getElementById("navVerFacturas")?.addEventListener("click", (e) => {
    e.preventDefault();
    FacturacionApp.mostrarSeccion("facturas");
});

// Botón “Nueva Orden”
document.getElementById("btnNuevaOrden")?.addEventListener("click", (e) => {
    e.preventDefault();
    FacturacionApp.nuevaOrden();
    cargarNextOrderId();
    cargarFechaHoraFactura();
});

// ====================================================================
//  ELEMENTOS DEL DOM
// ====================================================================
const DOM = {
    modClientes: document.getElementById("modalClientes"),
    modProductos: document.getElementById("modalProductos"),

    btnBuscarCliente: document.getElementById("btnBuscarCliente"),
    btnAgregarProducto: document.getElementById("btnAgregarProducto"),
    btnSearchCliente: document.getElementById("btnBuscarClienteModal"),
    btnVerTodosClientes: document.getElementById("btnVerTodosClientes"),
    btnSearchProducto: document.getElementById("btnBuscarProductoModal"),
    btnVerTodosProductos: document.getElementById("btnVerTodosProductos"),

    inputSearhCliente: document.getElementById("buscarCliente"),
    inputSearhProducto: document.getElementById("buscarProducto"),

    cerrarModalClientes: document.getElementById("cerrarModalClientes"),
    cerrarModalProductos: document.getElementById("cerrarModalProductos"),

    tablaClientesBody: document.querySelector("#tablaClientes tbody"),
    tablaProductosBody: document.querySelector("#tablaProductos tbody"),
    tablaProductosModal: document.querySelector("#tablaProductosModal tbody"),

    subTotalFactura: document.getElementById("subTotalFactura"),
    ivaFactura: document.getElementById("ivaFactura"),
    totalFactura: document.getElementById("totalFactura"),

    panelProducto: document.getElementById("panelProducto"),

    // Campos auxiliares
    auxId: document.getElementById("auxProductId"),
    auxName: document.getElementById("auxProductName"),
    auxPrice: document.getElementById("auxUnitPrice"),
    auxbasePrice: document.getElementById("auxbasePrice"),
    auxStock: document.getElementById("auxStock"),
    auxQuantity: document.getElementById("auxQuantity"),

    // Campos de envio
    shipAddress: document.getElementById("shipAddress"),
    shipCity: document.getElementById("shipCity"),
    shipCountry: document.getElementById("shipCountry"),
    shipPostalCode: document.getElementById("shipPostalCode"),

    //Factura
    tablaFacturasBody: document.querySelector("#tablaFacturas tbody"),
    modalFactura: document.getElementById("modalFactura"),
    cerrarModalFactura: document.getElementById("cerrarModalFactura"),
    factCliente: document.getElementById("factCliente"),
    factDireccion: document.getElementById("factDireccion"),
    factCiudad: document.getElementById("factCiudad"),
    factPais: document.getElementById("factPais"),
    factPostal: document.getElementById("factPostal"),
    factFecha: document.getElementById("factFecha"),
    tablaDetalleFacturaBody: document.querySelector("#tablaDetalleFactura tbody"),
    factTotal: document.getElementById("factTotal"),
    inputBuscar: document.getElementById("buscarFactura")
};

// ====================================================================
//  VARIABLES GLOBALES
// ====================================================================
let stockVirtual = {};        // Stock temporal en memoria
let productosGlobales = [];   // Productos cargados en modal
let nextOrderId = null;       // Variable que muestra el numero de factura
let fechaFactura = "";        // Variable que muestra la fecha al hacer factura

let paginaCliente = 1;
let tamanioPaginaCliente = 7; // Puedes cambiarlo
let ultimaPaginaClientes = false;

let paginaProducto = 1;
let tamanioPaginaProducto = 7; // Puedes cambiarlo
let ultimaPaginaProductos = false;

// ====================================================================
//  INICIALIZACIÓN
// ====================================================================
function inicializarFacturacion() {
    console.log("⚙ Inicializando eventos...");

    // Abrir modales
    DOM.btnBuscarCliente.onclick = (e) => abrirModalClientes(e);
    DOM.btnAgregarProducto.onclick = (e) => abrirModalProductos(e);

    // Cerrar modales
    DOM.cerrarModalClientes.onclick = () => {
        DOM.modClientes.style.display = "none";
        console.log("❌ Modal Clientes cerrado");
        // Limpiar campo de búsqueda de CLIENTE
        DOM.inputSearhCliente.value = "";
    }
    DOM.cerrarModalProductos.onclick = () => {
        DOM.modProductos.style.display = "none";
        console.log("❌ Modal Productos cerrado");
        // Limpiar campo de búsqueda de PRODUCTO
        DOM.inputSearhProducto.value = "";
    };

    // Cerrar click afuera de modales
    window.addEventListener("click", (e) => {

        // Cerrar CLIENTES al tocar afuera
        if (DOM.modClientes.style.display === "block") {
            if (!e.target.closest(".modal-content")) {
                DOM.modClientes.style.display = "none";
                console.log("❌ Modal Clientes cerrado");
                // Limpiar campo de búsqueda de CLIENTE
                DOM.inputSearhCliente.value = "";
            }
        }

        // Cerrar PRODUCTOS al tocar afuera
        if (DOM.modProductos.style.display === "block") {
            if (!e.target.closest(".modal-content")) {
                DOM.modProductos.style.display = "none";
                console.log("❌ Modal Productos cerrado");
                // Limpiar campo de búsqueda de PRODUCTO
                DOM.inputSearhProducto.value = "";
            }
        }
    });

    //// Funciones del modal CLIENTES
    //DOM.btnSearchCliente.onclick = buscarClientes;
    //DOM.btnVerTodosClientes.onclick = (e) => abrirModalClientes(e);

    //// Funciones del modal PRODUCTOS
    //DOM.btnSearchProducto.onclick = buscarProductos;
    //DOM.btnVerTodosProductos.onclick = (e) => abrirModalProductos(e);

    // Confirmar agregado
    document.getElementById("btnConfirmarAgregar")
        .addEventListener("click", agregarProductoDetalle);

    // Botón Guardar Orden
    document.getElementById("btnGuardar").onclick = guardarOrden;

    console.log("✅ Sistema de facturación listo.");
}

document.addEventListener("DOMContentLoaded", inicializarFacturacion);

// ====================================================================
//  OBTENER PRÓXIMO ID PARA NUMERO DE FACTURA
// ====================================================================
async function cargarNextOrderId() {
    try {
        const resp = await fetch(`${API_BASE}/GetNextOrderId`);
        const data = await resp.json();

        nextOrderId = data;

        document.getElementById("facturaId").innerText = nextOrderId;
        console.log("🧾 Próximo ID cargado:", nextOrderId);

    } catch (error) {
        console.error("❌ Error cargando NextOrderId", error);
    }
}

// ====================================================================
//  FECHA Y HORA DE LA FACTURA
// ====================================================================
let intervaloHora = null;
function cargarFechaHoraFactura() {
    const ahora = new Date();

    // Guardamos la fecha fija y mostrar en HTML
    fechaFactura = ahora.toLocaleDateString("es-EC");
    document.getElementById("facturaFecha").innerText = fechaFactura;

    // Si ya existe un intervalo anterior, lo limpiamos
    if (intervaloHora) clearInterval(intervaloHora);

    // Crear intervalo para actualizar hora cada segundo
    intervaloHora = setInterval(() => {
        const reloj = new Date();
        horaFactura = reloj.toLocaleTimeString("es-ES", {
            hour12: false
        });
        document.getElementById("facturaHora").innerText = horaFactura;
    }, 1000);
}
// ====================================================================
//  MODAL CLIENTES
// ====================================================================
//async function abrirModalClientes(e) {
//    console.log("📂 Abriendo modal clientes...");
//    if (e) e.stopPropagation(); // ⛔ DETIENE EL CLICK GLOBAL

//    DOM.modClientes.style.display = "block";

//    const resp = await fetch(`${API_BASE}/GetCustomers?page=1&pageSize=200`);
//    const clientes = await resp.json();

//    renderClientes(clientes);
//}

//async function buscarClientes() {
//    const texto = document.getElementById("buscarCliente").value.trim();
//    const resp = await fetch(`${API_BASE}/GetCustomers?Search=${texto}&page=1&pageSize=200`);
//    renderClientes(await resp.json());
//}
function abrirModalClientes(e) {
    if (e) e.stopPropagation();

    DOM.modClientes.style.display = "block";
    paginaCliente = 1;
    cargarClientes();
}

async function cargarClientes() {
    const resp = await fetch(
        `${API_BASE}/GetCustomers?page=${paginaCliente}&pageSize=${tamanioPaginaCliente}`
    );

    const data = await resp.json();

    renderClientes(data);

    // Detectar si ya no hay más páginas
    ultimaPaginaClientes = data.length < tamanioPaginaCliente;

    // Actualizar texto
    document.getElementById("paginaActualCliente").innerText = `Página ${paginaCliente}`;
}
document.getElementById("btnSiguienteCliente").addEventListener("click", () => {
    if (!ultimaPaginaClientes) {
        paginaCliente++;
        cargarClientes();
    }
});

document.getElementById("btnAnteriorCliente").addEventListener("click", () => {
    if (paginaCliente > 1) {
        paginaCliente--;
        cargarClientes();
    }
});
document.getElementById("buscarCliente").addEventListener("input", () => {
    buscarClientesDebounce();
});
let timerBusquedaCliente;
function buscarClientesDebounce() {
    clearTimeout(timerBusquedaCliente);

    timerBusquedaCliente = setTimeout(() => {
        buscarClientes();
    }, 300); // Espera 300 ms desde la última tecla
}
async function buscarClientes() {
    const texto = document.getElementById("buscarCliente").value.trim();

    // Reiniciar página al buscar
    paginaCliente = 1;

    const resp = await fetch(
        `${API_BASE}/GetCustomers?Search=${encodeURIComponent(texto)}&page=${paginaCliente}&pageSize=${tamanioPaginaCliente}`
    );

    const data = await resp.json();

    renderClientes(data);

    ultimaPaginaClientes = data.length < tamanioPaginaCliente;

    document.getElementById("paginaActualCliente").innerText = `Página ${paginaCliente}`;
}

function renderClientes(clientes) {
    //// Limpiar campo de búsqueda de CLIENTE
    //DOM.inputSearhCliente.value = "";

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
                        onclick="seleccionarCliente('${c.customerId}', '${c.firstName} ${c.lastName}', '${c.email}', '${c.address}')">
                        Seleccionar
                    </button>
                </td>
            </tr>
        `;
    });
}

function seleccionarCliente(id, nombre, email, address) {
    console.log("👤 Cliente seleccionado:", nombre);

    document.getElementById("clienteId").value = id;
    document.getElementById("clienteNombre").value = nombre;
    document.getElementById("clienteEmail").value = email;
    document.getElementById("shipAddress").value = address;

    DOM.modClientes.style.display = "none";

    // Limpiar campo de búsqueda de CLIENTE
    DOM.inputSearhCliente.value = "";
}

// ====================================================================
//  MODAL PRODUCTOS
// ====================================================================
//async function abrirModalProductos(e) {
//    console.log("📦 Abriendo modal productos...");
//    if (e) e.stopPropagation(); // ⛔ DETIENE EL CLICK GLOBAL

//    DOM.modProductos.style.display = "block";

//    const resp = await fetch(`${API_BASE}/GetProducts?page=1&pageSize=200`);
//    productosGlobales = await resp.json();

//    inicializarStockVirtual(productosGlobales);

//    renderProductos(productosGlobales);
//}

//async function buscarProductos() {
//    const texto = document.getElementById("buscarProducto").value.trim();
//    const resp = await fetch(`${API_BASE}/GetProducts?Search=${texto}&page=1&pageSize=200`);
//    renderProductos(await resp.json());
//}

function abrirModalProductos(e) {
    console.log("📦 Abriendo modal productos...");
    if (e) e.stopPropagation();

    DOM.modProductos.style.display = "block";

    paginaProducto = 1;
    cargarProductos();
}
async function cargarProductos() {
    const resp = await fetch(
        `${API_BASE}/GetProducts?page=${paginaProducto}&pageSize=${tamanioPaginaProducto}`
    );

    const data = await resp.json();

    inicializarStockVirtual(data);
    renderProductos(data);

    // Detectar si ya no hay más páginas
    ultimaPaginaProductos = data.length < tamanioPaginaProducto;

    // Actualizar número de página
    document.getElementById("paginaActualProducto").innerText = `Página ${paginaProducto}`;
}
document.getElementById("btnSiguienteProducto").addEventListener("click", () => {
    if (!ultimaPaginaProductos) {
        paginaProducto++;
        cargarProductos();
    }
});
document.getElementById("btnAnteriorProducto").addEventListener("click", () => {
    if (paginaProducto > 1) {
        paginaProducto--;
        cargarProductos();
    }
});
document.getElementById("buscarProducto").addEventListener("input", () => {
    buscarProductosDebounce();
});
let timerBusquedaProducto;
function buscarProductosDebounce() {
    clearTimeout(timerBusquedaProducto);

    timerBusquedaProducto = setTimeout(() => {
        buscarProductos();
    }, 300);
}
async function buscarProductos() {
    const texto = document.getElementById("buscarProducto").value.trim();
    paginaProducto = 1; // Reiniciar página

    const resp = await fetch(
        `${API_BASE}/GetProducts?Search=${encodeURIComponent(texto)}&page=${paginaProducto}&pageSize=${tamanioPaginaProducto}`
    );

    const data = await resp.json();

    renderProductos(data);

    ultimaPaginaProductos = data.length < tamanioPaginaProducto;
    document.getElementById("paginaActualProducto").innerText = `Página ${paginaProducto}`;
}

function inicializarStockVirtual(productos) {
    productos.forEach(p => {
        if (stockVirtual[p.productId] === undefined) {
            stockVirtual[p.productId] = p.stock;
        }
    });
}

function renderProductos(lista) {
    //// Limpiar campo de búsqueda de PRODUCTO
    //DOM.inputSearhProducto.value = "";

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
                        onclick="seleccionarProducto('${p.productId}', '${p.name}', '${p.unitPrice}', '${stockVirtual[p.productId]}')">
                        Seleccionar
                    </button>
                </td>
            </tr>
        `;
        }
    });
}

function seleccionarProducto(id, nombre, precioBase, stock) {
    console.log("🛒 Producto seleccionado:", nombre);
    DOM.modProductos.style.display = "none";

    DOM.panelProducto.style.display = "block";

    DOM.auxId.value = id;
    DOM.auxName.value = nombre;
    DOM.auxPrice.value = (precioBase * (1 + IVA)).toFixed(2);
    DOM.auxbasePrice.value = precioBase;
    DOM.auxStock.value = stockVirtual[id];
    DOM.auxQuantity.value = 1;
    DOM.auxQuantity.max = stock;

    // Limpiar campo de búsqueda de PRODUCTO
    DOM.inputSearhProducto.value = "";
}

// ====================================================================
//  AGREGAR PRODUCTO AL DETALLE
// ====================================================================
function agregarProductoDetalle() {
    const id = DOM.auxId.value;
    const nombre = DOM.auxName.value;
    const precio = parseFloat(DOM.auxPrice.value);
    const precioBase = parseFloat(DOM.auxbasePrice.value);
    const cantidad = parseInt(DOM.auxQuantity.value, 10);
    const stockDisponible = stockVirtual[id];

    if (!id) return alert("Seleccione un producto.");
    if (cantidad <= 0) return alert("Cantidad inválida.");
    if (cantidad > stockDisponible) return showWarning("No hay stock suficiente.");

    const trExistente = [...DOM.tablaProductosBody.querySelectorAll("tr")]
        .find(r => r.dataset.id == id);

    if (trExistente) {
        const cantActual = parseInt(trExistente.querySelector(".td-cantidad").innerText, 10);
        const nueva = cantActual + cantidad;

        trExistente.querySelector(".td-cantidad").innerText = nueva;
        trExistente.querySelector(".td-subtotal").innerText = (nueva * precio).toFixed(2);
    } else {
        const subtotal = (cantidad * precio).toFixed(2);
        const subtotalBase = (cantidad * precioBase).toFixed(2);


        DOM.tablaProductosBody.innerHTML += `
            <tr data-id="${id}">
                <td class="text-right">${id}</td>
                <td class="text-left">${nombre}</td>
                <td class="text-right">${precio.toFixed(2)}</td>
                <td hidden class="td-precioBase text-right">${precioBase.toFixed(2)}</td>
                <td class="td-cantidad text-right">${cantidad}</td>
                <td class="td-subtotal text-right">${subtotal}</td>
                <td hidden class="td-subtotalBase text-right">${subtotalBase}</td>
                <td class="text-left">
                    <button onclick="eliminarProducto(this)">⛔ Eliminar</button>
                    <button onclick="editarProducto(this)">📝 Editar</button>
                </td>
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
//  EDITAR PRODUCTO DEL DETALLE
// ====================================================================
function editarProducto(btn) {
    const tr = btn.closest("tr");
    const id = tr.dataset.id;
    const nombre = tr.children[1].innerText;
    const precio = parseFloat(tr.children[2].innerText);
    const preciobase = parseFloat(tr.children[3].innerText);
    const cantidad = parseInt(tr.querySelector(".td-cantidad").innerText, 10);

    // 1. DEVOLVER stock al virtual
    stockVirtual[id] += cantidad;

    const fila = document.querySelector(`#prod-${id} .stock-col`);
    if (fila) fila.innerText = stockVirtual[id];

    // 2. ELIMINAR la fila del detalle
    tr.remove();
    calcularTotalFactura();

    // 3. ABRIR PANEL DE PRODUCTO
    DOM.panelProducto.style.display = "block";

    // 4. CARGAR DATOS EN EL FORM AUXILIAR
    DOM.auxId.value = id;
    DOM.auxName.value = nombre;
    DOM.auxPrice.value = precio.toFixed(2);
    DOM.auxbasePrice.value = preciobase.toFixed(2);
    DOM.auxQuantity.value = cantidad;               // Cantidad actual
    DOM.auxStock.value = stockVirtual[id];          // Nuevo stock disponible

    // 5. AJUSTAR EL MÁXIMO DEL INPUT CANTIDAD
    DOM.auxQuantity.max = stockVirtual[id];

    console.log("✏️ Producto cargado para edición.");
}

// ====================================================================
//  CALCULAR TOTAL
// ====================================================================
function calcularTotalFactura() {
    let total = 0;
    let mostrarIva = 0;
    let mostrarSubtotal = 0;

    DOM.tablaProductosBody.querySelectorAll("tr").forEach(r => {
        mostrarSubtotal += parseFloat(r.querySelector(".td-subtotalBase").innerText);
    });
    DOM.tablaProductosBody.querySelectorAll("tr").forEach(r => {
        total += parseFloat(r.querySelector(".td-subtotal").innerText);
    });

    mostrarIva = total - mostrarSubtotal;
    DOM.subTotalFactura.innerText = mostrarSubtotal.toFixed(2);
    DOM.ivaFactura.innerText = mostrarIva.toFixed(2);
    DOM.totalFactura.innerText = total.toFixed(2);
}

// ====================================================================
//  GUARDAR ORDEN
// ====================================================================
async function guardarOrden() {
    console.log("💾 Guardando orden...");

    const customerId = document.getElementById("clienteId").value;

    if (!customerId) {
        showWarning("Seleccione un Cliente.");
        return;
    }

    const rows = DOM.tablaProductosBody.querySelectorAll("tr");
    if (rows.length === 0) {
        showWarning("Debe agregar Productos.");
        return;
    }

    const detalles = [...rows].map(r => ({
        productId: parseInt(r.dataset.id),
        unitPrice: parseFloat(r.children[2].innerText),
        quantity: parseInt(r.children[4].innerText),
    }));

    //// Verificación de datos de envío
    //const ok = await verificarDatosEnvio();
    //if (!ok) {
    //    console.log("❌ Usuario canceló. No se guarda la orden.");
    //    return;
    //}

    const data = {
        customerId,
        shipAddress: document.getElementById("shipAddress").value || "N/A",
        shipCity: document.getElementById("shipCity").value || "N/A",
        shipCountry: document.getElementById("shipCountry").value || "N/A",
        shipPostalCode: document.getElementById("shipPostalCode").value || "N/A",
        orderDetails: detalles
    };

    console.log("📨 Enviando JSON:", data);

    const resp = await fetch(`${API_BASE}/CreateOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!resp.ok) {
        showError("Error al crear la orden. Producto no Existente!!!");
        limpiarFactura();
        //limpiarDetallesFactura();
        return;
    }

    const id = await resp.json();

    showSuccess("Orden creada correctamente. ID de Factura: " + id);

    limpiarFactura();
}

function limpiarDetallesFactura() {
    // 1. Vaciar cuerpo de la tabla
    DOM.tablaProductosBody.innerHTML = "";

    // 2. Reiniciar el total
    totalFactura = 0;
    subtotalFactura = 0;
    ivatotalFactura = 0;

    // 3. Actualizar el total mostrado
    //document.getElementById("facturaTotal").innerText = totalFactura.toFixed(2);
    DOM.totalFactura.innerText = totalFactura.toFixed(2);
    DOM.ivaFactura.innerText = ivatotalFactura.toFixed(2);
    DOM.subTotalFactura.innerText = subtotalFactura.toFixed(2);

    // 4. (Opcional) Reiniciar número de ítems si lo usas
    //if (document.getElementById("facturaItems"))
    //    document.getElementById("facturaItems").innerText = "0";

    console.log("🧹 Detalles de factura limpiados correctamente.");
}
//async function verificarDatosEnvio() {
//    const campos = [
//        DOM.shipAddress,
//        DOM.shipCity,
//        DOM.shipCountry,
//        DOM.shipPostalCode
//    ];

//    const faltanDatos = campos.some(c => !c.value.trim());

//    if (!faltanDatos) return true;

//    const continuar = await showConfirm(
//        "Algunos datos de envío están vacíos.\n\n" +
//        "¿Desea guardar la factura con datos incompletos?"
//    );

//    if (!continuar) return false;

//    // campos.forEach(campo => {
//    //     if (!campo.value.trim()) campo.value = "N/A";
//    // });

//    return true;
//}

//async function guardarOrden() {
//    console.log("💾 Guardando orden...");

//    const customerId = document.getElementById("clienteId").value;

//    if (!customerId) return alert("Seleccione un cliente.");

//    const rows = DOM.tablaProductosBody.querySelectorAll("tr");
//    if (rows.length === 0) return alert("Debe agregar productos.");

//    const detalles = [...rows].map(r => ({
//        productId: parseInt(r.dataset.id),
//        unitPrice: parseFloat(r.children[1].innerText),
//        quantity: parseInt(r.children[2].innerText),
//    }));

//    // Verificación de datos de envío
//    const ok = verificarDatosEnvio();
//    if (!ok) {
//        console.log("❌ Usuario canceló. No se guarda la orden.");
//        return; // Detener aquí si el usuario canceló
//    }

//    const data = {
//        customerId,
//        shipAddress: document.getElementById("shipAddress").value || "N/A",
//        shipCity: document.getElementById("shipCity").value || "N/A",
//        shipCountry: document.getElementById("shipCountry").value || "N/A",
//        shipPostalCode: document.getElementById("shipPostalCode").value || "N/A",
//        orderDetails: detalles
//    };

//    console.log("📨 Enviando JSON:", data);

//    const resp = await fetch(`${API_BASE}/CreateOrder`, {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify(data)
//    });
//    //console.log(res);
    
//    if (!resp.ok) return alert("Error al crear la orden.");

//    const id = await resp.json();

//    alert("Orden creada correctamente. ID: " + id);

//    limpiarFactura();
//}

//function verificarDatosEnvio() {
//    const campos = [
//        DOM.shipAddress,
//        DOM.shipCity,
//        DOM.shipCountry,
//        DOM.shipPostalCode
//    ];

//    // Verifica si algún campo está vacío
//    const faltanDatos = campos.some(c => !c.value.trim());

//    if (!faltanDatos) return true; // Todo lleno → OK

//    // Preguntar al usuario
//    const continuar = confirm(
//        "⚠️ Algunos datos de envío están vacíos.\n\n" +
//        "¿Desea guardar la factura con datos incompletos?"
//    );

//    if (!continuar) return false; // ❌ Canceló → No guardar

//    // ✔ Aceptó → Rellenar vacíos con 'N/A'
//    campos.forEach(campo => {
//        //if (!campo.value.trim()) campo.value = "N/A";
//    });

//    return true; // ✔ Continuar con el guardado
//}

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
    DOM.ivaFactura.innerText = "0.00";
    DOM.subTotalFactura.innerText = "0.00";

    // Panel auxiliar
    DOM.panelProducto.style.display = "none";

    // Regenerar stock virtual
    stockVirtual = {};

    //Mostrar id de factura
    cargarNextOrderId();
    console.log("✔ Factura reseteada.");
}

// ====================================================================
//  ALERTAS PERSONALIZADAS
// ====================================================================
function showSuccess(msg) {
    Swal.fire({
        icon: "success",
        title: "Éxito",
        text: msg,
        confirmButtonColor: "#3085d6"
    });
}

function showError(msg) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
        confirmButtonColor: "#d33"
    });
}

function showWarning(msg) {
    Swal.fire({
        icon: "warning",
        title: "Atención",
        text: msg,
        confirmButtonColor: "#f0ad4e"
    });
}

function showConfirm(msg) {
    return Swal.fire({
        icon: "question",
        title: "Confirmar",
        text: msg,
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33"
    }).then(r => r.isConfirmed);
}

