const principalInput = document.getElementById('valorPrincipal');
const multaInput = document.getElementById('multa');
const jurosInput = document.getElementById('juros');
const summaryPrincipal = document.getElementById('summary-principal');
const summaryMulta = document.getElementById('summary-multa');
const summaryJuros = document.getElementById('summary-juros');
const summaryTotal = document.getElementById('summary-total');

const formatBRL = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const parseNumber = (value) => {
  if (!value) return 0;
  const parsed = Number(value.toString().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};

const updateSummary = () => {
  const principal = parseNumber(principalInput.value);
  const multa = parseNumber(multaInput.value);
  const juros = parseNumber(jurosInput.value);
  const total = principal + multa + juros;

  summaryPrincipal.textContent = formatBRL(principal);
  summaryMulta.textContent = formatBRL(multa);
  summaryJuros.textContent = formatBRL(juros);
  summaryTotal.textContent = formatBRL(total);
};

[principalInput, multaInput, jurosInput].forEach((input) => {
  input.addEventListener('input', updateSummary);
});

updateSummary();
