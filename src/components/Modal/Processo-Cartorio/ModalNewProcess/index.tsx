import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { useState } from "react"
import {  Dropdown, Button } from "semantic-ui-react"
import { PessoaCartorio } from "./pessoa"
import { RemembramentoCartorio } from "./remembramento"
import { DesmembramentoCartorio } from "./desmembramento"
import { ItemCadastroProps, ItemLoteProps } from "../../../../pages/prefeitura"
import { FiX } from "react-icons/fi"



interface ModalNewProcessProps {
    isOpen: boolean
    onRequestClose: () => void;
    setorList: ItemCadastroProps[];
    tipoList: ItemCadastroProps[];
    loteList: ItemLoteProps[];
}

export function ModalNewProcess({ isOpen, onRequestClose, setorList, tipoList, loteList }: ModalNewProcessProps,) {

 
    const [selectTipo, setSelectTipo] = useState(0)

    const [tipos, setTipos] = useState(tipoList || []);
    
    const [showDesmembramento, setShowDesmembramento] = useState(false)
    const [showRemembramento, setShowRemembramento] = useState(true)
    const [showPessoa, setShowPessoa] = useState(false)

    const [titulo, setTitulo] = useState("titularidade")


    function handleChangeTipo(data) {
        setSelectTipo(data.value);
        setTitulo(tipos[data.value].nome)
        if (tipos[data.value].nome === "remembramento") {
            setShowDesmembramento(false)
            setShowRemembramento(true)
            setShowPessoa(false)
            
            return
        }
        if (tipos[data.value].nome === "desmembramento") {
            setShowRemembramento(false)
            setShowDesmembramento(true)
            setShowPessoa(false)
           
            return
        }
        setShowPessoa(true)
        setShowDesmembramento(false)
        setShowRemembramento(false)
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
            width: "1020px",
            height: "800px",
            maxWidth: "90vw",
            maxHeight: "85vh"

        }
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className={styles.title}>
                <Button onClick={onRequestClose} className="react-modal-close" style={{ background: "transparent", border: 0 }}>
                    <FiX size={45} color="#000" />
                </Button>
                <h1>Novo Processo {titulo}</h1>
            </div>
            <div className={styles.base}>
                <div>
                    <label htmlFor="tipo">Tipo de Processo:</label>
                    <Dropdown name="tipo" id="tipo" selection value={selectTipo} onChange={(e,data) => handleChangeTipo(data)}
                        options={
                            tipos.map((item, index) => {
                                return (
                                    { key: item.id, value: index, text: item.nome }
                                )
                            })
                        }>

                    </Dropdown>
                </div>
            </div>
            {showPessoa && (
                <PessoaCartorio  tipo={tipos[selectTipo]} setorList={setorList}
                loteList={loteList}   />
            )}
            {showRemembramento && (
                <RemembramentoCartorio tipo={tipos[selectTipo]} setorList={setorList}
                loteList={loteList} />
            )}
              {showDesmembramento && (
                <DesmembramentoCartorio tipo={tipos[selectTipo]} setorList={setorList}
                loteList={loteList} />
            )}
        </Modal>
    )

}


