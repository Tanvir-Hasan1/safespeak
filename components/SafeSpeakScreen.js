import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { styled } from "nativewind";
import CustomHeader from "./CustomHeader";

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

export default function SafeSpeakScreen({
  title,
  backText,
  rightIcon,
  onRightPress,
  showCancel = false,
  rightText,
  rightTextColor,
  blueTheme = false,
  showDivider = false,
  simpleBack = false,
  plainRightIcon = false,
  children,
  contentContainerStyle,
  className = "flex-1 px-5",
  showHeader = true,
  showOnlyEmergencyBar = false,
}) {
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y <= 10) setHeaderVisible(true);
    else if (y > 50) setHeaderVisible(false);
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      {(showHeader || showOnlyEmergencyBar) && (
        <CustomHeader
          title={title}
          backText={backText}
          rightIcon={rightIcon}
          onRightPress={onRightPress}
          showCancel={showCancel}
          rightText={rightText}
          rightTextColor={rightTextColor}
          blueTheme={blueTheme}
          showDivider={showDivider}
          simpleBack={simpleBack}
          plainRightIcon={plainRightIcon}
          headerVisible={headerVisible}
          showOnlyEmergencyBar={showOnlyEmergencyBar}
        />
      )}

      <StyledScrollView
        className={className}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle || { paddingBottom: 40 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {children}
      </StyledScrollView>
    </StyledView>
  );
}
