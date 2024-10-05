import axios from "axios";
import { BACKEND_URL } from "../constants/backend";
import WebApp from "@twa-dev/sdk";
const user: any = WebApp.initDataUnsafe?.user;
const accessToken: any = localStorage.getItem(`accessToken_${user && user.id}`);
// const accessToken: any = localStorage.getItem(`accessToken_${5673577167}`);

const testMode = false;

const axiosClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    'X-Transfer-Key': testMode ? 
    "l4vRSXqEdl+duDMDrdBBREs5s8cqqKFGixtQKZUQ/NFdOKENXKBxsp6aHtjaRY0L9e3kHi+jc+waUATPVJJW01nahQMF5+NoPlI/dVEcwfT0m8ERa02XyUm8Wf8KcFbQUn8OdP9yfSeWFvLZTZc63mZch0Cajpb4O6sCNkh6eT6EvPE3scGyFWYCJgNg3lE+o7FYspq795OrugiPO+d8ZVWPgayu329u47GZlk/MnGJH1voR7B+lK7nkcxqhphbRsjfFF0QdbCu6vySw377mS2qNR3NqqW9KRb+uA8pTio5qtlDIO9sZJ2VlYFOIZ+DqFYmmcvnkh2860z6p8gaEeA=="
    : accessToken,
  },
});

export default axiosClient;
