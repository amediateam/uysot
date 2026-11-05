import { theme as antdTheme, type ThemeConfig } from "antd";
import { BASE_TOKENS, tokensFor, type ResolvedTheme } from "@/theme/palette";

// antd theme config (recovered exactly from the build): maps the app tokens onto antd's
// global token and per-component overrides.
export const buildAntdTheme = (resolvedTheme: ResolvedTheme): ThemeConfig => {
  const t = tokensFor(resolvedTheme);
  return {
    algorithm: resolvedTheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: t.primary,
      colorPrimaryHover: t.primaryHover,
      colorSuccess: t.success,
      colorWarning: t.warning,
      colorError: t.danger,
      colorInfo: t.accent,
      colorLink: t.accent,
      colorLinkHover: t.accentHover,
      colorPrimaryBg: t.accentSoft,
      colorBgLayout: t.canvas,
      colorBgContainer: t.surface,
      colorBgElevated: t.surface,
      colorFillSecondary: t.surfaceMuted,
      colorBgMask: t.overlay,
      colorText: t.content,
      colorTextSecondary: t.contentSecondary,
      colorTextTertiary: t.contentMuted,
      colorTextQuaternary: t.contentMuted,
      colorTextPlaceholder: t.contentPlaceholder,
      colorBorder: t.borderStrong,
      colorBorderSecondary: t.border,
      borderRadius: BASE_TOKENS.borderRadius,
      borderRadiusSM: BASE_TOKENS.borderRadiusSm,
      borderRadiusLG: BASE_TOKENS.borderRadiusLg,
      controlHeight: BASE_TOKENS.controlHeight,
      controlHeightLG: BASE_TOKENS.controlHeightLg,
      controlHeightSM: BASE_TOKENS.controlHeightSm,
      fontFamily: BASE_TOKENS.fontFamily,
      fontFamilyCode: BASE_TOKENS.fontFamilyMono,
      boxShadowSecondary: BASE_TOKENS.shadowCard,
    },
    components: {
      Input: {
        colorBgContainer: t.surfaceMuted,
        activeBg: t.surface,
        hoverBg: t.surface,
        activeBorderColor: t.accent,
        hoverBorderColor: t.borderStrong,
      },
      InputNumber: {
        colorBgContainer: t.surfaceMuted,
        activeBg: t.surface,
        hoverBg: t.surface,
        activeBorderColor: t.accent,
        hoverBorderColor: t.borderStrong,
      },
      Select: {
        selectorBg: t.surfaceMuted,
        optionSelectedBg: t.accentSoft,
        controlItemBgActiveHover: t.accentSoft,
        hoverBorderColor: t.borderStrong,
        activeBorderColor: t.accent,
      },
      DatePicker: {
        colorBgContainer: t.surfaceMuted,
        activeBg: t.surface,
        hoverBorderColor: t.borderStrong,
        activeBorderColor: t.accent,
      },
      Table: {
        headerBg: t.surfaceMuted,
        headerColor: t.contentMuted,
        headerSplitColor: "transparent",
        rowHoverBg: t.surfaceHover,
        borderColor: t.rowBorder,
        cellPaddingBlock: 12,
        cellPaddingInline: 20,
        headerBorderRadius: 0,
      },
      Segmented: {
        trackBg: t.surfaceMuted,
        itemSelectedBg: t.surface,
        itemSelectedColor: t.content,
        itemColor: t.contentMuted,
      },
      Modal: {
        contentBg: t.surface,
        headerBg: t.surface,
        titleColor: t.content,
      },
      Drawer: {
        colorBgElevated: t.surface,
      },
      Button: {
        primaryShadow: "none",
        defaultShadow: "none",
        fontWeight: 600,
        colorPrimary: t.primary,
        colorPrimaryHover: t.primaryHover,
        colorPrimaryActive: t.primary,
        primaryColor: t.contentInverse,
      },
      Switch: {
        colorPrimary: resolvedTheme === "dark" ? t.accent : t.primary,
        colorPrimaryHover: resolvedTheme === "dark" ? t.accentHover : t.primaryHover,
        colorTextQuaternary: t.borderStrong,
      },
      Pagination: {
        itemActiveBg: t.primary,
        itemActiveColor: t.contentInverse,
        itemActiveColorHover: t.contentInverse,
        itemSize: BASE_TOKENS.controlHeightSm,
      },
      Tooltip: {
        colorBgSpotlight: t.primary,
        colorTextLightSolid: t.contentInverse,
      },
    },
  };
};
