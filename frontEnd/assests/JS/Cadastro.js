
        // Máscara simples para CNPJ
        document.getElementById('cnpj').addEventListener('input', function (e) {
            let v = e.target.value.replace(/\D/g, '');
            v = v.replace(/^(\d{2})(\d)/, "$1.$2");
            v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
            v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
            v = v.replace(/(\d{4})(\d)/, "$1-$2");
            e.target.value = v.slice(0, 18);
        });

        // Olho senha - animação
        function setupPasswordToggle(inputId, toggleId, iconId) {
            const input = document.getElementById(inputId);
            const toggle = document.getElementById(toggleId);
            const icon = document.getElementById(iconId);

            toggle.addEventListener('click', function () {
                if (input.type === "password") {
                    input.type = "text";
                    icon.classList.remove("bi-eye-slash");
                    icon.classList.add("bi-eye");
                } else {
                    input.type = "password";
                    icon.classList.remove("bi-eye");
                    icon.classList.add("bi-eye-slash");
                }
            });

            // Olho fechado ao digitar
            input.addEventListener('input', function () {
                if (input.value.length > 0) {
                    icon.classList.remove("bi-eye");
                    icon.classList.add("bi-eye-slash");
                }
            });
            // Olho aberto se campo vazio e visível
            input.addEventListener('blur', function () {
                if (input.value.length === 0 && input.type === "text") {
                    icon.classList.remove("bi-eye-slash");
                    icon.classList.add("bi-eye");
                }
            });
        }
        setupPasswordToggle('password', 'togglePassword', 'iconPassword');
        setupPasswordToggle('confirm_password', 'toggleConfirmPassword', 'iconConfirmPassword');
