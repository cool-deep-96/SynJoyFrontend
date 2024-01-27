import Image from "next/image"
import Instruction from "./Component/Instruction"
import Link from "next/link"

const instructionData = [
  {
    imgSrc:'/images/downloadMovie.jpg',
    heading: 'Download Movies',
    order: false,
    description:'Ensure all members download planned movies for seamless movie-watching experience'
  },
  {
    imgSrc:'/images/createRoom.jpg',
    heading: 'Create Room & Share Code',
    order: true,
    description: 'Initiate a room and share the code for collective movie enjoyment.',
    link:'/room'
  },
  {
    imgSrc:'/images/requestAndAccept.jpg',
    heading: 'Request & Accept',
    order: false,
    description: 'Allow owner-approved requests, creating an inclusive atmosphere for an enhanced and engaging movie experience.'
  },
  
  {
    imgSrc:'/images/syncMovie.jpg',
    heading: 'Sync Movie Choice',
    order: true,
    description: 'Ensure all members select the same movie file for synchronization.'
  },
  {
    imgSrc:'/images/celebrateMovie.jpg',
    heading: 'Celebrate Together',
    order: false,
    description: 'Relax, unwind, and revel in the collective joy of celebrating together with friends.'
  },
]

Image
export default function Home() {


  return (
    <div className="bg-white text-black min-h-screen bg-[url('/images/decore.webp')] bg-no-repeat bg-contain bg-right-top bg-[length:50vw_70vh]">
      <div className="bg-white inline-block py-8 ml-48">
        <Image className="h-8" src='/images/Logo.png' alt="" width={100} height={100} />
      </div>

      <div className="flex h-[65vh] flex-row w-full mb-28">
        <div className="flex  justify-end w-6/12 items-center">
          <div className="w-8/12">
            <div className="text-red-700 text-md font-bold  uppercase">EXPLORE MOVIE MAGIC WITH FRIENDS</div>
            <div className=" text-5xl font-bold  py-5">Create movie rooms, sync play, and enjoy together.</div>
            <div className="text-xs  pb-5 w-96">Craft your virtual room, where you and your friends can gather to watch movies from local files. Feel the thrill of synchronized play and pauses, as you collectively dive into the magic of film</div>
            <div className="flex flex-row gap-10 justify-start ">
              <Link href='/room' className="px-5 flex items-center py-1 text-sm text-white bg-yellow-500 rounded-lg font-semibold">
                Explore The Room
              </Link>
              <div className="flex flex-row gap-4 justify-center items-center hover:cursor-pointer">
                <div className=" flex justify-center  items-center  py-2 w-10">
                  <Image className="h-8" src='/images/Playbutton.png' alt="" width={1000} height={1000} />
                </div>
                <button className="text-sm">Play Demo</button>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-2/4  ">
          <div className="w-full ">
            <Image className=' w-11/12' src='/images/celebrateMovie.jpg' alt="" width={1000} height={1000} />
          </div>

        </div>

      </div>


      <div className="w-full flex justify-center">
        <div className="flex flex-col items-center pb-28 w-2/4">
          <div className="flex flex-col bg-[url('/images/celebrate.gif')] bg-repeat-x bg-right-bottom ">
            <div>

              <div className="py-5 font-semibold">Easy and Fast</div>
              <div className="text-5xl font-bold pb-5">Start Watching Together in 5 Simple Steps</div>
            </div>
            {
              instructionData.map((data, index)=>{
                return(
                  <div key={index}>
                      <Instruction imgSrc={`${data.imgSrc}`} order={data.order} heading={data.heading}  description={data.description} link={data.link}/>
                  </div>


                )
              })
            }
            
          </div>
        </div>
      </div>
    </div>
  )
}
