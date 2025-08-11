import { ReactNode, useMemo, useState } from "react";
import GradientCloud, { type GradientCloudProps } from "./GradientCloud";

interface CloudConfig {
  scale: number;
  top: number;
  left: number;
  rotation: number;
  opacity: number;
  blur: string;
}

interface BackgroundWrapperProps {
  children: ReactNode;
  clouds?: CloudConfig[] | "default" | "typicalClouds";
  className?: string;
  devMode?: boolean;
  animationPreset?: AnimationPresetName | "none";
}

const defaultClouds: CloudConfig[] = [
  {
    scale: 0.9,
    top: 38,
    left: 6,
    rotation: 42,
    opacity: 0.35,
    blur: "3xl",
  },
  {
    scale: 1.3,
    top: 44,
    left: 84,
    rotation: 54.108,
    opacity: 0,
    blur: "2xl",
  },
];
const typicalClouds: CloudConfig[] = [
  {
    scale: 0.8,
    top: 47,
    left: 16,
    rotation: 59,
    opacity: 0.8,
    blur: "3xl",
  },
];

type AnimatableConfig = Partial<
  Pick<CloudConfig, "scale" | "top" | "left" | "rotation" | "opacity" | "blur">
> & { colors?: GradientCloudProps["colors"] };

type CloudAnimation = {
  from?: AnimatableConfig;
  to?: AnimatableConfig;
  duration?: number;
  delay?: number;
};

type AnimationPreset = { clouds: CloudAnimation[] };
type AnimationPresetName = "drift" | "floatIn" | "crossFade";

const animationPresets: Record<AnimationPresetName, AnimationPreset> = {
  drift: {
    clouds: [
      { to: { left: 10, top: 40, rotation: 56 }, duration: 2000 },
      {
        to: { left: 78, top: 46, rotation: 40, opacity: 0.25 },
        duration: 2000,
        delay: 150,
      },
    ],
  },
  floatIn: {
    clouds: [
      { from: { opacity: 0 }, to: { opacity: 0.4, top: 36 }, duration: 1200 },
      {
        from: { opacity: 0 },
        to: { opacity: 0.35, left: 82 },
        duration: 1200,
        delay: 100,
      },
    ],
  },
  crossFade: {
    clouds: [
      { to: { opacity: 0.6 }, duration: 1200 },
      {
        from: { opacity: 0 },
        to: { opacity: 0.25 },
        duration: 1200,
        delay: 200,
      },
    ],
  },
};

