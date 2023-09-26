// Import necessary modules and components
import React, { useState } from 'react';
import {findDuplicateIndexes, validateInputAddresses} from '../utils';

// Define a React functional component called Disperse
function Disperse() {
  // Define state variables using the useState hook
  const [text, setText] = useState(''); // Manages the text input
  const [lines, setLines] = useState(1); // Manages the line count
  const [error, setError] = useState([]); // Manages error messages

  // Handle changes in the textarea input
  const handleTextareaChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    const newLines = newText.split('\n').length;
    setLines(newLines);
    setError([]);
  };

  // Function to remove duplicates based on user choice
  const removeDuplicate=(val)=>{
    const arrOfAddress = text.split('\n');
    const indexOfDuplicates = findDuplicateIndexes(arrOfAddress);
    if(val === "keep"){
      // Keep the first occurrence of each duplicate
      const updatedText = [...new Set(arrOfAddress)].join('\n');
      setText(updatedText);
      const updatedLines = updatedText.split('\n').length;
      setLines(updatedLines);
    }
    if(val === "combine"){
      // Combine balances for duplicates
      let uniqueArr = [...new Set(arrOfAddress)];
      uniqueArr.forEach((item,index)=>{
        indexOfDuplicates.forEach((itemd)=>{
          if(item === itemd.value){
              if(item.includes("=")){
                let combineBalance = Number(item.slice(item.indexOf('=') + 1))*itemd.indexes.length;
                let cutStr = item.substring(0,item.indexOf("=")+1);
                uniqueArr[index] = cutStr+combineBalance.toString();
              }
              if(item.includes(",")){
                let combineBalance = Number(item.slice(item.indexOf(',') + 1))*itemd.indexes.length;
                let cutStr = item.substring(0,item.indexOf(",")+1);
                uniqueArr[index] = cutStr+combineBalance.toString();
              }
              if(item.includes(" ")){
                let combineBalance = Number(item.slice(item.indexOf(' ') + 1))*itemd.indexes.length;
                let cutStr = item.substring(0,item.indexOf(" ")+1);
                uniqueArr[index] = cutStr+combineBalance.toString();
              }
          }
        })
      })
      const updatedText = uniqueArr.join('\n');
      setText(updatedText);
      const updatedLines = updatedText.split('\n').length;
      setLines(updatedLines);
    }

    // Filter out non-duplicate errors from the error array
    let removeDuplicateError = error.filter((item)=>item.isDuplicateError === false);    
    setError([...removeDuplicateError]);
  }

// Handle form submission
const handleSubmit=()=>{
  const arrOfAddress = text.split('\n');
  const errorObj = [];
  const indexOfDuplicates = findDuplicateIndexes(arrOfAddress);

  // Check for duplicate errors
  indexOfDuplicates.forEach((item)=>{
    errorObj.push({error: item.value+"  duplicate in Line: "+item.indexes.map((i)=>i+1).join(", "), isDuplicateError: true})
  })

  // Validate Ethereum addresses and other errors
  arrOfAddress.forEach((a,index)=>{
    if(!validateInputAddresses(a)){
     if(a.length>1 && a.substring(0,2) !== "0x"){
      errorObj.push({error: "Line "+(index+1)+" invalid Ethereum address", isDuplicateError: false}) 
     }
     if(a.includes("=") && a.substring(2,a.indexOf('=')).length !== 40){
      errorObj.push({error: "Line "+(index+1)+" invalid Ethereum address", isDuplicateError: false}) 
     }
     if(a.includes(",") && a.substring(2,a.indexOf(',')).length !== 40){
      errorObj.push({error: "Line "+(index+1)+" invalid Ethereum address", isDuplicateError: false}) 
     }
     if(a.includes(" ") && a.substring(2,a.indexOf(' ')).length !== 40){
      errorObj.push({error: "Line "+(index+1)+" invalid Ethereum address", isDuplicateError: false}) 
     }
     if(a.includes("=") || a.includes(",") || a.includes(" ")){
      if(a.includes("=")){
        let isNum = /^\d+$/.test(a.substring(a.indexOf("=")+1,a.length));
        if(!isNum){
          errorObj.push({error: "Line "+(index+1)+" wrong amount", isDuplicateError: false}) 
        }
      }
      if(a.includes(",")){
        let isNum = /^\d+$/.test(a.substring(a.indexOf(",")+1,a.length));
        if(!isNum){
          errorObj.push({error: "Line "+(index+1)+" wrong amount", isDuplicateError: false}) 
        }
      }
      if(a.includes(" ")){
        let isNum = /^\d+$/.test(a.substring(a.indexOf(" ")+1,a.length));
        if(!isNum){
          errorObj.push({error: "Line "+(index+1)+" wrong amount", isDuplicateError: false}) 
        }
      }
     }else{
      errorObj.push({error: "Line "+(index+1)+" invalid Ethereum address", isDuplicateError: false})
     }
    }
  })
  setError(errorObj);
}

  return (
    <div className='pt-6 p-4 bg-[#24272c]'>
      <div className='h-[30px]'>
        <p className='text-slate-200 float-left text-sm'>Address with Amounts</p>
        <p className='text-slate-200 float-right font-thin text-sm'>Upload File</p>
      </div>
      <div className='flex bg-black p-4'>
        <div className='w-10 text-center p-2 mr-[-8px] border border-2 border-black'>
          {Array.from({ length: lines }, (_, index) => (
            <div
              key={index}
              className='line-number text-slate-400 bg-black text-[10px] md:text-sm md:font-semibold'
            >
              {index + 1}
            </div>
          ))}
        </div>
        <textarea
          className='flex-1 border border-2 border-black border-l-slate-400 p-2 resize-none text-white bg-black text-[10px] md:text-sm md:font-semibold focus:outline-none'
          value={text}
          onChange={handleTextareaChange}
          rows={10}
        />
      </div>
      <div className='h-[30px] mt-6'>
        <p className='text-slate-200 float-left text-sm'>Separated by ',' or '' or '='</p>
        <p className='text-slate-500 float-right text-sm'>Show Example</p>
      </div>
      {error && error.filter((item)=>item.isDuplicateError).length?<div className='h-[30px]'>
        <p className='text-slate-200 float-left text-sm'>Duplicated</p>
        <p className='text-rose-600 float-right text-sm'>
        <span className='cursor-pointer' onClick={()=>{removeDuplicate('keep')}}>Keep the first one</span> | 
        <span className='cursor-pointer' onClick={()=>{removeDuplicate('combine')}}> Combine Balance</span></p>
      </div>:null}
      {error && error.length?<div className='p-4 border border-rose-600 rounded flex'>
        <div className='border-2 border-rose-600 rounded-full text-rose-600 w-[25px] h-[25px] text-center text-sm'>!</div>
        <div className='ml-2'>
          {error.map((msg,index)=>{
            return <p key={index+"error"} className='text-rose-600'>{msg.error}</p>
          })}
          
        </div>  
      </div>:null}
      <div className='mt-6 mb-6 flex justify-center'>
            <button disabled={error && error.length?true:false} onClick={handleSubmit} 
            className={error && error.length?'rounded-full text-slate-200 bg-black w-screen p-4 text-sm':
            'rounded-full text-slate-200 bg-[#50d71e] w-screen p-4 text-sm bg-gradient-to-r from-[#c072fa] to-[#6a55d1]'}>Next</button>
      </div>
    </div>
  );
}

export default Disperse;
