"use client"

import Image from "next/image"

const About = () =>{
    return (<>

    <div className="">
        
    <div className='flex flex-row gap-6 justify-end p-5'>
    <div className="px-3 text-sm bold tracking-wide text-white ">
            Visit My Profile: 
        </div>
                                    
                                            <Image className="h-5 w-5 grayscale hover:grayscale-0 transition duration-1000 hover:cursor-pointer" width={720} height={720}  src='/images/github.png' alt="github" onClick={()=>{window.open('https://github.com/cool-deep-96')}}/>
                                            <Image className="h-5 w-5 grayscale hover:grayscale-0 transition duration-1000 hover:cursor-pointer" width={720} height={720} src='/images/linkedin.png' alt="linkedin" onClick={()=>{window.open('https://www.linkedin.com/in/cool-deep96/')}}/>
                                            <Image className="h-5 w-5 grayscale hover:grayscale-0 transition duration-1000 hover:cursor-pointer" width={720} height={720} src='/images/instagram.png' alt="instagram" onClick={()=>{window.open('https://instagram.com/cool_deep_96?igshid=NTc4MTIwNjQ2YQ==')}}/>

                                       


                                    </div>

    </div>
    </>

    )
}

export default About;