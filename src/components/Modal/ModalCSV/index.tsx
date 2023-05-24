import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { setupAPIClient } from "../../../services/api"
import { useState,ChangeEvent } from "react"
import {FiUpload} from 'react-icons/fi'
import { Button,Input } from "semantic-ui-react"
import {toast} from "react-toastify"

interface ModalConfirmProps{
    isOpen: boolean;
    onRequestClose: () => void;
}

export function ModalCSV({isOpen,onRequestClose}:ModalConfirmProps){

    const [file,setFile] = useState(null)

    async function handleNewCSVCadastro(){
        
    
        try{
            const data = new FormData();

            data.append('file',file)

            const apiClient = setupAPIClient();

            const config = {     
                headers: { "Content-Type": "multipart/form-data" },
               
            }
            
            await apiClient.post('/lote',data,config,)

            toast.success('Base atualizada com Sucesso')
        }catch(err){
            toast.error("erro ao atualizar base de dados")
            console.log(err)
        }
        
    }

    function handleChange(e : ChangeEvent<HTMLInputElement>){

      

        if(!e.target.files){
            return;
        }

        const fileSource = e.target.files[0];

        if(!fileSource){
            return;
        }


        setFile(fileSource);
       
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
                <h2>Atualizar base de dados</h2>
                <p>*documento do tipo .csv</p>
                <label className={styles.labelIcon}>
                    <span>
                        <FiUpload size={25} color="#000"/>
                    </span>
                    <input type="file"  accept=".csv,text/csv" onChange={ (e) =>handleChange(e)}/>
                </label>
               
                <div className={styles.content}>
                    <Button color="blue" onClick={handleNewCSVCadastro} className={styles.atualizar}>
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