const API_URL = 'https://v6.exchangerate-api.com/v6/48ad50bfa464ee2d31d06c2a/latest/';
const defaultCurrencies = { from: 'RUB', to: 'USD' };

const fromInput = document.querySelectorAll('.currency-input input')[0];
const toInput = document.querySelectorAll('.currency-input input')[1];
const fromRateText = document.querySelectorAll('.rate')[0];
const toRateText = document.querySelectorAll('.rate')[1];
const fromTabs = document.querySelectorAll('.currency-box')[0].querySelectorAll('.currency-tabs button');
const toTabs = document.querySelectorAll('.currency-box')[1].querySelectorAll('.currency-tabs button');

let fromCurrency = defaultCurrencies.from;
let toCurrency = defaultCurrencies.to;


function showError(message) {
  let errorDiv = document.querySelector('.error-message');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    document.body.appendChild(errorDiv);
  }
  
  
  errorDiv.textContent = message;
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '60%'; 
  errorDiv.style.left = '50%';
  errorDiv.style.transform = 'translate(-50%, -50%)'; 
  errorDiv.style.backgroundColor = 'red';
  errorDiv.style.color = 'white';
  errorDiv.style.fontSize = '20px';
  errorDiv.style.padding = '10px 20px';
  errorDiv.style.borderRadius = '5px';
  errorDiv.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.1)';
  errorDiv.style.zIndex = '1000';
  errorDiv.style.textAlign = 'center';

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function checkOnlineStatus() {
  if (!navigator.onLine) {
    showError('İnternet bağlantınız yoxdur. Əməliyyatın davam etməsi üçün internetə qoşulun.');
    return false;
  }
  return true;
}

async function fetchRates(base) {
  if (!checkOnlineStatus()) return null;

  try {
    const response = await fetch(`${API_URL}${base}`);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.conversion_rates; 
  } catch (error) {
    showError('Xəta baş verdi. API əlçatmazdır.');
    return null;
  }
}


async function updateConversion() {
  if (!checkOnlineStatus()) return;

  if (fromCurrency === toCurrency) {
    showError('Eyni valyutalar seçilib. Zəhmət olmasa fərqli valyutalar seçin.');
    return;
  }

  const rates = await fetchRates(fromCurrency);
  if (rates) {
    const rate = rates[toCurrency];
    const reverseRate = 1 / rate;
    fromRateText.textContent = `1 ${fromCurrency} = ${rate.toFixed(5)} ${toCurrency}`;
    toRateText.textContent = `1 ${toCurrency} = ${reverseRate.toFixed(5)} ${fromCurrency}`;
    toInput.value = (fromInput.value * rate).toFixed(5);
  }
}

async function updateReverseConversion() {
  if (!checkOnlineStatus()) return;

  if (fromCurrency === toCurrency) {
    showError('Eyni valyutalar seçilib. Zəhmət olmasa fərqli valyutalar seçin.');
    return;
  }

  const rates = await fetchRates(fromCurrency);
  if (rates) {
    const rate = rates[toCurrency];
    const reverseRate = 1 / rate;
    fromRateText.textContent = `1 ${fromCurrency} = ${rate.toFixed(5)} ${toCurrency}`;
    toRateText.textContent = `1 ${toCurrency} = ${reverseRate.toFixed(5)} ${fromCurrency}`;
    fromInput.value = (toInput.value * reverseRate).toFixed(5); // Sağ dəyərdən sol dəyəri hesablamaq
  }
}

function handleTabClick(event, isFromCurrency) {
  const buttons = isFromCurrency ? fromTabs : toTabs;
  buttons.forEach(button => button.classList.remove('active'));
  event.target.classList.add('active');
  
  if (isFromCurrency) {
    fromCurrency = event.target.textContent;
  } else {
    toCurrency = event.target.textContent;
  }
  updateConversion();
}


function formatInput(event) {
  const maxLength = 23; 
  const input = event.target;

  input.value = input.value.replace(',', '.').replace(/[^\d.]/g, '');


  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }

  const decimalIndex = input.value.indexOf('.');
  if (decimalIndex !== -1 && input.value.length - decimalIndex - 1 > 5) {
    input.value = input.value.slice(0, decimalIndex + 6); 
  }
}

fromInput.addEventListener('input', (event) => {
  formatInput(event);
  updateConversion();
});
toInput.addEventListener('input', (event) => {
  formatInput(event);
  updateReverseConversion(); 
});

fromTabs.forEach(button => {
  button.addEventListener('click', (event) => handleTabClick(event, true));
});
toTabs.forEach(button => {
  button.addEventListener('click', (event) => handleTabClick(event, false));
});

fromInput.value = 5000;
updateConversion();




