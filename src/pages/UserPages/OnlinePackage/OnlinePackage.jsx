import { Badge, Card } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
const OnlinePackage = () => {
    const naviagate = useNavigate();
    const [Package, setPackage] = useState([]);
    // const boxes = [
    //     {
    //         BoxId: 1,
    //         BoxOptionsName: "Mystery Anime Box",
    //         ImageUrl: "https://cdn2-retail-images.kiotviet.vn/2024/09/29/littleusastore/863e8d65616149eba761909126772369.png",
    //         BoxOptionPrice: 200000,
    //         OriginPrice: 49.99,
    //         DisplayPrice: 29.99,
    //         BoxOptionStock: 100,
    //         IsDeleted: false,
    //         IsOnlineSerieBox: true,
    //         Brand: "Anime Deluxe",
    //         BoxItem: [
    //             { BoxItemName: "Naruto Keychain", BoxItemId: 101, IsSecret: false },
    //             { BoxItemName: "One Piece Figure", BoxItemId: 102, IsSecret: true },
    //         ],
    //         OnlineSerieBox: {
    //             BasePrice: 29.99,
    //             PriceAfterSecret: 39.99,
    //             PriceIncreasePercent: 10,
    //             Name: "Anime Deluxe Series",
    //             IsSecretOpen: false,
    //             Turn: 1,
    //             MaxTurn: 5,
    //         },
    //     },
    //     {
    //         BoxId: 2,
    //         BoxOptionsName: "Gaming Loot Box",
    //         ImageUrl: "https://cdn2-retail-images.kiotviet.vn/2024/09/29/littleusastore/863e8d65616149eba761909126772369.png",
    //         BoxOptionPrice: 49.99,
    //         OriginPrice: 79.99,
    //         DisplayPrice: 49.99,
    //         BoxOptionStock: 50,
    //         IsDeleted: false,
    //         Brand: "Gamer's Paradise",
    //         IsOnlineSerieBox: false,
    //         BoxItem: [
    //             { BoxItemName: "RGB Gaming Mouse", BoxItemId: 201, IsSecret: false },
    //             { BoxItemName: "Limited Edition Headset", BoxItemId: 202, IsSecret: true },
    //         ],
    //         OnlineSerieBox: {
    //             BasePrice: 19.99,
    //             PriceAfterSecret: 29.99,
    //             PriceIncreasePercent: 15,
    //             Name: "Fashion Mystery Series",
    //             IsSecretOpen: true,
    //             Turn: 2,
    //             MaxTurn: 3,
    //         },
    //     },
    //     {
    //         BoxId: 3,
    //         BoxOptionsName: "Fashion Blind Box",
    //         ImageUrl: "https://cdn2-retail-images.kiotviet.vn/2024/09/29/littleusastore/863e8d65616149eba761909126772369.png",
    //         BoxOptionPrice: 19.99,
    //         OriginPrice: 39.99,
    //         DisplayPrice: 19.99,
    //         BoxOptionStock: 200,
    //         IsDeleted: false,
    //         Brand: "Anime Deluxe",
    //         IsOnlineSerieBox: true,
    //         BoxItem: [
    //             { BoxItemName: "Designer Socks", BoxItemId: 301, IsSecret: false },
    //             { BoxItemName: "Luxury Sunglasses", BoxItemId: 302, IsSecret: true },
    //         ],
    //         OnlineSerieBox: {
    //             BasePrice: 19.99,
    //             PriceAfterSecret: 29.99,
    //             PriceIncreasePercent: 15,
    //             Name: "Fashion Mystery Series",
    //             IsSecretOpen: true,
    //             Turn: 3,
    //             MaxTurn: 3,
    //         },
    //     },
    // ];

    const fetchPackages = async () => {
        try {
            const response = await api.get("OnlineSerieBox");
            setPackage(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);
    const handleSelectedBox = (e) => {
        naviagate("/online-blindbox");
    };
    const groupedByBrand = Package.reduce((acc, box) => {
        if (!acc[box.Brand]) {
            acc[box.Brand] = [];
        }
        acc[box.Brand].push(box);
        return acc;
    }, {});

    return (
        <div className="flex flex-col pt-[10%] items-center justify-center">
            {Object.keys(groupedByBrand).map((brand) => (
                <div key={brand} className="mb-6 w-full text-center px-[20%]">
                    <h2 className="text-2xl font-bold mb-4 border-b-1 border-gray-600">{brand}</h2>
                    <div className="flex flex-wrap gap-10 justify-center">
                        {groupedByBrand[brand].map((box) => (
                            <Badge.Ribbon key={box.BoxId} text={`Box ID: ${box.BoxId}`} color={box.OnlineSerieBox.IsSecretOpen ? "lime" : "gold"}>
                                <Card
                                    className={`m-2 p-4 shadow-lg w-64 ${box.OnlineSerieBox.Turn === box.OnlineSerieBox.MaxTurn ? "opacity-50 cursor-not-allowed" : ""}`}
                                    hoverable={box.OnlineSerieBox.Turn !== box.OnlineSerieBox.MaxTurn}
                                    cover={
                                        <img
                                            alt="example"
                                            src={box.ImageUrl}
                                            className="h-[10vw] w-full object-cover"
                                        />
                                    }
                                    onClick={box.OnlineSerieBox.Turn !== box.OnlineSerieBox.MaxTurn ? handleSelectedBox : undefined}
                                    actions={[box.OnlineSerieBox.Turn === box.OnlineSerieBox.MaxTurn ? <span>Out of Turn</span> : <span>Buy Now</span>]}
                                >
                                    <h3 className="text-lg font-bold">{box.BoxOptionsName}</h3>
                                    <div className="flex flex-row w-full gap-2">
                                        <div className="w-3/4 text-[1vw]">{box.BoxOptionPrice}</div>
                                        <div className="w-1/4">{box.BoxOptionStock}</div>
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
