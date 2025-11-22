document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const copyFeedback = document.getElementById('copy-feedback');

    // ... (Lógica de Dark Mode se mantiene igual)

    const userPrefersDark = localStorage.getItem('theme') === 'dark' ||
                            (localStorage.getItem('theme') === null &&
                             window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (userPrefersDark) {
        body.classList.add('dark-mode');
    }

    themeToggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Guarda la nueva preferencia de tema
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Lógica de la calculadora de promociones
    document.getElementById('plista').addEventListener('input', function() {
        // Obtenemos el valor del input
        const rawValue = this.value;
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '';

        let plista;
        
        try {
            // 1. Reemplazamos las comas por puntos para una correcta evaluación numérica
            let expression = rawValue.replace(',', '.'); 
            
            // 2. Quitamos cualquier caracter que no sea número, +, -, *, /, o .
            // Esto evita inyecciones de código, permitiendo solo operaciones matemáticas básicas.
            expression = expression.replace(/[^-()\d/*+.]/g, ''); 

            // 3. Evaluamos la expresión matemática. 
            // Esto es necesario para manejar la suma (ej: '1500000+500000').
            // Nota: El uso de eval() puede ser riesgoso en aplicaciones donde el input no es controlado, 
            // pero se mitiga en parte limitando los caracteres permitidos.
            plista = Function('return ' + expression)(); 

        } catch (e) {
            // Si la evaluación falla (ej: sintaxis incorrecta), establecemos plista en NaN
            plista = NaN;
        }

        if (isNaN(plista) || plista <= 0) {
            return;
        }

        // Formato para mostrar los resultados en moneda
        const format = (n) => `$${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const promotions = [
            // ... (Tus promociones se mantienen iguales)
            { name: '✅ Contado (40% OFF)', price: plista * 0.60, installments: null, total: plista * 0.60 },
            { name: '🟧 Naranja (20% OFF)', price: plista * 0.80 / 8, installments: 8, total: plista * 0.80 },
            //{ name: '🟧 Naranja (25% OFF)', price: plista * 0.75 / 10, installments: 10, total: plista * 0.75 },
            //{ name: '🟧 Naranja (30% OFF)', price: plista * 0.70 / 6, installments: 6, total: plista * 0.70 },
            { name: '🟪 Tuya (10% OFF)', price: plista * 0.90 / 12, installments: 12, total: plista * 0.90 },
            { name: '🟪 Tuya (20% OFF)', price: plista * 0.80 / 6, installments: 6, total: plista * 0.80 },
            { name: '🟦 VISA/MASTER (S/INT)', price: plista / 12, installments: 12, total: plista },
            { name: '🟦 VISA/MASTER (20% OFF)', price: plista * 0.80 / 6, installments: 6, total: plista * 0.80 },
            { name: '🟦 VISA/MASTER (20% OFF)', price: plista * 0.80 / 3, installments: 3, total: plista * 0.80}
        ];

        promotions.forEach(promo => {
            const promoItem = document.createElement('div');
            promoItem.className = 'promo-item';
            
            let contentText = '';
            if (promo.installments) {
                contentText = `${promo.name}: ${promo.installments} de ${format(promo.price)} / P.F: ${format(promo.total)}`;
            } else {
                contentText = `${promo.name}: ${format(promo.price)}`;
            }

            promoItem.innerHTML = `
                <div class="promo-item-content">
                    <span>${promo.name}</span>
                    <b>${promo.installments ? `${promo.installments} de ${format(promo.price)}` : format(promo.price)}</b>
                    ${promo.installments ? `<span class="total-price">Precio Final: ${format(promo.total)}</span>` : ''}
                </div>
                <button class="copy-button" data-text="${contentText}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                </button>
            `;
            
            const copyButton = promoItem.querySelector('.copy-button');
            copyButton.addEventListener('click', () => {
                const textToCopy = copyButton.getAttribute('data-text');
                
                // Uso de document.execCommand('copy') como alternativa
                const tempInput = document.createElement('textarea');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);

                copyFeedback.classList.add('show');
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                }, 1500);
            });

            resultDiv.appendChild(promoItem);
        });
    });
});