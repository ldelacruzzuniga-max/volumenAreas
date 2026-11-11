// -------------------------------------------------------------
// 1. OBJETOS CON LAS FÓRMULAS Y FIGURAS DE LA IMAGEN
// -------------------------------------------------------------
const figurasData = {
    volumen: {
        cubo: {
            nombre: "Cubo",
            inputs: ["Lado (cm)"],
            calcular: (val) => Math.pow(val[0], 3)
        },
        esfera: {
            nombre: "Esfera",
            inputs: ["Radio (cm)"],
            calcular: (val) => (4 / 3) * Math.PI * Math.pow(val[0], 3)
        },
        piramide: {
            nombre: "Pirámide Base Cuadrada",
            inputs: ["Lado de la base (cm)", "Altura (cm)"],
            calcular: (val) => (Math.pow(val[0], 2) * val[1]) / 3
        }
    },
    area: {
        triangulo: {
            nombre: "Triángulo",
            inputs: ["Base (cm)", "Altura (cm)"],
            calcular: (val) => (val[0] * val[1]) / 2
        },
        trapecio: {
            nombre: "Trapecio",
            inputs: ["Base Mayor (cm)", "Base Menor (cm)", "Altura (cm)"],
            calcular: (val) => ((val[0] + val[1]) * val[2]) / 2
        },
        circulo: {
            nombre: "Círculo",
            inputs: ["Radio (cm)"],
            calcular: (val) => Math.PI * Math.pow(val[0], 2)
        }
    }
};

// -------------------------------------------------------------
// 2. REFERENCIAS A NODOS DEL DOM
// -------------------------------------------------------------
const selectModo = document.getElementById("selectModo");
const contenedorFigura = document.getElementById("contenedorFigura");
const selectFigura = document.getElementById("selectFigura");
const formInputs = document.getElementById("formInputs");
const camposDinamicos = document.getElementById("camposDinamicos");
const divResultado = document.getElementById("resultado");
const txtUltimoCalculo = document.getElementById("ultimoCalculoSaved");

// -------------------------------------------------------------
// 3. EVENTOS Y LÓGICA DE INTERFAZ
// -------------------------------------------------------------

// Al cargar la página, recuperar el último resultado guardado en LocalStorage
document.addEventListener("DOMContentLoaded", () => {
    const ultimoGuardado = localStorage.getItem("ultimoCalculo");
    if (ultimoGuardado) {
        // Objeto creado desde JSON guardado
        const info = JSON.parse(ultimoGuardado);
        txtUltimoCalculo.textContent = `Último cálculo guardado: ${info.tipo} de ${info.figura} = ${info.valor} cm² / cm³`;
    }
});

// Evento al cambiar entre Volumen o Área
selectModo.addEventListener("change", (e) => {
    const modo = e.target.value;
    
    // Limpiar nodos anteriores
    selectFigura.innerHTML = '<option value="">-- Selecciona figura --</option>';
    camposDinamicos.innerHTML = '';
    formInputs.classList.add("oculto");
    divResultado.textContent = '';

    if (!modo) {
        contenedorFigura.classList.add("oculto");
        return;
    }

    // Cargar dinámicamente solo las figuras del modo elegido
    const opcionesModo = figurasData[modo];
    for (const clave in opcionesModo) {
        const optionNode = document.createElement("option"); // Nodo opción
        optionNode.value = clave;
        optionNode.textContent = opcionesModo[clave].nombre;
        selectFigura.appendChild(optionNode); // Agregar nodo al DOM
    }

    contenedorFigura.classList.remove("oculto");
});

// Evento al seleccionar una figura específica
selectFigura.addEventListener("change", (e) => {
    const modo = selectModo.value;
    const figuraClave = e.target.value;
    camposDinamicos.innerHTML = ''; // Limpiar campos previos

    if (!figuraClave) {
        formInputs.classList.add("oculto");
        return;
    }

    const campos = figurasData[modo][figuraClave].inputs;

    // Crear nodos de input según los requerimientos de la figura
    campos.forEach((labelTexto, index) => {
        const labelNode = document.createElement("label");
        labelNode.textContent = labelTexto + ":";

        const inputNode = document.createElement("input");
        inputNode.type = "number";
        inputNode.step = "any";
        inputNode.required = true;
        inputNode.className = "dato-input";
        inputNode.dataset.index = index;

        camposDinamicos.appendChild(labelNode);
        camposDinamicos.appendChild(inputNode);
    });

    formInputs.classList.remove("oculto");
});

// Evento de cálculo y guardado en LocalStorage
formInputs.addEventListener("submit", (e) => {
    e.preventDefault();

    const modo = selectModo.value;
    const figuraClave = selectFigura.value;
    const inputsNodos = document.querySelectorAll(".dato-input");
    
    // Extraer valores numéricos de los nodos input
    const valores = Array.from(inputsNodos).map(inp => parseFloat(inp.value));

    // Ejecutar la función del objeto correspondiente
    const resultadoCalculado = figurasData[modo][figuraClave].calcular(valores);
    const resultadoFormateado = resultadoCalculado.toFixed(2);
    const unidad = modo === "volumen" ? "cm³" : "cm²";

    // Mostrar el resultado en pantalla (Manipulación de nodo DOM)
    divResultado.textContent = `El ${modo} es: ${resultadoFormateado} ${unidad}`;

    // Objeto para almacenar en LocalStorage
    const registroCalculo = {
        tipo: modo.toUpperCase(),
        figura: figurasData[modo][figuraClave].nombre,
        valor: resultadoFormateado,
        fecha: new Date().toLocaleTimeString()
    };

    // Guardar en LocalStorage convirtiendo el objeto a String JSON
    localStorage.setItem("ultimoCalculo", JSON.stringify(registroCalculo));
    txtUltimoCalculo.textContent = `Guardado localmente: ${registroCalculo.tipo} de ${registroCalculo.figura} = ${registroCalculo.valor} ${unidad}`;
});