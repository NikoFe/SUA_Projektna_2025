import axios from "axios";

export const api = {
  login: axios.create({ baseURL: process.env.NEXT_PUBLIC_LOGIN }),
  menu: axios.create({ baseURL: process.env.NEXT_PUBLIC_MENU }),
  order: axios.create({ baseURL: process.env.NEXT_PUBLIC_ORDER }),
  payment: axios.create({ baseURL: process.env.NEXT_PUBLIC_PAYMENT }),
  shipping: axios.create({ baseURL: process.env.NEXT_PUBLIC_SHIPPING }),
  gamification: axios.create({ baseURL: process.env.NEXT_PUBLIC_GAMIFICATION }),
  notification: axios.create({ baseURL: process.env.NEXT_PUBLIC_NOTIFICATION }),
};
