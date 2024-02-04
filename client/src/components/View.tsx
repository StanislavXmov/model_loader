import { OrbitControls, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { GLTF } from 'three/examples/jsm/Addons.js';
import { useModelStore } from '../store/useModelStore';
import { GridHelper } from 'three';

interface Model3d extends GLTF {
  nodes: any;
  materials: any;
}

const View = ({url}: {url: string}) => {

  const setPreview = useModelStore(s => s.setPreview);
  const setIsPreview = useModelStore(s => s.setIsPreview);
  const isPreview = useModelStore(s => s.isPreview);
  const name = useModelStore(s => s.name);

  const gridRef = useRef<GridHelper>(null);

  const gl = useThree((state) => state.gl);
  const {nodes, materials} = useGLTF(url) as unknown as Model3d;
  
  const setScreenshot = async () => {
    if (gridRef.current) {
      gridRef.current.visible = false;

      // await next render
      await new Promise((res) => setTimeout(() => {
        res(null)
      }, 500));

      gl.domElement.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `${name}_preview.png`);
          setIsPreview(false);
          setPreview(file);
  
          // test preview
          // const path = URL.createObjectURL(file);
          // const link = document.createElement('a');
          // link.setAttribute('download', `${name}_preview.png`);
          // link.setAttribute('href', path);
          // link.click();

          if (gridRef.current) {
            gridRef.current.visible = true;
          }
        }
      }, 'image/png');
    }
  }

  useEffect(() => {
    if (isPreview) {
      setScreenshot();
    }
  }, [isPreview]);

  return (
    <>
      <pointLight position={[10, 10, 10]} />
      <gridHelper ref={gridRef} />
      <group>
        <mesh 
          castShadow 
          receiveShadow 
          geometry={nodes['collider'].geometry} 
          material={materials[""]} 
        />
      </group>
      <OrbitControls />
    </>
  )
}

export default View;