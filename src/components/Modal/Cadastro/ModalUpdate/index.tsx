import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../../services/api"
import { useState } from "react"
import { Input,Button } from "semantic-ui-react"
import {toast} from "react-toastify"

interface ModalConfirmProps{
    isOpen: boolean;
    onRequestClose: () => void;
    id:string;
    index:number;
    type:number;
}

export function ModalUpdate({isOpen,onRequestClose, id,index,type}:ModalConfirmProps){

    const [nome,setNome] = useState("")

    async function handleUpdate(){
        const apiCliente = setupAPIClient();

        if(type===1){
            try{
                await apiCliente.put("/atividade/update",{
                    id,
                    nome
                })
                setNome("")
                location.reload()
            }catch{
                setNome("")
                toast.error("Erro na atualização")
            }
            
            
        }
        if(type===2){
            try{
                await apiCliente.put("/departamento/update",{
                    id,
                    nome
                })
                setNome("")
                location.reload()
            }catch{
                setNome("")
                toast.error("Erro na atualização")
            }

        }
        if(type===3){

            if(index === 0 || index === 1){

                toast.error("Este campo não pode ser atualizado")

                return
            }
            try{
                await apiCliente.put("/tipo/update",{
                    id,
                    nome
                    
                })
                setNome("")
                location.reload()
            }catch{
                toast.error("Erro na atualização")
                setNome("")
            }

        }
        if(type===4){
            try{
                await apiCliente.put("/tipocartorio/update",{
                    id,
                    nome
                })
                setNome("")
                location.reload()
            }catch{
                setNome("")
                toast.error("Erro na atualização")
            }

        }
        if(type===5){
            try{
                await apiCliente.put("/setor/update",{
                    id,
                    nome
                })
                setNome("")
                location.reload()
            }catch{
                setNome("")
                toast.error("Erro na atualização")
            }

        }
    }

    const customStyles = {
        content:{
            top:"50%",
            bottom: "auto",
            left: "50%",
            rigth: "auto",
            padding: "30px",
            transform:"translate(-50%,-50%)",
            backgroundColor:"#F3F3F4",
            width:"500px"
        }
    }

    return(
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>

            <div className={styles.container}>
                <h2>Atualizar nome</h2>
                <div>
                    <Input type="text" placeholder="Novo nome" value={nome}onChange= {(e) => setNome(e.target.value)} />
                </div>
                <div className={styles.content}>
                    
                    <Button  onClick={handleUpdate} color="blue">
                        Atualizar
                    </Button>
                    <Button onClick={onRequestClose} className="react-modal-close" >
                        Cancelar
                    </Button>
                </div>
            </div>
            

        </Modal>
    )
}