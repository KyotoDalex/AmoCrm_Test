const axios = require('axios');
const secret_key = 'aQveAkjh5Kr7II8GdAuGYUabq4H4ReR8NbiDE0gv1Dr2PkPPwU7vapIcW3qOB49V'
const id_key = 'df6cfae7-2618-44f7-8453-9b8507d2fed9'
const auth_key = 'def50200dd60e474c915b31d5f65055a9c6183d5554c8905144d0ff81f5cbf032bc858ea295acee989d29052cd14c9e93168fa50d32993644aa4a4a2b12c3bb0bfbefe646f5b11fa47b1d9fe733af4fe1f536cbe86d3d8360b092f92534a6db832dbf12849de749d43d82f980156a8431aa41a8f34374e09f71a3221f4ccaba6f3ddbb82ef44fc4ec97c5ecd6ca78e5213babe40cf212fc172fe136c79921b0d114fb906b64b10a13736577cff8261344451e9d18c72bf816cfdd900e91ed5dc8180879c56dcba55f78c19722ae93027eaec8895300c1b829befb1285f3fd1e5cbb5f3bc369386a6652bc676ebc311b3cc9c9b5eb21e305963fd325205144af5f9732aacc843d15530193d5cab15edc79b6e14fbf59a555ff0e78da155a94b0ff17000c50de517b562febbc44b069204a169eb6d5acea75e9cf40b94319ac2acc859feebf598494a308ab49416a2b9ad6a5ea09f2233f10dbd5a49a09d36626dd2be437f044e6a02f6b8b5f10be5c9525dbb157c6d2d571e09b71b177f0a74e32187fd72c992e63bf730e585300e939c1dcbb86679d1e8ed216c44f42da6f211305bc77853ec2b38507e176cb485f2411581e2bffcd6d9ed67b8fb32c74b7fedc5823810d6864f0df9bf91dfed32281a5f5b7c7ecac27337a3cd91ca964ec12fc31824799992122c3031b2a49aa480c037f62e22c0fd48e49601e4af'
const redirect_url = "https://28d5-92-124-160-69.ngrok-free.app/"

// URL для обмена кода авторизации на токены
const tokenUrl = 'https:/danilagusak.amocrm.ru/oauth2/access_token'; // Замените на реальный URL

// Подготовка данных для POST-запроса
const data = {
  
  client_id: id_key,
  client_secret: secret_key,
  grant_type: 'authorization_code',
  code: auth_key,
  redirect_uri: redirect_url,
};

// Выполняем POST-запрос для обмена кода на токены
axios.post(tokenUrl, data)
  .then((response) => {
    // Обработка успешного ответа сервера
    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
  })
  .catch((error) => {
    // Обработка ошибок
    console.log('Произошла ошибка при обмене кода на токены:', error.response.data);
  });
 