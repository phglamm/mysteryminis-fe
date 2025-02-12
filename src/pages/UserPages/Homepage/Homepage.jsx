
import Labubu from '../../../assets/images/Labubu.png';
import Yooki from '../../../assets/images/yooki.png';
import Skull from '../../../assets/images/SkullPanda.png';
import BB3 from '../../../assets/images/BABY3.png';
import TiltedCard from '../../../components/TiltedCard/TiltedCard';
import BlurText from '../../../components/BlurText/BlurText';
export default function Homepage() {
  return (
    <div className=" mt-24">

      {/* Image Content */}
      <div className="grid grid-cols-3 p-14 pr-36 pl-36 gap-4">
        <div className=" col-span-2 rounded-3xl h-96">
        <TiltedCard
          imageSrc={Labubu}
          altText="LABUBU - POPMART"
          captionText="LABUBU - POPMART"
          containerHeight="100%"
          containerWidth="100%"
          imageHeight="100%"
          imageWidth="100%"
          rotateAmplitude={7}
          scaleOnHover={1.1}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={false}
          overlayContent={
            <p className="tilted-card-demo-text">
             LABUBU - POPMART
            </p>
          }
        />
        </div>
        <div className="h-96">
          <div className="grid grid-cols-1 gap-4">
            <div className=" rounded-3xl h-48">
              <TiltedCard
                imageSrc={Skull}
                altText="SKULL PANDA - POPMART"
                captionText="SKULL PANDA - POPMART"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={9}
                scaleOnHover={1.1}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={false}
                overlayContent={
                  <p className="tilted-card-demo-text">
                    SKULL PANDA - POPMART
                  </p>
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 h-44">
              <div className='bg-green-400 rounded-3xl'>
              <TiltedCard
                imageSrc={Yooki}
                altText="YOOKI - BLINDBOX"
                captionText="YOOKI - BLINDBOX"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={9}
                scaleOnHover={1.1}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={false}
                overlayContent={
                  <p className="tilted-card-demo-text">
                    YOOKI - BLINDBOX
                  </p>
                }
              />
              </div>
              <div className='bg-yellow-400 rounded-3xl'>
              <TiltedCard
                imageSrc={BB3}
                altText="BABYTHREE - BLINDBOX"
                captionText="BABYTHREE - BLINDBOX"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={9}
                scaleOnHover={1.1}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={false}
                overlayContent={
                  <p className="tilted-card-demo-text">
                    BABYTHREE - BLINDBOX
                  </p>
                }
              />
              </div>
            </div>
          </div>
        </div>
        
      </div>


      {/* Content */}
      <div className='text-center flex flex-col items-center'
        style={{ userSelect: 'none' }}    
      >
        <BlurText
          text="MYSTERY MINIS"
          delay={150}
          animateBy="letters"
          direction="top"
          className="text-6xl mb-4 font-sans"
        />
        <BlurText
          text="Unbox the Unexpected! Every Box Holds a Secret!"
          delay={150}
          animateBy="letters"
          direction="bottom"
          className="text-3xl mb-8 text-gray-500 font-sans"
        />
      </div>
    </div>
  );
}
