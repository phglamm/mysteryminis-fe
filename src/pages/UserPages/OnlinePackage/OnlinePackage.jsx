import { Badge, Card, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import { UpSquareOutlined } from "@ant-design/icons";

const OnlinePackage = () => {
    const navigate = useNavigate();
    const [Package, setPackage] = useState([]);

    const fetchPackages = async () => {
        try {
            const response = await api.get("online-serie-box");
            setPackage(response.data);
        } catch (error) {   
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleSelectedBox = (box) => {
        navigate(`/online-blindbox/${box.onlineSerieBoxId}`);
    };

    const groupedByBrand = Package.reduce((acc, box) => {
        if (!acc[box.brandDtoResponse.brandName]) {
            acc[box.brandDtoResponse.brandName] = [];
        }
        acc[box.brandDtoResponse.brandName].push(box);
        return acc;
    }, {});

    return (
        <div className="flex h-fit min-h-screen flex-col pt-[10%] items-center justify-center">
            {Object.keys(groupedByBrand).map((brand) => (
                <div key={brand} className="mb-6 w-full text-center px-[12%]">
                    <h2 className="text-2xl font-bold mb-4 border-b-1 border-gray-600">{brand}</h2>
                    <div className="flex flex-wrap gap-10 justify-center">
                        {groupedByBrand[brand].map((box) => (
                            <Badge.Ribbon key={box.onlineSerieBoxId} text={`Box ID: ${box.onlineSerieBoxId}`} color={box.isPublished ? "red" : "gray"}>
                                <Card
                                    className={` p-4 shadow-lg w-64 ${!box.isPublished ? "opacity-50 cursor-not-allowed" : ""}`}
                                    hoverable={box.isPublished}
                                    cover={
                                        <img
                                            alt="example"
                                            src={box.imageUrl}
                                            className="h-[10vw] w-full object-cover"
                                        />
                                    }
                                    onClick={box.isPublished ? () => handleSelectedBox(box) : undefined}
                                    actions={[!box.isPublished ? <span>Out of Turn</span> : 
                                        <div className="flex flex-row w-full gap-2">
                                            <span className="w-[80%] truncate">Buy Now</span>
                                            <span className="w-[20%]">{box.turn}/{box.maxTurn}</span>
                                        </div>]}>
                                    <div className="w-full flex flex-row justify-between items-center">
                                        <div className={`text-sm px-3 py-1 rounded-md ${box.isSecretOpen ? "bg-gray-500" : "bg-gradient-to-r from-amber-200 to-yellow-500" }`}>
                                            {box.isSecretOpen ? 'Secret Opened' : 'Secret'}
                                        </div>
                                        <div className={`text-sm px-3 gap-1 py-1 items-center justify-center flex rounded-md ${box.isSecretOpen ? "bg-white border-2" : box.priceIncreasePercent > 20 ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-b from-sky-400 to-sky-200" }`}>
                                            <UpSquareOutlined /> {box.isSecretOpen ? '0' : box.priceIncreasePercent}%
                                        </div>
                                    </div>
                                    <Tooltip placement="bottom" title={box.boxOption.boxOptionName}>
                                        <h3 className="text-lg font-bold truncate">{box.boxOption.boxOptionName}</h3>
                                    </Tooltip>
                                    <div className="flex flex-col w-full">
                                        <div className=" text-red-500 font-bold w-full text-[1.3vw] truncate">{box.boxOption.displayPrice.toLocaleString()}</div>
                                        <div className=" text-gray-300 line-through w-full text-[0.7vw] -mb-[10%] truncate">{box.boxOption.originPrice.toLocaleString()}</div>
                                    </div>
                                </Card>
                            </Badge.Ribbon>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OnlinePackage;