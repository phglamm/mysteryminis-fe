/* eslint-disable react/prop-types */
import { Card } from "antd";

import AnimatedList from "../../../../components/React_Bits/AnimatedList/AnimatedList";

const BlindBoxList = ({ category, boxes }) => {   

        

    return (
        <div className=" ">
            <h2 className="text-center text-xl font-semibold mb-5">{category}</h2>
            <div className="w-[5%] gap-5 ">
                <AnimatedList
                 showGradients={false} 
                 displayScrollbar={false}
                    items={boxes.map((box, index) => (
                        <Card
                            key={index}
                            hoverable
                            className="shadow-lg rounded-xl overflow-hidden w-[200px]"
                            cover={<img alt={box.name} className="h-[150px] object-cover" src={box.image} />}
                        >
                            <p className="text-center font-semibold">{box.name}</p>
                            <div className="text-center mt-2">
                                <span className={`px-2 py-1 rounded text-sm ${box.isSecretAvailable ? "bg-yellow-300" : "bg-gray-300"}`}>
                                    {box.isSecretAvailable ? "Secret" : "Normal"}
                                </span>
                            </div>
                            <p className="text-center font-bold text-lg mt-2">{box.price.toLocaleString()} VND</p>
                            <p className="text-center text-gray-600">{box.boxAvailable}</p>
                        </Card>
                    ))}
                />
            </div>
        </div>
    );
};

export default BlindBoxList;
