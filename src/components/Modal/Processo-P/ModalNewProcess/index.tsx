import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { useState } from "react"
import { Desmembramento } from "./desmembramento"
import { Remembramento } from "./remembramento"
import { Pessoa } from "./pessoa"
import { Input,Dropdown,Button} from "semantic-ui-react"


import { ItemCadastroProps, ItemLoteProps } from "../../../../pages/prefeitura"
import { FiX } from "react-icons/fi"



interface ModalNewProcessProps {
    isOpen: boolean
    onRequestClose: () => void;
    atividadeList: ItemCadastroProps[];
    departamentoList: ItemCadastroProps[];
    tipoList: ItemCadastroProps[];
    loteList: ItemLoteProps[];
}

export function ModalNewProcess({ isOpen, onRequestClose, atividadeList, departamentoList, tipoList, loteList }: ModalNewProcessProps,) {

    const [selectTipo, setSelectTipo] = useState(0)
    const [selectAtividade, setSelectAtividade] = useState(0)

    const [titulo, setTitulo] = useState("Remembramento")

    const [atividades, setAtividades] = useState(atividadeList || []);
    const [tipos, setTipos] = useState(tipoList || []);
    const [lotes, setLotes] = useState(loteList || []);
    const [num_processo, setNum_processo] = useState("")
    const [ano, setAno] = useState("2023")
    const [criado_em, setCriado_em] = useState("")

    const [showDesmembramento, setShowDesmembramento] = useState(false)
    const [showRemembramento, setShowRemembramento] = useState(true)
    const [showPessoa, setShowPessoa] = useState(false)


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

    function handleChangeAtividade(data) {
        setSelectAtividade(data.value)
    }

    const customStyles = {
        content: {
            top: "50%",
            bottom: "auto",
            left: "50%",
            rigth: "auto",
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
                    <FiX size={45} color="#777" />
                </Button>
                <h1>Novo Processo {titulo}</h1>
            </div>
            <div className={styles.base}>
                <div className={styles.baseSelect}>
                    <div>
                        <label htmlFor="tipos">Tipos de Processo:</label>
                        <Dropdown id="tipos"selection value={selectTipo} onChange={ (e,data) => handleChangeTipo(data)} options={       
                            tipos.map((item, index) => {
                                return (
                                    {key:item.id, value:index,text:item.nome}
                                )
                            })} />
                     
                       
                    </div>
                    <div>
                        <label htmlFor="aprovacao">Data de Aprovação:</label>
                        <Input id="aprovacao" value={criado_em} onChange={(e) => setCriado_em(e.target.value)} 
                         type="date" />
                    </div>
                    <div>
                        <label htmlFor="atividade">Atividades:</label>
                        <Dropdown id="atividade" value={selectAtividade}  onChange={(e,data) => handleChangeAtividade(data)} selection options={
                            atividades.map((item, index) => {
                                return (
                                    {key:item.id, value:index,text:item.nome}
                                )
                            })} >
                        </Dropdown>

                    </div>
                </div>
                <div className={styles.baseInput}>

                    <Input type="text" placeholder="Número do Processo" value={num_processo} onChange={(e) => setNum_processo(e.target.value)} />
                    <Input type="text" maxLength={4} placeholder="Ano do Processo" value={ano} onChange={(e) => setAno(e.target.value)} />
                </div>
            </div>
            {showDesmembramento && (
                <Desmembramento atividade={atividades[selectAtividade]} tipo={tipos[selectTipo]} departamentoList={departamentoList}
                    loteList={lotes} numero_processo={num_processo} ano={ano} criado_em={criado_em} />
            )}
            {showRemembramento && (
                <Remembramento atividade={atividades[selectAtividade]} tipo={tipos[selectTipo]} departamentoList={departamentoList}
                    loteList={lotes} numero_processo={num_processo} ano={ano} criado_em={criado_em} />
            )}
            {showPessoa && (
                <Pessoa atividade={atividades[selectAtividade]} tipo={tipos[selectTipo]} departamentoList={departamentoList}
                loteList={lotes} numero_processo={num_processo} ano={ano} criado_em={criado_em} />
            )}
        </Modal>
    )

}


