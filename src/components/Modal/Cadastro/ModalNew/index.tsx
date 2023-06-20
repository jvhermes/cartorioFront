import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../../services/api"
import { useState } from "react"

import { FiX } from "react-icons/fi"
import { toast } from "react-toastify"

import { Input, Button,List } from "semantic-ui-react"
import { ItemCadastroProps } from "../../../../pages/prefeitura"

interface ModalProcessProps {
    isOpen: boolean;
    onRequestClose: () => void;
    tipo: number
}

export function ModalNewCadastro({ isOpen, onRequestClose,  tipo }: ModalProcessProps) {

  
    const [nome, setNome] = useState("")

    async function handleNew() {
        const apiCliente = setupAPIClient();

        if (tipo === 1) {
            try {
                await apiCliente.post("/atividade", {
                    nome
                })
                setNome("")
                location.reload()
            } catch {
                setNome("")
                toast.error("Não foi possível completar a ação")
            }


        }
        if (tipo === 2) {
            try {
                await apiCliente.post("/departamento", {

                    nome
                })
                setNome("")
                location.reload()
            } catch {
                setNome("")
                toast.error("Não foi possível completar a ação")
            }

        }
        if (tipo === 3) {

            try {
                await apiCliente.post("/tipo", {

                    nome

                })
                setNome("")
                location.reload()
            } catch {
                toast.error("Não foi possível completar a ação")
                setNome("")
            }

        }
      
        if (tipo === 4) {

            try {
                await apiCliente.post("/setor", {
                    nome
                })
                setNome("")
                location.reload()
            } catch {
                toast.error("Não foi possível completar a ação")
                setNome("")
            }

        }

    }



    const customStyles = {
        content: {
            top: "50%",
            bottom: "auto",
            left: "50%",
            rigth: "auto",
            padding: "30px",
            transform: "translate(-50%,-50%)",
            backgroundColor: "#F3F3F4",
            width: "600px",
            height: "400px"
        }
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <button onClick={onRequestClose} className="react-modal-close" style={{ background: "transparent", border: 0 }}>
                <FiX size={45} color="#000" />
            </button>
            <div className={styles.container}>
                    <h2>Novo</h2>
                    <div className={styles.botao}>
                        <Input type="text" value={nome} placeholder="Novo nome" onChange={(e,data) => { setNome(data.value) }} />
                        <Button color="blue"  onClick={handleNew}>Adicionar</Button>
                    </div>
              
            </div>
        </Modal>
    )
}