import React from "react";
import { ScrollView, View, Text, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Data matching the 16 guides
const GUIDES = [
  { id: 1, tag: "CYBER", title: "Bullying", theme: "identify", bg: "bg-[#0E5C9E]", desc: "Protect your digital footprint & data from potential online threats." },
  { id: 2, tag: "HARASSMENT", title: "Discrimination", theme: "identify", bg: "bg-[#EA580C]", desc: "Discrimination occurs when employees are treated unfairly for personal traits." },
  { id: 3, tag: "PROTECTION", title: "Online Safety", theme: "identify", bg: "bg-[#8F9E8B]", desc: "Protect your digital footprint & data from potential online threats." },
  { id: 4, tag: "SCAM", title: "Protect Your Identity After a Scam", theme: "footprint", bg: "bg-[#4299E1]", desc: "Take early steps to secure accounts, bank access, and identity documents after a scam or privacy breach." },
  { id: 5, tag: "SECURITY", title: "What to Do After a Data Breach", theme: "footprint", bg: "bg-[#319795]", desc: "Take early steps to secure accounts, bank access, and identity documents after a scam or privacy breach." },
  { id: 6, tag: "PRIVACY", title: "Image-Based Abuse and Private Photos", theme: "document", bg: "bg-[#0E5C9E]", desc: "Take early steps to secure accounts, bank access, and identity documents after a scam or privacy breach." },
  { id: 7, tag: "THREATS", title: "Online Blackmail or Threats", theme: "identify", bg: "bg-[#EA580C]", desc: "Take early steps to secure accounts, bank access, and identity documents after a scam or privacy breach." },
  { id: 8, tag: "COURT", title: "Giving Evidence Safely", theme: "rights", bg: "bg-[#EA580C]", desc: "Take early steps to secure accounts, bank access, and identity documents after a scam or privacy breach." },
  { id: 9, tag: "TEST", title: "New educational content", theme: "identify", bg: "bg-[#0E5C9E]", desc: "Take early steps to secure accounts, bank access, and identity documents after a scam or privacy breach." },
  { id: 10, tag: "EMPLOYER", title: "Employer Sharing Health Information", theme: "identify", bg: "bg-[#0D9488]", desc: "Take early steps to secure accounts, bank access, and identity documents after a scam or privacy breach." },
  { id: 11, tag: "TEST", title: "Test with Gurnam", theme: "identify", bg: "bg-[#0E5C9E]", desc: "Take early steps to secure accounts, bank access, and identity documents after a scam or privacy breach." },
  { id: 12, tag: "COMPLAINT", title: "Privacy Complaint Steps", theme: "document", bg: "bg-[#EA580C]", desc: "Take early steps to secure accounts, bank access, and identity documents after a scam or privacy breach." },
  { id: 13, tag: "GUIDE", title: "Understanding Your Rights Online", theme: "rights", bg: "bg-[#EA580C]", desc: "Learn about online rights and guidelines to safeguard yourself and your data." },
  { id: 14, tag: "RIGHTS", title: "Migrant & Student Rights", theme: "rights", bg: "bg-[#0E5C9E]", desc: "Brief description of legal guidelines, visas rights, and local services for students and migrants." },
  { id: 15, tag: "HEALTH", title: "Mental Health", theme: "wellbeing", bg: "bg-[#0D9488]", desc: "Resources for mental health, emergency helplines, and safe counseling connections." },
  { id: 16, tag: "LEGAL", title: "Legal Aid Basics", theme: "rights", bg: "bg-[#0E5C9E]", desc: "Brief description of legal aid, federal courts support, and local centers guidelines." }
];

const detailContentByTheme = {
  identify: {
    eyebrow: "Recognize the pattern",
    headline: "Spot harm early before it becomes normalized.",
    summary: "Bullying and harassment often escalate through repetition, isolation, and shifts in power. Early recognition helps users respond before the situation gets harder to describe.",
    paragraph1: "This topic focuses on practical awareness and low-friction safety habits. Protect your digital footprint & data from potential online threats.",
    paragraph2: "Start by identifying early signs, document what matters, and choose one immediate protective step you can take today.",
    paragraph3: "Support options work best when used consistently. Build a small routine, keep records, and ask for trusted professional help when needed.",
    takeaway: "Understanding the nature of online threats empowers you to take actionable steps to protect your identity and mental well-being.",
    cta: "Get Protected",
    steps: [
      { label: "1. GET STARTED", btnText: "Start checklist", title: "Note who was involved and where it happened.", highlight: "GET PROTECTED", tip: "Record dates, channels used, and names of individuals who participated or witnessed the behavior." },
      { label: "2. IDENTIFY", btnText: "Identify source", title: "Record repeated phrases, gestures, or actions.", highlight: "KEEP RECORDS", tip: "Capture exact words if possible, noting the emotional impact and frequency of occurrences." },
      { label: "3. DOCUMENT", btnText: "Document evidence", title: "Mark whether the behavior affected work, study, housing, or safety.", highlight: "STAY SAFE", tip: "Flag any immediate changes in your routine, attendance, or productivity due to threats." }
    ]
  },
  document: {
    eyebrow: "Preserve the details",
    headline: "Capture evidence in a way that stays usable later.",
    summary: "Documentation becomes much stronger when users record facts close to the event and keep files organized without adding friction during a stressful moment.",
    paragraph1: "Detailed timelines and digital records help clarify incidents when seeking legal assistance or support agency referrals.",
    paragraph2: "Capture screenshots, write notes, and save dates/links safely without creating digital clutter or local exposure risks.",
    paragraph3: "Having direct facts readily available avoids the burden of repeatedly explaining distressing memories to different representatives.",
    takeaway: "Preserving details systematically guarantees that your evidence remains clear, chronological, and ready for support review.",
    cta: "Review Evidence Tips",
    steps: [
      { label: "1. GET STARTED", btnText: "Start checklist", title: "Save screenshots before messages disappear.", highlight: "GET PROTECTED", tip: "Take screenshots on your phone or device and store them securely in a private album or folder." },
      { label: "2. IDENTIFY", btnText: "Identify source", title: "Keep a short timeline with dates and locations.", highlight: "KEEP RECORDS", tip: "Create a list of key events chronologically to help support services understand the timeline easily." },
      { label: "3. DOCUMENT", btnText: "Document evidence", title: "Separate what you saw directly from what someone else told you.", highlight: "STAY SAFE", tip: "Clearly distinguish direct observations from second-hand information to maintain evidence clarity." }
    ]
  },
  report: {
    eyebrow: "Report with control",
    headline: "Give users options without making the flow feel risky.",
    summary: "Reporting works better when the interface clearly explains what happens next, what is optional, and how privacy controls affect visibility.",
    paragraph1: "Trauma-aware systems guide you step-by-step through reporting pathways so you stay fully in control of what is shared.",
    paragraph2: "Understanding the difference between anonymous disclosures and formal investigations helps set realistic expectations.",
    paragraph3: "Safety buttons remain accessible on every screen to ensure you can exit instantly if someone enters your space.",
    takeaway: "Entering details with clarity and knowing your referral pathways beforehand lowers stress levels during the submission phase.",
    cta: "View Reporting Steps",
    steps: [
      { label: "1. GET STARTED", btnText: "Start checklist", title: "Show which fields are optional before users start typing.", highlight: "GET PROTECTED", tip: "Identify and prioritize necessary fields, leaving optional ones for later when comfortable." },
      { label: "2. IDENTIFY", btnText: "Identify source", title: "Explain referral pathways before the final submit action.", highlight: "KEEP RECORDS", tip: "Understand where your information is sent and who will review it before submitting." },
      { label: "3. DOCUMENT", btnText: "Document evidence", title: "Keep Quick Exit visible throughout the reporting flow.", highlight: "STAY SAFE", tip: "Ensure you can navigate away instantly in case your environment becomes unsafe." }
    ]
  },
  footprint: {
    eyebrow: "Reduce digital exposure",
    headline: "Help users understand the trail they may be leaving behind.",
    summary: "Shared devices, browser history, screenshots, and location metadata can all create risk. Good frontend patterns reduce that exposure without blocking access.",
    paragraph1: "Shared devices, cloud backups, and location services can inadvertently broadcast sensitive routines or conversations.",
    paragraph2: "Using private browser sessions and checking lock screen settings are simple, low-effort checks to boost privacy.",
    paragraph3: "Educating yourself on device traces empowers you to use digital tools with greater confidence and safety.",
    takeaway: "Proactive digital privacy habits significantly minimize location, messaging, and account risks across shared networks.",
    cta: "Review Privacy Steps",
    steps: [
      { label: "1. GET STARTED", btnText: "Start checklist", title: "Use a private device when possible.", highlight: "GET PROTECTED", tip: "Access sensitive info using private windows, or clean up cookies and history after use." },
      { label: "2. IDENTIFY", btnText: "Identify source", title: "Avoid saving sensitive screenshots in public albums.", highlight: "KEEP RECORDS", tip: "Hide or secure folders containing records so they cannot be accessed accidentally." },
      { label: "3. DOCUMENT", btnText: "Document evidence", title: "Check notification previews and shared browser sessions.", highlight: "STAY SAFE", tip: "Disable previews on your lock screen so sensitive alerts are kept private." }
    ]
  },
  rights: {
    eyebrow: "Know your options",
    headline: "Understand rights, records, and safer next steps.",
    summary: "Rights guidance works best when it is practical, plain-language, and paired with options for trusted follow-up.",
    paragraph1: "Every student, worker, and tenant has fundamental protections against intimidation, harassment, and discrimination.",
    paragraph2: "Familiarizing yourself with organization rules or terms of service helps formulate clear boundaries and statements.",
    paragraph3: "Seeking advice from specialized legal clinics provides a clear understanding of possible legal avenues before committing.",
    takeaway: "Knowing the standards of conduct and local safety laws helps you identify and advocate for your rights in any setting.",
    cta: "Review Rights Guidance",
    steps: [
      { label: "1. GET STARTED", btnText: "Start checklist", title: "Write down the setting and people involved.", highlight: "GET PROTECTED", tip: "Determine the jurisdiction or local guidelines that apply to the location of the incident." },
      { label: "2. IDENTIFY", btnText: "Identify source", title: "Keep copies of messages, policies, or documents.", highlight: "KEEP RECORDS", tip: "Keep files that define code of conduct, tenancy terms, or safety policies close by." },
      { label: "3. DOCUMENT", btnText: "Document evidence", title: "Ask a trusted service which reporting pathway fits.", highlight: "STAY SAFE", tip: "Get advice from a local legal aid center before taking official legal steps." }
    ]
  },
  wellbeing: {
    eyebrow: "Support your wellbeing",
    headline: "Use short steps that lower pressure while you decide what comes next.",
    summary: "Wellbeing support should make the next action feel smaller, safer, and easier to complete.",
    paragraph1: "Your physical safety and emotional recovery come first. Give yourself permission to pause and regroup in a safe space.",
    paragraph2: "Reaching out to a trusted contact or helpline can offer the external support needed to process challenging experiences.",
    paragraph3: "Focusing on one small task at a time prevents overwhelm and builds confidence for subsequent safety decisions.",
    takeaway: "Lowering the pressure on yourself by taking small, safe, and deliberate steps helps clear mental fog and reduces anxiety.",
    cta: "Open Wellbeing Tips",
    steps: [
      { label: "1. GET STARTED", btnText: "Start checklist", title: "Pause and move to a safer place if possible.", highlight: "GET PROTECTED", tip: "Take time out of the stressful situation to clear your mind and ensure physical safety." },
      { label: "2. IDENTIFY", btnText: "Identify source", title: "Choose one trusted person or service to contact.", highlight: "KEEP RECORDS", tip: "Connect with a friend, advocate, or counseling service to talk through how you feel." },
      { label: "3. DOCUMENT", btnText: "Document evidence", title: "Keep the next action small and specific.", highlight: "STAY SAFE", tip: "Focus on one manageable action rather than trying to plan everything at once." }
    ]
  }
};

const hackerImage = { uri: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop" };

export default function LessonDetail() {
  const router = useRouter();
  const { cardId, mode } = useLocalSearchParams();
  
  // Find the selected guide
  const selectedId = cardId ? parseInt(cardId, 10) : 1;
  const guide = GUIDES.find(g => g.id === selectedId) || GUIDES[0];
  const content = detailContentByTheme[guide.theme];
  const isEducation = mode === "education";

  const handleCta = (actionName) => {
    Alert.alert("Action Triggered", `Launching: ${actionName}`);
  };

  if (isEducation) {
    return (
      <StyledView className="flex-1 bg-[#F0F4FA]">
        <CustomHeader
          title=""
          backText="MicroEducation"
          rightIcon="close"
          onRightPress={() => router.back()}
        />

        <StyledScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, paddingHorizontal: 24 }}
        >
          {/* Card 1: Bullying/Info Card */}
          <StyledView className="w-full bg-[#F8FAFC] rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-5 mt-4">
            <StyledText className="text-[#64748B] text-xs font-bold uppercase mb-2">
              {guide.tag}
            </StyledText>
            <StyledText className="text-[#002B49] text-3xl font-black mb-3">
              {guide.title}
            </StyledText>
            <StyledText className="text-[#4B5563] text-sm leading-5 font-semibold">
              {guide.desc}
            </StyledText>
          </StyledView>

          {/* Card 2: Key Takeaway */}
          <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-5">
            <StyledText className="text-[#64748B] text-xs font-bold uppercase mb-2">
              KEY TAKEAWAY
            </StyledText>
            <StyledText className="text-[#4B5563] text-sm leading-5 mb-5 font-semibold">
              {content.takeaway}
            </StyledText>
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleCta(content.cta)}
              className="bg-[#005B96] py-2.5 px-6 rounded-full self-start"
            >
              <StyledText className="text-white text-xs font-bold">
                {content.cta}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Card 3: Digital Harassment Overview */}
          <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-4">
            <StyledText className="text-[#002B49] text-2xl font-black mb-4">
              Digital Harassment Overview
            </StyledText>
            <StyledText className="text-[#64748B] text-sm leading-6 mb-4 font-semibold">
              {content.paragraph1}
            </StyledText>
            <StyledText className="text-[#64748B] text-sm leading-6 mb-4 font-semibold">
              {content.paragraph2}
            </StyledText>
            <StyledText className="text-[#64748B] text-sm leading-6 font-semibold">
              {content.paragraph3}
            </StyledText>
          </StyledView>
        </StyledScrollView>
      </StyledView>
    );
  }

  // Default mode: Cards / Slides layout
  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="SafeSpeak Education"
        rightText="Cancel"
      />

      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, paddingHorizontal: 24 }}
      >
        {/* Main Guide Card 1 */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden shadow-xs mb-6 mt-4">
          {/* Card Hero Image Header */}
          <ImageBackground
            source={hackerImage}
            className="h-56 justify-end relative"
            resizeMode="cover"
          >
            <StyledView className="absolute inset-0 bg-[#0A6FAF]/35 mix-blend-multiply" />
            <StyledView className="absolute inset-0 bg-black/40" />
            
            <StyledView className="p-5 z-10">
              <StyledView className="bg-[#01579B] px-2 py-0.5 rounded-md self-start mb-2">
                <StyledText className="text-white text-[9px] font-bold uppercase tracking-wider">
                  {guide.tag}
                </StyledText>
              </StyledView>
              <StyledText className="text-white text-[24px] font-black leading-7">
                {guide.title}
              </StyledText>
            </StyledView>
          </ImageBackground>

          {/* Card Body */}
          <StyledView className="p-5">
            <StyledText className="text-[#3B82F6] text-[10px] font-bold uppercase tracking-[2px] mb-2">
              Recognize the pattern
            </StyledText>
            <StyledText className="text-[#002B49] text-xl font-black mb-3">
              {content.headline}
            </StyledText>
            <StyledText className="text-[#4B5563] text-xs leading-5 mb-4">
              {content.summary}
            </StyledText>

            {/* Key Takeaway Inset Box */}
            <StyledView className="bg-[#EFF6FF] border-l-4 border-[#01579B] p-4 rounded-r-xl my-4">
              <StyledView className="flex-row items-start gap-2.5">
                <Ionicons name="alert-circle" size={18} color="#01579B" className="mt-0.5" />
                <StyledView className="flex-1">
                  <StyledText className="text-[#01579B] text-[9.5px] font-bold uppercase tracking-wider mb-0.5">
                    KEY TAKEAWAY
                  </StyledText>
                  <StyledText className="text-[#111827] text-xs leading-4.5">
                    {content.takeaway}
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>

            <StyledText className="text-[#4B5563] text-xs leading-5">
              {content.paragraph1}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Dynamic Card Steps Stack */}
        {content.steps.map((step, index) => (
          <StyledView key={index} className="w-full bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden shadow-xs mb-6">
            {/* Card Hero Image Header */}
            <ImageBackground
              source={hackerImage}
              className="h-44 justify-end relative"
              resizeMode="cover"
            >
              <StyledView className="absolute inset-0 bg-[#0A6FAF]/25 mix-blend-multiply" />
              <StyledView className="absolute inset-0 bg-black/30" />
              
              <StyledView className="p-5 z-10">
                <StyledView className="bg-[#01579B] px-2 py-0.5 rounded-md self-start mb-2">
                  <StyledText className="text-white text-[9px] font-bold uppercase tracking-wider">
                    {guide.tag}  |  Step {index + 2}
                  </StyledText>
                </StyledView>
                <StyledText className="text-white text-lg font-black leading-6">
                  {guide.title}
                </StyledText>
              </StyledView>
            </ImageBackground>

            {/* Card Body */}
            <StyledView className="p-5">
              <StyledText className="text-[#002B49] text-base font-black mb-3">
                {step.title}
              </StyledText>

              {/* Step Inset Tip Box */}
              <StyledView className="bg-[#EFF6FF] border-l-4 border-[#01579B] p-4 rounded-r-xl">
                <StyledView className="flex-row items-start gap-2.5">
                  <Ionicons name="information-circle" size={18} color="#01579B" className="mt-0.5" />
                  <StyledView className="flex-1">
                    <StyledText className="text-[#01579B] text-[9.5px] font-bold uppercase tracking-wider mb-0.5">
                      {step.highlight}
                    </StyledText>
                    <StyledText className="text-[#111827] text-xs leading-4.5">
                      {step.tip}
                    </StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
        ))}

        {/* Final Wrap Card */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs mb-4">
          <StyledText className="text-[#4B5563] text-xs leading-5 mb-4">
            {content.paragraph2}
          </StyledText>

          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleCta(content.cta)}
            className="w-full bg-[#FF8A00] py-3 rounded-full items-center justify-center shadow-xs"
          >
            <StyledText className="text-white text-sm font-bold">
              {content.cta}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
