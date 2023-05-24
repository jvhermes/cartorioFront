import React from "react";
import { AppProps } from "next/app";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import 'semantic-ui-css/semantic.min.css'
import '../styles/globals.scss'


import { AuthProvider } from "../contexts/AuthContext";


export default function  App({ Component, pageProps }:AppProps) {

  return(
    <AuthProvider>
        
          <Component {...pageProps} />
       <ToastContainer autoClose={3000}/>
    </AuthProvider>
  )
}










