import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../services/api"
import { Button } from "semantic-ui-react"
import {toast} from "react-toastify"

interface ModalConfirmProps{
    isOpen: boolean;
    onRequestClose: () => void;
    id:string;
    type:number;
}

export function ModalConfirm({isOpen,onRequestClose, id,type}:ModalConfirmProps){

    async function handleDeleteConfirm(){
        const apiCliente = setupAPIClient();

        const idProcess = parseInt(id)

        if(type===1){
            try{
                await apiCliente.put("/processo/fechar", {
                    id: idProcess
                })
                location.reload()
            }catch{
                toast.error("erro ao deletar")
            }
          
        }
        if(type===2){
            try{
                await apiCliente.put("/processocartorio/fechar", {
                    id: id,
                    excluido:true,
                })
                location.reload()
            }catch{
                toast.error("erro ao deletar")
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
                <h2>Confirmar Conclusão</h2>
                <div className={styles.content}>
                    <Button onClick={handleDeleteConfirm} color="red">
                        Confirmar
                    </Button>
                    <Button onClick={onRequestClose} className="react-modal-close" >
                        Cancelar
                    </Button>
                </div>
            </div>
            

        </Modal>
    )
}