import { store } from "@/config/redux/store";
import UserLayout from "@/layout/userlayout";
import "@/styles/globals.css";
import {Provider} from "react-redux"

export default function App({ Component, pageProps }) {
  return <>
  
  <Provider store={store}>
      <Component {...pageProps} />
  </Provider>  </>
}
