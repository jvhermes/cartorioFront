import Head from "next/head"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { FormEvent, useState } from "react"
import { Icon, Input, Button } from "semantic-ui-react"
import styles from "./style.module.scss"
import { SidebarPrefeitura } from "../../components/SidebarPrefeitura"


import { ModalProcessCartorioView } from "../../components/Modal/Processo-P/ModalProcessCartorioView"
import { ItemProcessoCartorioProps } from "."

import Modal from "react-modal"

import { setupAPIClient } from "../../services/api"
import moment from "moment"




interface DashboardRecebidosProps {

    processCartorioList: ItemProcessoCartorioProps[];
    admin: boolean;
    avatar:string
}

Modal.setAppElement("#__next")



export default function DashboardPrefeitura({ processCartorioList, admin,avatar }: DashboardRecebidosProps) {


    const [processos, setCartorio] = useState(processCartorioList || [])


    //filtro
    const [tipo_processo, setTipo_processo] = useState("")
    const [proprietario, setProprietario] = useState("")
    const [dataInicial, setDataInicial] = useState("")
    const [dataFinal, setDataFinal] = useState("")
    const [bairro, setBairro] = useState("")
    const [quadra, setQuadra] = useState("")
    const [lote, setLote] = useState("")
    const [departamento, setDepartamento] = useState("")


    const [tipoDataInicial, setTipoDataInicial] = useState("text")

    const [modalProcessoCartorio, setModalProcessoCartorio] = useState<ItemProcessoCartorioProps>()
    const [modalProcessoCartorioOpen, setModalProcessoCartorioOpen] = useState(false)


    const [processoFilter, setProcessoFilter] = useState(processos)


    function closeModal() {

        setModalProcessoCartorioOpen(false)
    }


    async function openProcessCartorioModal(id: string) {
        const apiCliente = setupAPIClient();

        const response = await apiCliente.get("/processocartorio/detalhe", {
            params: {
                id: id
            }
        })

        setModalProcessoCartorio(response.data);
        setModalProcessoCartorioOpen(true);
    }





    async function handleFilter(event: FormEvent) {
        event.preventDefault();
        if (tipo_processo === "" && proprietario === "" && dataInicial === "" && dataFinal === "" && bairro === "" && quadra === "" && lote === "" && departamento === "") {
            return
        }

        const searchInicial = dataInicial


        const searchNum = tipo_processo.toLowerCase();
        const searchPropr = proprietario.toLowerCase();
        const searchBairro = bairro.toLowerCase();
        const searchQuadra = quadra.toLowerCase();
        const searchLote = lote.toLowerCase();
        const searchDep = departamento.toLowerCase();
        const newProcessFilter = processoFilter.filter((item, index) => {


            const num = item.tipo.nome;

            const prop = item.lote.proprietario;

            const bai = item.lote.bairro;

            const qua = item.lote.quadra;

            const lot = item.lote.lote;

            const ini = item.criado_em;

            const depa = item.departamento.nome


            return prop.includes(searchPropr) && num.includes(searchNum) && bai.includes(searchBairro) && qua.includes(searchQuadra) && lot.includes(searchLote) && ini.includes(searchInicial) && depa.includes(searchDep);
        })

        setProcessoFilter(newProcessFilter)
        setBairro("")
        setQuadra("")
        setLote("")
        setProprietario("")
        setTipo_processo("")
        setDataInicial("")
        setDepartamento("")
    }


    return (
        <>
            <Head>
                <title>MS CIT</title>

            </Head>
            <main className={styles.main}>
                <SidebarPrefeitura admin={admin} avatar={avatar}/>
                <div className={styles.container} >
                    <div className={styles.title}>
                        <div>
                            <h1>Processos Recebidos</h1>
                            <p>Listagem de processos rebidos dos cartórios ativos</p>
                        </div>
                    </div>
                    <section className={styles.content}>
                        <form className={styles.filter} onSubmit={handleFilter}>

                            <div className={styles.inputArea}>
                                <Input type="search" list="tipo" placeholder="Tipo de processo" value={tipo_processo} onChange={(e) => setTipo_processo(e.target.value)} />
                                <datalist id="tipo">
                                    {processos.map((item) => {
                                        return (
                                            <option className={styles.dropDownRow} key={item.id} value={item.tipo.nome}></option>
                                        )
                                    })}
                                </datalist>
                            </div >
                            <div className={styles.inputArea}>
                                <Input list="dep" type="search" placeholder="Departamentos" value={departamento} onChange={(e) => { setDepartamento(e.target.value) }} />
                                <datalist id="dep" >
                                    {processos.map((item) => {
                                        return (
                                            <option key={item.id} value={item.departamento.nome}></option>
                                        )
                                    })}
                                </datalist>
                            </div>


                            <div className={styles.inputArea}>
                                <Input type={tipoDataInicial} onFocus={() => { setTipoDataInicial("date") }} onBlur={() => { setTipoDataInicial("text") }}
                                    value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} placeholder="Data Inicial" />
                            </div>
                            <div className={styles.inputArea}>
                                <Input list="prop" type="search" placeholder="Propietário" value={proprietario} onChange={(e) => { setProprietario(e.target.value) }} />
                                <datalist id="prop" >
                                    {processos.map((item) => {
                                        return (
                                            <option key={item.id} value={item.lote.proprietario}></option>
                                        )
                                    })}
                                </datalist>
                            </div>



                            <div className={styles.inputArea}>
                                <Input type="search" list="bairro" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                                <datalist id="bairro" >
                                    {processos.map((item) => {
                                        return (
                                            <option key={item.id} value={item.lote.bairro}></option>
                                        )
                                    })}
                                </datalist>
                            </div>
                            <div className={styles.inputArea}>
                                <Input type="search" list="quadra" placeholder="Quadra" value={quadra} onChange={(e) => setQuadra(e.target.value)} />
                                <datalist id="quadra" >
                                    {processos.filter((item) => {

                                        const searchBairro = bairro.toLowerCase();
                                        const bair = item.lote.bairro;

                                        return searchBairro && bair.includes(searchBairro);
                                    }).map((item) => {
                                        return (
                                            <option key={item.id} value={item.lote.quadra}></option>
                                        )
                                    })}
                                </datalist>
                            </div>
                            <div>
                                <Input type="search" list="lote" placeholder="Lote" value={lote} onChange={(e) => setLote(e.target.value)} />
                                <datalist id="lote" >
                                    {processos.filter((item) => {

                                        const searchBairro = bairro.toLowerCase();
                                        const bair = item.lote.bairro;

                                        const searchQuadra = quadra.toLowerCase();
                                        const qua = item.lote.quadra;


                                        return searchBairro && bair.includes(searchBairro) && searchQuadra && qua.includes(searchQuadra);
                                    }).map((item) => {
                                        return (
                                            <option key={item.id} value={item.lote.lote}></option>
                                        )
                                    })}
                                </datalist>
                            </div>

                            <div className={styles.inputArea}>
                                <Button color="grey" onClick={() => setProcessoFilter(processos)}>
                                    Pesquisar
                                    <Icon className={styles.buttonIcon} name="search"></Icon>
                                </Button>
                            </div>

                        </form>

                        <div className={styles.processHead}>
                        </div>
                        <div className={styles.processList}>
                            <ul>
                                <li className={styles.processTitleResp}>
                                    <span >Tipo de Processo</span>
                                    <span >Enviado de</span>
                                    <span >Propietário</span>
                                    <span >Bairro</span>
                                    <span >Quadra</span>
                                    <span >Lote</span>
                                    <span >Criação</span>

                                </li>
                                {processoFilter.map((item, index) => {
                                    return (
                                        <li value={index} key={item.id} className={styles.processItem} >
                                            <button className={styles.processContentResp} onClick={() => openProcessCartorioModal(item.id)}>
                                                <span>{item.tipo.nome}</span>
                                                <span>{item.departamento.nome}</span>
                                                <span>{item.lote.proprietario}</span>
                                                <span>{item.lote.bairro}</span>
                                                <span>{item.lote.quadra}</span>
                                                <span>{item.lote.lote}</span>
                                                <span>{moment(item.criado_em).format("DD/MM/YYYY")}</span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </section>
                </div>
            </main> 
            <footer className={styles.footer}>
                    <strong>Copyright</strong> SICART - CIT © 2023
            </footer>

            {modalProcessoCartorioOpen && (
                <ModalProcessCartorioView isOpen={modalProcessoCartorioOpen} onRequestClose={closeModal} processo={modalProcessoCartorio} />
            )}

        </>
    )
}



export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)


    const response = await apiClient.get("/me")

    const { tipo, setor, admin,avatar } = response.data;

    if (tipo === '2') {
        return {
            redirect: {
                destination: "/cartorio/recebidos",
                permanent: false
            }
        }
    }

    const [

        responseProcessCartorio,


    ] = await Promise.all([

        apiClient.get('/processocartorio/lista/setor', {
            params: {
                set: setor
            }
        })
    ])

    return {
        props: {
            admin: admin,
            avatar:avatar,
            processCartorioList: responseProcessCartorio.data,

        }
    }

})