import InfiniteScroll from '../../../components/React_Bits/InfiniteScroll/InfiniteScroll';
import gift from '../../../assets/images/OpenedGift.webm';
const boxes = [
    { id: 1, name: "Mystery Box 1", price: 350000, isSecretAvailable: true, boxAvailable: "99/9", category: "Kimmon", 
        image: [
            "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180",
            "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180",
            "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180",
            "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180",
            "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180",
            "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180",
            "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180",
            "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180",
            "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180"
        ] 
    },
    { id: 2, name: "Mystery Box 2", price: 250000, isSecretAvailable: true, boxAvailable: "0/9", category: "Kimmon", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 3, name: "Mystery Box 3", price: 150000, isSecretAvailable: false, boxAvailable: "7/9", category: "Kimmon", image: "hhttps://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 4, name: "Mystery Box 4", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "Kimmon", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 5, name: "Mystery Box 1", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "BabyThree", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 6, name: "Mystery Box 2", price: 250000, isSecretAvailable: true, boxAvailable: "0/9", category: "BabyThree", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 7, name: "Mystery Box 3", price: 150000, isSecretAvailable: false, boxAvailable: "7/9", category: "BabyThree", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 8, name: "Mystery Box 4", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "BabyThree", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 9, name: "Mystery Box 1", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "Yooki", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 10, name: "Mystery Box 2", price: 250000, isSecretAvailable: true, boxAvailable: "0/9", category: "Yooki", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 11, name: "Mystery Box 3", price: 150000, isSecretAvailable: false, boxAvailable: "7/9", category: "Yooki", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 12, name: "Mystery Box 2", price: 250000, isSecretAvailable: true, boxAvailable: "0/9", category: "Yooki", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 13, name: "Mystery Box 3", price: 150000, isSecretAvailable: false, boxAvailable: "7/9", category: "Yooki", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 14, name: "Mystery Box 2", price: 250000, isSecretAvailable: true, boxAvailable: "0/9", category: "Yooki", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 15, name: "Mystery Box 3", price: 150000, isSecretAvailable: false, boxAvailable: "7/9", category: "Yooki", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" },
    { id: 16, name: "Mystery Box 4", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "Yooki", image: "https://tse1.mm.bing.net/th?id=OIP.PqQ7kpwYuU-jLBqwsbc9aQHaHa&pid=Api&P=0&h=180" }
];




import { useState } from 'react';
import SplashCursor from '../../../components/React_Bits/SplashCursor/SplashCursor';


const OnlineBlindBox = () => {
    const [selectedBox, setSelectedBox] = useState(null);
    console.log(selectedBox);
    return (
        <div className="pt-[7%] h-screen bg-gradient-to-r from-neutral-300 to-stone-400  flex flex-row">
            {/* <SplashCursor/> */}
                    {/* Package List */}
                    <div className=" w-1/4 border-2 ">
                        <InfiniteScroll
                            setSelectedBox={setSelectedBox}
                            negativeMargin='-3vw'
                            maxHeight='100%'
                            autoplaySpeed={1}
                            items={boxes}
                            autoplay
                        />
                    </div>

                    {/* Package Details */}
                    <div className='w-3/4 h-full border-2'>
                       <video autoPlay loop muted className='w-[30%] h-fit '>
                            <source src={gift} type="video/webm"/>
                        </video>
                       
                     </div>
        </div>
    );
};

export default OnlineBlindBox;
