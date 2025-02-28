/* eslint-disable react/prop-types */
import { Badge } from "antd"


const Content = ({box}) => {
  return (
    <div  className='w-[100%]'>
        <Badge.Ribbon style={{fontSize:'1vw', height: 'fit-content'}}  text={box.category} color="blue">
            <div className="flex flex-col h-[10vw] justify-center items-center w-full  bg-white rounded-lg shadow-md">
                                            
                                            
                <div className='flex flex-row h-full w-full '>
                    <div className=' w-2/5 max-w-full'>
                        <img
                            className='w-full rounded-tl-md  min-h-full max-h-full bg-amber-400'
                            src={box.image}
                            alt={box.name}
                        />
                    </div>
                                                
                    <div className="text-lg flex flex-col text-center justify-center items-center w-3/5 font-semibold">
                        <div className='h-3/4 flex justify-center pt-[22%] w-full'>
                            <p className="text-[1.2vw] ">{box.name}</p>
                            
                        </div>
                        <div className='flex flex-row item-center border-t-1  h-1/4 w-full'>
                            <p className="text-[1.5vw] flex items-center justify-center w-3/4 ">{box.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
                            <p className="text-[100%] flex items-center justify-center w-1/4">{box.boxAvailable}</p>
                    </div>
                    </div>
                </div>             
            </div>
        </Badge.Ribbon>
    </div>
  )
}

export default Content