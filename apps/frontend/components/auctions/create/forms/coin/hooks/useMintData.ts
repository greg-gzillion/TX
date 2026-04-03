import { useState, useEffect } from "react";
import { mintDatabase } from "../data/mints";
import {
  MintData,
  CoinSpec,
} from "@/components/auctions/create/forms/coin/types";

export const useMintData = (
  selectedCountry: any,
  metalType?: string,
  selectedCoin?: CoinSpec | null,
) => {
  const [mintOptions, setMintOptions] = useState<MintData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (!selectedCountry) {
      console.log("❌ No country selected");
      setMintOptions([]);
      setLoading(false);
      return;
    }

    const currentMetal = metalType || "Gold";
    console.log(
      `🔍 Getting mints for ${selectedCountry.value} - ${currentMetal}`,
    );

    let mints = mintDatabase[selectedCountry.value]?.[currentMetal] || [];
    console.log(`📋 Total mints in database: ${mints.length}`);

    // Log all mints before filtering
    console.log("All mints before filtering:");
    mints.forEach((mint, i) => {
      console.log(
        `  ${i + 1}. ${mint.label} (${mint.minYear}-${mint.maxYear})`,
      );
    });

    // Filter mints based on selected coin's production years
    if (selectedCoin && mints.length > 0) {
      // Parse coin's manufacturing years
      const yearRange = selectedCoin.years;
      let coinMinYear = 0;
      let coinMaxYear = new Date().getFullYear();

      if (yearRange.includes("-")) {
        const parts = yearRange.split("-");
        coinMinYear = parseInt(parts[0]);
        coinMaxYear = parts[1].includes("present")
          ? new Date().getFullYear()
          : parseInt(parts[1]);
      } else {
        coinMinYear = parseInt(yearRange);
        coinMaxYear = coinMinYear;
      }

      console.log(
        `🔍 Filtering mints for ${selectedCoin.name} (${coinMinYear}-${coinMaxYear})`,
      );
      console.log(`   Coin years: ${coinMinYear} to ${coinMaxYear}`);

      // Filter mints that were operational during the coin's production years
      const filteredMints = mints.filter((mint) => {
        const mintMax =
          mint.maxYear === "present" ? new Date().getFullYear() : mint.maxYear;

        // Check if mint was operating during coin's production period
        const mintStartsAfterCoinEnds = mint.minYear > coinMaxYear;
        const mintEndsBeforeCoinStarts = mintMax < coinMinYear;
        const isValid = !(mintStartsAfterCoinEnds || mintEndsBeforeCoinStarts);

        console.log(`  - ${mint.label}: ${mint.minYear}-${mintMax}`);
        console.log(
          `    mintStartsAfterCoinEnds? ${mint.minYear} > ${coinMaxYear} = ${mintStartsAfterCoinEnds}`,
        );
        console.log(
          `    mintEndsBeforeCoinStarts? ${mintMax} < ${coinMinYear} = ${mintEndsBeforeCoinStarts}`,
        );
        console.log(`    → ${isValid ? "✅ KEEP" : "❌ FILTER OUT"}`);

        return isValid;
      });

      console.log(
        `🏛️ Filtered result: ${filteredMints.length} mints available`,
      );
      setMintOptions(filteredMints);
    } else {
      console.log(`📋 No coin selected, showing all ${mints.length} mints`);
      setMintOptions(mints);
    }

    setLoading(false);
  }, [selectedCountry, metalType, selectedCoin]);

  return { mintOptions, loading };
};
