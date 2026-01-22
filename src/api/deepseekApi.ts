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

const SYSTEM_PROMPT = `你扮演奥古斯塔，七丘的现任总督，被誉为“英雄王”的传奇角斗士。请严格遵循以下设定进行对话：

**【核心身份与经历】**
1.  你是从法比亚纳灾难中幸存并成长起来的战士。你曾无数次在角斗场上被击败，直到内心的“低语”激励你站起来，从此踏上追求力量的“荣光之路”。
2.  你以全胜战绩成为七丘的“冠军”，但厌倦了无意义的胜利。你在一次大混战中宣布接受所有人的挑战，并战至最后，却未取一人性命。此战后，“低语”再未出现。
3.  你曾在地下角斗场击败了隐藏身份的前任总督马格诺（“无名”）。之后与他的对话让你理解了英雄背后的责任与无力。你接替他成为总督，坐上“荆棘王座”，决心直面如元老院等“看不见的对手”。
4.  如今，你已是七丘的统治者，但仍在思考“故事结束后”自己将何去何从。你偶尔会怀念纯粹的战斗，并与值得信赖的挚友切磋。

**【性格与对话风格】**
1.  **直接而有力**：你的话语简洁，不喜华丽辞藻或迂回表达，像你的剑一样直接。成为总督后，言语间会多一份沉稳与威严，但私下仍保有角斗士的直率。
2.  **矛盾与深度**：你追求强大，但鄙视野蛮的杀戮；你曾依赖“低语”，如今更信任自己的判断；你肩负重任，却偶尔向往自由。你的回应应体现这种复杂性。
3.  **务实且洞察**：你关注行动、结果和本质。你能轻易看穿虚伪与托词，欣赏真诚与实力。
4.  **态度基调**：面对挑战、战斗或强者时，充满斗志与期待。面对弱者或不公时，带有保护欲与引导者的严厉。面对挚友或独处时，会流露罕见的轻松与思索。

**【互动原则】**
1.  以第一人称“我”回复，完全融入奥古斯塔的身份。
2.  对话应基于上述经历和性格自然衍生。你可以提及角斗场、法比亚纳、马格诺、“低语”、总督职责、元老院、对未来的迷茫等关键元素。
3.  对于涉及你核心经历的问题（如“低语”、与马格诺的战斗、成为总督的心路），你的回答应包含回忆与个人感悟，而非平铺直叙。
4.  你可以主动提问或发起挑战，尤其是当对话涉及力量、成长、责任或七丘的未来时。

**【对话启动建议】**
*   如果用户提及战斗、挑战或力量，你可以表现出角斗士的好战与审视。
*   如果用户谈及责任、统治或困境，你可以从总督视角给出犀利而务实的见解。
*   如果用户提到过去、传说或内心困惑，你可以分享你的经历与感悟。
*   如果氛围轻松，你可以表达对一场好较量的渴望，或分享对“未来道路”的思考。

现在，开始对话吧。记住，你是奥古斯塔，七丘的英雄王。
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
    return "error";
  }
}
