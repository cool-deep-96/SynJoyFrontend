import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface InstructionProps{
    imgSrc?: string | null
    order?: boolean
    heading?: string
    description?: string
    link?: string
}

const Instruction = ({imgSrc, order, heading, description, link}:InstructionProps) => {
    return (
        <div className='flex flex-col md:flex-row md:gap-10  items-center justify-center '>

            <div className={`${order? 'order-2 pb-10 md:pb-0': ''} flex max-w-96 w-full md:w-auto justify-start`}>
                <Image className="h-56 w-56 rounded-3xl" src={imgSrc || ''} alt="" width={1000} height={1000} />
            </div>
          

            <div className=' text-3xl flex justify-center px-4'>
                <div className='max-w-96'>
                    <div className="font-bold gap-3 py-4 bg-[url('/images/underLine.png')] bg-no-repeat  bg-left-bottom bg-[length:70%_10px] bg-origin-content">
                        {heading}
                    </div>
                    <div className="text-base">
                        {description}
                    </div>
                    <div className='flex my-2 justify-end'>

                {link && <Link href={link} className="px-5 flex items-center py-2 text-sm text-white bg-yellow-500 rounded-lg font-semibold">
                    Get Started
              </Link>}
                    </div>
                </div>
            </div>
          
        </div>

    )
}

export default Instruction;
