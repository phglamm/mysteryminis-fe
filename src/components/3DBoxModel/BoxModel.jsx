import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Modal } from "antd";
import logo from "../../assets/images/Logo-removebg.png";
import secretRun from "../../assets/images/secretVid.mp4"; 
import commonRun from "../../assets/images/commonVid.mp4";

const BoxModel = ({ plays, setPlays }) => {
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  const Model = () => {
    const { scene, animations } = useGLTF("../../../public/BoxModel3D/box.glb");
    const { actions } = useAnimations(animations, scene);

     // Handle preventing scroll when modal is open
  useEffect(() => {
    if (rewardModalVisible) {
      document.documentElement.style.overflow = "hidden"; // Disable scrolling
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto"; // Enable scrolling
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, [rewardModalVisible]);
  
    useEffect(() => {
      if (plays && actions) {
        const action = actions[Object.keys(actions)[0]]; // Get the first animation
        if (action) {
          action.reset().setLoop(THREE.LoopOnce, 1).play();
          action.clampWhenFinished = true; // Keep final animation frame
          
          // Detect when animation finishes
          action.getMixer().addEventListener("finished", () => {
            setPlays(false);
            setShowVideo(true); // Start video after box animation ends
            videoRef.current?.play();
          });
        }
      }
    }, [plays, actions]);

    return <primitive object={scene} />;
  };

  const AnimatedModel = () => (
    <motion.group
      animate={{ rotateY: [0, Math.PI * 2] }} // Rotate 360 degrees
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    >
      <Model />
    </motion.group>
  );

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [-150, 20, 0], fov: 3 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[-150, 20, 0]} />
        <AnimatedModel />
      </Canvas>

      {/* Background Video (Only Shows When Needed) */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          className="fixed top-0 left-0 w-full h-full object-cover z-10"
          onPlay={() => {
            setTimeout(() => {
              setRewardModalVisible(true); // Show modal
            }, 3000);
          }}
        >
          <source src={secretRun} type="video/mp4" />
        </video>
      )}

      {/* Modal (Only Shows After Video Ends) */}
      <Modal 
        open={rewardModalVisible} 
        onOk={() => setRewardModalVisible(false)} 
        onCancel={() =>{
          setRewardModalVisible(false);
          setShowVideo(false);
        } }
        centered
        footer={null}
        width={800}
        className="text-center z-20" // Ensure modal is above video
        maskStyle={{
          backgroundColor: "transparent", // Fully transparent mask
        }}
      >
        <div className="flex justify-center items-center">
          <img src={logo} alt="logo" className="w-1/2 h-[20vw]" />
        </div>
        <p>You have won a reward!</p>
      </Modal>
    </div>
  );
};

export default BoxModel;
