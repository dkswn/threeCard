import { OrbitControls } from "@react-three/drei";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const cardData = [
  {
    imageUrl: "/tarrot1.png",
    position: [0, -1, 0],
    rotationY: -10,
    rotationZ: 0,
  },
  {
    imageUrl: "/tarrot2.png",
    position: [0.5, -1.05, -0.1],
    rotationY: -10,
    rotationZ: -10,
  },
  {
    imageUrl: "/tarrot3.png",
    position: [-0.5, -1.05, 0.1],
    rotationY: -10,
    rotationZ: 10,
  },
  {
    imageUrl: "/tarrot4.png",
    position: [-1, -1.15, 0.2],
    rotationY: -10,
    rotationZ: 20,
  },
  {
    imageUrl: "/tarrot5.png",
    position: [1, -1.15, -0.1],
    rotationY: -10,
    rotationZ: -20,
  },
];
import { useSpring, animated } from "@react-spring/three";
import { useState } from "react";

const CardComponent = ({ position, rotationY, rotationZ, imageUrl }) => {
  const [hovered, setHovered] = useState(false);

  const texture = useLoader(THREE.TextureLoader, imageUrl);
  texture.colorSpace = THREE.DisplayP3ColorSpace; // P3 색공간으로 변경

  const materials = [
    new THREE.MeshStandardMaterial(), // 오른쪽
    new THREE.MeshStandardMaterial(), // 왼쪽
    new THREE.MeshStandardMaterial(), // 윗면
    new THREE.MeshStandardMaterial(), // 바닥면
    new THREE.MeshStandardMaterial({
      map: texture,
    }), // 앞면 (이미지 적용)
    new THREE.MeshStandardMaterial(), // 뒷면
  ];

  const calculatePosition = (position, hovered) => {
    return hovered ? [position[0], position[1] + 0.5, position[2]] : position;
  };

  const adjustRotation = (rotation, adjustment) => {
    return rotation === 0 ? rotation : rotation + adjustment;
  };

  const calculateRotation = (rotationY, rotationZ, hovered) => {
    return hovered
      ? [
          0,
          THREE.MathUtils.degToRad(adjustRotation(rotationY, 5)),
          THREE.MathUtils.degToRad(
            adjustRotation(rotationZ, rotationZ > 0 ? -5 : 5)
          ),
        ]
      : [
          0,
          THREE.MathUtils.degToRad(rotationY),
          THREE.MathUtils.degToRad(rotationZ),
        ];
  };
  const props = useSpring({
    scale: hovered ? [1.1, 1.1, 1] : [1, 1, 1],
    position: calculatePosition(position, hovered),
    rotation: calculateRotation(rotationY, rotationZ, hovered),
    config: { mass: 1, tension: 400, friction: 100 },
  });

  return (
    <animated.mesh
      castShadow
      receiveShadow
      position={position}
      rotation-y={THREE.MathUtils.degToRad(rotationY)}
      rotation-z={THREE.MathUtils.degToRad(rotationZ)}
      material={materials}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      {...props}
    >
      <boxGeometry args={[1, 1.6, 0.01]} />
    </animated.mesh>
  );
};

import { useThree, useFrame } from "@react-three/fiber";

const Element = () => {
  const { camera } = useThree();

  useFrame(() => {
    camera.lookAt(0, 0.5, 0);
  });

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.7} />
      <directionalLight
        castShadow
        intensity={4}
        target-position={[0, -1, 0]}
        shadow-mapSize={[5000, 5000]}
        position={[-4, -2.1, 4]}
      />
      {cardData.map((props) => {
        return <CardComponent {...props} imageUrl={"/card1.png"} />;
      })}
    </>
  );
};

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 2, 3] }}>
      <Element />
    </Canvas>
  );
}

export default App;
