import { MintData } from "../../types";

export const ukMints: Record<string, MintData[]> = {
  Gold: [
    {
      value: "Royal Mint - London (886-1975)",
      label: "🇬🇧 London",
      minYear: 886,
      maxYear: 1975,
    },
    {
      value: "Royal Mint - Llantrisant (1968-present)",
      label: "🇬🇧 Llantrisant",
      minYear: 1968,
      maxYear: "present",
    },
  ],
  Silver: [
    {
      value: "Royal Mint - London (886-1975)",
      label: "🇬🇧 London",
      minYear: 886,
      maxYear: 1975,
    },
    {
      value: "Royal Mint - Llantrisant (1968-present)",
      label: "🇬🇧 Llantrisant",
      minYear: 1968,
      maxYear: "present",
    },
  ],
  Platinum: [
    {
      value: "Royal Mint - Llantrisant (1968-present)",
      label: "🇬🇧 Llantrisant",
      minYear: 1990,
      maxYear: "present",
    },
  ],
};
