import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { motion, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Badge, Descriptions, Modal, Rate } from "antd";
import logo from "../../assets/images/Logo-removebg.png";
import secretRun from "../../assets/images/secretVid.mp4";
import commontRun from "../../assets/images/commonVid.mp4";
import api from "../../config/api";
import { useSelector } from "react-redux";
import { selectUser } from "../../Redux/features/counterSlice";
import { use } from "react";
import ShowRewardModal from "../ShowRewardModal/ShowRewardModal";

const BoxModel = ({ plays, setPlays, onlineSerieBoxId }) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [interactionDisabled, setInteractionDisabled] = useState(false);
  const [reward, setReward] = useState(null);
  const hasInteracted = useRef(false);
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  

  const user = useSelector(selectUser);

  // Target position for the camera reset
  const initialCameraPosition = new THREE.Vector3(-150, 20, 0);
  const IntroCameraPosition = new THREE.Vector3(60, 70, 80);

  // UseSpring for smooth transition
  const smoothX = useSpring(initialCameraPosition.x, {});
  const smoothY = useSpring(initialCameraPosition.y, {});
  const smoothZ = useSpring(initialCameraPosition.z, {});

  useEffect(() => {
    if (!isInteracting && hasInteracted.current) {
      smoothX.set(initialCameraPosition.x);
      smoothY.set(initialCameraPosition.y);
      smoothZ.set(initialCameraPosition.z);

      setInteractionDisabled(true);
      setTimeout(() => {
        setInteractionDisabled(false);
      }, 1000);
    }
  }, [isInteracting]);

  const unboxOnlineBlindBox = async () => {
    setReward(null);
    try {
      const payload = {
        userId: user.userId, // Replace with the actual userId if available
        onlineSerieBoxId: onlineSerieBoxId, // Replace with the actual onlineSerieBoxId
      };

      const response = await api.post(`online-serie-box/unbox`, payload);
      if (response && response.data) {
        setReward(response.data);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error unboxing online blind box:", error);
    }
  };
  useEffect(() => {
    if (plays) {
      unboxOnlineBlindBox();
    }
  }, [plays]);
  console.log("Unbox Response:", reward);

  const [hasShownIntro, setHasShownIntro] = useState(false);

  const CameraAnimation = () => {
    useEffect(() => {
      if (!hasShownIntro && cameraRef.current) {
        cameraRef.current.position.copy(IntroCameraPosition); // Start at IntroCameraPosition

        setTimeout(() => {
          smoothX.set(initialCameraPosition.x);
          smoothY.set(initialCameraPosition.y);
          smoothZ.set(initialCameraPosition.z);
          setHasShownIntro(true); // Ensure it runs only once
        }, 1500); // Delay before moving to initialCameraPosition
      }
    }, [hasShownIntro]);
    useFrame(() => {
      if (!isInteracting && cameraRef.current) {
        cameraRef.current.position.lerp(
          new THREE.Vector3(smoothX.get(), smoothY.get(), smoothZ.get()),
          0.02
        );
        cameraRef.current.lookAt(0, 0, 0);
      }
    });
    return null;
  };

  const Model = () => {
    const { scene, animations } = useGLTF("../../../public/BoxModel3D/box.glb");
    const { actions } = useAnimations(animations, scene);

    useEffect(() => {
      if (plays && actions && reward) {
        const action = actions[Object.keys(actions)[0]];
        if (action) {
          action.reset().setLoop(THREE.LoopOnce, 1).play();
          action.clampWhenFinished = true;
          action.getMixer().addEventListener("finished", () => {
            setPlays(false);
            setShowVideo(true);
            videoRef.current?.play();
          });
        }
      }
    }, [plays, actions]);

    return <primitive object={scene} />;
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [-150, 20, 0], fov: 4 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[-150, 20, 0]} />

        <OrbitControls
          ref={controlsRef}
          enableZoom={!interactionDisabled}
          enablePan={!interactionDisabled}
          enableRotate={!interactionDisabled}
          onStart={() => {
            if (!interactionDisabled) {
              setIsInteracting(true);
              hasInteracted.current = true;
            }
          }}
          onEnd={() => setIsInteracting(false)}
        />

        <CameraAnimation />
        <Model />
      </Canvas>

      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          className="fixed top-0 left-0 w-full h-full object-cover z-10"
          onPlay={() => {
            setTimeout(() => {
              setRewardModalVisible(true);
            }, 3000);
          }}
        >
          <source src={reward.isSecret ? secretRun : commontRun} type="video/mp4" />
        </video>
      )}

      <ShowRewardModal 
        reward={reward} 
        visible={rewardModalVisible} 
        onClose={() => setRewardModalVisible(false)} 
        setShowVideo={setShowVideo} 
      />
    </div>
  );
};

export default BoxModel;
