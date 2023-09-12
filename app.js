const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const AccessToken = require('./token');
const app = express();
const port = 3000;


const apiUrl = 'https://danilagusak.amocrm.ru/api'; // URL API AmoCRM
const accessToken = AccessToken; // Токен 

app.use(bodyParser.urlencoded({ extended: false }));

// Создание формы поиска контакта по указанным значениям name/email/phone/
app.get('/', (req, res) => {
  const formHtml = `
    <h1>Поиск и создание контакта</h1>
    <form method="POST" action="/contact">
      <label for="name">Фио клиента:</label>
      <input type="text" id="name" name="name">
      
      <label for="email">Email:</label>
      <input type="email" id="email" name="email">
      
      <label for="phone">Телефон:</label>
      <input type="text" id="phone" name="phone">
      
      <input type="submit" value="Поиск">
    </form>

    <div id="searchResult"></div>
  `;

  res.send(formHtml);
});
// Обработка данных из формы
app.post('/contact', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const queryParams = {};
    if (name) queryParams.query = name;
    if (email) queryParams.email = email;
    if (phone) queryParams.phone = phone;
    // Формируем полный URL запроса преобразуя её в формат ключ=значение
    const response = await axios.get(`${apiUrl}/v4/contacts?${new URLSearchParams(queryParams).toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // В случае удачного исхода(клиент найден) выводятся данные из CRM и предлагается создание сделки 
    if (response.data._embedded && response.data._embedded.contacts && response.data._embedded.contacts.length > 0) {
      const contact = response.data._embedded.contacts[0];
      const resultHtml = `
        <h2>Результат поиска:</h2>
        <p>ID контакта: ${contact.id}</p>
        <p>Имя: ${contact.name || ''}</p>
        <p>Email: ${contact.custom_fields_values && contact.custom_fields_values.length > 1 ? contact.custom_fields_values[1].values[0].value : 'N/A'}</p>
        <p>Телефон: ${contact.custom_fields_values && contact.custom_fields_values.length > 0 ? contact.custom_fields_values[0].values[0].value : 'N/A'}</p>
        <form method="POST" action="/createDeal">
          <input type="hidden" name="contactId" value="${contact.id}">
          <label for="dealTitle">Название сделки:</label>
          <input type="text" id="dealTitle" name="dealTitle">
          <label for="dealPrice">Сумма сделки:</label>
          <input type="text" id="dealPrice" name="dealPrice">
          <input type="submit" value="Создать сделку">
        </form>
      `;
      res.send(resultHtml);
    }
    // Предложение создать контакт с указанными данными 
    else {           
      const createFormHtml = `
        <h2>Контакт не найден</h2>
        <p>Хотите создать новый контакт с указанными данными?</p>
        <form method="POST" action="/createContact">
          <input type="hidden" name="name" value="${name || ''}">
          <input type="hidden" name="email" value="${email || ''}">
          <input type="hidden" name="phone" value="${phone || ''}">
          <button type="submit">Создать контакт</button>
        </form>
      `;
      res.send(createFormHtml);
    }
  } catch (error) {
    console.error('Произошла ошибка:', error.response ? error.response.data : error.message);
    res.status(500).send('Произошла ошибка');
  }
});
//  Функция создания контакта
app.post('/createContact', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    // Валидация формата записи телефона в виде +1234567890
    const phonePattern = /^\+\d+$/;
    const isPhoneValid = phonePattern.test(phone);

    if (!isPhoneValid) {
      console.error('Некорректный формат номера телефона');
      return res.status(400).send('Некорректный формат номера телефона');
    }
    // Формирование данных Контакта
    const newContactData = {
      name: name,
      email: email,
      phone: phone,
    };
    // Передача их методом POST
    await axios.post(`${apiUrl}/v4/contacts`, [newContactData], {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const successHtml = `
      <h2>Контакт "${name}" успешно создан!</h2>
      <p>Вы можете <a href="/">вернуться к поиску</a>.</p>
    `;
    res.send(successHtml);
  }
  // Лог ошибок сервер\пользователь    
  catch (error) {
    console.error('Произошла ошибка:', error.response ? error.response.data : error.message);
    res.status(500).send('Произошла ошибка при создании контакта');
  }
});
// Функция создания сделки
app.post('/createDeal', async (req, res) => {
  try {
    // Предопределяем значние поля dealPrice к формату float 
    const { contactId, dealTitle} = req.body;
    const dealPrice = parseFloat(req.body.dealPrice);

    const newDealData = {
      name: dealTitle,
      price:  dealPrice,
      contacts: [{ id: contactId }],
    };
    // Передаём значение в CRM
    await axios.post(`${apiUrl}/v4/leads`, [newDealData], {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Уведомление о успешном созданни сделки
    const successHtml = `
      <h2>Сделка "${dealTitle}" успешно создана!</h2>
      <p>Вы можете <a href="/">вернуться к поиску</a>.</p>
    `;
    res.send(successHtml);
  }
    // Лог ошибок сервер\пользователь     
  catch (error) {
    console.error('Произошла ошибка:', error.response ? error.response.data : error.message);
    res.status(500).send('Произошла ошибка при создании сделки');
  }
});
//  Отображение на каком порту был запущен сервер 
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});