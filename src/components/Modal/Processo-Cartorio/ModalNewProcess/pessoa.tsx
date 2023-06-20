import styles from "./styles.module.scss"
import Modal from 'react-modal'
import { useState } from "react"
import { setupAPIClient } from "../../../../services/api"
import { Input, Dropdown, Button } from "semantic-ui-react"
import { AiOutlinePlus, AiOutlineMinus, AiOutlineLeft, AiOutlineRight } from "react-icons/ai"

import { ItemCadastroProps, ItemLoteProps } from "../../../../pages/prefeitura"
import { FiX } from "react-icons/fi"
import { toast } from "react-toastify"

type Descricao = {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
}

interface ModalNewProcessProps {
    setorList: ItemCadastroProps[];
    tipo: ItemCadastroProps;
    loteList: ItemLoteProps[];
}

export function PessoaCartorio({ setorList, tipo, loteList }: ModalNewProcessProps,) {

    const tipo_id = tipo.id
    const [lote_id, setLote_id] = useState(0)
    const [setores, setSetores] = useState(setorList || []);
    const [selectSetor, setSelectSetor] = useState(0)
    const [observacao, setObservacao] = useState("")


    const [numPessoas, setNumPessoas] = useState(0)
    const [descricaoPessoa, setDescricao] = useState<Descricao[]>([])

    const [selectTipo, setSelectTipo] = useState(0)


    const [endereco, setEndereco] = useState("")
    const [matricula, setMatricula] = useState("")
    const [area, setArea] = useState("")

    const [descricaoCod, setDescricaoCod] = useState(" ")
    const [descricaoProp, setDescricaoProp] = useState(" ")

    const [selectInsc, setSelectInsc] = useState("")
    const [selectQuadra, setSelectQuadra] = useState("")
    const [selectLote, setSelectLote] = useState("")
    const [selectCodigo, setSelectCodigo] = useState("")


    async function handleRigth() {

        if (selectLote === "blank" || selectLote === "") {
            setDescricaoProp("")
            setDescricaoCod("")
            setArea("")
            setEndereco("")
            return
        }
        const apiClient = setupAPIClient()
        const id = selectLote

        const response = await apiClient.get("/lote/unico", {
            params: {
                id: id
            }
        })

        const loteUnico: ItemLoteProps = response.data

        setLote_id(loteUnico.id)
        setDescricaoCod(loteUnico.codigo_imovel)
        setDescricaoProp(loteUnico.proprietario)
        setArea(loteUnico.area_total)
        setEndereco(`${loteUnico.logradouro}, Número: ${loteUnico.numero}`)
    }
    function handleLeft() {
        setDescricaoCod("")
        setDescricaoProp("")
        setArea("")
        setEndereco("")
        setLote_id(0)
        return
    }


    //bairros unicos
    const bairros = loteList.map((item) => {
        return item.bairro
    })


    const filteredBairros = bairros.filter((item, index) => {
        return bairros.indexOf(item) === index && item
    }).sort();

    const [selectBairro, setSelectBairro] = useState(filteredBairros[0])

    //quadras por bairro unicas 
    const quadrasPorBairro = loteList.filter((item) => {

        const searchBairro = selectBairro;
        const bair = item.bairro;

        return searchBairro && bair.includes(searchBairro);
    })

    const quadras = quadrasPorBairro.map((item) => {
        return item.quadra
    })

    const filtredQuadra = quadras.filter((item, index) => {
        return quadras.indexOf(item) === index && item
    }).sort();

    //lote por bairro e quadra 

    const lotePorBairroeQuadra = loteList.filter((item) => {

        const searchBairro = selectBairro;
        const bair = item.bairro;

        const searchQuadra = selectQuadra;
        const qua = item.quadra

        const searchinsc = selectInsc
        const inscri = item.insc_imob

        const searchcod = selectCodigo
        const cod = item.codigo_imovel

        if (searchinsc) {
            return inscri.includes(searchinsc)
        }

        if (searchcod) {
            return cod.includes(searchcod)
        }

        return searchBairro && bair.includes(searchBairro) && searchQuadra && qua.includes(searchQuadra);
    });







    function handleMinus() {
        if (numPessoas === 0) {
            return
        }
        descricaoPessoa.pop()
        setNumPessoas(numPessoas - 1)
    }

    function handlePlus() {
        if (numPessoas === 5) {

            return
        }
        descricaoPessoa.push({
            nome: "",
            cpf: "",
            email: "",
            telefone: ""
        })
        setNumPessoas(numPessoas + 1)
    }

    function handleChangeTipo(data) {
        setSelectTipo(data.value);
    }

    function handleChangeSetor(data) {
        setSelectSetor(data.value)
    }

    function handleChangeBairro(data) {
        setSelectBairro(data.value)
    }

    function handleChangeQuadra(data) {
        setSelectQuadra(data.value)
    }

    function handleChangeInsc(data) {
        setSelectInsc(data.value)

    }
    function handleChangeCod(data) {
        setSelectCodigo(data.value)

    }
    function handleChangeLote(data) {
        setSelectLote(data.value)

    }

    function handleChangeNomeDesc(e, index) {
        descricaoPessoa[index].nome = e.target.value
        setDescricao([...descricaoPessoa])
    }
    function handleChangeCpfDesc(e, index) {
        descricaoPessoa[index].cpf = e.target.value
        setDescricao([...descricaoPessoa])
    }
    function handleChangeEmailDesc(e, index) {
        descricaoPessoa[index].email = e.target.value
        setDescricao([...descricaoPessoa])
    }
    function handleChangeTelefoneDesc(e, index) {
        descricaoPessoa[index].telefone = e.target.value
        setDescricao([...descricaoPessoa])
    }

    async function handleNewProcess() {

        if (lote_id === 0) {
            toast.error("selecione um lote")
            return
        }
        const apiClient = setupAPIClient()

        const setor_id = setores[selectSetor].id
        const prazo = 180

        const response = await apiClient.get("/me")
        const { departamento_id } = response.data;

        const descricaoLote = []
        try {
            await apiClient.post("/processocartorio", {
                observacao, prazo, descricaoPessoa, descricaoLote, lote_id,
                setor_id, departamento_id, tipo_id
            })
            location.reload()
        } catch {
            toast.error("Erro ao enviar processo")
        }

    }



    return (
        <div>
     
            <div className={styles.content}>
                <div className={styles.filter}>
                    <h3>Filtro:</h3>
                    <div className={styles.filterTopSide}>
                        <div>
                            <label htmlFor="bairro">Bairro:</label>
                            <Dropdown clearable id="bairro" search selection options={
                                filteredBairros.map((item, index) => {
                                    return (
                                        { key: index, value: item, text: item }
                                    )
                                })
                            } value={selectBairro} onChange={(e, data) => handleChangeBairro(data)}>
                            </Dropdown>
                        </div>
                        <div>
                            <label htmlFor="quadra">Quadra:</label>
                            <Dropdown id="quadra" selection value={selectQuadra} onChange={(e, data) => handleChangeQuadra(data)} options={
                                filtredQuadra.map((item, index) => {
                                    return (
                                        { key: index, value: item, text: item }
                                    )
                                })
                            }>
                            </Dropdown>
                        </div>
                        <div className={styles.inscr}>
                            <label htmlFor="inscricao">Insc. Imobiliaria:</label>
                            <Input type="search" list="insc" id="inscricao" value={selectInsc} onChange={(e, data) => handleChangeInsc(data)} />
                            <datalist id="insc" >
                                {loteList.map((item) => {
                                    return (
                                        <option key={item.id} value={item.insc_imob}></option>
                                    )
                                })}
                            </datalist>
                        </div>
                        <div className={styles.codigo}>
                            <label htmlFor="codigo_imovel">Cod. Imóvel:</label>
                            <Input type="search" list="codigo" id="codigo_imovel" value={selectCodigo} onChange={(e, data) => handleChangeCod(data)} />
                            <datalist id="codigo" >
                                {loteList.map((item) => {
                                    return (
                                        <option key={item.id} value={item.codigo_imovel}></option>
                                    )
                                })}
                            </datalist>
                        </div>
                    </div>
                    <div className={styles.filterBottonSide}>
                        <div className={styles.lotes}>
                            <label htmlFor="lotes">Lotes:</label>
                            <Dropdown selection id="lotes" value={selectLote} options={lotePorBairroeQuadra.map((item) => {
                                return (
                                    { key: item.id, value: item.id, text: item.lote }
                                )
                            })} onChange={(e, data) => handleChangeLote(data)}>
                            </Dropdown>
                        </div>
                        <div className={styles.setas}>
                            <button onClick={handleRigth}><AiOutlineRight size={25} /></button>
                            <button onClick={handleLeft}><AiOutlineLeft size={25} /></button>
                        </div>
                        <div className={styles.selecionados}>
                            <label htmlFor="selecionado">Imóvel selecionado:</label>
                            <ul id="selecionado" placeholder="Imovel Selecionado">
                                <li>
                                    <span>Código: <strong>{descricaoCod} </strong></span>
                                    <span>Proprietário: <strong>{descricaoProp}</strong> </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.description}>
                    <h3>Seleção:</h3>
                    <div className={styles.descriptionArea}>
                        <div>
                            <label htmlFor="matricula">Matrícula</label>
                            <textarea id="matricula" name="matricula" value={matricula} placeholder="Matricula" readOnly={true}></textarea>
                        </div>
                        <div>
                            <label htmlFor="endereço">Endereço</label>
                            <textarea name="endereco" value={endereco} placeholder="Endereco" className={styles.endereco} readOnly={true}></textarea>
                        </div>
                        <div>
                            <label htmlFor="area">Area</label>
                            <textarea name="area" value={area} placeholder="Area" readOnly={true}></textarea>
                        </div>
                    </div>

                </div>
                <div className={styles.end}>
                    <div className={styles.pessoa}>
                        <div className={styles.pessoaTitulo}>
                            <h3>Pessoas do Processo<span> {numPessoas}</span> </h3>
                            <div className={styles.number}>
                                <button onClick={handlePlus}><AiOutlinePlus size={30} /></button>
                                <button onClick={handleMinus}><AiOutlineMinus size={30} /></button>
                            </div>
                        </div>
                        <div >
                            <ul className={styles.pessoaLista}>
                                {descricaoPessoa.map((item, index) => {
                                    return (
                                        <li className={styles.pessoaDados} key={index}>
                                            <Input type="text" placeholder="nome" value={item.nome} onChange={(e) => handleChangeNomeDesc(e, index)} />
                                            <Input type="text" placeholder="cpf" value={item.cpf} onChange={(e) => handleChangeCpfDesc(e, index)} />
                                            <Input type="text" placeholder="email" value={item.email} onChange={(e) => handleChangeEmailDesc(e, index)} />
                                            <Input type="text" placeholder="telefone" value={item.telefone} onChange={(e) => handleChangeTelefoneDesc(e, index)} />
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <textarea name="observacao" placeholder="Observação" value={observacao} maxLength={272} onChange={(e) => setObservacao(e.target.value)} ></textarea>
                    </div>
                    <div className={styles.enviar}>
                        <div>
                            <label htmlFor="encaminhar">Encaminhar para (setores)</label>
                            <Dropdown id="encaminhar" selection onChange={(e, data) => handleChangeSetor(data)} value={selectSetor} options={
                                setores.map((item, index) => {
                                    return (
                                        { key: item.id, value: index, text: item.nome }
                                    )
                                })
                            }>
                            </Dropdown >
                        </div>
                        <Button color="blue" onClick={handleNewProcess} className={styles.enviar}>Enviar</Button>
                    </div>
                </div>
            </div>
        </div>

    )

}


