/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import {  useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import ShowRewardModal from "../ShowRewardModal/ShowRewardModal";

import bg360 from "../../assets/images/360pic2.jpg";
import secretRun from "../../assets/images/secretVid.mp4";
import commontRun from "../../assets/images/commonVid.mp4";

const BoxModel = ({ plays, setPlays, reward, fetchBlindBox, showVideo, setShowVideo }) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  console.log(reward);
  const [interactionDisabled, setInteractionDisabled] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const hasInteracted = useRef(false);
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);


  const initialCameraPosition = new THREE.Vector3(-150, 20, 0);
  const IntroCameraPosition = new THREE.Vector3(60, 70, 80);

  const smoothX = useSpring(initialCameraPosition.x, {});
  const smoothY = useSpring(initialCameraPosition.y, {});
  const smoothZ = useSpring(initialCameraPosition.z, {});

  const texture = useLoader(THREE.TextureLoader, bg360);
  useEffect(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);
  

  useEffect(() => {
    if (!isInteracting && hasInteracted.current) {
      smoothX.set(initialCameraPosition.x);
      smoothY.set(initialCameraPosition.y);
      smoothZ.set(initialCameraPosition.z);

      setInteractionDisabled(true);
      setTimeout(() => setInteractionDisabled(false), 1000);
    }
  }, [isInteracting ]);

  // const unboxOnlineBlindBox = async () => {
  //   setReward(null);
  //   try {
  //     const response = await api.post(`online-serie-box/unbox`, {
  //       userId: user.userId,
  //       onlineSerieBoxId: onlineSerieBoxId,
  //     });
  //     if (response && response.data) {
  //       setReward(response.data);
  //     } else {
  //       console.error("Unexpected response format:", response);
  //     }
  //   } catch (error) {
  //     console.error("Error unboxing online blind box:", error);
  //   }
  // };


  const CameraAnimation = () => {
    useEffect(() => {
      if (cameraRef.current && showIntro) {
        cameraRef.current.position.copy(IntroCameraPosition);
        setTimeout(() => {
          smoothX.set(initialCameraPosition.x);
          smoothY.set(initialCameraPosition.y);
          smoothZ.set(initialCameraPosition.z);
        }, 1500);
        setShowIntro(false);
      }
    }, []);

    useFrame(() => {
      if (!isInteracting && cameraRef.current) {
        cameraRef.current.position.lerp(
          new THREE.Vector3(smoothX.get(), smoothY.get(), smoothZ.get()),
          0.009  
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

    return <primitive object={scene} scale={[13, 13, 13]} />;
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [-150, 20, 0], fov: 40 }}
        onCreated={({ scene, camera }) => {
          scene.background = texture;
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[-150, 20, 0]} />

        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
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
          className="fixed top-0 left-0 w-full h-full object-cover z-20"
          onPlay={() => {
            setTimeout(() => setRewardModalVisible(true), 3000);
          }}
        >
          <source src={reward?.isSecret ? secretRun : commontRun} type="video/mp4" />
        </video>
      )}

      <ShowRewardModal 
        reward={reward} 
        visible={rewardModalVisible} 
        onClose={() => { 
          setRewardModalVisible(false); 
          setShowVideo(false); 
          fetchBlindBox();
        }}
        
      />
    </div>
  );
};

export default BoxModel;
