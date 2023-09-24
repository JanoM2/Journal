import axios from "axios";

const journalApi = axios.create({
  baseURL: "https://journal-7af70-default-rtdb.firebaseio.com/",
});

journalApi.interceptors.request.use(
  (config) => {
    config.params = { auth: localStorage.getItem("idToken") };
    return config;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

// console.log(process.env.NODE_ENV); // TEST durante testing

export default journalApi;
