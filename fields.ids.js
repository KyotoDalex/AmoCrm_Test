const axios = require('axios');
const AccessToken = require('./token');

const apiUrl = 'https://danilagusak.amocrm.ru/api/v4/'; // URL API AmoCRM
const accessToken= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjU1NmNhNzExMzFlYmQ0NTJiNDdmMGFmOTRiOGU2MDM0MTY2NDZiN2U5ZGE1MDQ2Yjk3ZDYwZWEwODJlODI4N2Q3ODc1NDMwZmRjNzM5MjdiIn0.eyJhdWQiOiJkZjZjZmFlNy0yNjE4LTQ0ZjctODQ1My05Yjg1MDdkMmZlZDkiLCJqdGkiOiI1NTZjYTcxMTMxZWJkNDUyYjQ3ZjBhZjk0YjhlNjAzNDE2NjQ2YjdlOWRhNTA0NmI5N2Q2MGVhMDgyZTgyODdkNzg3NTQzMGZkYzczOTI3YiIsImlhdCI6MTY5NDQ1MTkzNCwibmJmIjoxNjk0NDUxOTM0LCJleHAiOjE2OTQ1MzgzMzQsInN1YiI6IjEwMDcyMTc4IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxMjg4MDM0LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOiJ2MiIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.WRWJ73HCiSsukIo1ySnL3EClv_3t18min0-Elu0ITftXsL8yhPpXo36VlnrEJuEfZ0L6a68J9DhPyMDiNENtSg4baHhVSpHRF-XP9dYWD7eWHzbqoGqmosJfmro4o6EDnTrOSMlzoPRBZ01YObVXAGhUP82ocmDBII7UVE93kwMxIu_BTSbPrCzmKLdN98HLuFrP6mgGqAZ7VyruZ_KziCIF63ax2spM34CaIXtHwL18wb8N8m-UR6T7QU6oliJaQxT71Trley0jJXR9MzOKeKSqI-t0Y-PXNfrtbqIZ4isq_cV4HtQjHY9_oaVyiM2_Wz49URXaCo3M4SnIspDT8w'


const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
});
const element_type = 'contacts';

axiosInstance.get(`/api/v4/${element_type}`)
  .then((response) => {
    const customFields = response.data._embedded.custom_fields;
    customFields.forEach((field) => {
      console.log(`Имя: ${field.name}, ID: ${field.id}`);
    });
  })
  .catch((error) => {
    console.error('Произошла ошибка:', error.response ? error.response.data : error.message);
  });
