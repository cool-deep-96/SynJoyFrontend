interface RectangleProps{
    h?: string,
    w?: string,
    rounded?: string,
    m?: string
}

const Rectangle = ({h, w, rounded, m}:RectangleProps) => {
  return (
    <>
    <div className={`bg-gray-500 ${h} ${w} ${rounded} ${m} relative overflow-hidden`}>
        <div className='absolute w-2/4 h-full bg-red-400 drop-shadow-xl -skew-x-12 shimmer'></div>
    </div>
    </>
  )
}

export default Rectangle;