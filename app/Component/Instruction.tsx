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
        <div className='flex flex-row gap-10  p-10'>

            <div className={`${order? 'order-2': ''} flex justify-center  items-center  rounded-3xl`}>
                <Image className="h-56 w-56" src={imgSrc || ''} alt="" width={1000} height={1000} />
            </div>
          

            <div className=' text-3xl flex justify-center'>
                <div className='w-96'>
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
