import styles from "./styles.module.scss"
import { AiOutlineClose } from "react-icons/ai"
import { AiOutlineEdit } from "react-icons/ai"
import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{}

export function DeleteButton({...rest}:ButtonProps){
    return(
       
        <button className={` ${styles.button} ${styles.redbg} `}{...rest}><AiOutlineClose size={17}/></button>
        
    )
}

export function UpdateButton({...rest}:ButtonProps){
    return(
        
        <button className={` ${styles.button} ${styles.greenbg} `} {...rest}><AiOutlineEdit size={17}/></button>
       
        
    )
         
}   