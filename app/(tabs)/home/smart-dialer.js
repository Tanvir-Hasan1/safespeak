import React, { useState, useMemo, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../components/CustomHeader";
import { useLanguage } from "../../../context/LanguageContext";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

export default function SmartDialer() {
  const { language, t } = useLanguage();
  const [selectedContactId, setSelectedContactId] = useState("respect");
  const [scriptDraft, setScriptDraft] = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;

    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  const contacts = useMemo(() => [
    {
      id: "emergency",
      label: t("emergencyLabel"),
      displayNumber: "000",
      dialNumber: "000",
      description: t("emergencyDesc"),
      availability: "24/7",
      sourceUrl: "https://www.police.nsw.gov.au/safety_and_prevention/emergency_management/in_an_emergency",
    },
    {
      id: "respect",
      label: t("respectLabel"),
      displayNumber: "1800 737 732",
      dialNumber: "1800737732",
      description: t("respectDesc"),
      availability: "24/7",
      sourceUrl: "https://1800respect.org.au/calling-1800respect",
    },
    {
      id: "lifeline",
      label: t("lifelineLabel"),
      displayNumber: "13 11 14",
      dialNumber: "131114",
      description: t("lifelineDesc"),
      availability: "24/7",
      sourceUrl: "https://www.lifeline.org.au/131114/",
    },
    {
      id: "policeAssistance",
      label: t("policeAssistanceLabel"),
      displayNumber: "131 444",
      dialNumber: "131444",
      description: t("policeAssistanceDesc"),
      availability: "24/7",
      sourceUrl: "https://www.police.nsw.gov.au/contact_us",
    },
    {
      id: "tisNational",
      label: t("tisNationalLabel"),
      displayNumber: "131 450",
      dialNumber: "131450",
      description: t("tisNationalDesc"),
      availability: "24/7",
      sourceUrl: "https://www.tisnational.gov.au/en/Contact-us",
    },
  ], [t]);

  const selectedContact = useMemo(() => 
    contacts.find((c) => c.id === selectedContactId) || contacts[0],
    [contacts, selectedContactId]
  );

  const buildSmartDialerScript = (contactId, locale) => {
    const isSpanish = locale === "es";
    const interpreter = isSpanish
      ? "Necesito un intérprete en español. Si hace falta, conecten TIS National al 131 450."
      : "I can continue in English.";

    if (contactId === "emergency") {
      return isSpanish
        ? [
            "Hola. Necesito ayuda urgente ahora mismo.",
            "Mi ubicación es: [agrega tu dirección o punto de referencia].",
            "No es seguro para mí hablar mucho tiempo.",
            interpreter,
          ]
        : [
            "Hello. I need urgent help right now.",
            "My location is: [add your address or nearest landmark].",
            "It is not safe for me to speak for long.",
            interpreter,
          ];
    }

    if (contactId === "policeAssistance") {
      return isSpanish
        ? [
            "Quiero reportar un incidente que no es una emergencia.",
            "Necesito orientación sobre la forma más segura de documentarlo.",
            interpreter,
          ]
        : [
            "I need to report a non-emergency incident.",
            "I need guidance on the safest way to document and report it.",
            interpreter,
          ];
    }

    if (contactId === "respect") {
      return isSpanish
        ? [
            "Necesito apoyo confidencial y planificación de seguridad.",
            "Puede que no sea seguro para mí hablar mucho tiempo.",
            interpreter,
          ]
        : [
            "I need confidential support and safety planning.",
            "It may not be safe for me to stay on the phone for long.",
            interpreter,
          ];
    }

    if (contactId === "lifeline") {
      return isSpanish
        ? [
            "Necesito apoyo emocional urgente ahora.",
            "No estoy en peligro físico inmediato, pero necesito hablar con alguien.",
            interpreter,
          ]
        : [
            "I need urgent emotional support right now.",
            "I am not in immediate physical danger, but I need to speak with someone urgently.",
            interpreter,
          ];
    }

    return isSpanish
      ? [
          "Necesito un intérprete por teléfono.",
          "Conéctenme en español.",
          "Después, por favor llamen al servicio que necesito.",
        ]
      : [
          "I need a phone interpreter.",
          "Please connect me in English.",
          "After that, please call the service I need.",
        ];
  };

  const suggestedScript = useMemo(() => 
    buildSmartDialerScript(selectedContact.id, language).join("\n"),
    [selectedContact.id, language]
  );

  useEffect(() => {
    setScriptDraft(suggestedScript);
  }, [suggestedScript]);

  const callContact = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const openSource = (url) => {
    Linking.openURL(url);
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText={t("smartDialerTitle")}
        rightText="Cancel"
        headerVisible={headerVisible}
      />
      
      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Intro Section */}
        <StyledView className="mt-4 mb-4 bg-white p-4 rounded-[24px] border border-[#dce5f1] shadow-sm">
          <StyledText className="text-[10px] font-bold uppercase tracking-widest text-[#0f5d9f]">
            Safe call planning
          </StyledText>
          <StyledText className="text-[#002B49] text-2xl font-extrabold mt-1">
            {t("smartDialerTitle")}
          </StyledText>
          <StyledText className="text-[#1F2937]/70 text-xs font-medium mt-1.5 leading-relaxed">
            {t("smartDialerDesc")}
          </StyledText>
          <StyledView className="flex-row flex-wrap mt-2.5">
            <StyledView className="bg-[#eef4ff] px-2.5 py-0.5 rounded-full mr-2 mb-1.5">
              <StyledText className="text-[#0f5d9f] text-[9px] font-bold uppercase">
                {language === "es" ? "Apoyo en intérprete disponible" : "Interpreter support available"}
              </StyledText>
            </StyledView>
            <StyledView className="bg-[#fff7ed] px-2.5 py-0.5 rounded-full mb-1.5">
              <StyledText className="text-[#b45309] text-[9px] font-bold uppercase">
                {language === "es" ? "Guía encubierta únicamente" : "Covert guidance only"}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Services List Section */}
        <StyledText className="text-xs font-bold text-[#002B49] mb-2 uppercase tracking-wider">
          {language === "es" ? "Servicios disponibles" : "Available services"}
        </StyledText>

        <StyledView className="mb-4">
          {contacts.map((contact) => {
            const isSelected = contact.id === selectedContactId;
            return (
              <StyledTouchableOpacity
                key={contact.id}
                onPress={() => setSelectedContactId(contact.id)}
                activeOpacity={0.9}
                className={`w-full rounded-[20px] border p-4 mb-2.5 ${
                  isSelected
                    ? "border-[#0f5d9f] bg-[#eef6ff]"
                    : "border-[#dce5f1] bg-white"
                }`}
              >
                <StyledView className="flex-row justify-between items-start">
                  <StyledView className="flex-1 mr-3">
                    <StyledText className="text-base font-bold text-[#1f2a3a]">
                      {contact.label}
                    </StyledText>
                    <StyledText className="text-[#0f5d9f] text-sm font-extrabold mt-0.5">
                      {contact.displayNumber}
                    </StyledText>
                    <StyledText className="text-xs text-[#60728a] mt-1 leading-normal">
                      {contact.description}
                    </StyledText>
                  </StyledView>
                  <StyledView className="bg-slate-100 px-2 py-0.5 rounded-full">
                    <StyledText className="text-[#60728a] text-[9px] font-bold uppercase">
                      {contact.availability}
                    </StyledText>
                  </StyledView>
                </StyledView>

                <StyledView className="mt-3 flex-row">
                  <StyledTouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => callContact(contact.dialNumber)}
                    className="bg-[#0f5d9f] rounded-full px-4 py-2 flex-row items-center mr-2 shadow-sm"
                  >
                    <Ionicons name="call" size={12} color="white" style={{ marginRight: 4 }} />
                    <StyledText className="text-white text-xs font-bold">
                      {t("smartDialerCallNow")}
                    </StyledText>
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => openSource(contact.sourceUrl)}
                    className="border border-[#d7e1ee] rounded-full px-4 py-2 flex-row items-center"
                  >
                    <StyledText className="text-[#334155] text-xs font-bold mr-1">
                      {t("smartDialerSource")}
                    </StyledText>
                    <Ionicons name="open-outline" size={11} color="#334155" />
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledTouchableOpacity>
            );
          })}
        </StyledView>

        {/* Call Prep Script Card */}
        <StyledView className="bg-white p-4 rounded-[24px] border border-[#dce5f1] shadow-sm mb-6">
          <StyledView className="flex-row items-center mb-2.5">
            <StyledView className="w-7 h-7 rounded-full bg-[#eef4ff] items-center justify-center mr-2.5">
              <Ionicons name="document-text" size={14} color="#0f5d9f" />
            </StyledView>
            <StyledView>
              <StyledText className="text-sm font-bold text-[#1f2a3a]">
                {t("smartDialerCallPrep")}
              </StyledText>
              <StyledText className="text-[9px] text-[#60728a]">
                {t("smartDialerCallPrepDesc")}
              </StyledText>
            </StyledView>
          </StyledView>
          
          <StyledTextInput
            multiline
            value={scriptDraft}
            onChangeText={setScriptDraft}
            style={{ textAlignVertical: "top", minHeight: 110 }}
            className="w-full rounded-[14px] border border-[#dce5f1] bg-[#f8fbff] px-3.5 py-2.5 text-xs leading-relaxed text-[#334155]"
            placeholder="Edit call prep script here..."
          />

          <StyledView className="mt-3 p-3.5 rounded-[14px] border border-[#e3ebf5] bg-[#f8fbff]">
            <StyledText className="font-bold text-xs text-[#1f2a3a]">
              {t("smartDialerCovertGuidance")}
            </StyledText>
            <StyledText className="text-[10px] text-[#50627a] mt-0.5 leading-normal">
              {t("smartDialerCovertGuidanceDesc")}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
