import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { useState } from "react"
import { ModalArovacao } from "../ModalAprovacao"
import { ModalArovacaoPessoa } from "../ModalAprovacaoPessoa"
import { DescricaoAprovacao } from "../../../../pages/prefeitura"
import { Button, Table } from "semantic-ui-react"
import { FiX } from "react-icons/fi"

import { ItemProcessProps, ItemCadastroProps } from "../../../../pages/prefeitura"
import moment from "moment"


interface ModalProcessProps {
    isOpen: boolean;
    onRequestClose: () => void;
    processo: ItemProcessProps;
    setorList: ItemCadastroProps[];
}

export function ModalProcess({ isOpen, onRequestClose, processo, setorList }: ModalProcessProps) {

    const [modalAprovacaoOpen, setModalAprovacaoOpen] = useState(false)
    const [modalAprovacaoPessoaOpen, setModalAprovacaoPessoaOpen] = useState(false)
    const processoId = processo.id
    const [atrasado, setAtrasado] = useState<boolean>()
    const descricaoList: DescricaoAprovacao[] = []

    processo.descricaoLotes.map((item) => {
        descricaoList.push({
            lote: item.lote,
            matricula: "",
            data_registro: "",
            transcricao: "",
            descricao_id: item.id
        })
    })

    const dataAtual = moment()
    const data = moment(processo.prazo)

    const dataCalc = data.diff(dataAtual, 'days')

    function openAprovacaoModal(atraso: boolean) {

        setAtrasado(atraso)
        setModalAprovacaoOpen(true)
    }
    function openAprovacaoModalPessoa(atraso: boolean) {

        setAtrasado(atraso)
        setModalAprovacaoPessoaOpen(true)
    }

    function closeAprovacaoModal() {
        setModalAprovacaoOpen(false);
        setModalAprovacaoPessoaOpen(false)
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
            height: "620px",
            width: "1000px",
        }
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <button onClick={onRequestClose} className="react-modal-close" style={{ background: "transparent", border: 0 }}>
                <FiX size={45} color="#000" />
            </button>
            <div className={styles.content}>
                <div className={styles.detalhes}>
                    <h2>Detalhes do Processo</h2>
                    <div className={styles.detalhesItem}>
                        <p>Número do Processo: <strong>{processo.num_processo} </strong></p>
                        <p>Criado em: <strong>{processo.criado_em}</strong></p>
                        <p>Expira em: <strong>{processo.prazo}</strong></p>
                        <p>Ano: <strong>{processo.ano}</strong></p>
                        <p>Recebido de: <strong>{processo.setor.nome}</strong></p>

                        {dataCalc > 0 && (
                            <p className={`${styles.prazo} ${styles.prazoAntes}`}> {dataCalc} dias restantes</p>
                        )}
                        {dataCalc < 0 && (
                            <p className={`${styles.prazoAtraso} ${styles.prazo}`}> {dataCalc.toString().slice(1)} dias de atraso</p>
                        )}
                        {dataCalc === 0 && (
                            <p className={`${styles.prazoUltimo} ${styles.prazo}`}> Último dia de prazo</p>
                        )}

                    </div>
                </div>



                {processo.tipoLote && (
                    <div className={styles.descricao}>
                        <h3>Descrição Recebida:</h3>
                        <div className={styles.tableContainer}>
                            <Table celled className={styles.table} >
                                <Table.Header >
                                    <Table.Row>
                                        <Table.HeaderCell>Lote</Table.HeaderCell>
                                        <Table.HeaderCell>Area</Table.HeaderCell>
                                        <Table.HeaderCell>Testada</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {processo.descricaoLotes.map((item) => {
                                        return (
                                            <Table.Row key={item.id}>
                                                <Table.Cell><span>{item.lote}</span></Table.Cell>
                                                <Table.Cell><span>{item.area}</span></Table.Cell>
                                                <Table.Cell><span>{item.testada}</span></Table.Cell>
                                            </Table.Row>
                                        )
                                    })}

                                </Table.Body>
                            </Table>
                        </div>
                    </div>

                ) || (
                        <div className={styles.descricao}>
                            <h3>Descrição Recebida:</h3>
                            <div className={styles.tableContainer}>
                                <Table celled className={styles.table} >
                                    <Table.Header >
                                        <Table.Row>
                                            <Table.HeaderCell>Cpf</Table.HeaderCell>
                                            <Table.HeaderCell>Nome</Table.HeaderCell>
                                            <Table.HeaderCell>Email</Table.HeaderCell>
                                            <Table.HeaderCell>Telefone</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {processo.descricaoPessoas.map((item) => {
                                            return (
                                                <Table.Row key={item.id}>
                                                    <Table.Cell><span>{item.cpf}</span></Table.Cell>
                                                    <Table.Cell><span>{item.nome}</span></Table.Cell>
                                                    <Table.Cell><span>{item.email}</span></Table.Cell>
                                                    <Table.Cell><span>{item.telefone}</span></Table.Cell>
                                                </Table.Row>
                                            )
                                        })}

                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                    )}




                <div className={styles.lotesContent}>
                    <h3>Lotes Relacionados:</h3>
                    {processo.lote.map((item, index) => {
                        return (
                            <div className={styles.lotes} key={index}>
                                <h3>Dados do lote {index + 1}</h3>
                                <p>Bairro: <strong> {item.lote.bairro} </strong> </p>
                                <p>Quadra: <strong> {item.lote.quadra}</strong></p>
                                <p>Lote: <strong> {item.lote.lote} </strong> </p>
                                <p>Inscrição Imobiliária: <strong> {item.lote.insc_imob} </strong> </p>
                                <p>Proprietário: <strong> {item.lote.proprietario} </strong> </p>
                                <p>Número: <strong> {item.lote.numero} </strong> </p>
                                <p>Logradouro: <strong> {item.lote.logradouro} </strong> </p>
                            </div>
                        )
                    })}

                </div>
                <div className={styles.observacaoContainer}>
                    <h3>Observação Recebida</h3>
                    <p className={styles.observacao}>{processo.texto}</p>
                </div>
                
                {!processo.respondido && (processo.tipoLote && (
                    <div className={styles.button} >
                        {dataCalc < 0 && (
                            <Button color="red" onClick={() => openAprovacaoModal(true)} >Informar Registro com atraso</Button>
                        ) || <Button color="blue" onClick={() => openAprovacaoModal(false)} >Informar Registro</Button>}

                    </div>
                ) || (
                        <div className={styles.button} >
                            {dataCalc < 0 && (
                                <Button color="red" onClick={() => openAprovacaoModalPessoa(true)} >Informar Registro com atraso</Button>
                            ) || <Button color="blue" onClick={() => openAprovacaoModalPessoa(false)}  >Informar Registro</Button>}

                        </div>
                    ))}


            </div>
            {modalAprovacaoOpen && (
                <ModalArovacao isOpen={modalAprovacaoOpen} descricaoList={descricaoList} onRequestClose={closeAprovacaoModal}
                    setorList={setorList} processoId={processoId} atrasado={atrasado} />
            )}
             {modalAprovacaoPessoaOpen && (
                <ModalArovacaoPessoa isOpen={modalAprovacaoPessoaOpen} onRequestClose={closeAprovacaoModal}
                    setorList={setorList} processoId={processoId} atrasado={atrasado} />
            )}
        </Modal>
    )
}