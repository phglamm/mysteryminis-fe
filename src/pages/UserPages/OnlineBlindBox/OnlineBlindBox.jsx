 

import BlindBoxList from './BlindBoxList/BlindBoxList';

const blindBoxes = [
    { name: "Mystery Box 1", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "Kimmon", image: "image1.jpg" },
    { name: "Mystery Box 2", price: 250000, isSecretAvailable: true, boxAvailable: "0/9", category: "Kimmon", image: "image2.jpg" },
    { name: "Mystery Box 3", price: 150000, isSecretAvailable: false, boxAvailable: "7/9", category: "Kimmon", image: "image3.jpg" },
    { name: "Mystery Box 4", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "Kimmon", image: "image4.jpg" },
    { name: "Mystery Box 1", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "BabyThree", image: "image1.jpg" },
    { name: "Mystery Box 2", price: 250000, isSecretAvailable: true, boxAvailable: "0/9", category: "BabyThree", image: "image2.jpg" },
    { name: "Mystery Box 3", price: 150000, isSecretAvailable: false, boxAvailable: "7/9", category: "BabyThree", image: "image3.jpg" },
    { name: "Mystery Box 4", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "BabyThree", image: "image4.jpg" },
    { name: "Mystery Box 1", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "Yooki", image: "image1.jpg" },
    { name: "Mystery Box 2", price: 250000, isSecretAvailable: true, boxAvailable: "0/9", category: "Yooki", image: "image2.jpg" },
    { name: "Mystery Box 3", price: 150000, isSecretAvailable: false, boxAvailable: "7/9", category: "Yooki", image: "image3.jpg" },
    { name: "Mystery Box 2", price: 250000, isSecretAvailable: true, boxAvailable: "0/9", category: "Yooki", image: "image2.jpg" },
    { name: "Mystery Box 3", price: 150000, isSecretAvailable: false, boxAvailable: "7/9", category: "Yooki", image: "image3.jpg" },
    { name: "Mystery Box 2", price: 250000, isSecretAvailable: true, boxAvailable: "0/9", category: "Yooki", image: "image2.jpg" },
    { name: "Mystery Box 3", price: 150000, isSecretAvailable: false, boxAvailable: "7/9", category: "Yooki", image: "image3.jpg" },
    { name: "Mystery Box 4", price: 350000, isSecretAvailable: true, boxAvailable: "3/9", category: "Yooki", image: "image4.jpg" }
];

const categories = [...new Set(blindBoxes.map(box => box.category))];



const OnlineBlindBox = () => (
    <div className="py-[8%] flex flex-row justify-between px-5">
        {categories.map(category => (
            <BlindBoxList key={category} category={category} boxes={blindBoxes.filter(box => box.category === category)} />
        ))}
    </div>
);

export default OnlineBlindBox;
