import { useState } from "react";
import Link from "next/link";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface ICake {
  id: string;
  latitude: number;
  longitude: number;
}

interface IProps {
  cake: ICake;
}

export default function SingleMap({ cake }: IProps) {
  const [viewport, setViewport] = useState({
    latitude: cake.latitude,
    longitude: cake.longitude,
    zoom: 13,
  });

  return (
    <div className="text-black">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        mapStyle="mapbox://styles/suwignyo/ckk7q4x50061d17p8kfx2q0tb"
        scrollZoom={false}
        minZoom={8}
      >
        <div className="absolute top-0 left-0 p-4">
          <NavigationControl showCompass={false} />
        </div>

        <Marker
          latitude={cake.latitude}
          longitude={cake.longitude}
          offsetLeft={-15}
          offsetTop={-15}
        >
          <button
            type="button"
            style={{ width: "30px", height: "30px", fontSize: "30px" }}
          >
            <img src="/home-color.svg" className="w-8" alt="selected cake" />
          </button>
        </Marker>
      </ReactMapGL>
    </div>
  );
}
