import Image from "next/image";
import HomeIntro from "../components/common/HomeIntro";
import Instructions from "../components/common/Instructions";
import About from "../components/common/About";

Image;
export default function Home() {
  return (
    <div className=" min-h-screen bg-no-repeat bg-black text-white  bg-right-top bg-[length:50vw_70vh]">
      <HomeIntro />
      <Instructions />
      <About />
    </div>
  );
}
