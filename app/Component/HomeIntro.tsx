import Image from "next/image";
import Link from "next/link";

const HomeIntro = () => {
  return (
    <div className="flex  mt-40 lg:mt-56 flex-col lg:flex-row items-center gap-4 lg:gap-0 w-full mb-28">
        <div className="flex justify-center lg:justify-end lg:w-6/12 items-center ">
        
          <div className="max-w-[32rem] px-4 relative">

          <div className="absolute inline-block bottom-full mb-10 lg:mb-16">
          <Image className="h-24 w-auto rounded-xl" src='/images/Logo.png' alt="" width={1080} height={1080} />
        </div>


            <div className="text-red-700 text-md font-bold  uppercase">EXPLORE MOVIE MAGIC WITH FRIENDS</div>
            <div className=" text-4xl md:text-5xl font-bold  py-5">Create movie rooms, sync play, and enjoy together.</div>
            <div className="text-xs  pb-5 max-w-96">Craft your virtual room, where you and your friends can gather to watch movies from local files or by pasting YouTube URL. Feel the thrill of synchronized play and pauses, as you collectively dive into the magic of film</div>
            <div className="flex flex-row gap-10 justify-start ">
              <Link href='/room' className="relative flex justify-center overflow-hidden rounded-lg p-[1px]">
               
                  <div className="absolute w-[110%] h-[35px] -z-[1]   explore-border-animation bg-white rounded-lg">
                  </div>
                  <button className=" px-5 flex items-center py-3 text-sm text-white bg-yellow-500 rounded-lg font-semibold  tracking-wide">Explore The Room</button>
              
              </Link>
              <div className="flex flex-row gap-4 justify-center items-center hover:cursor-pointer">
                <div className=" flex justify-center  items-center  py-2 w-10">
                  <Image className="h-8" src='/images/Playbutton.png' alt="" width={1000} height={1000} />
                </div>
                <button className="text-sm tracking-wide">Play Demo</button>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full lg:w-6/12  px-4 lg:px-0">
          <div className="max-w-[32rem] lg:w-11/12 ">
            <Image className='' src='/images/celebrateMovie.jpg' alt="" width={1000} height={1000} />
          </div>

        </div>

      </div>
  )
}

export default HomeIntro;
