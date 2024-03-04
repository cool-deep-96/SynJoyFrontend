"use client"
import { instructionData, instructionData2 } from "@/data/InstructionData"
import Instruction from "./Instruction"
import { useState } from "react"


const Instructions = () => {
    const [mode, setMode] = useState<boolean>(true)
  return (
    <div className="flex justify-center">
    <div className="flex flex-col items-center pb-28 max-w-[40rem] lg:w-2/4 ">
      <div className="flex flex-col bg-[url('/images/celebrate.gif')] bg-repeat-x bg-right-bottom ">
        <div className="px-4">
          <div className="my-5 font-semibold">Easy and Fast</div>
          <div className="text-4xl md:text-5xl font-bold pb-5">Start Watching Together with 2 different mode</div>
        </div>
        <div className="flex justify-evenly mb-5 text-xl">
            <button className={`${mode? 'bg-red-700':'bg-gray-900'} px-5 py-3 rounded-l-lg w-1/2 font-semibold`} onClick={()=>setMode(true)}>YouTube</button>
            <button className={`${mode? 'bg-gray-900':'bg-yellow-500'} px-5 py-3 rounded-r-lg w-1/2 font-semibold`} onClick={()=>setMode(false)}>File Storage</button>
        </div>
        <div className="flex flex-col gap-10 ">
          {mode? (
            
            instructionData2.map((data, index)=>{
              return(
                <div key={index}>
                    <Instruction {...data}/>
                </div>


              )
            })
            ):
            (
                instructionData.map((data, index)=>{
                    return(
                      <div key={index}>
                          <Instruction {...data}/>
                      </div>
      
      
                    )
                  })
            )
          }

        </div>
      </div>
    </div>
  </div>
  )
}

export default Instructions;
