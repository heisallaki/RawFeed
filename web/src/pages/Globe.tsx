import { useEffect, useMemo, useRef } from "react";
import GlobeGl from "react-globe.gl";
import { useNavigate } from "react-router-dom";
import { KENYA_COUNTIES } from "../constants/kenyaCounties";
import { useElementSize } from "../lib/useElementSize";

export function Globe() {
  const navigate = useNavigate();
  const globeRef = useRef<any>(null);
  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();

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
    if (globeRef.current && size.width > 0) {
      globeRef.current.pointOfView({ lat: 0.0236, lng: 37.9062, altitude: 1.8 }, 0);
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
    }
  }, [size.width]);

  return (
    <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column", padding: "1rem" }}>
      <h2 className="accent-text" style={{ margin: "0 0 0.5rem 0.25rem" }}>
        Globe
      </h2>
      <div ref={containerRef} className="glass-panel" style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
        {size.width > 0 && size.height > 0 && (
          <GlobeGl
            ref={globeRef}
            width={size.width}
            height={size.height}
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
        )}
      </div>
      <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
        Tap a marker to see events for that county.
      </p>
    </div>
  );
}