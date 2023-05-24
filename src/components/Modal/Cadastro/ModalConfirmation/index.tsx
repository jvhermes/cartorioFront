import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../../services/api"
import { Button } from "semantic-ui-react"
import {toast} from "react-toastify"

interface ModalConfirmProps{
    isOpen: boolean;
    onRequestClose: () => void;
    id:string;
    index:number;
    type:number;
}

export function ModalConfirm({isOpen,onRequestClose, id,index,type}:ModalConfirmProps){

    async function handleDeleteConfirm(){
        const apiCliente = setupAPIClient();

        if(type===1){
            try{
                await apiCliente.delete("/atividade",{
                    params:{
                        id:id
                    }
                })
                location.reload()
            }catch{
                toast.error("erro ao deletar")
            }
          
        }
        if(type===2){
            try{
                await apiCliente.delete("/departamento",{
                    params:{
                        id:id
                    }
                })
                location.reload()
            }catch{
                toast.error("erro ao deletar")
            }
           

        }
        if(type===3){
            
            if(index === 0 || index === 1){

                toast.error("Este campo não pode ser excluido")

                return
            }
            try{
                await apiCliente.delete("/tipo",{
                    params:{
                        id:id
                    }
                })
                location.reload()
            }catch{
                toast.error("erro ao deletar")
            }

        }
        if(type===4){

            try{
                await apiCliente.delete("/tipocartorio",{
                    params:{
                        id:id
                    }
                })
                location.reload()
            }catch{
                toast.error("erro ao deletar")
            }
        }
        if(type===5){

            try{
                await apiCliente.delete("/setor",{
                    params:{
                        id:id
                    }
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
                <h2>Confirmar Exculsão</h2>
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