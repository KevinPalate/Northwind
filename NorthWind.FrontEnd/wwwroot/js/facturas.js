// js/facturas.js
console.log("📄 Módulo facturas cargado...");

const DOMFacturas = {
    tablaFacturasBody: document.querySelector("#tablaFacturas tbody"),
    modalFactura: document.getElementById("modalFactura"),
    cerrarModalFactura: document.getElementById("cerrarModalFactura"),
    factCliente: document.getElementById("factCliente"),
    factDireccion: document.getElementById("factDireccion"),
    factCiudad: document.getElementById("factCiudad"),
    factPais: document.getElementById("factPais"),
    factFecha: document.getElementById("factFecha"),
    tablaDetalleFacturaBody: document.querySelector("#tablaDetalleFactura tbody"),
    factTotal: document.getElementById("factTotal"),
    inputBuscar: document.getElementById("buscarFactura")
};

// ======================================================
// Abrir modal de factura
// ======================================================
function abrirModalFactura() {
    DOMFacturas.modalFactura.style.display = "block";
}

// ======================================================
// Cerrar modal
// ======================================================
DOMFacturas.cerrarModalFactura.onclick = () => {
    DOMFacturas.modalFactura.style.display = "none";
};

// Cerrar modal al hacer click afuera
window.addEventListener("click", e => {
    if (e.target === DOMFacturas.modalFactura) DOMFacturas.modalFactura.style.display = "none";
});

// ======================================================
// Variables globales
// ======================================================
let facturasGlobales = [];

// ======================================================
// Cargar facturas desde API
// ======================================================
async function cargarFacturas(search = "") {
    console.log("📄 Cargando facturas...", search);

    const qs = search ? `?Search=${encodeURIComponent(search)}&page=1&pageSize=200` : "?page=1&pageSize=200";

    try {
        const resp = await fetch(`${API_BASE}/GetOrders${qs}`);
        facturasGlobales = await resp.json();
        renderFacturas(facturasGlobales);
    } catch (err) {
        console.error("❌ Error cargando facturas:", err);
    }
}

// ======================================================
// Renderizar facturas en la tabla
// ======================================================
function renderFacturas(lista) {
    DOMFacturas.tablaFacturasBody.innerHTML = "";

    lista.forEach(f => {
        DOMFacturas.tablaFacturasBody.innerHTML += `
            <tr>
                <td>${f.orderId}</td>
                <td>${f.customerR?.customerId || f.customerId}</td>
                <td>${f.shipCity}</td>
                <td>${f.total.toFixed(2)}</td>
                <td>
                    <button class="btnVerDetalle" data-id="${f.orderId}">Ver Detalle</button>
                </td>
            </tr>
        `;
    });

    // Asignar eventos a botones de detalle
    document.querySelectorAll(".btnVerDetalle").forEach(btn => {
        btn.onclick = () => verDetalleFactura(parseInt(btn.dataset.id, 10));
    });
}

// ======================================================
// Ver detalle de factura
// ======================================================
async function verDetalleFactura(orderId) {
    const factura = facturasGlobales.find(f => f.orderId === orderId);
    if (!factura) return alert("Factura no encontrada");

    // Información general
    DOMFacturas.factCliente.innerText = `${factura.customerR.firstName} ${factura.customerR.lastName}`;
    DOMFacturas.factDireccion.innerText = factura.shipAddress;
    DOMFacturas.factCiudad.innerText = factura.shipCity;
    DOMFacturas.factPais.innerText = factura.shipCountry;
    DOMFacturas.factFecha.innerText = new Date(factura.orderDate).toLocaleDateString("es-EC");

    // Detalle de productos
    DOMFacturas.tablaDetalleFacturaBody.innerHTML = "";
    factura.orderDetailR.forEach(d => {
        DOMFacturas.tablaDetalleFacturaBody.innerHTML += `
            <tr>
                <td>${d.product.name}</td>
                <td>${d.unitPrice.toFixed(2)}</td>
                <td>${d.quantity}</td>
                <td>${d.subTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    // Total
    DOMFacturas.factTotal.innerText = factura.total.toFixed(2);

    abrirModalFactura();
}

// ======================================================
// Buscar facturas en vivo por ID, cédula o ciudad
// ======================================================
DOMFacturas.inputBuscar.addEventListener("input", e => {
    const texto = e.target.value.trim().toLowerCase();

    if (!texto) {
        renderFacturas(facturasGlobales);
        return;
    }

    const filtradas = facturasGlobales.filter(f =>
        f.orderId.toString().includes(texto) ||
        f.customerR.customerId.toLowerCase().includes(texto) ||
        f.shipCity.toLowerCase().includes(texto)
    );

    renderFacturas(filtradas);
});

// ======================================================
// Inicialización automática al hacer click en "Ver Facturas"
// ======================================================
document.getElementById("navVerFacturas")?.addEventListener("click", e => {
    e.preventDefault();
    FacturacionApp.mostrarSeccion("verFacturas");
    cargarFacturas();
});
