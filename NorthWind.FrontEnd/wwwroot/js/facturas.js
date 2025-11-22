// js/facturas.js
console.log("📄 Módulo facturas cargado...");

const DOMFacturas = {
    tablaFacturasBody: document.querySelector("#tablaFacturas tbody"),
    modalFactura: document.getElementById("modalFactura"),
    cerrarModalFactura: document.getElementById("cerrarModalFactura"),
    idFact: document.getElementById("idFact"),
    factCliente: document.getElementById("factCliente"),
    factClienteCI: document.getElementById("factClienteCI"),
    factClienteEmail: document.getElementById("factClienteEmail"),
    factClienteTel: document.getElementById("factClienteTel"),
    factDireccion: document.getElementById("factDireccion"),
    factCiudad: document.getElementById("factCiudad"),
    factPais: document.getElementById("factPais"),
    factPostal: document.getElementById("factPostal"),
    factFecha: document.getElementById("factFecha"),
    tablaDetalleFacturaBody: document.querySelector("#tablaDetalleFactura tbody"),
    factTotal: document.getElementById("factTotal"),
    factTotalIva: document.getElementById("factTotalIva"),
    factSubTotal: document.getElementById("factSubTotal"),
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
let paginaFactura = 1;
let tamanioPaginaFactura = 7; // Puedes cambiarlo
let ultimaPaginaFacturas = false;


// ======================================================
// Cargar facturas desde API
// ======================================================
//async function cargarFacturas(search = "") {
//    console.log("📄 Cargando facturas...", search);

//    const qs = search ? `?Search=${encodeURIComponent(search)}&page=1&pageSize=200` : "?page=1&pageSize=200";

//    try {
//        const resp = await fetch(`${API_BASE}/GetOrders${qs}`);
//        facturasGlobales = await resp.json();
//        renderFacturas(facturasGlobales);
//    } catch (err) {
//        console.error("❌ Error cargando facturas:", err);
//    }
//}
async function cargarFacturas(search = "") {
    console.log("📄 Cargando facturas...", search);

    const qs = search
        ? `?Search=${encodeURIComponent(search)}&page=${paginaFactura}&pageSize=${tamanioPaginaFactura}`
        : `?page=${paginaFactura}&pageSize=${tamanioPaginaFactura}`;

    try {
        const resp = await fetch(`${API_BASE}/GetOrders${qs}`);
        const data = await resp.json();

        facturasGlobales = data;
        renderFacturas(data);

        // Detectar si no hay más páginas
        ultimaPaginaFacturas = data.length < tamanioPaginaFactura;

        // Mostrar número de página
        document.getElementById("paginaActualFactura").innerText =
            `Página ${paginaFactura}`;
    } catch (err) {
        console.error("❌ Error cargando facturas:", err);
    }
}
document.getElementById("btnSiguienteFactura").addEventListener("click", () => {
    if (!ultimaPaginaFacturas) {
        paginaFactura++;
        cargarFacturas(DOMFacturas.inputBuscar.value.trim());
    }
});

document.getElementById("btnAnteriorFactura").addEventListener("click", () => {
    if (paginaFactura > 1) {
        paginaFactura--;
        cargarFacturas(DOMFacturas.inputBuscar.value.trim());
    }
});


// ======================================================
// Renderizar facturas en la tabla
// ======================================================
function renderFacturas(lista) {
    DOMFacturas.tablaFacturasBody.innerHTML = "";

    lista.forEach(f => {
        DOMFacturas.tablaFacturasBody.innerHTML += `
            <tr>
                <td class="text-right">${f.orderId}</td>
                <td class="text-left">${f.customerR?.customerId || f.customerId}</td>
                <td class="text-left">${f.shipCity}</td>
                <td>${f.total.toFixed(2)}</td>
                <td class="text-left">
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

    //console.log(factura);

    // Información general
    const fecha = new Date(factura.orderDate);

    DOMFacturas.idFact.innerText = factura.orderId;
    DOMFacturas.factCliente.innerText = `${factura.customerR.firstName} ${factura.customerR.lastName}`;
    DOMFacturas.factClienteCI.innerText = `${factura.customerId}`;
    DOMFacturas.factClienteEmail.innerText = `${factura.customerR.email}`;
    DOMFacturas.factClienteTel.innerText = `${factura.customerR.phoneNumber}`;
    DOMFacturas.factDireccion.innerText = factura.shipAddress;
    DOMFacturas.factCiudad.innerText = factura.shipCity;
    DOMFacturas.factPais.innerText = factura.shipCountry;
    DOMFacturas.factPostal.innerText = factura.shipPostalCode;

    DOMFacturas.factFecha.innerText = fecha.toLocaleDateString("es-EC");
    DOMFacturas.factFecha.innerText += ` ${fecha.toLocaleTimeString("es-EC", {
        hour12: false
    })}`;
    const precio = factura.unitPrice ?? 0;
    const cantidad = factura.quantity ?? 0;
    const subtotal = factura.subTotal ?? (precio * cantidad);

    // Detalle de productos
    DOMFacturas.tablaDetalleFacturaBody.innerHTML = "";
    factura.orderDetailR.forEach(d => {
        const precioBase = d.product.unitPrice ?? 0;     // Precio normal
        const precioConIVA = d.unitPrice ?? 0;           // Precio facturado
        const cantidad = d.quantity ?? 0;
        const subtotal = d.subTotal ?? (precioConIVA * cantidad);

        DOMFacturas.tablaDetalleFacturaBody.innerHTML += `
            <tr>
                <td class="text-right">${d.productId}</td>
                <td class="text-left">${d.product.name}</td>
                <td class="text-right">${d.unitPrice.toFixed(2)}</td>
                <td class="text-right">${d.quantity}</td>
                <td class="text-right">${d.subTotal.toFixed(2)}</td>
                <td hidden>${d.product.unitPrice.toFixed(2)}</td>
                <td hidden class="td-subtotalFacDetBase">${(precioBase * cantidad).toFixed(2)}</td>
            </tr>
        `;
    });

    // Total
    let calcIva = 0;
    let calcSubtotal = 0;
    DOM.tablaDetalleFacturaBody.querySelectorAll("tr").forEach(r => {
        calcSubtotal += parseFloat(r.querySelector(".td-subtotalFacDetBase").innerText);
    });
    calcIva = factura.total - calcSubtotal;
    DOMFacturas.factSubTotal.innerText = calcSubtotal.toFixed(2);
    DOMFacturas.factTotalIva.innerText = calcIva.toFixed(2);
    DOMFacturas.factTotal.innerText = factura.total.toFixed(2);
    abrirModalFactura();
}
function calcularTotalFact() {
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
// ======================================================
// Buscar facturas en vivo por ID, cédula o ciudad
// ======================================================
//DOMFacturas.inputBuscar.addEventListener("input", e => {
//    const texto = e.target.value.trim().toLowerCase();

//    if (!texto) {
//        renderFacturas(facturasGlobales);
//        return;
//    }

//    const filtradas = facturasGlobales.filter(f =>
//        f.orderId.toString().includes(texto) ||
//        f.customerR.customerId.toLowerCase().includes(texto) ||
//        f.shipCity.toLowerCase().includes(texto)
//    );

//    renderFacturas(filtradas);
//});
let timerBuscarFactura;

DOMFacturas.inputBuscar.addEventListener("input", e => {
    clearTimeout(timerBuscarFactura);

    timerBuscarFactura = setTimeout(() => {
        paginaFactura = 1; // Reinicia página
        cargarFacturas(e.target.value.trim());
    }, 300);
});

// ======================================================
// Inicialización automática al hacer click en "Ver Facturas"
// ======================================================
document.getElementById("navVerFacturas")?.addEventListener("click", e => {
    e.preventDefault();
    FacturacionApp.mostrarSeccion("verFacturas");

    paginaFactura = 1; // Reinicia paginación
    cargarFacturas();
});
