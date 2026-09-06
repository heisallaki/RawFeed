import { useEffect, useMemo, useRef } from "react";
import GlobeGl from "react-globe.gl";
import { useNavigate } from "react-router-dom";
import { KENYA_COUNTIES } from "../constants/kenyaCounties";

export function Globe() {
  const navigate = useNavigate();
  const globeRef = useRef<any>(null);

  const points = useMemo(
    () =>
      KENYA_COUNTIES.map((county) => ({
        lat: county.lat,
        lng: county.lng,
        name: county.name,
        size: 0.4,
      })),
    []
  );

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 0.0236, lng: 37.9062, altitude: 1.6 }, 0);
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
    }
  }, []);

  return (
    <div style={{ margin: "1rem" }}>
      <h2 className="accent-text" style={{ marginLeft: "0.25rem" }}>
        Globe
      </h2>
      <div className="glass-panel" style={{ padding: "0.5rem", height: "70vh", overflow: "hidden" }}>
        <GlobeGl
          ref={globeRef}
          backgroundColor="rgba(0,0,0,0)"
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "#14b8a6"}
          pointAltitude={0.02}
          pointRadius="size"
          pointLabel="name"
          onPointClick={(point: any) => navigate(`/explore?county=${encodeURIComponent(point.name)}`)}
        />
      </div>
      <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
        Tap a marker to see events for that county.
      </p>
    </div>
  );
}