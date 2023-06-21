import Head from "next/head"
import { canSSRAuth } from "../../utils/canSSRAuth"
import { FormEvent, useState } from "react"
import { SidebarPrefeitura } from "../../components/SidebarPrefeitura"
import styles from "./style.module.scss"


import { Input, Button, Icon } from 'semantic-ui-react'


import { ModalProcess } from "../../components/Modal/Processo-P/ModalProcess"
import { ModalNewProcess } from "../../components/Modal/Processo-P/ModalNewProcess"


import Modal from "react-modal"

import { setupAPIClient } from "../../services/api"
import moment from "moment"


export type ItemLoteProps = {
    id: number;
    codigo_imovel: string;
    numero: string;
    bairro: string;
    quadra: string;
    lote: string;
    insc_imob: string;
    proprietario: string;
    area_total: string;
    logradouro: string;
    testada: string;
}

export type DescricaoLotes = {
    id: string;
    lote: string;
    area: string;
    testada: string;
}

export type DescricaoPessoas = {
    id: string;
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
}

export type ItemProcessoCartorioProps = {
    id: number;
    memorando: string;
    observacao: string;
    criado_em: string;
    prazo: string;
    respondido_em: string;
    ativo: boolean;
    atividade: {
        id: string;
        nome: string;
    };
    tipo: {
        id: string;
        nome: string;
    };
    departamento: {
        id: string;
        nome: string;
    };
    setor: {
        id: string;
        nome: string;
    }
    lote:  Lote[];
    descricaoPessoas: DescricaoPessoas[];
    descricaoLotes: DescricaoLotes[];
    tipoLote:boolean;
}

export type DescricaoAprovacao = {
    matricula: string;
    data_registro: string;
    transcricao: string;
    lote: string;
    descricao_id: string;
}

export type Reenvio = {
    id: string;
    observacao: string;
    nome: string;
    enviado_de: string;
    aprovacao_id: string;
}
export type ItemAprovacaoProps = {
    id: string;
    observacao: string;
    processo_id: number;
    descricao: DescricaoAprovacao[];
    reenvio: Reenvio[];
    alvara: string;
}

export type ItemAprovacaoPessoaProps = {
    id: string;
    observacao: string;
    processo_id: number;
    reenvio: Reenvio[];
    alvara: string;
}

export type Lote = {
    processo_id: string;
    lote_id: string;
    lote: {
        bairro: string;
        lote: string;
        quadra: string;
        insc_imob: string;
        proprietario: string;
        numero: string;
        codigo_imovel: string;
        logradouro: string;
        area_total: string;
    }
}
export type ItemProcessProps = {
    id: number;
    num_processo: string;
    prazo: string;
    criado_em: string;
    respondido: boolean;
    respondido_em: string;
    ativo: boolean;
    texto: string;
    ano: string;
    atrasado: boolean;
    atividade: {
        id: string;
        nome: string;
    };
    tipo: {
        id: string;
        nome: string;
    };
    departamento: {
        id: string;
        nome: string;
    };
    setor: {
        id: string;
        nome: string;
    }
    lote: Lote[];
    descricaoLotes: DescricaoLotes[];
    descricaoPessoas: DescricaoPessoas[];
    aprovacao: ItemAprovacaoProps;
    aprovacaoPessoa: ItemAprovacaoPessoaProps;
    tipoLote:boolean;
    conclusao:string;
}

export type ItemCadastroProps = {
    id: string;
    nome: string;
}


interface DashboardProps {
    processList: ItemProcessProps[];
    atividadeList: ItemCadastroProps[];
    departamentoList: ItemCadastroProps[];
    tipoList: ItemCadastroProps[];
    setorList: ItemCadastroProps[];
    admin: boolean;
    avatar: string
}

Modal.setAppElement("#__next")



export default function DashboardPrefeitura({ processList, atividadeList, departamentoList, tipoList, setorList, admin, avatar }: DashboardProps) {

    const [processos, setProcessos] = useState(processList || []);
    const [loteList, setLoteList] = useState<ItemLoteProps[]>()



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

    const [modalNewProcessoOpen, setModalNewProcessoOpen] = useState(false)

    const [processoFilter, setProcessoFilter] = useState(processos)

    const dataAtual = moment()

    function closeModal() {
        setModalProcessoOpen(false);
        setModalNewProcessoOpen(false);

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


    async function openNewProcessModal() {

        const apiClient = setupAPIClient()
        try {
            const responseLotes = await apiClient.get('lote/lista')
            setLoteList(responseLotes.data)
        } catch {
            return
        }

        setModalNewProcessoOpen(true)
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

            <main className={styles.main}>
                <SidebarPrefeitura admin={admin} avatar={avatar} />
                <div className={styles.container} >
                    <div className={styles.title}>
                        <div>
                            <h1>Processos Enviados</h1>
                            <p>Listagem de processos enviados para os cartórios ativos</p>
                        </div>
                        <Button color="blue" onClick={openNewProcessModal}>Novo Processo</Button>
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
                                                {item.atrasado && (<span className={styles.atrasadoResp}>Resp c/ atraso</span>) || (
                                                    <span>{item.respondido && (<span className={styles.respondido}>respondido</span>)
                                                        || moment(item.prazo).diff(dataAtual, 'days') < 0 && (<span className={styles.atrasado}>expirado</span>)
                                                        || <span className={styles.pendente}>pendente</span>} </span>
                                                )}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </section>

                </div>

            </main>


            {modalProcesoOpen && (
                <ModalProcess isOpen={modalProcesoOpen} onRequestClose={closeModal} processo={modalProcesso} setorList={setorList} />

            )}
            {modalNewProcessoOpen && (
                <ModalNewProcess isOpen={modalNewProcessoOpen} onRequestClose={closeModal} tipoList={tipoList}
                    departamentoList={departamentoList} atividadeList={atividadeList} loteList={loteList} />
            )}



        </>
    )
}



export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)


    const response = await apiClient.get("/me")

    const { tipo, setor, admin, avatar } = response.data;

    if (tipo === '2') {
        return {
            redirect: {
                destination: "/cartorio",
                permanent: false
            }
        }
    }

    if (admin) {
        const [
            responseProcess,
            responseAtividade,
            responseDepartamento,
            responseTipo,
            responseSetor

        ] = await Promise.all([
            apiClient.get('/processo/admin/lista', {
                params: {
                    set: setor
                }
            }),

            apiClient.get('/atividade/lista'),
            apiClient.get('/departamento/lista'),
            apiClient.get('/tipo/lista'),
            apiClient.get('/setor/lista'),

        ])

        return {
            props: {
                processList: responseProcess.data,
                atividadeList: responseAtividade.data,
                departamentoList: responseDepartamento.data,
                tipoList: responseTipo.data,
                setorList: responseSetor.data,
                admin: admin,
                avatar: avatar
            }
        }

    } else {
        const [
            responseProcess,
            responseAtividade,
            responseDepartamento,
            responseTipo,
            responseSetor

        ] = await Promise.all([
            apiClient.get('/processo/lista/setor', {
                params: {
                    set: setor
                }
            }),

            apiClient.get('/atividade/lista'),
            apiClient.get('/departamento/lista'),
            apiClient.get('/tipo/lista'),
            apiClient.get('/setor/lista'),

        ])

        return {
            props: {
                processList: responseProcess.data,
                atividadeList: responseAtividade.data,
                departamentoList: responseDepartamento.data,
                tipoList: responseTipo.data,
                setorList: responseSetor.data,
                admin: admin,
                avatar: avatar
            }
        }

    }

})