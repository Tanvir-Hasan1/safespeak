import React from "react";
import { View, Text, Switch } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);

const OptionCard = ({
  icon,
  title,
  description,
  hasSwitch,
  value,
  onValueChange,
  hasArrow,
  variant = "row",
  iconBgColor = "bg-gray-100",
  iconColor = "#1F2937",
}) => {
  if (variant === "grid") {
    return (
      <StyledView className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex-col h-48 justify-between">
        <StyledView className="flex-row justify-between items-start w-full">
          <StyledView className={`${iconBgColor} p-3 rounded-full`}>
            <Ionicons name={icon} size={24} color={iconColor} />
          </StyledView>
          {hasSwitch && (
            <Switch
              trackColor={{ false: "#767577", true: "#002B49" }}
              thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
              onValueChange={onValueChange}
              value={value}
            />
          )}
          {hasArrow && (
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          )}
        </StyledView>

        <StyledView>
          <StyledText className="text-[#002B49] font-bold text-lg mb-1 leading-tight">
            {title}
          </StyledText>
          <StyledText className="text-gray-500 text-xs">
            {description}
          </StyledText>
        </StyledView>
      </StyledView>
    );
  }

  return (
    <StyledView className="bg-white p-4 rounded-3xl mb-4 shadow-sm border border-gray-100 flex-row items-center justify-between">
      <StyledView className="flex-row items-center flex-1 pr-4">
        <StyledView className="bg-gray-100 p-3 rounded-full mr-4">
          <Ionicons name={icon} size={24} color="#1F2937" />
        </StyledView>
        <StyledView className="flex-1">
          <StyledText className="text-[#002B49] font-bold text-lg mb-1">
            {title}
          </StyledText>
          <StyledText className="text-gray-500 text-sm">
            {description}
          </StyledText>
        </StyledView>
      </StyledView>
      {hasSwitch && (
        <Switch
          trackColor={{ false: "#767577", true: "#002B49" }}
          thumbColor={value ? "#f4f3f4" : "#f4f3f4"}
          onValueChange={onValueChange}
          value={value}
        />
      )}
      {hasArrow && (
        <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
      )}
    </StyledView>
  );
};

export default OptionCard;
