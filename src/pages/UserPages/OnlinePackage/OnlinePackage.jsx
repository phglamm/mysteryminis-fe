import { Badge, Card } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";

const OnlinePackage = () => {
    const navigate = useNavigate();
    const [Package, setPackage] = useState([]);

    const fetchPackages = async () => {
        try {
            const response = await api.get("online-serie-box");
            setPackage(response.data);
            console.log(response.data);
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
        <div className="flex flex-col pt-[10%] items-center justify-center">
            {Object.keys(groupedByBrand).map((brand) => (
                <div key={brand} className="mb-6 w-full text-center px-[20%]">
                    <h2 className="text-2xl font-bold mb-4 border-b-1 border-gray-600">{brand}</h2>
                    <div className="flex flex-wrap gap-10 justify-center">
                        {groupedByBrand[brand].map((box) => (
                            <Badge.Ribbon key={box.onlineSerieBoxId} text={`Box ID: ${box.onlineSerieBoxId}`} color={box.IsSecretOpen ? "lime" : "gold"}>
                                <Card
                                    className={`m-2 p-4 shadow-lg w-64 ${box.turn === box.maxTurn ? "opacity-50 cursor-not-allowed" : ""}`}
                                    hoverable={box.turn !== box.maxTurn}
                                    cover={
                                        <img
                                            alt="example"
                                            src={box.imageUrl}
                                            className="h-[10vw] w-full object-cover"
                                        />
                                    }
                                    onClick={box.turn !== box.maxTurn ? () => handleSelectedBox(box) : undefined}
                                    actions={[box.turn === box.maxTurn ? <span>Out of Turn</span> : 
                                        <div className="flex flex-row w-full gap-2">
                                            <span className="w-[80%]">Buy Now</span>
                                            <span className="w-[20%]">{box.turn}/{box.maxTurn}</span>
                                        </div>]}
                                >
                                    <h3 className="text-lg font-bold">{box.boxOption.boxOptionName}</h3>
                                    <div className="flex flex-row w-full gap-2">
                                        <div className="w-3/4 text-[1vw]">{box.basePrice}</div>
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