import Image from "next/image"
import HomeIntro from "./Component/HomeIntro"
import Instructions from "./Component/Instructions"
import About from "./Component/About"


Image
export default function Home() {


  return (
    <div className=" min-h-screen bg-no-repeat  bg-right-top bg-[length:50vw_70vh]">


      <HomeIntro/>
      <Instructions/>
      <About/>



    </div>
  )
}
