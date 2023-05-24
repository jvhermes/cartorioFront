import Head from "next/head"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { FormEvent, useState } from "react"
import styles from "./style.module.scss"

import { Input, Button, Icon } from 'semantic-ui-react'


import { ModalProcess } from "../../components/Modal/Processo-Cartorio/ModalProcessView"

import Modal from "react-modal"

import { setupAPIClient } from "../../services/api"
import moment from "moment"
import { DescricaoAprovacao, ItemCadastroProps, ItemProcessProps } from "../prefeitura"
import { SidebarCartorio } from "../../components/SidebarCartorio"


interface DashboardProps {
    processList: ItemProcessProps[];
    admin: boolean;
    setorList: ItemCadastroProps[];
    avatar:string;
}

Modal.setAppElement("#__next")



export default function DashboardPrefeitura({ processList, admin, setorList,avatar }: DashboardProps) {

    const [processos, setProcessos] = useState(processList || []);


    //filtro
    const [num_processo, setNum_processo] = useState("")
    const [proprietario, setProprietario] = useState("")
    const [dataInicial, setDataInicial] = useState("")
    const [dataFinal, setDataFinal] = useState("")
    const [bairro, setBairro] = useState("")
    const [quadra, setQuadra] = useState("")
    const [lote, setLote] = useState("")

    const [tipoDataInicial, setTipoDataInicial] = useState("text")
    const [tipoDataFinal, setTipoDataFinal] = useState("text")

    const [modalProcesso, setModalProcesso] = useState<ItemProcessProps>()
    const [modalProcesoOpen, setModalProcessoOpen] = useState(false)

    const [processoFilter, setProcessoFilter] = useState(processos)
   

    const dataAtual = moment()
    function closeModal() {
        setModalProcessoOpen(false);


    }



    async function openProcessModal(id: number) {

        const apiCliente = setupAPIClient();

        const response = await apiCliente.get("/processo/detalhe", {
            params: {
                id: id
            }
        })
       
        setModalProcesso(response.data);
        setModalProcessoOpen(true);

    }



    async function handleFilter(event: FormEvent) {
        event.preventDefault();
        if (num_processo === "" && proprietario === "" && dataInicial === "" && dataFinal === "" && bairro === "" && quadra === "" && lote === "") {
            return
        }

        const searchInicial = dataInicial
        console.log(dataInicial)
        const searchFinal = dataFinal
        const searchNum = num_processo.toLowerCase();
        const searchPropr = proprietario.toLowerCase();
        const searchBairro = bairro.toLowerCase();
        const searchQuadra = quadra.toLowerCase();
        const searchLote = lote.toLowerCase();

        const newProcessFilter = processoFilter.filter((item, index) => {


            const num = item.num_processo;

            const prop = item.lote[0].lote.proprietario;

            const bai = item.lote[0].lote.bairro;

            const qua = item.lote[0].lote.quadra;

            const lot = item.lote[0].lote.lote;

            const ini = item.criado_em;

            const fin = item.prazo;

            return prop.includes(searchPropr) && num.includes(searchNum) && bai.includes(searchBairro) && qua.includes(searchQuadra) && lot.includes(searchLote) && ini.includes(searchInicial) && fin.includes(searchFinal);
        })

        setProcessoFilter(newProcessFilter)
        setBairro("")
        setQuadra("")
        setLote("")
        setProprietario("")
        setNum_processo("")
        setDataFinal("")
        setDataInicial("")
    }


    return (
        <>
            <Head>
                <title>MS CIT</title>

            </Head>

            <main>
                <SidebarCartorio admin={admin}  avatar={avatar} />
                <div className={styles.container} >
                    <div className={styles.title}>
                        <div>
                            <h1>Processos Recebidos</h1>
                            <p>Listagem de processos recebidos da prefeitura ativos</p>
                        </div>
                    </div>
                    <section className={styles.content}>
                        <form className={styles.filter} onSubmit={handleFilter}>

                            <div className={styles.inputArea}>
                                <Input type="search" list="num" placeholder="Nº de processo" value={num_processo} onChange={(e) => setNum_processo(e.target.value)} />
                                <datalist id="num">
                                    {processos.map((item) => {
                                        return (
                                            <option className={styles.dropDownRow} key={item.id} value={item.num_processo}></option>
                                        )
                                    })}
                                </datalist>
                            </div>
                            <div className={styles.inputArea}>
                                <Input type="text" placeholder="Propietário" value={proprietario} onChange={(e) => { setProprietario(e.target.value) }} />

                            </div>

                            <div className={styles.inputArea}>
                                <Input type="search" list="bairro" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                                <datalist id="bairro" >
                                    {processos.map((item) => {
                                        return (
                                            <option key={item.id} value={item.lote[0].lote.bairro}></option>
                                        )
                                    })}
                                </datalist>
                            </div>
                            <div className={styles.inputArea}>
                                <Input type="search" list="quadra" placeholder="Quadra" value={quadra} onChange={(e) => setQuadra(e.target.value)} />
                                <datalist id="quadra" >
                                    {processos.filter((item) => {

                                        const searchBairro = bairro.toLowerCase();
                                        const bair = item.lote[0].lote.bairro;

                                        return searchBairro && bair.includes(searchBairro);
                                    }).map((item) => {
                                        return (
                                            <option key={item.id} value={item.lote[0].lote.quadra}></option>
                                        )
                                    })}
                                </datalist>
                            </div>

                            <div className={styles.inputArea}>
                                <Input type="search" list="lote" placeholder="Lote" value={lote} onChange={(e) => setLote(e.target.value)} />
                                <datalist id="lote" >
                                    {processos.filter((item) => {

                                        const searchBairro = bairro.toLowerCase();
                                        const bair = item.lote[0].lote.bairro;

                                        const searchQuadra = quadra.toLowerCase();
                                        const qua = item.lote[0].lote.quadra;


                                        return searchBairro && bair.includes(searchBairro) && searchQuadra && qua.includes(searchQuadra);
                                    }).map((item) => {
                                        return (
                                            <option key={item.id} value={item.lote[0].lote.lote}></option>
                                        )
                                    })}
                                </datalist>
                            </div>
                            <div className={styles.inputArea}>

                                <Input type={tipoDataInicial} onFocus={() => { setTipoDataInicial("date") }} onBlur={() => { setTipoDataInicial("text") }}
                                    value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} placeholder="Data Inicial" />
                            </div>
                            <div className={styles.inputArea}>

                                <Input placeholder="Prazo final" type={tipoDataFinal} onFocus={() => { setTipoDataFinal("date") }} onBlur={() => { setTipoDataFinal("text") }}
                                    value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
                            </div>
                            <div className={styles.inputArea}>
                                <Button color="grey" onClick={() => setProcessoFilter(processos)}>
                                    Pesquisar
                                    <Icon className={styles.buttonIcon} name="search"></Icon>
                                </Button>
                            </div>

                        </form>

                        <div>
                            <ul>
                                <li className={styles.processTitle}>
                                    <span >Número do Processo</span>
                                    <span >Tipo de Processo</span>
                                    <span >Propietário</span>
                                    <span >Bairro</span>
                                    <span >Quadra</span>
                                    <span >Lote</span>
                                    <span >Criação</span>
                                    <span >Prazo</span>
                                    <span> Status</span>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.processList}>
                            <ul>

                                {processoFilter.map((item, index) => {
                                    return (
                                        <li value={index} key={item.id} className={styles.processItem} >
                                            <button className={styles.processContent} onClick={() => openProcessModal(item.id)}>
                                                <span>{item.num_processo}</span>
                                                <span>{item.tipo.nome}</span>
                                                <span>{item.lote[0].lote.proprietario}</span>
                                                <span>{item.lote[0].lote.bairro}</span>
                                                <span>{item.lote[0].lote.quadra}</span>
                                                <span>{item.lote[0].lote.lote}</span>
                                                <span>{moment(item.criado_em).format("DD/MM/YYYY")}</span>
                                                <span>{moment(item.prazo).format("DD/MM/YYYY")}</span>
                                                <span>{ moment(item.prazo).diff(dataAtual, 'days') > 0 && (<span className={styles.respondido}>Pendente</span>) || <span className={styles.pendente}>Atrasado</span>} </span>
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
            {modalProcesoOpen && (
                <ModalProcess isOpen={modalProcesoOpen} onRequestClose={closeModal} processo={modalProcesso} setorList={setorList} />

            )}


        </>
    )
}



export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)


    const response = await apiClient.get("/me")

    const { tipo, departamento, admin,avatar } = response.data;

    if (tipo === '2') {
        return {
            redirect: {
                destination: "/cartorio",
                permanent: false
            }
        }
    }

    const responseProcess = await apiClient.get('/processo/lista/departamento', {
        params: {
            dep: departamento
        }
    })

    const responseSetor = await apiClient.get('/setor/lista')

    return {
        props: {
            processList: responseProcess.data,
            setorList: responseSetor.data,
            admin: admin,
            avatar:avatar
        }
    }

})