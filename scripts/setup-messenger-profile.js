const token = process.env.META_PAGE_ACCESS_TOKEN;
const graphVersion = process.env.META_GRAPH_VERSION ?? "v26.0";
const unitName = process.env.UNIT_NAME ?? "Công an phường";
if (!token) throw new Error("Missing META_PAGE_ACCESS_TOKEN");

const url = new URL(`https://graph.facebook.com/${graphVersion}/me/messenger_profile`);
url.searchParams.set("access_token", token);

const payload = {
  get_started: { payload: "GET_STARTED" },
  greeting: [
    {
      locale: "default",
      text: `Xin chào {{user_first_name}}! Đây là trợ lý tự động của ${unitName}.`,
    },
  ],
  persistent_menu: [
    {
      locale: "default",
      composer_input_disabled: false,
      call_to_actions: [
        { type: "postback", title: "Gặp cán bộ trực", payload: "HUMAN_AGENT" },
        { type: "postback", title: "Thông tin liên hệ", payload: "CONTACT" }
      ],
    },
  ],
};

const response = await fetch(url, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(payload),
});

const body = await response.text();
if (!response.ok) throw new Error(`Meta Messenger Profile API ${response.status}: ${body}`);
console.log(body);
