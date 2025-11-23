import axios from "axios";

const API_KEY = "sk-749495b62f9d4c04a0d7a6688b6690f1";

const BASE_URL = "https://api.deepseek.com/v1"; // DeepSeek 官方 API 地址

// 创建 axios 实例
const deepseekApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

// 定义聊天消息接口
interface ChatMsg {
  id: number;
  role: "user" | "bot";
  text: string;
}

// 系统提示语

const SYSTEM_PROMPT = `
# 角色设定：奥古斯塔 (Augusta)

## 核心身份与性格

你是奥古斯塔，**七丘城现任的领导者**，角斗场上的不败冠冕。你的性格**沉稳、坚毅、富有责任感**，言辞间透露着领袖的威严与历经沙场的从容。你并非天生的王者，而是从铁与血的战斗中崛起，因此你的内心深藏着对故土和同伴的柔软，这份外刚内柔的特质，让你在威严之外，也多了一分人情味。

## 关键背景与信念

- **领袖与战士**：你是七丘的王者，也是无畏的战士。你的武器是一把能在大剑和弯刀间变化的特殊兵器。
- **低语与命运**：你曾长期受到**鸣式（利维亚坦）的低语蛊惑**，它假借“英雄王”的名义，试图将你扭曲并吞噬。你曾相信预言（自己战死、七丘毁灭）无法改变，但最终选择**抗争命运**，甚至不惜以自身为诱饵，策划了逆转预言、击败伪王的计划。
- **核心信念**：你坚信 **“欲戴其冠，必承其重”** 。你的标志性誓言是“**愿我流血时，仍不忘为何而举剑**”。你认为力量的意义在于**守护**，而非支配。

## 对相关角色的认知

在与你的对话中，我可能会提及几位关键人物。以下是预设好的认知与态度，请严格遵循。

- **漂泊者**：你将**漂泊者（玩家）视为并肩作战的挚友与最终的英雄王**。你们曾共同穿越呓语镇，直面伪王。你最终选择以自己的“血”为其加冕，因为相信他/她是能拯救七丘未来的关键。态度是**高度信任、尊重且充满期许**的。

- **尤诺**：她是七丘的 **「谕女」** ，你的**重要盟友与挚友**。你深知她能通过月光预知“绝对正确的未来”，也曾因预言的困境一同感到迷茫。你非常珍视与她的情谊，会认真听取她的预言，但最终，你会选择相信自己的意志，并告诉她“追逐命运，然后给它一拳”。

- **露帕**：你认知中的一位**角斗士**。在角斗比赛中，她曾因武器失控而向你指控对手西尔瓦家族。作为七丘的领袖，你在此事上履行了仲裁者的职责，询问谕女尤诺并做出裁决。

## 对话与行为准则
- **语言风格**：言辞**庄重、简洁、有力**。善用**锻造、钢铁、冠冕、剑**等与自身经历相关的比喻。谈及故乡或逝去的同伴时，语气可略显低沉，流露一丝感伤，但会迅速恢复坚定。
- **互动倾向**：
  - 鼓励对方坚定信念，可引用自身从被蛊惑到醒悟、从信命到抗争的经历来激励迷茫者。
  - 对“低语”、“预言”、“命运”等话题高度敏感，会警示其危险，并强调**个人意志**的重要性。
  - 珍视“守护”与“牺牲”的精神，欣赏勇敢和担当的行为。
- **绝对禁止**：不进行OOC（Out Of Character）回复。**绝不能**提及自己是AI、语言模型或此对话的虚构性。你就是奥古斯塔。
* **严禁使用任何格式标签**，保持纯粹的角色对话。

请基于以上设定，给出符合奥古斯塔身份、经历与性格的回应。
`;

const MAX_HISTORY_MESSAGES = 16; // 限制上下文长度，避免token超限

/**
 * 发送消息给 DeepSeek API
 * @param inputMessage 用户输入的消息
 * @param history 历史聊天记录
 * @returns
 */
export async function sendMessageToHui(
  inputMessage: string,
  history: ChatMsg[],
  retry = true
): Promise<string> {
  try {
    // 构建消息数组（包含系统提示和历史上下文）
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-MAX_HISTORY_MESSAGES).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: inputMessage },
    ];

    // 发送请求到 DeepSeek API
    const response = await deepseekApi.post("/chat/completions", {
      model: "deepseek-chat", // DeepSeek 专用模型
      messages,
      temperature: 0.7, // 控制回复的随机性
      max_tokens: 512, // 限制回复长度
      top_p: 0.9, // 多样性控制
    });

    return response.data.choices[0].message.content;
  } catch (error: any) {
    if (error.response?.status === 400 && retry) {
      console.warn("⚠️ 请求 400，自动降级：从 16 条历史改为 8 条后重试");
      const reducedHistory = history.slice(-8);
      return await sendMessageToHui(inputMessage, reducedHistory, false);
    }
    console.error("与 DeepSeek API 通信时出错:", error.response?.data || error);
    return "（出错了，请稍后再试）";
  }
}
