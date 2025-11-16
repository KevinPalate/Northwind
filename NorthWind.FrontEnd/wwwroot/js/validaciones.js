// ====================================================================
// VALIDACIÓN DE ENTRADA
// ====================================================================

const buscarClienteInput = document.getElementById("buscarCliente");

buscarClienteInput.addEventListener("input", (event) => {
    // Permite: letras, números, espacios, acentos, ñ, y caracteres de email (@ . _ -)
    const regex = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s@._-]/g;
    event.target.value = event.target.value.replace(regex, '');
});


document.addEventListener("DOMContentLoaded", () => {
    const inputProducto = document.getElementById("buscarProducto");

    inputProducto.addEventListener("input", () => {
        // Permite solo números, letras, espacios y guiones bajos
        inputProducto.value = inputProducto.value.replace(/[^a-zA-Z0-9\s_-]/g, "");
    });
});

// ====================================================================
// VALIDACIONES DE CAMPOS DE ENVÍO
// ====================================================================

const envioCampos = {
    shipAddress: document.getElementById("shipAddress"),
    shipCity: document.getElementById("shipCity"),
    shipCountry: document.getElementById("shipCountry"),
    shipPostalCode: document.getElementById("shipPostalCode")
};

// Función general para validar mientras se escribe
function agregarValidacionesEnvio() {
    if (!envioCampos.shipAddress || !envioCampos.shipCity ||
        !envioCampos.shipCountry || !envioCampos.shipPostalCode) return;

    // Dirección: letras, números, espacios, #.-, tildes y ñ
    envioCampos.shipAddress.addEventListener("input", () => {
        envioCampos.shipAddress.value = envioCampos.shipAddress.value.replace(/[^a-zA-Z0-9\s#\.\-áéíóúÁÉÍÓÚñÑ]/g, '');
    });

    // Ciudad: solo letras, espacios, tildes y ñ
    envioCampos.shipCity.addEventListener("input", () => {
        envioCampos.shipCity.value = envioCampos.shipCity.value.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚñÑ]/g, '');
    });

    // País: solo letras, espacios, tildes y ñ
    envioCampos.shipCountry.addEventListener("input", () => {
        envioCampos.shipCountry.value = envioCampos.shipCountry.value.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚñÑ]/g, '');
    });

    // Código Postal: solo números
    envioCampos.shipPostalCode.addEventListener("input", () => {
        envioCampos.shipPostalCode.value = envioCampos.shipPostalCode.value.replace(/[^0-9]/g, '');
    });
}

// Inicializar validaciones al cargar la página
document.addEventListener("DOMContentLoaded", agregarValidacionesEnvio);


// ====================================================================
// VALIDACIÓN DE CANTIDAD DE PRODUCTO
// ====================================================================

const auxQuantity = document.getElementById("auxQuantity");

if (auxQuantity) {
    // Evitar letras y mantener mínimo 1
    auxQuantity.addEventListener("input", () => {
        // Solo números positivos
        auxQuantity.value = auxQuantity.value.replace(/[^0-9]/g, '');

        // Si queda vacío o menor que 1, forzar 1
        if (!auxQuantity.value || parseInt(auxQuantity.value, 10) < 1) {
            auxQuantity.value = 1;
        }
    });
}

// ============================
// Validación de input Buscar Factura
// ============================
const buscarFacturaInput = document.getElementById("buscarFactura");

if (buscarFacturaInput) {
    buscarFacturaInput.addEventListener("input", (e) => {
        // Permitir solo: letras, números, espacios, guiones, puntos y tildes
        const regex = /[^0-9a-zA-ZáéíóúÁÉÍÓÚñÑ\s.-]/g;
        e.target.value = e.target.value.replace(regex, "");
    });
}