export default function BackgroundWrapper({
  children,
  clouds = "default",
  className = "",
  devMode = false,
  animationPreset = "none",
}: BackgroundWrapperProps) {
  // Resolve initial cloud configuration
  const getInitialConfig = (): CloudConfig[] => {
    if (Array.isArray(clouds)) {
      return clouds;
    }
    switch (clouds) {
      case "typicalClouds":
        return typicalClouds;
      case "default":
      default:
        return defaultClouds;
    }
  };

  const [cloudConfig, setCloudConfig] = useState<CloudConfig[]>(
    getInitialConfig()
  );
  const [selectedCloudIndex, setSelectedCloudIndex] = useState(0);

  const updateCloudProperty = (
    index: number,
    property: keyof CloudConfig,
    value: number | string
  ) => {
    console.log(`Updating cloud ${index}, ${property} to:`, value);
    setCloudConfig((prev) => {
      const newConfig = prev.map((cloud, i) =>
        i === index ? { ...cloud, [property]: value } : cloud
      );
      console.log("New cloud config:", newConfig);
      return newConfig;
    });
  };

  const getAnimationForIndex = useMemo(() => {
    if (!animationPreset || animationPreset === "none") return null;
    const preset = animationPresets[animationPreset as AnimationPresetName];
    if (!preset) return null;
    return (index: number): CloudAnimation | null => {
      if (preset.clouds.length === 0) return null;
      return preset.clouds[Math.min(index, preset.clouds.length - 1)] ?? null;
    };
  }, [animationPreset]);

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      {/* Gradient Clouds */}
      {cloudConfig.map((cloud, index) => {
        const anim = getAnimationForIndex ? getAnimationForIndex(index) : null;

        if (!anim || devMode) {
          return (
            <GradientCloud
              key={index}
              scale={cloud.scale}
              top={cloud.top}
              left={cloud.left}
              rotation={cloud.rotation}
              opacity={cloud.opacity}
              blur={cloud.blur as "3xl" | "2xl" | "sm" | "md" | "lg" | "xl"}
            />
          );
        }

        const from = { ...cloud, ...(anim.from ?? {}) } as any;
        const to = { ...cloud, ...(anim.to ?? {}) } as any;

        return (
          <GradientCloud
            key={index}
            animating
            fromGradientCloudConfig={from}
            toGradientCloudConfig={to}
            duration={anim.duration}
            delay={anim.delay}
          />
        );
      })}

      {/* Content */}
      {children}

      {/* Dev Mode Controls */}
      {devMode && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm w-80 max-h-96 overflow-y-auto z-50">
          <h3 className="font-bold text-sm mb-3 text-gray-800">
            Cloud Controls
          </h3>

          {/* Cloud Selector */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Select Cloud:
            </label>
            <select
              value={selectedCloudIndex}
              onChange={(e) => setSelectedCloudIndex(Number(e.target.value))}
              className="w-full text-xs border border-gray-300 rounded px-2 py-1"
            >
              {cloudConfig.map((_, index) => (
                <option key={index} value={index}>
                  Cloud {index + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Controls for selected cloud */}
          {cloudConfig[selectedCloudIndex] && (
            <div className="space-y-3">
              {/* Scale */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Scale: {cloudConfig[selectedCloudIndex].scale.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={cloudConfig[selectedCloudIndex].scale}
                  onChange={(e) =>
                    updateCloudProperty(
                      selectedCloudIndex,
                      "scale",
                      Number(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>

              {/* Top Position */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Top: {cloudConfig[selectedCloudIndex].top}%
                </label>
                <input
                  type="range"
                  min="-50"
                  max="100"
                  step="1"
                  value={cloudConfig[selectedCloudIndex].top}
                  onChange={(e) =>
                    updateCloudProperty(
                      selectedCloudIndex,
                      "top",
                      Number(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>

              {/* Left Position */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Left: {cloudConfig[selectedCloudIndex].left}%
                </label>
                <input
                  type="range"
                  min="-50"
                  max="100"
                  step="1"
                  value={cloudConfig[selectedCloudIndex].left}
                  onChange={(e) =>
                    updateCloudProperty(
                      selectedCloudIndex,
                      "left",
                      Number(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>

              {/* Rotation */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Rotation:{" "}
                  {cloudConfig[selectedCloudIndex].rotation.toFixed(1)}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={cloudConfig[selectedCloudIndex].rotation}
                  onChange={(e) =>
                    updateCloudProperty(
                      selectedCloudIndex,
                      "rotation",
                      Number(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Opacity: {cloudConfig[selectedCloudIndex].opacity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={cloudConfig[selectedCloudIndex].opacity}
                  onChange={(e) =>
                    updateCloudProperty(
                      selectedCloudIndex,
                      "opacity",
                      Number(e.target.value)
                    )
                  }
                  className="w-full"
                />
              </div>

              {/* Blur */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Blur: {cloudConfig[selectedCloudIndex].blur}
                </label>
                <select
                  value={cloudConfig[selectedCloudIndex].blur}
                  onChange={(e) =>
                    updateCloudProperty(
                      selectedCloudIndex,
                      "blur",
                      e.target.value
                    )
                  }
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra Large</option>
                  <option value="2xl">2X Large</option>
                  <option value="3xl">3X Large</option>
                </select>
              </div>
            </div>
          )}

          {/* Export Configuration */}
          <button
            onClick={() => {
              console.log(
                "Current Cloud Configuration:",
                JSON.stringify(cloudConfig, null, 2)
              );
            }}
            className="w-full mt-3 bg-purple-600 text-white text-xs py-2 px-3 rounded hover:bg-purple-700 transition-colors"
          >
            Log Config to Console
          </button>
        </div>
      )}
    </div>
  );
}
