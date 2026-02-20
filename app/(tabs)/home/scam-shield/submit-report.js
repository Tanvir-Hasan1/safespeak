import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../../components/CustomHeader";
import { useRouter } from "expo-router";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

export default function SubmitReport() {
  const router = useRouter();
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
  const [expandedAgencies, setExpandedAgencies] = useState(["ACCC Scamwatch"]);

  // State for editable fields
  const [acccData, setAcccData] = useState([
    { label: "Sender Name", value: "Unknown/PayPal Spoof", verified: true },
    { label: "Scam Category", value: "Phishing / Identity Theft", icon: "swap-vertical" },
    { label: "Platform", value: "Email / Gmail" },
  ]);

  const [reportCyberData, setReportCyberData] = useState([
    { label: "Report Type", value: "Cybercrime Investigation Request" },
    { label: "Incident Date", value: "2026-02-20" },
    { label: "Urgency Level", value: "High / Critical", icon: "alert-circle" },
  ]);

  const [bankData, setBankData] = useState([
    { label: "Bank Name", value: "Commonwealth Bank (CBA)" },
    { label: "Account Status", value: "Compromised / Suspended", icon: "lock-closed" },
    { label: "Reference ID", value: "TXN-882190-SS" },
  ]);

  const toggleAgency = (name) => {
    if (expandedAgencies.includes(name)) {
      setExpandedAgencies(expandedAgencies.filter((a) => a !== name));
    } else {
      setExpandedAgencies([...expandedAgencies, name]);
    }
  };

  const updateField = (agency, index, newValue) => {
    if (agency === "ACCC Scamwatch") {
      const updated = [...acccData];
      updated[index].value = newValue;
      setAcccData(updated);
    } else if (agency === "ReportCyber (ACSC)") {
      const updated = [...reportCyberData];
      updated[index].value = newValue;
      setReportCyberData(updated);
    } else if (agency === "Bank Security Dept") {
      const updated = [...bankData];
      updated[index].value = newValue;
      setBankData(updated);
    }
  };

  const AgencyAccordion = ({ icon, name, fields, isExpanded }) => (
    <StyledView className="bg-white rounded-[24px] mb-4 shadow-sm border border-[#F1F5F9] overflow-hidden">
      <StyledTouchableOpacity
        activeOpacity={0.7}
        onPress={() => toggleAgency(name)}
        className="flex-row items-center p-5 bg-white"
      >
        <StyledView className="w-10 h-10 rounded-full bg-[#F0F4FA] items-center justify-center mr-4">
          <Ionicons name={icon} size={20} color="#005B96" />
        </StyledView>
        <StyledText className="flex-1 text-[#1F2937] text-lg font-bold">
          {name}
        </StyledText>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#1F2937"
        />
      </StyledTouchableOpacity>

      {isExpanded && fields && (
        <StyledView className="px-5 pb-6">
          <StyledView className="h-[1px] bg-[#F1F5F9] mb-5" />
          
          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-4">
            PREFILLED DETAILS
          </StyledText>

          {fields.map((field, index) => (
            <StyledView key={index} className="mb-4">
              <StyledText className="text-[#1F2937] text-sm font-bold mb-2">
                {field.label}
              </StyledText>
              <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3 flex-row items-center">
                <StyledTextInput
                  value={field.value}
                  onChangeText={(val) => updateField(name, index, val)}
                  className="flex-1 text-[#64748B] text-sm font-medium"
                />
                {field.verified && (
                  <Ionicons name="checkmark-circle-outline" size={16} color="#22C55E" />
                )}
                {field.icon && (
                  <Ionicons name={field.icon} size={16} color="#94A3B8" />
                )}
              </StyledView>
            </StyledView>
          ))}
        </StyledView>
      )}
    </StyledView>
  );

  return (
    <StyledView className="flex-1 bg-[#FDFDFD]">
      <CustomHeader title="Submit Report" showCancel={true} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Section */}
        <StyledView className="mt-8 mb-8">
          <StyledText className="text-[#1F2937] text-2xl font-black">
            Prefilled Agency Reports
          </StyledText>
          <StyledText className="text-[#94A3B8] text-sm font-medium leading-5 mt-2">
            Our AI has prefilled these forms based on your conversation analysis.
            Please review each section carefully before submitting to the
            relevant authorities.
          </StyledText>
        </StyledView>

        {/* Agencies */}
        <AgencyAccordion
          icon="shield-outline"
          name="ACCC Scamwatch"
          isExpanded={expandedAgencies.includes("ACCC Scamwatch")}
          fields={acccData}
        />

        <AgencyAccordion
          icon="hammer-outline"
          name="ReportCyber (ACSC)"
          isExpanded={expandedAgencies.includes("ReportCyber (ACSC)")}
          fields={reportCyberData}
        />

        <AgencyAccordion
          icon="business-outline"
          name="Bank Security Dept"
          isExpanded={expandedAgencies.includes("Bank Security Dept")}
          fields={bankData}
        />

        {/* Privacy Consent */}
        <StyledView className="mt-6 bg-[#FAFAFA] rounded-[24px] p-5 border border-[#F1F5F9]">
          <StyledView className="flex-row items-start">
            <StyledView className="flex-1 mr-4">
              <StyledText className="text-[#1F2937] text-base font-bold">
                Privacy Consent
              </StyledText>
              <StyledText className="text-[#64748B] text-xs font-medium leading-4 mt-1">
                I authorize SafeSpeak to securely transmit this data to the
                selected agencies in accordance with the Privacy Policy.
              </StyledText>
            </StyledView>
            <Switch
              value={isPrivacyAccepted}
              onValueChange={setIsPrivacyAccepted}
              trackColor={{ false: "#E2E8F0", true: "#005B96" }}
              thumbColor="#FFFFFF"
            />
          </StyledView>
        </StyledView>

        {/* Submit Button */}
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => Alert.alert("Reports Submitted", "Your prefilled reports have been securely transmitted to the selected agencies.")}
          className={`rounded-full py-4 items-center justify-center flex-row mt-8 shadow-lg ${
            isPrivacyAccepted ? "bg-[#FF8A00] shadow-orange-300" : "bg-gray-300 shadow-none"
          }`}
          disabled={!isPrivacyAccepted}
        >
          <Ionicons name="send" size={20} color="white" />
          <StyledText className="text-white text-lg font-bold ml-3 uppercase tracking-wider">
            Submit All Reports
          </StyledText>
        </StyledTouchableOpacity>

        <StyledText className="text-[#94A3B8] text-[10px] font-bold text-center mt-4 uppercase tracking-widest">
          END-TO-END ENCRYPTED SUBMISSION
        </StyledText>
      </StyledScrollView>
    </StyledView>
  );
}
