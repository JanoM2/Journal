import axios from "axios";

const authApi = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/accounts",
  params: { key: "AIzaSyBN0CJ0KN6UjXozYqPCLZLKTE59QVEzHh0" },
});

// console.log(process.env.NODE_ENV); // TEST durante testing

export default authApi;
