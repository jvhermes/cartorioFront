import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { useState, useEffect } from "react"
import { setupAPIClient } from "../../../../services/api"
import { DescricaoAprovacao } from "../../../../pages/prefeitura"
import { Table, Dropdown, Button, Input, Checkbox,TextArea } from "semantic-ui-react"
import { ItemCadastroProps } from "../../../../pages/prefeitura"
import { FiX } from "react-icons/fi"
import { toast } from "react-toastify"



interface ModalAprovacaoProps {
    isOpen: boolean;
    onRequestClose: () => void;
    setorList: ItemCadastroProps[];
    processoId: number;
    atrasado: boolean
}



export function ModalArovacaoPessoa({ isOpen, onRequestClose, setorList, processoId, atrasado }: ModalAprovacaoProps,) {

    const [setores, setSetoress] = useState(setorList || []);
    const [selectSetor, setSelectSetor] = useState(0)
    const [observacao, setObservacao] = useState("")
    const [alvaraExiste, setAlvaraExiste] = useState(false)
    const [alvara, setAlvara] = useState("")
   


    function handleChangeSetor(data) {
        setSelectSetor(data.value)
    }

    function changeAlvara() {
        setAlvaraExiste(!alvaraExiste)
    }

    function handleChangeObservacao(data) {
        setObservacao(data.value)
    }

    function handleChangeAlvara(data) {
        setAlvara(data.value)
    }


    async function handleNewAprovacao(atraso) {
        const apiClient = setupAPIClient()

        const setor_id = setores[selectSetor].id

        const processo_id = processoId

    
        
        try {
            await apiClient.post("/aprovacaopessoa", {
                observacao, processo_id,alvara,atraso,setor_id
            })
            location.reload()
        } catch {
            toast.error("Erro ao enviar aprovacao")
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
            width: "1100px",
            height: "700px"
        }
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <button onClick={onRequestClose} className="react-modal-close" style={{ background: "transparent", border: 0 }}>
                <FiX size={45} color="#000" />
            </button>
            <div className={styles.container}>
                <h2>Novo Registro</h2>
                <div className={styles.observacao}>
                    <label htmlFor="observacao">Observação:</label>
                    <TextArea name="obs" id="observacao" value={observacao} maxLength={435} onChange={(e,data) => handleChangeObservacao(data)}></TextArea>
                </div>
                <div className={styles.enviar}>

                    {atrasado && (
                        <div className={styles.atraso}>
                            <label>Possui autorização da prefeitura?</label>
                            <Checkbox toggle onChange={() => changeAlvara()} ></Checkbox>
                            {alvaraExiste && (
                                <div className={styles.atrasoContent}>
                                    <div className={styles.alvara}>
                                        <Input placeholder="Alvará de permissão" value={alvara} onChange={(e,data) => handleChangeAlvara(data)}/>
                                    </div>
                                    <div className={styles.envio}>
                                        <label htmlFor="encaminhar">Encaminhar para (setores)</label>
                                        <Dropdown selection id="encaminhar" onChange={(e, data) => handleChangeSetor(data)} value={selectSetor} options={
                                            setores.map((item, index) => {
                                                return (
                                                    { key: item.id, value: index, text: item.nome }
                                                )
                                            })
                                        }>
                                        </Dropdown>
                                    </div>

                                    <Button color="blue" onClick={() => handleNewAprovacao(true)} >Enviar</Button>
                                </div>
                            )}
                        </div>
                    )}
                    {!atrasado && (
                        <div>
                            <div className={styles.envio}>
                                <label htmlFor="encaminhar">Encaminhar para (setores)</label>
                                <Dropdown selection id="encaminhar" onChange={(e, data) => handleChangeSetor(data)} value={selectSetor} options={
                                    setores.map((item, index) => {
                                        return (
                                            { key: item.id, value: index, text: item.nome }
                                        )
                                    })
                                }>
                                </Dropdown>
                            </div>
                            <Button color="blue" onClick={() => handleNewAprovacao(false)} className={styles.enviar}>Enviar</Button>
                        </div>
                    )}

                </div>


            </div>
        </Modal>
    )

}


