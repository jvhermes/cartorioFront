import styles from "./styles.module.scss"
import { ItemCadastroProps,ItemLoteProps } from "../../../../pages/prefeitura"
import { useState} from "react"
import { AiOutlinePlus , AiOutlineMinus, AiOutlineLeft, AiOutlineRight} from "react-icons/ai"
import { setupAPIClient } from "../../../../services/api"

import {toast} from "react-toastify"

interface NewProcessProps{
    atividade:ItemCadastroProps;
    tipo:ItemCadastroProps;
    departamentoList: ItemCadastroProps[];
    loteList:ItemLoteProps[];
    numero_processo:string;
    ano:string;
    criado_em:string;
  
}

export type Descricao ={
    lote:string;
    area:string;
    testada:string;
}

export type Ids = {
    id:number
}

export function Outro({atividade,tipo,departamentoList,loteList ,numero_processo,ano,criado_em}:NewProcessProps){

    const tipo_id = tipo.id;
    const atividade_id = atividade.id;
    const num_processo = numero_processo
    const [departamentos,setDepartamentos] = useState(departamentoList || []);
    const [selectDepartamento,setSelectDepartamento] = useState(0)

    const [numLotes, setNumLotes] = useState(0)

    const [selectInsc, setSelectInsc] = useState("")
    const [selectQuadra, setSelectQuadra] = useState("")
    const [selectLote, setSelectLote] = useState("")
    const [selectCodigo, setSelectCodigo] = useState("")

    const [lotesSelecionados,setLotesSelecionados] = useState<ItemLoteProps[]>([])

    const [tamanho,setTamanho] = useState(0)
   
    const [fechar,setFechar] = useState(false)

    const [lote_id,setLotesID] = useState<Ids[]>([])
    const [descricao,setDescricao] = useState<Descricao[]>([])
    

    //bairros unicos
    const bairros = loteList.map( (item) => {
        return item.bairro
    })


    const filteredBairros = bairros.filter((item, index) => {
       return bairros.indexOf(item) === index && item
    }).sort();

    const [selectBairro, setSelectBairro] = useState(filteredBairros[0])

    //quadras por bairro unicas 
    const quadrasPorBairro = loteList.filter( (item) => {

        const searchBairro = selectBairro;
        const bair = item.bairro;

        return searchBairro && bair.includes(searchBairro);
    })

    const quadras = quadrasPorBairro.map( (item) => {
        return item.quadra
    })

    const filtredQuadra = quadras.filter((item, index) => {
        return quadras.indexOf(item) === index && item
     }).sort();
    
    //lote por bairro e quadra 

    const lotePorBairroeQuadra = loteList.filter( (item) => {

        const searchBairro = selectBairro;
        const bair = item.bairro;

        const searchQuadra = selectQuadra;
        const qua = item.quadra

        const searchinsc = selectInsc
        const inscri = item.insc_imob

        const searchcod = selectCodigo
        const cod = item.codigo_imovel

        if(searchinsc){
            return inscri.includes(searchinsc)
        }

        if(searchcod){
            return cod.includes(searchcod)
        }

        return searchBairro && bair.includes(searchBairro) && searchQuadra && qua.includes(searchQuadra);
    });

    function handleMinus(){
        if(numLotes === 0){
            return
        }
        descricao.pop()
        setNumLotes(numLotes -1)
    }

    function handlePlus(){
        if(numLotes === 10){
         
            return
        }
        
        descricao.push({
            area:"",
            lote:"",
            testada:""
        })
        setNumLotes(numLotes +1)
    }

    function handleChangeLoteDesc(e,index){
        descricao[index].lote = e.target.value
        setDescricao([...descricao])
    }
    function handleChangeAreaDesc(e,index){
        descricao[index].area = e.target.value
        setDescricao([...descricao])
    }
    function handleChangeTestadaDesc(e,index){
        descricao[index].testada = e.target.value
        setDescricao([...descricao])
    }

    async function handleRigth(){

        if(selectLote === "blank" || selectLote === "" || tamanho === 5){
    
            return
        }

        const apiClient = setupAPIClient()
        const id = selectLote

        const response = await apiClient.get("/lote/unico",{
            params:{
                id:id
            }
        })

        const newLote:ItemLoteProps = response.data

        for (let item of lotesSelecionados){
            if(item.id === newLote.id){
                return
            }
        }
   
        lote_id.push({id:newLote.id})
        lotesSelecionados.push(newLote)
        setTamanho(tamanho + 1)
        setFechar(true)


    }
    function handleLeft(){
        if(tamanho === 0){
            return
        }
        if(tamanho === 1){
            lotesSelecionados.pop()
            lote_id.pop()
            setTamanho(tamanho -1)
            setFechar(false)
            return
        }
        lotesSelecionados.pop()
        lote_id.pop()
        setTamanho(tamanho -1)
        return

    }

 
    async function handleNewProcess(){

        const apiClient = setupAPIClient()
  
        const departamento_id = departamentos[selectDepartamento].id
        const prazo = 180
        const response = await apiClient.get("/me")
        const {setor_id} = response.data;

        
        
        try{
            await apiClient.post("/processo",{
                num_processo,prazo,atividade_id,departamento_id,
                lote_id,descricao,tipo_id,setor_id,ano,criado_em
            })
            
            location.reload()
        }catch(err){
 
            toast.error("Erro ao enviar processo")
            console.log(err.data)
        }
    }

    function handleChangeDepartamento(event){
        setSelectDepartamento(event.target.value)
    }


    return(
        <div className={styles.container}>
            <section className={styles.content}>
                <div className={styles.filter}>
                    <div className={styles.filterTopSide}>
                        <h3>Filtro:</h3>
                        <div>
                            <label htmlFor="bairro">Bairro:</label>
                            <select id="bairro"   value={selectBairro} disabled={fechar} onChange= {(e) => setSelectBairro(e.target.value)}>
                               {filteredBairros.map( (item,index) => {
                                return(
                                    <option value={item} key={index}> {item}</option>
                                )
                               })}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="quadra">Quadra:</label>
                            <select id="quadra"  value={selectQuadra} disabled={fechar} onChange= {(e) => setSelectQuadra(e.target.value)}>
                                <option value="blank" defaultChecked={true}>  </option>
                               {filtredQuadra.map( (item,index) => {
                                return(
                                    <option value={item} key={index}> {item}</option>
                                )
                               })}
                            </select>
                        </div>
                        <div className={styles.inscr}>
                            <label htmlFor="inscricao">Insc. Imobiliaria:</label>
                            <input type="search" list="insc" id="inscricao"value={selectInsc} onChange= {(e) => setSelectInsc(e.target.value)} />
                            <datalist id="insc" >
                                    {loteList.map( (item) => {
                                        return(
                                            <option key={item.id} value={item.insc_imob}></option>
                                        )
                                    })}
                             </datalist>
                        </div>
                        <div className={styles.codigo}>
                            <label htmlFor="codigo_imovel">Cod. Imóvel:</label>
                            <input type="search" list="codigo" id="codigo_imovel" value={selectCodigo} onChange= {(e) => setSelectCodigo(e.target.value)}/>
                            <datalist id="codigo" >
                                    {loteList.map( (item) => {
                                        return(
                                            <option key={item.id} value={item.codigo_imovel}></option>
                                        )
                                    })}
                             </datalist>
                        </div>
                    </div>
                    <div className={styles.filterBottonSide}>
                        <div>
                            <label htmlFor="lotes">Lotes:</label>
                            <select id="lotes" size={5} value={selectLote}  onChange= {(e) =>  setSelectLote(e.target.value)}>
                            <option value="blank" defaultChecked={true} >  </option>
                            {lotePorBairroeQuadra.map( (item) => {
                                return(
                                    <option value={item.id} key={item.id}> {item.lote}</option>
                                )
                               })}
                            </select>
                        </div>
                        <div className={styles.setas}>
                            <button onClick={handleRigth}><AiOutlineRight size={25} /></button>
                            <button onClick={handleLeft}><AiOutlineLeft size={25} /></button>
                        </div>
                        <div>
                            <label htmlFor="selecionado">Imóvel selecionado:</label>
                            <label htmlFor="selecionado">Imóvel selecionado:</label>
                            <ul id="selecionado" placeholder="Imovel Selecionado">
                                {lotesSelecionados.map( (item) => {
                                    return(
                                    <li key={item.id}>
                                        <span>Código: <strong>{item.codigo_imovel} </strong></span>    
                                        <span>Proprietário: <strong>{item.proprietario}</strong> </span>    
                                        <span>Lote: <strong>{item.lote}</strong> </span>    
                                    </li>
                                    )
                                })}
                             
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.description}>
                    <h3>Seleções:</h3>
                    <ul>
                        {lotesSelecionados.map( (item,index) => {
                            return(
                                <li key={item.id}>
                                    <textarea name="matricula" value={""} placeholder="Matricula" readOnly={true}></textarea>
                                    <textarea name="endereco" value={`${item.logradouro}, Número: ${item.numero}`} placeholder="Endereco"readOnly={true} ></textarea>
                                    <textarea name="area" value={item.area_total} placeholder="Area" readOnly={true}></textarea>
                                </li>
                            )
                        })}
                    </ul>
                </div>
              
                
            </section>
            <div className={styles.division}></div>
            <section className={`${styles.content} ${styles.contentLeft}`}>
                <h3>Novas Descrições:</h3>
                <div className={styles.number}>
                    <span>Número de Lotes: {numLotes}</span>
                    <button onClick={handlePlus}><AiOutlinePlus size={30} /></button>
                    <button onClick={handleMinus}><AiOutlineMinus size={30} /></button>
                </div>
                <table>
                     <thead>
                         <tr>
                        <th>Lote</th>
                        <th>Area</th>
                        <th>Testada</th>
                      </tr>
                    </thead>
                    <tbody>
                       {descricao.map((item,index)=> {
                            return(
                                <tr key={index}>
                                    <td><input type="text" value={item.lote} onChange={ (e) => handleChangeLoteDesc(e,index)} placeholder='ex: "00-X"'  /></td>
                                    <td><input type="text" value={item.area} onChange={ (e) => handleChangeAreaDesc(e,index)} placeholder='ex: "000.00"'/></td>
                                    <td><input type="text" value={item.testada} onChange={ (e) => handleChangeTestadaDesc(e,index)} placeholder='ex: "00.00"'/></td>
                                </tr>
                            )
                       })}

                    </tbody>
                </table>
                <div className={styles.selecao}>
                    <label htmlFor="encaminhar">Encaminhar para:(departamentos)</label>
                    <select id="encaminhar" onChange={handleChangeDepartamento} value={selectDepartamento}>
                         {departamentos.map((item,index) =>{
                            return(
                                <option key={item.id} value={index}>
                                    {item.nome}
                                </option>
                                )
                            })}
                    </select>
                </div>
                <button onClick={handleNewProcess} className={styles.enviar}>Enviar</button>
            </section>
        </div>
    )
}