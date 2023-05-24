import React, { FormEvent , useContext, useState} from "react";
import Head from "next/head";
import {toast} from "react-toastify"

import { Button,Form,Header } from "semantic-ui-react";

import styles from "../styles/home.module.scss"


import { AuthContext } from "../contexts/AuthContext";


import { canSSRGuest } from "../utils/canSSRGuest";

export default function Home() {

  const {signIn} = useContext(AuthContext)

  const [email,setEmail] = useState("")
  const [senha,setSenha] = useState("")
  const [loading,setLoading] = useState(false)

  async function handleLogin(event: FormEvent) {
     event.preventDefault();

     if(email === "" || senha === ""){
      
      toast.error("Preencha todos os campos!!!")
      return
     }

     setLoading(true);
    
     let data = { email, senha}

     await signIn(data)

     setLoading(false)
  }
  return (
    <>
    <Head>
      <title>Login</title>
    </Head>
    <div className={styles.container}>
    
      <div className={styles.login}>
        <Header color="grey">Login</Header>
          <Form onSubmit={handleLogin} loading={loading}>
            <Form.Input placeholder="email"
                  type="email"
                  value={email}
                  icon="at"
                  onChange= {(e) => setEmail(e.target.value)}
            />
            <Form.Input placeholder="Senha"
                  type="password"
                  icon="lock"
                  value={senha}
                  onChange= {(e) => setSenha(e.target.value)}
            />

            <Button 
              type="submit"
              color="blue"
              >
                Entrar
            </Button>
          </Form>
      </div>
    </div>
    
    </>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) =>{
  
  return {
    props: {}
  }
})