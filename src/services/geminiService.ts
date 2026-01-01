import { GoogleGenAI } from "@google/genai";
import { User, Resource, AccessLog } from "../types";

const initGenAI = () => {
  if (!process.env.API_KEY) {
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeSecurityEvent = async (user: User, resource: Resource, log: AccessLog, systemState: any): Promise<string> => {
  const ai = initGenAI();
  if (!ai) return "AI Configuration Missing: API_KEY not found.";

  const prompt = `
    Act as a Senior Security Auditor for a Payroll System. 
    Analyze this access attempt event.
    
    Context:
    - User: ${user.name} (${user.role} in ${user.department})
    - Clearance: ${user.clearanceLevel}
    - Resource: ${resource.name} (${resource.type})
    - Sensitivity: ${resource.sensitivityLevel}
    - Resource Owner: ${resource.ownerId}
    - System Time: ${systemState.currentTime}:00 hours
    - Weekend: ${systemState.isWeekend}
    
    Event Result:
    - Access Granted: ${log.granted}
    - Primary Policy Trigger: ${log.policyTypeTriggered}
    - Reason: ${log.denialReason || 'Access permitted by policy.'}
    
    Explain to the user clearly why this decision was made, referencing the specific security model (MAC, DAC, RBAC, RuBAC, or ABAC) involved.
    Keep it concise (max 2 sentences).
  `;

  try {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text ?? "AI Audit temporarily unavailable.";
} catch (error) {
  console.error("Gemini Error:", error);
  return "AI Audit temporarily unavailable.";
}
};
