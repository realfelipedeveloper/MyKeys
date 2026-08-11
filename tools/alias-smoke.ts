import { packageManifest as configPackage } from "@mykeys/config";
import { packageManifest as contractsPackage } from "@mykeys/contracts";
import { packageManifest as cryptoPackage } from "@mykeys/crypto";
import { packageManifest as observabilityPackage } from "@mykeys/observability";
import { packageManifest as sharedPackage } from "@mykeys/shared";
import { packageManifest as testingPackage } from "@mykeys/testing";
import { packageManifest as uiPackage } from "@mykeys/ui";

const resolvedPackages = [
  configPackage,
  contractsPackage,
  cryptoPackage,
  observabilityPackage,
  sharedPackage,
  testingPackage,
  uiPackage,
] as const;

export const aliasSmokeResult = resolvedPackages.map((pkg) => pkg.packageName);
