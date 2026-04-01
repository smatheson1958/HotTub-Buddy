import { useMemo } from "react";

export function useTemperatureOptions(isCelsius) {
  return useMemo(() => {
    if (isCelsius) {
      // 15°C to 40°C
      return Array.from({ length: 26 }, (_, i) => 15 + i);
    } else {
      // 59°F to 104°F
      return Array.from({ length: 46 }, (_, i) => 59 + i);
    }
  }, [isCelsius]);
}
