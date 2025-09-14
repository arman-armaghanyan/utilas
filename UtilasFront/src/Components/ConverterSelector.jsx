import { styled } from 'styled-components';
import {converterTypeList} from '../ConstData/IteamLists';
import {useState} from "react";

export function ConverterSelector({SelectorChange})
{
   const [internalInputType , setInternalInputType] = useState('png');
   const [internalOutputType , setInternalOutputType] = useState('png');
   const [isNotCorrectValue, setIsNotCorrectValue] = useState(false);

    const SelectorDiv = styled.div`
        display: flex;
        padding: 20px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-direction: column;
        
    `
    function InternalInputSelectionChange(value){
        setInternalInputType(value)
        if(value === internalOutputType)
        {
            setIsNotCorrectValue(true)
        }
        else{
            setIsNotCorrectValue(false)
            SelectorChange(
                {
                    inputType: value,
                    outputType: internalOutputType
                }
            );
        }

    }

    function InternalOutputSelectionChange(value){
        setInternalOutputType(value)
        console.log(value === internalInputType)
        if(value === internalInputType)
        {
            setIsNotCorrectValue(true)
        }
        else
        {
            setIsNotCorrectValue(false)
            SelectorChange(
                {
                    inputType: internalInputType,
                    outputType: value
                }
            );
        }
    }

    return (
        <SelectorDiv>
            <label>
                Input Type
                <select value={internalInputType}  onChange={(e) => InternalInputSelectionChange(e.target.value)} name="selectedFruit">
                    {converterTypeList.map(item =>
                        <option value={item.value}>{item.title}</option>)}
                </select>
            </label>
            <label>
                convert to Type
                <select value={internalOutputType} onChange={(e)=> InternalOutputSelectionChange(e.target.value)} name="selectedFruit">
                    {converterTypeList.map(item =>
                        <option value={item.value}>{item.title}</option>)}
                </select>
            </label>
        {isNotCorrectValue && 'It is same value change'}
        </SelectorDiv>
    )
}